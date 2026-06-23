"use client";

import { useState, useCallback } from "react";
import {
  School,
  Users,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Upload,
  ArrowUpRight,
  Plus,
  UserPlus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Camera,
  X,
  Image as ImageIcon,
} from "lucide-react";
import * as XLSX from "xlsx";
import PhotoUploader from "@/components/registration/PhotoUploader";

// ─── Inline photo-upload modal for existing registrations ─────────────────────
function PhotoUploadModal({
  regId,
  studentName,
  onClose,
  onUploaded,
}: {
  regId: string;
  studentName: string;
  onClose: () => void;
  onUploaded: (regId: string) => void;
}) {
  const [photoBase64, setPhotoBase64] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = useCallback(async () => {
    if (!photoBase64) {
      setError("Please select a photo first.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const res = await fetch(`/api/photo/${regId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Data: photoBase64 }),
      });
      const data = await res.json();
      if (data.success) {
        onUploaded(regId);
        onClose();
      } else {
        setError(data.error || "Upload failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [photoBase64, regId, onUploaded, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Upload Student Photo</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              For <span className="font-semibold text-slate-700">{studentName}</span>{" "}
              <span className="font-mono text-[10px] text-slate-400">({regId})</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <PhotoUploader
            photoBase64={photoBase64}
            onPhotoSelected={(base64) => {
              setPhotoBase64(base64);
              setError("");
            }}
            error={error && !photoBase64 ? error : undefined}
          />

          {error && photoBase64 && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
              <AlertCircle size={13} className="shrink-0" /> {error}
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!photoBase64 || uploading}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              "Saving…"
            ) : (
              <>
                <Check size={14} /> Save Photo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function SchoolDashboardClient({
  school,
  registrations,
}: {
  school: any;
  registrations: any[];
}) {
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Quota & Roster state
  const [usedQuota, setUsedQuota] = useState(school.used_quota);
  const [studentList, setStudentList] = useState(registrations);

  // Photo modal state
  const [photoModalReg, setPhotoModalReg] = useState<{
    regId: string;
    name: string;
  } | null>(null);

  // Form state
  const [showAddForm, setShowAddForm] = useState(true);
  const [keepFormOpen, setKeepFormOpen] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentDob, setStudentDob] = useState("");
  const [parentMobile, setParentMobile] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("English");
  const [photoBase64, setPhotoBase64] = useState("");
  const [photoError, setPhotoError] = useState("");

  const [registering, setRegistering] = useState(false);
  const [formError, setFormError] = useState("");
  const [successState, setSuccessState] = useState<{
    registrationId: string;
    name: string;
  } | null>(null);

  const referralLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/register?school=${school.school_code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyIdToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      studentList.map((r) => ({
        "Registration ID": r.registration_id,
        "Student Name": r.student_name,
        Class: r.student_class,
        "Photo Uploaded": r.photo_url ? "Yes" : "No",
        Status: r.registration_status,
        Date: new Date(r.created_at).toLocaleDateString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, `CNTS_Registrations_${school.school_code}.xlsx`);
  };

  const downloadTemplate = () => {
    const wsStudents = XLSX.utils.json_to_sheet([], {
      header: [
        "Student Name",
        "Class",
        "Date of Birth (DD/MM/YYYY)",
        "Mobile Number",
        "Parent Email",
        "Gender (Male/Female/Other)",
        "Language (English/Hindi)",
      ],
    });
    wsStudents["!cols"] = [
      { wch: 30 },
      { wch: 10 },
      { wch: 26 },
      { wch: 20 },
      { wch: 30 },
      { wch: 28 },
      { wch: 28 },
    ];

    const instructions = [
      { "Instruction / Guideline": "1. Fill student details in the 'Students' tab." },
      { "Instruction / Guideline": "2. Do NOT rename column headers. Required: Student Name, Class, Date of Birth, Mobile Number." },
      { "Instruction / Guideline": "3. Optional columns: Parent Email, Gender (Male/Female/Other), Language (English/Hindi)." },
      { "Instruction / Guideline": "4. Class must be between 5 and 8." },
      { "Instruction / Guideline": "5. Date of Birth must be in DD/MM/YYYY format (e.g. 14/05/2013)." },
      { "Instruction / Guideline": "6. Mobile Number must be a valid 10-digit number." },
      { "Instruction / Guideline": "7. IMPORTANT: Student photos CANNOT be uploaded via Excel. After upload, go to the Registered Students Roster and click the 📷 Upload Photo button next to each student." },
      { "Instruction / Guideline": `8. This template is for: ${school.name}` },
      { "Instruction / Guideline": `9. School Code: ${school.school_code}` },
      { "Instruction / Guideline": `10. Remaining quota: ${school.quota - usedQuota} seats.` },
    ];
    const wsInstructions = XLSX.utils.json_to_sheet(instructions);
    wsInstructions["!cols"] = [{ wch: 100 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsStudents, "Students");
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Read Me Instructions");
    const sanitized = school.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    XLSX.writeFile(wb, `cnts_template_${sanitized}_${school.school_code}.xlsx`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const res = await fetch("/api/schools/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolCode: school.school_code, students: jsonData }),
      });
      const result = await res.json();
      if (result.success) {
        if (result.errors && result.errors.length > 0) {
          setUploadError(
            `Registered ${result.processed} student(s). Skipped ${result.errors.length} row(s):\n` +
              result.errors.slice(0, 3).join("\n") +
              (result.errors.length > 3 ? `\n…and ${result.errors.length - 3} more` : "")
          );
        }
        window.location.reload();
      } else {
        setUploadError(result.message || "Bulk upload failed.");
      }
    } catch {
      setUploadError("Error parsing Excel file. Please ensure it follows the correct format.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const resetForm = () => {
    setStudentName("");
    setStudentClass("");
    setStudentDob("");
    setParentMobile("");
    setParentEmail("");
    setParentName("");
    setGender("");
    setLanguage("English");
    setPhotoBase64("");
    setPhotoError("");
  };

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessState(null);
    if (!studentName.trim()) { setFormError("Please enter the student name."); return; }
    if (!studentClass) { setFormError("Please select a class."); return; }
    if (!studentDob) { setFormError("Please enter the student's Date of Birth."); return; }
    if (parentMobile.length !== 10 || !/^\d+$/.test(parentMobile)) {
      setFormError("Please enter a valid 10-digit mobile number."); return;
    }
    if (!photoBase64) { setPhotoError("Student passport photo is required."); return; }

    setRegistering(true);
    try {
      const res = await fetch("/api/schools/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName.trim(),
          studentClass,
          dob: studentDob,
          mobileNumber: parentMobile,
          parentEmail: parentEmail.trim(),
          parentName: parentName.trim(),
          gender,
          language,
          photoBase64,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsedQuota((q: number) => q + 1);
        setStudentList((prev: any[]) => [
          {
            registration_id: data.registrationId,
            student_name: studentName.trim(),
            student_class: studentClass,
            registration_status: "REGISTERED",
            photo_url: "uploaded", // optimistic — shows ✓ immediately
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setSuccessState({ registrationId: data.registrationId, name: studentName.trim() });
        resetForm();
      } else {
        setFormError(data.message || "Failed to register student.");
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  // Called after photo is successfully uploaded from the roster modal
  const handlePhotoUploaded = (regId: string) => {
    setStudentList((prev: any[]) =>
      prev.map((r) =>
        r.registration_id === regId ? { ...r, photo_url: "uploaded" } : r
      )
    );
  };

  const remainingQuota = school.quota - usedQuota;
  const missingPhotoCount = studentList.filter((r) => !r.photo_url).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Photo Upload Modal */}
        {photoModalReg && (
          <PhotoUploadModal
            regId={photoModalReg.regId}
            studentName={photoModalReg.name}
            onClose={() => setPhotoModalReg(null)}
            onUploaded={handlePhotoUploaded}
          />
        )}

        {/* Header */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              <School className="text-blue-700 w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                {school.name}
              </h1>
              <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5 sm:mt-1">
                {school.city} • Code:{" "}
                <span className="whitespace-nowrap font-semibold text-slate-700">
                  {school.school_code}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 w-full md:w-auto">
            <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl border border-slate-100 text-center flex-1 md:flex-none">
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Total Quota</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{school.quota}</p>
            </div>
            <div className="bg-blue-50 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl border border-blue-100 text-center flex-1 md:flex-none">
              <p className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Available</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">{remainingQuota}</p>
            </div>
            {missingPhotoCount > 0 && (
              <div className="bg-amber-50 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl border border-amber-200 text-center flex-1 md:flex-none">
                <p className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Photos Missing</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-700">{missingPhotoCount}</p>
              </div>
            )}
          </div>
        </div>

        {/* Missing photos banner */}
        {missingPhotoCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <Camera size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold text-amber-900">
                {missingPhotoCount} student{missingPhotoCount !== 1 ? "s are" : " is"} missing a passport photo.
              </span>{" "}
              <span className="text-amber-700">
                Scroll down to the roster and click the{" "}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 border border-amber-300 rounded-lg text-xs font-semibold text-amber-800">
                  <Camera size={10} /> Upload Photo
                </span>{" "}
                button next to each student.
              </span>
            </div>
          </div>
        )}

        {/* Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left: Add Student Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="text-blue-600" size={22} />
                  <h2 className="font-bold text-lg text-slate-900">Add Student</h2>
                </div>
                {showAddForm ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </div>

              {showAddForm && (
                <div className="p-6 md:p-8">
                  {successState ? (
                    <div className="space-y-6 text-center max-w-md mx-auto py-4">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Student Registered Successfully</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Credentials generated for <strong>{successState.name}</strong>.
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 text-left space-y-1.5 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Candidate ID</span>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-700 font-mono shadow-sm">
                            {successState.registrationId}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyIdToClipboard(successState.registrationId)}
                            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                          >
                            {copiedId === successState.registrationId
                              ? <Check size={16} className="text-emerald-600" />
                              : <Copy size={16} className="text-slate-500" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-center pt-2">
                        <button
                          type="button"
                          onClick={() => { setSuccessState(null); if (!keepFormOpen) setShowAddForm(false); }}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
                        >
                          Add Another Student
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSuccessState(null); setShowAddForm(false); }}
                          className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-xl transition-all text-sm shadow-sm"
                        >
                          Close Form
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleAddStudentSubmit} className="space-y-6">
                      <div className="flex justify-between items-center bg-blue-50/50 px-4 py-3 rounded-2xl border border-blue-100/50">
                        <span className="text-xs font-semibold text-blue-800">Remaining seat capacity:</span>
                        <span className="text-sm font-bold text-blue-900">{remainingQuota} / {school.quota}</span>
                      </div>

                      {formError && (
                        <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-2xl border border-red-100 flex items-start gap-2">
                          <AlertCircle size={16} className="shrink-0 mt-0.5" />
                          {formError}
                        </div>
                      )}

                      <div className="space-y-5">
                        {/* Photo */}
                        <PhotoUploader
                          photoBase64={photoBase64}
                          onPhotoSelected={(b64) => { setPhotoBase64(b64); setPhotoError(""); }}
                          error={photoError}
                        />

                        {/* Student Name */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Student Name *</label>
                          <input required type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner"
                            disabled={registering || remainingQuota <= 0}
                          />
                        </div>

                        {/* DOB */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Date of Birth *</label>
                          <input required type="date" value={studentDob} onChange={(e) => setStudentDob(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner"
                            disabled={registering || remainingQuota <= 0}
                          />
                        </div>

                        {/* Class & Gender */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Class *</label>
                            <select required value={studentClass} onChange={(e) => setStudentClass(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm appearance-none cursor-pointer"
                              disabled={registering || remainingQuota <= 0}
                            >
                              <option value="">Select Class</option>
                              {[5, 6, 7, 8].map((c) => <option key={c} value={String(c)}>Class {c}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Gender (Optional)</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm appearance-none cursor-pointer"
                              disabled={registering || remainingQuota <= 0}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Mobile & Parent Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Parent Mobile *</label>
                            <input required type="tel" value={parentMobile}
                              onChange={(e) => setParentMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                              placeholder="10-digit number"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner"
                              maxLength={10} disabled={registering || remainingQuota <= 0}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Parent Name (Optional)</label>
                            <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)}
                              placeholder="e.g. Mr. Ramesh Sharma"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner"
                              disabled={registering || remainingQuota <= 0}
                            />
                          </div>
                        </div>

                        {/* Email & Language */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Parent Email (Optional)</label>
                            <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)}
                              placeholder="parent@example.com"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner"
                              disabled={registering || remainingQuota <= 0}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Exam Language</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm appearance-none cursor-pointer"
                              disabled={registering || remainingQuota <= 0}
                            >
                              <option value="English">English</option>
                              <option value="Hindi">Hindi</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                          <input type="checkbox" checked={keepFormOpen} onChange={(e) => setKeepFormOpen(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          Keep form open after save (Quick Add Mode)
                        </label>
                        <div className="flex flex-col-reverse sm:flex-row gap-2 w-full md:w-auto">
                          <button type="button" onClick={() => setShowAddForm(false)}
                            className="w-full sm:w-auto text-center px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            Cancel
                          </button>
                          <button type="submit" disabled={registering || remainingQuota <= 0}
                            className="w-full sm:w-auto justify-center px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                          >
                            {registering ? "Registering…" : <><Plus size={14} /> Register Student</>}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Utilities */}
          <div className="space-y-6">
            {/* Share Link */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shadow-inner">
                <ArrowUpRight size={24} className="text-emerald-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Share Registration Link</h3>
                <p className="text-xs text-slate-500 mt-1">Copy the referral link to share with parents, automatically applying your school code.</p>
              </div>
              <button onClick={copyToClipboard}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all text-slate-700 shadow-sm"
              >
                {copied ? <><Check size={14} className="text-emerald-600" /> Link Copied!</> : <><Copy size={14} /> Copy Invite Link</>}
              </button>
            </div>

            {/* Bulk Upload */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-inner">
                <Upload size={24} className="text-purple-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Bulk Excel Upload</h3>
                <p className="text-xs text-slate-500 mt-1">Register multiple candidates at once by importing a student spreadsheet.</p>
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-start gap-2">
                  <Camera size={12} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 font-semibold leading-snug">
                    Photos cannot be uploaded via Excel. After import, use the <strong>📷 Upload Photo</strong> button in the roster below.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload}
                    disabled={uploading || remainingQuota <= 0}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <button disabled={uploading || remainingQuota <= 0}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    {uploading ? "Uploading…" : <><FileSpreadsheet size={14} /> Upload Spreadsheet</>}
                  </button>
                </div>
                <button onClick={downloadTemplate}
                  className="w-full py-2 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-purple-100/50 shadow-sm"
                >
                  <Download size={14} /> Download Template
                </button>
              </div>
              {uploadError && (
                <p className="text-xs text-red-500 mt-1 whitespace-pre-line">{uploadError}</p>
              )}
            </div>

            {/* Export */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-inner">
                <Download size={24} className="text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Export Students</h3>
                <p className="text-xs text-slate-500 mt-1">Download a <code>.xlsx</code> of all registered candidates with photo status.</p>
              </div>
              <button onClick={exportToExcel} disabled={studentList.length === 0}
                className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm border border-amber-200/50"
              >
                <Download size={14} /> Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* ── Registered Students Roster ───────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Users size={20} className="text-blue-600 shrink-0" />
              Registered Students Roster
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              {missingPhotoCount > 0 && (
                <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                  {missingPhotoCount} photo{missingPhotoCount !== 1 ? "s" : ""} missing
                </span>
              )}
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {studentList.length} Total
              </span>
            </div>
          </div>

          {/* Mobile list */}
          <div className="block lg:hidden divide-y divide-slate-100">
            {studentList.length > 0 ? (
              studentList.map((reg, idx) => (
                <div key={idx} className="p-4 flex justify-between items-center gap-3 hover:bg-slate-50/20 transition-colors">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-sm truncate">{reg.student_name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <span>Class {reg.student_class}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{reg.registration_id}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {reg.photo_url ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ImageIcon size={9} /> Photo ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => setPhotoModalReg({ regId: reg.registration_id, name: reg.student_name })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200 transition-colors"
                      >
                        <Camera size={9} /> Upload Photo
                      </button>
                    )}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {reg.registration_status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 italic text-sm">
                No registrations yet. Add students using the form above or share your invite link.
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-slate-100">Student Name</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Class</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Photo</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Date Registered</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {studentList.length > 0 ? (
                  studentList.map((reg, idx) => (
                    <tr key={idx} className={`hover:bg-slate-50/30 transition-colors ${!reg.photo_url ? "bg-amber-50/30" : ""}`}>
                      <td className="p-4">
                        <p className="font-semibold text-slate-900">{reg.student_name}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{reg.registration_id}</p>
                      </td>
                      <td className="p-4">Class {reg.student_class}</td>
                      <td className="p-4">
                        {reg.photo_url ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ImageIcon size={11} /> Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => setPhotoModalReg({ regId: reg.registration_id, name: reg.student_name })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200 hover:shadow-sm transition-all"
                          >
                            <Camera size={12} /> Upload Photo
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(reg.created_at).toLocaleDateString(undefined, {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {reg.registration_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                      No registrations yet. Add students using the form above or share your invite link.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
