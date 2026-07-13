"use client";

import { useState, useEffect, useCallback } from "react";
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
  DollarSign,
  Megaphone,
  FileText,
  Calendar,
  BarChart3,
  TrendingUp,
  Eye,
  Settings,
  HelpCircle,
  FileDown,
  RefreshCw
} from "lucide-react";
import * as XLSX from "xlsx";
import PhotoUploader from "@/components/registration/PhotoUploader";

// ─── Inline Student 360° Profile Modal ──────────────────────────────────────────
function Student360Modal({
  studentId,
  studentName,
  schoolId,
  onClose,
}: {
  studentId: string;
  studentName: string;
  schoolId: string;
  onClose: () => void;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/schools/roster/${studentId}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        } else {
          setError(data.message || "Failed to load student profile");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [studentId]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Student 360° Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive parameter view for <span className="font-semibold text-slate-700">{studentName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {loading ? (
            <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-blue-600" size={18} /> Loading student data...
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-2xl border border-red-100 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Identity & Funnel Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Details</h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-semibold text-slate-500">ID:</span> <span className="font-mono text-slate-900 font-bold">{profile.student.registration_id}</span></p>
                    <p><span className="font-semibold text-slate-500">Class:</span> Class {profile.student.student_class}</p>
                    <p><span className="font-semibold text-slate-500">DOB:</span> {new Date(profile.student.dob).toLocaleDateString()}</p>
                    <p><span className="font-semibold text-slate-500">Parent Mobile:</span> {profile.student.mobile_number}</p>
                    <p><span className="font-semibold text-slate-500">Language:</span> {profile.student.language}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cohort Funnel Status</h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold text-slate-500">Registration:</span>{" "}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {profile.student.registration_status}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-slate-500">Sponsorship:</span>{" "}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {profile.student.payment_status}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-slate-500">Admit Card Download:</span>{" "}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${profile.admitCardDownloaded ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        {profile.admitCardDownloaded ? 'DOWNLOADED' : 'PENDING'}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-slate-500">Certificate Download:</span>{" "}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${profile.certificateDownloaded ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        {profile.certificateDownloaded ? 'DOWNLOADED' : 'PENDING'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Quota Allocation & Transaction ID */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quota Allocation History</h4>
                {profile.allocation ? (
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-semibold text-slate-500">Allocation status:</span> <span className="font-semibold text-emerald-600">{profile.allocation.status}</span></p>
                    <p><span className="font-semibold text-slate-500">Allocated At:</span> {new Date(profile.allocation.allocated_at).toLocaleString()}</p>
                    <p><span className="font-semibold text-slate-500">Idempotency Reference Key:</span> <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">{profile.allocation.idempotency_key}</code></p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No sponsored allocation ledger recorded.</p>
                )}
              </div>

              {/* Assessment Performance DNA */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance DNA & Results</h4>
                {profile.result ? (
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-semibold text-slate-500">Score:</span> {profile.result.score}</p>
                    <p><span className="font-semibold text-slate-500">Percentile:</span> {profile.result.percentile}%</p>
                    <p><span className="font-semibold text-slate-500">Rank:</span> {profile.result.rank || 'N/A'}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">Assessment results not published yet.</p>
                )}
              </div>

              {/* Issued Certificates */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates</h4>
                {profile.certificate ? (
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-semibold text-slate-500">Type:</span> {profile.certificate.certificate_type}</p>
                    <p><span className="font-semibold text-slate-500">Verification Token:</span> <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">{profile.certificate.verification_token}</code></p>
                    <p><span className="font-semibold text-slate-500">Issued At:</span> {new Date(profile.certificate.issued_at).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No certificates issued.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Upload Student Photo</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              For <span className="font-semibold text-slate-700">{studentName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <PhotoUploader
            photoBase64={photoBase64}
            onPhotoSelected={(base64) => {
              setPhotoBase64(base64);
              setError("");
            }}
            error={error && !photoBase64 ? error : undefined}
          />
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!photoBase64 || uploading} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors">
            {uploading ? "Saving…" : "Save Photo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SchoolDashboardClient({
  school,
  registrations,
}: {
  school: any;
  registrations: any[];
}) {
  const [activeTab, setActiveTab] = useState<"roster" | "financials" | "documents" | "communications" | "calendar" | "reports" | "snapshots">("roster");
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Dashboard Action States
  const [dashboardData, setDashboardData] = useState<any>({
    announcements: [],
    acknowledgments: [],
    events: [],
    documents: [],
    ledger: [],
    balance: 0,
    snapshots: [],
    config: null,
  });

  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Form States
  const [studentList, setStudentList] = useState(registrations);
  const [showAddForm, setShowAddForm] = useState(false);
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
  const [formError, setFormError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [successState, setSuccessState] = useState<{ registrationId: string; name: string } | null>(null);
  const [photoModalReg, setPhotoModalReg] = useState<{ regId: string; name: string } | null>(null);
  const [selectedStudent360, setSelectedStudent360] = useState<{ id: string; name: string } | null>(null);

  // Document Upload State
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docType, setDocType] = useState("MOU");
  const [docFileBase64, setDocFileBase64] = useState("");
  const [docIssueDate, setDocIssueDate] = useState("");
  const [docExpiryDate, setDocExpiryDate] = useState("");
  const [docUploadError, setDocUploadError] = useState("");

  // Report Schedule State
  const [scheduleType, setScheduleType] = useState("DAILY");
  const [scheduleEmails, setScheduleEmails] = useState("");
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Fetch Dashboard State Data
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch("/api/schools/dashboard-actions");
      const data = await res.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Failed to load dashboard parameters:", err);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const copyToClipboard = () => {
    const inviteLink = `${window.location.origin}/register?school=${school.school_code}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyIdToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Acknowledge circulars
  const handleAcknowledge = async (announcementId: string) => {
    try {
      const res = await fetch("/api/schools/dashboard-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "acknowledge", announcementId }),
      });
      const data = await res.json();
      if (data.success) {
        setDashboardData((prev: any) => ({
          ...prev,
          acknowledgments: [...prev.acknowledgments, announcementId],
        }));
      }
    } catch (err) {
      console.error("Acknowledgment trigger failed:", err);
    }
  };

  // Upload Document
  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFileBase64) {
      setDocUploadError("Please select a document file.");
      return;
    }
    setUploadingDoc(true);
    setDocUploadError("");

    try {
      const res = await fetch("/api/schools/dashboard-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upload_doc",
          documentType: docType,
          storagePath: `documents/${school.school_code}/${docType}_${Date.now()}.pdf`,
          issueDate: docIssueDate || undefined,
          expiryDate: docExpiryDate || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDocFileBase64("");
        setDocIssueDate("");
        setDocExpiryDate("");
        fetchDashboardData();
      } else {
        setDocUploadError(data.message || "Failed to register document");
      }
    } catch {
      setDocUploadError("Network error. Please try again.");
    } finally {
      setUploadingDoc(false);
    }
  };

  // Download Document Signed URL
  const handleDocDownload = async (docId: string) => {
    try {
      const res = await fetch(`/api/schools/documents/${docId}/download`);
      const data = await res.json();
      if (data.success && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        alert(data.message || "Failed to get document download URL");
      }
    } catch (err) {
      console.error("Document download failed:", err);
    }
  };

  // single candidate submit
  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessState(null);

    if (!studentName.trim()) { setFormError("Student Name is required."); return; }
    if (!studentClass) { setFormError("Class is required."); return; }
    if (!studentDob) { setFormError("Date of Birth is required."); return; }
    if (parentMobile.length !== 10) { setFormError("Parent Mobile is required."); return; }

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
        setStudentList((prev: any[]) => [
          {
            registration_id: data.registrationId,
            student_name: studentName.trim(),
            student_class: studentClass,
            registration_status: "REGISTERED",
            photo_url: photoBase64 ? "uploaded" : null,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setSuccessState({ registrationId: data.registrationId, name: studentName.trim() });
        // Reset form
        setStudentName("");
        setStudentClass("");
        setStudentDob("");
        setParentMobile("");
        setParentEmail("");
        setParentName("");
        setGender("");
        setPhotoBase64("");
      } else {
        setFormError(data.message || "Failed to register student.");
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const handlePhotoUploaded = (regId: string) => {
    setStudentList((prev: any[]) =>
      prev.map((r) =>
        r.registration_id === regId ? { ...r, photo_url: "uploaded" } : r
      )
    );
  };

  const remainingQuota = (dashboardData.config?.quota || school.quota) - (dashboardData.config?.used_quota || school.used_quota);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Photo Upload Modal */}
        {photoModalReg && (
          <PhotoUploadModal
            regId={photoModalReg.regId}
            studentName={photoModalReg.name}
            onClose={() => setPhotoModalReg(null)}
            onUploaded={handlePhotoUploaded}
          />
        )}

        {/* Student 360 profile Modal */}
        {selectedStudent360 && (
          <Student360Modal
            studentId={selectedStudent360.id}
            studentName={selectedStudent360.name}
            schoolId={school.id}
            onClose={() => setSelectedStudent360(null)}
          />
        )}

        {/* School Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              <School className="text-blue-700 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                {school.name}
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">
                {school.city} • Code: <span className="font-semibold text-slate-700">{school.school_code}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center flex-1 md:flex-none">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Total Quota</p>
              <p className="text-2xl font-bold text-slate-900">{dashboardData.config?.quota || school.quota}</p>
            </div>
            <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 text-center flex-1 md:flex-none">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1">Available Quota</p>
              <p className="text-2xl font-bold text-blue-700">{remainingQuota}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-1 bg-white p-2 rounded-2xl shadow-sm border">
          {(["roster", "financials", "documents", "communications", "calendar", "reports", "snapshots"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider shrink-0 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab View Panels */}
        <div className="space-y-6">
          
          {/* TABS 1: ROSTER & FUNNEL */}
          {activeTab === "roster" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Form & Roster */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Add Student Button */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 cursor-pointer hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus className="text-blue-600" size={22} />
                      <h2 className="font-bold text-base text-slate-900">Add Student Registration</h2>
                    </div>
                    {showAddForm ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </div>

                  {showAddForm && (
                    <form onSubmit={handleAddStudentSubmit} className="p-6 space-y-4">
                      {formError && (
                        <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-2xl border border-red-100 flex items-start gap-2">
                          <AlertCircle size={16} className="shrink-0 mt-0.5" /> {formError}
                        </div>
                      )}

                      <div className="space-y-4">
                        <PhotoUploader
                          photoBase64={photoBase64}
                          onPhotoSelected={(b64) => { setPhotoBase64(b64); setPhotoError(""); }}
                          error={photoError}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Student Name *</label>
                            <input required type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Date of Birth *</label>
                            <input required type="date" value={studentDob} onChange={(e) => setStudentDob(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Class *</label>
                            <select required value={studentClass} onChange={(e) => setStudentClass(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                              <option value="">Select Class</option>
                              {[5,6,7,8].map(c => <option key={c} value={String(c)}>Class {c}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Parent Mobile *</label>
                            <input required type="tel" value={parentMobile} onChange={(e) => setParentMobile(e.target.value.slice(0, 10))} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                        <button type="submit" disabled={registering} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                          {registering ? "Registering…" : "Register Candidate"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Student Roster Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Users size={20} className="text-blue-600" /> Registered Students
                    </h2>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {studentList.length} Total
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                          <th className="p-4 font-semibold border-b border-slate-100">Student Name</th>
                          <th className="p-4 font-semibold border-b border-slate-100">Class</th>
                          <th className="p-4 font-semibold border-b border-slate-100">Photo</th>
                          <th className="p-4 font-semibold border-b border-slate-100">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {studentList.length > 0 ? (
                          studentList.map((reg, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-4 font-semibold">
                                <button onClick={() => setSelectedStudent360({ id: reg.registration_id, name: reg.student_name })} className="text-blue-600 hover:underline text-left">
                                  {reg.student_name}
                                </button>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{reg.registration_id}</p>
                              </td>
                              <td className="p-4">Class {reg.student_class}</td>
                              <td className="p-4">
                                {reg.photo_url ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <ImageIcon size={12} /> Uploaded
                                  </span>
                                ) : (
                                  <button onClick={() => setPhotoModalReg({ regId: reg.registration_id, name: reg.student_name })} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">
                                    <Camera size={12} /> Upload
                                  </button>
                                )}
                              </td>
                              <td className="p-4">
                                <button onClick={() => setSelectedStudent360({ id: reg.registration_id, name: reg.student_name })} className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-600">
                                  <Eye size={14} /> Profile 360
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                              No registrations yet. Add students using the form above or share your invite link.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Invite / Excel Upload */}
              <div className="space-y-6">
                {/* Share Link */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                    <ArrowUpRight size={24} className="text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-sans tracking-tight">Invite Link</h3>
                    <p className="text-xs text-slate-500 mt-1">Copy and share this referral link with parents to register students.</p>
                  </div>
                  <button onClick={copyToClipboard} className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all">
                    {copied ? "Link Copied!" : "Copy Invite Link"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIALS */}
          {activeTab === "financials" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 shadow-inner">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Dynamic Outstanding Balance</h3>
                    <p className="text-2xl font-bold text-slate-900 mt-0.5">₹ {dashboardData.balance?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                  Pay Outstanding Fees
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-base">Ledger Statement History</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold border-b border-slate-100">Date</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Transaction Type</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Reference ID</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {dashboardData.ledger?.length > 0 ? (
                        dashboardData.ledger.map((tx: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-4 text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 font-semibold">{tx.transactionType}</td>
                            <td className="p-4 font-mono text-xs">{tx.referenceId || "N/A"}</td>
                            <td className={`p-4 font-bold ${['PAYMENT', 'SPONSORED_CREDIT'].includes(tx.transactionType) ? 'text-emerald-600' : 'text-slate-900'}`}>
                              ₹ {tx.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-400 italic">No financial ledger entries recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNICATIONS / ANNOUNCEMENTS */}
          {activeTab === "communications" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Megaphone className="text-blue-600" size={22} />
                <h2 className="font-bold text-lg text-slate-900">Announcements Circular Board</h2>
              </div>

              <div className="space-y-4">
                {dashboardData.announcements?.length > 0 ? (
                  dashboardData.announcements.map((ann: any, idx: number) => {
                    const isAcked = dashboardData.acknowledgments?.includes(ann.id);
                    return (
                      <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ann.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                              {ann.priority}
                            </span>
                            <span className="text-xs text-slate-400">{new Date(ann.publish_time).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base">{ann.title}</h4>
                          <p className="text-sm text-slate-600">{ann.content}</p>
                        </div>
                        {ann.required_acknowledgment && (
                          <button
                            onClick={() => !isAcked && handleAcknowledge(ann.id)}
                            disabled={isAcked}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                              isAcked
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {isAcked ? "Acknowledged ✓" : "Acknowledge"}
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500 italic text-center py-6">No active announcements circulars found.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Upload Document Form */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileText className="text-blue-600" size={20} />
                  <h3 className="font-bold text-base text-slate-900">Upload Coordinator Documents</h3>
                </div>
                
                {docUploadError && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
                    {docUploadError}
                  </div>
                )}

                <form onSubmit={handleDocUpload} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Document Type *</label>
                    <select required value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                      <option value="MOU">Memorandum of Understanding (MoU)</option>
                      <option value="GST">GST Registration Certificate</option>
                      <option value="PRINCIPAL_AUTH">Principal Authorization</option>
                      <option value="SPONSOR_AGREEMENT">Sponsorship Agreement</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Issue Date (Optional)</label>
                    <input type="date" value={docIssueDate} onChange={(e) => setDocIssueDate(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expiry Date (Optional)</label>
                    <input type="date" value={docExpiryDate} onChange={(e) => setDocExpiryDate(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Document File (PDF/Image) *</label>
                    <input required type="file" accept=".pdf,image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setDocFileBase64(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>

                  <button type="submit" disabled={uploadingDoc} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                    {uploadingDoc ? "Uploading..." : "Submit Document"}
                  </button>
                </form>
              </div>

              {/* Uploaded Documents List */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Active Documents Registry</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold border-b border-slate-100">Document Type</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Version</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Uploaded At</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {dashboardData.documents?.length > 0 ? (
                        dashboardData.documents.map((doc: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-4 font-semibold">{doc.documentType}</td>
                            <td className="p-4">v{doc.version}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                doc.verificationStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                doc.verificationStatus === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' :
                                'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {doc.verificationStatus}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                            <td className="p-4">
                              <button onClick={() => handleDocDownload(doc.id)} className="text-blue-600 hover:underline flex items-center gap-1 text-xs font-bold">
                                <FileDown size={14} /> Download
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 italic">No uploaded documents registered.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CALENDAR */}
          {activeTab === "calendar" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Calendar className="text-blue-600" size={22} />
                <h2 className="font-bold text-lg text-slate-900">Deadlines and Exam Calendar</h2>
              </div>

              <div className="space-y-4">
                {dashboardData.events?.length > 0 ? (
                  dashboardData.events.map((ev: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.event_type === 'GLOBAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {ev.event_type}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base mt-1">{ev.title}</h4>
                        <p className="text-sm text-slate-500">{ev.description}</p>
                      </div>
                      <div className="text-right shrink-0 text-xs font-medium text-slate-600">
                        <p><span className="font-bold">Start:</span> {new Date(ev.start_date).toLocaleString()}</p>
                        <p className="mt-0.5"><span className="font-bold">End:</span> {new Date(ev.end_date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic text-center py-6">No scheduled calendar events found.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS & SCHEDULES */}
          {activeTab === "reports" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <BarChart3 className="text-blue-600" size={22} />
                <h2 className="font-bold text-lg text-slate-900">Email Reports and Schedules</h2>
              </div>

              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">Schedule Roster Summary Report</h4>
                  <p className="text-sm text-slate-500">Enable automatic summaries generated and sent directly to emails.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <select value={scheduleType} onChange={(e) => setScheduleType(e.target.value)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm">
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow">
                    Create Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PERFORMANCE SNAPSHOTS */}
          {activeTab === "snapshots" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <TrendingUp className="text-blue-600" size={22} />
                <h2 className="font-bold text-lg text-slate-900">Year-Over-Year Performance Snapshots</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold border-b border-slate-100">Academic Year</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Students Count</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Average Score</th>
                      <th className="p-4 font-semibold border-b border-slate-100">School Rank</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Scholarships</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {dashboardData.snapshots?.length > 0 ? (
                      dashboardData.snapshots.map((snap: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-4 font-bold">{snap.academic_sessions?.session_name || "N/A"}</td>
                          <td className="p-4">{snap.student_count}</td>
                          <td className="p-4">{snap.average_score.toFixed(2)}</td>
                          <td className="p-4">#{snap.school_rank || "N/A"}</td>
                          <td className="p-4">{snap.scholarship_count}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 italic">No historical snapshots calculated.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
