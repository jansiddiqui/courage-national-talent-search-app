/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface StudentRow {
  studentName: string;
  studentClass: string;
  dob: string;
  parentMobile: string;
  parentEmail?: string;
  parentName?: string;
  gender?: string;
  language?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validatedRows: StudentRow[];
}

export class SchoolImportValidation {
  // Validate magic bytes header for Excel/ZIP (.xlsx is a zip package starting with 50 4B 03 04)
  static validateMagicBytes(buffer: ArrayBuffer, filename: string): boolean {
    const uint8 = new Uint8Array(buffer.slice(0, 4));
    const header = Array.from(uint8)
      .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
      .join(" ");

    const ext = filename.split(".").pop()?.toLowerCase();

    if (ext === "xlsx") {
      // Magic bytes: 50 4B 03 04 (PK..)
      return header === "50 4B 03 04";
    }

    if (ext === "csv") {
      // Plain text, check if it's printable characters
      for (let i = 0; i < Math.min(uint8.length, 100); i++) {
        if (uint8[i] < 9 && uint8[i] !== 0) return false; // Non-printable binary detected
      }
      return true;
    }

    return false;
  }

  // Strip formula injections to protect coordinators opening exported spreadsheets
  static sanitizeFormula(value: string | undefined | null): string {
    if (!value) return "";
    const clean = String(value).trim();
    if (clean.startsWith("=") || clean.startsWith("+") || clean.startsWith("-") || clean.startsWith("@")) {
      // Strip leading injection chars
      return clean.replace(/^[=\+\-\@\s]+/, "");
    }
    return clean;
  }

  // Parses DOB in format DD/MM/YYYY
  static cleanImportDob(dobVal: unknown): string | null {
    if (dobVal === undefined || dobVal === null) return null;

    if (typeof dobVal === "number") {
      // Excel serial date offset
      const days = dobVal > 59 ? dobVal - 1 : dobVal;
      const date = new Date(Math.round((days - 25569) * 86400 * 1000));
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }

    const dobStr = String(dobVal).trim();
    if (!dobStr) return null;

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) return dobStr;

    // DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = dobStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmyMatch) {
      const [, d, m, y] = dmyMatch;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    const parsed = new Date(dobStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }

    return null;
  }

  /**
   * Performs client/server-gated row-by-row structural validation.
   */
  static validateSheetData(
    jsonData: any[],
    maxRows = 5000
  ): ValidationResult {
    const errors: string[] = [];
    const validatedRows: StudentRow[] = [];

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return { isValid: false, errors: ["Spreadsheet contains no records or invalid format"], validatedRows: [] };
    }

    if (jsonData.length > maxRows) {
      return {
        isValid: false,
        errors: [`Limit exceeded: spreadsheet contains ${jsonData.length} rows, maximum allowed is ${maxRows}`],
        validatedRows: [],
      };
    }

    for (const [index, student] of jsonData.entries()) {
      const rowNum = index + 1;

      // Extract properties mapping possible headers
      const rawName = student["Student Name"] || student["Name"] || student["studentName"];
      const rawClass = student["Class"] || student["studentClass"];
      const rawDob = student["Date of Birth (DD/MM/YYYY)"] || student["Date of Birth"] || student["DOB"];
      const rawMobile = student["Mobile Number"] || student["Mobile"] || student["mobile"];

      const rawEmail = student["Parent Email"] || student["Email"] || "";
      const rawGender = student["Gender (Male/Female/Other)"] || student["Gender"] || "";
      const rawLang = student["Language (English/Hindi)"] || student["Language"] || "English";
      const rawParentName = student["Parent Name"] || "";

      // Sanitize fields against injections
      const name = this.sanitizeFormula(rawName);
      const parentEmail = this.sanitizeFormula(rawEmail);
      const gender = this.sanitizeFormula(rawGender);
      const language = this.sanitizeFormula(rawLang);
      const parentName = this.sanitizeFormula(rawParentName);

      if (!name) {
        errors.push(`Row ${rowNum}: Student Name is required.`);
        continue;
      }

      if (!rawClass) {
        errors.push(`Row ${rowNum} (${name}): Class is required.`);
        continue;
      }

      const classNum = Number(rawClass);
      if (isNaN(classNum) || classNum < 5 || classNum > 8) {
        errors.push(`Row ${rowNum} (${name}): Class must be between 5 and 8. Got: ${rawClass}`);
        continue;
      }

      const dob = this.cleanImportDob(rawDob);
      if (!dob) {
        errors.push(`Row ${rowNum} (${name}): Date of Birth is missing or invalid. Use DD/MM/YYYY format.`);
        continue;
      }

      const cleanMobile = String(rawMobile ?? "")
        .replace(/\D/g, "")
        .slice(-10);
      if (!rawMobile || cleanMobile.length < 10) {
        errors.push(`Row ${rowNum} (${name}): Valid 10-digit Parent Mobile Number is required.`);
        continue;
      }

      validatedRows.push({
        studentName: name,
        studentClass: String(classNum),
        dob,
        parentMobile: cleanMobile,
        parentEmail: parentEmail || undefined,
        parentName: parentName || undefined,
        gender: gender || undefined,
        language: language || "English",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      validatedRows,
    };
  }

  /**
   * Helper to identify duplicate candidates inside the database roster.
   */
  static async checkDatabaseDuplicates(schoolId: string, rows: StudentRow[]): Promise<string[]> {
    const duplicateLogs: string[] = [];

    // Chunk size processing to prevent DB range overflow
    const chunkSize = 100;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      
      // Perform database duplicate lookup query
      const queries = chunk.map(r => 
        (supabaseAdmin as any)
          .from("registrations")
          .select("student_name")
          .eq("school_id", schoolId)
          .eq("student_class", r.studentClass)
          .eq("whatsapp_number", r.parentMobile)
          .eq("dob", r.dob)
          .maybeSingle()
      );

      const results = await Promise.all(queries);

      results.forEach((res, index) => {
        if (res.data) {
          const matchedRow = chunk[index];
          duplicateLogs.push(
            `Candidate "${matchedRow.studentName}" (Class ${matchedRow.studentClass}, Mobile: ${matchedRow.parentMobile}, DOB: ${matchedRow.dob}) matches an existing registration.`
          );
        }
      });
    }

    return duplicateLogs;
  }
}
