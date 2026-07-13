/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

const db = supabaseAdmin as any;

export interface DocumentRecord {
  id: string;
  documentType: string;
  storagePath: string;
  uploadedBy: string;
  createdAt: string;
  version: number;
  verificationStatus: string;
  issueDate?: string;
  expiryDate?: string;
}

export class SchoolDocumentService {
  /**
   * Retrieves a list of active document records for a school.
   */
  static async getDocuments(schoolId: string): Promise<DocumentRecord[]> {
    if (!hasSupabaseAdminConfig) return [];

    const { data, error } = await db
      .from("school_documents")
      .select("*")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Documents fetch failed: ${error.message}`);
    }

    return (data || []).map((d: any) => ({
      id: d.id,
      documentType: d.document_type,
      storagePath: d.storage_path,
      uploadedBy: d.uploaded_by,
      createdAt: d.created_at,
      version: d.version,
      verificationStatus: d.verification_status,
      issueDate: d.issue_date || undefined,
      expiryDate: d.expiry_date || undefined,
    }));
  }

  /**
   * Uploads or replaces a coordinator document record, increments version, and supersedes previous entries.
   */
  static async uploadDocument(
    schoolId: string,
    uploaderId: string,
    docType: string,
    storagePath: string,
    issueDate?: string,
    expiryDate?: string
  ): Promise<string> {
    if (!hasSupabaseAdminConfig) return "demo-doc-id";

    // 1. Locate any pre-existing active document of the same type to supersede
    const { data: existing } = await db
      .from("school_documents")
      .select("id, version")
      .eq("school_id", schoolId)
      .eq("document_type", docType)
      .eq("verification_status", "APPROVED")
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextVersion = existing ? existing.version + 1 : 1;

    // 2. Insert new version record
    const { data: newDoc, error } = await db
      .from("school_documents")
      .insert({
        school_id: schoolId,
        document_type: docType,
        storage_path: storagePath,
        uploaded_by: uploaderId,
        version: nextVersion,
        verification_status: "PENDING",
        issue_date: issueDate || null,
        expiry_date: expiryDate || null,
        superseded_id: existing ? existing.id : null,
      })
      .select("id")
      .single();

    if (error || !newDoc) {
      throw new Error(`Document registration failed: ${error?.message}`);
    }

    return newDoc.id;
  }

  /**
   * Generates a secure, short-lived signed URL for document retrieval.
   * Lifetime is capped at 5 minutes (300 seconds).
   */
  static async getSignedDownloadUrl(schoolId: string, docId: string): Promise<string> {
    if (!hasSupabaseAdminConfig) return "#";

    // Validate coordinator owns this document
    const { data: doc, error: docErr } = await db
      .from("school_documents")
      .select("storage_path")
      .eq("id", docId)
      .eq("school_id", schoolId)
      .single();

    if (docErr || !doc) {
      throw new Error("Unauthorized access to document");
    }

    // Call Supabase storage signed URL creator (valid for 5 minutes)
    const bucketName = "school-documents";
    const { data, error: storageErr } = await db.storage
      .from(bucketName)
      .createSignedUrl(doc.storage_path, 300);

    if (storageErr || !data) {
      throw new Error(`Failed to generate download link: ${storageErr?.message}`);
    }

    return data.signedUrl;
  }
}
