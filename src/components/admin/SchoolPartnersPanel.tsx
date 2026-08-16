"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { School, Search, Plus, Copy, Check, Users, CheckCircle, Phone, Mail, FileDown, Eye, EyeOff, Globe, Sparkles, ExternalLink, X, Key, Send } from "lucide-react";

export default function SchoolPartnersPanel() {
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Public Profile Modal State
  const [editingProfileSchool, setEditingProfileSchool] = useState<any | null>(null);
  const [profileState, setProfileState] = useState("");
  const [profileSlug, setProfileSlug] = useState("");
  const [profileStatus, setProfileStatus] = useState("DRAFT");
  const [isFounding, setIsFounding] = useState(false);
  const [publicDescription, setPublicDescription] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Reset PIN Modal State
  const [resetPinSchool, setResetPinSchool] = useState<any | null>(null);
  const [newPinInput, setNewPinInput] = useState("");
  const [notifyCoordinatorOnReset, setNotifyCoordinatorOnReset] = useState(true);
  const [resettingPin, setResettingPin] = useState(false);
  const [resetSuccessInfo, setResetSuccessInfo] = useState<{ clearPin: string; schoolName: string; emailSent?: boolean; whatsappSent?: boolean } | null>(null);
  const [resetErrorMsg, setResetErrorMsg] = useState("");

  // Inquiries State
  const [subTab, setSubTab] = useState<"active" | "requests">("active");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const fetchSchools = async () => {
    try {
      const res = await fetch("/api/admin/schools");
      const data = await res.json();
      if (data.success) {
        setSchools(data.schools);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch("/api/admin/support");
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        const schoolInquiries = data.messages.filter((m: any) => {
          if (!m.subject) return false;
          const subj = m.subject.toLowerCase();
          return (
            subj === "school partnership inquiry" ||
            subj.includes("school partnership") ||
            subj.includes("partnership request") ||
            subj.includes("school partnership request")
          );
        });
        setInquiries(schoolInquiries);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          updates: { status: newStatus }
        })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      }
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
    }
  };

  const handleResolveInquiry = (id: string) => handleUpdateInquiryStatus(id, "RESOLVED");
  const handleReopenInquiry = (id: string) => handleUpdateInquiryStatus(id, "PENDING");

  const parseInquiryMessage = (messageText: string) => {
    const lines = (messageText || "").split("\n");
    const data = {
      schoolName: "",
      schoolBoard: "",
      name: "",
      designation: "",
      studentStrength: "",
      message: ""
    };
    
    for (const line of lines) {
      if (line.includes("School Name:")) {
        data.schoolName = line.split("School Name:")[1].trim();
      } else if (line.includes("School Board:")) {
        data.schoolBoard = line.split("School Board:")[1].trim();
      } else if (line.includes("Coordinator Name:")) {
        data.name = line.split("Coordinator Name:")[1].trim();
      } else if (line.includes("Designation:")) {
        data.designation = line.split("Designation:")[1].trim();
      } else if (line.includes("Estimated Candidate Pool:")) {
        data.studentStrength = line.split("Estimated Candidate Pool:")[1].trim();
      } else if (line.includes("Remarks:")) {
        data.message = line.split("Remarks:")[1].trim();
      }
    }
    return data;
  };

  useEffect(() => {
    fetchSchools();
    fetchInquiries();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openProfileModal = (school: any) => {
    setEditingProfileSchool(school);
    setProfileState(school.state || "");
    const defaultSlug = `${school.name}-${school.city}-${school.state || "india"}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setProfileSlug(school.slug || defaultSlug);
    setProfileStatus(school.profile_status || "DRAFT");
    setIsFounding(Boolean(school.is_founding_school));
    setPublicDescription(school.public_description || "");
    setProfileError("");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfileSchool) return;
    setSavingProfile(true);
    setProfileError("");

    try {
      const res = await fetch("/api/admin/schools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProfileSchool.id,
          state: profileState.trim() || null,
          slug: profileSlug.trim().toLowerCase(),
          profile_status: profileStatus,
          is_founding_school: isFounding,
          public_description: publicDescription.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSchools((prev) =>
          prev.map((s) =>
            s.id === editingProfileSchool.id
              ? {
                  ...s,
                  state: profileState.trim() || null,
                  slug: profileSlug.trim().toLowerCase(),
                  profile_status: profileStatus,
                  is_founding_school: isFounding,
                  public_description: publicDescription.trim() || null,
                }
              : s
          )
        );
        setEditingProfileSchool(null);
      } else {
        setProfileError(data.message || "Failed to update profile");
      }
    } catch {
      setProfileError("Network error. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const openResetPinModal = (school: any) => {
    setResetPinSchool(school);
    const autoPin = Math.floor(1000 + Math.random() * 9000).toString();
    setNewPinInput(autoPin);
    setNotifyCoordinatorOnReset(true);
    setResetSuccessInfo(null);
    setResetErrorMsg("");
  };

  const handleResetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPinSchool || !newPinInput.trim()) return;
    setResettingPin(true);
    setResetErrorMsg("");

    try {
      const res = await fetch("/api/admin/schools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resetPinSchool.id,
          pin: newPinInput.trim(),
          notifyCoordinator: notifyCoordinatorOnReset,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResetSuccessInfo({
          clearPin: newPinInput.trim(),
          schoolName: resetPinSchool.name,
          emailSent: data.notification?.emailSent,
          whatsappSent: data.notification?.whatsappSent,
        });
      } else {
        setResetErrorMsg(data.message || "Failed to reset PIN");
      }
    } catch {
      setResetErrorMsg("Network error. Please try again.");
    } finally {
      setResettingPin(false);
    }
  };

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.school_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printCredentials = (school: any, overridePin?: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let displayPin = overridePin || school.raw_pin || school.pin || "";
    if (!overridePin && displayPin.startsWith("$2")) {
      displayPin = "[Secured - Click 'Reset PIN' to generate a new PIN]";
    }

    const html = `
      <html>
        <head>
          <title>CNTS School Credentials - ${school.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 900; color: #1e3a8a; letter-spacing: 1px; }
            h1 { color: #0f172a; margin-bottom: 5px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 30px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px; }
            .mono { font-family: monospace; font-size: 20px; background: #fff; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
            .referral { background: #eff6ff; border: 1px dashed #93c5fd; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; color: #1e40af; }
            .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">COURAGE NATIONAL TALENT SEARCH</div>
            <h1>School Partnership Credentials</h1>
            <p>Welcome to CNTS 2026. Keep this document secure.</p>
          </div>
          
          <div class="box">
            <div class="grid">
              <div>
                <div class="label">School Name</div>
                <div class="value">${school.name}</div>
              </div>
              <div>
                <div class="label">Coordinator</div>
                <div class="value">${school.coordinator_name} (${school.coordinator_mobile})</div>
              </div>
            </div>
          </div>

          <div class="box" style="background: #f0f9ff; border-color: #bae6fd;">
            <div class="grid">
              <div>
                <div class="label">School Access Code</div>
                <div class="value mono">${school.school_code}</div>
              </div>
              <div>
                <div class="label">Dashboard PIN</div>
                <div class="value mono">${displayPin}</div>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div class="label">Dashboard Login Link</div>
              <div class="value" style="font-size: 14px;">https://www.thecouragelibrary.com/school/login</div>
            </div>
          </div>

          <div class="box">
            <div class="label" style="margin-bottom: 10px;">Direct Student Referral Link (Auto-fills Code)</div>
            <div class="referral">https://www.thecouragelibrary.com/register?school=${school.school_code}</div>
            <p style="font-size: 13px; color: #475569; margin-top: 10px;">
              Share this link with your students. It will automatically waive their registration fee based on your pre-paid quota (${school.quota} seats).
            </p>
          </div>
          
          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} | Courage National Talent Search 2026
          </div>
          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
          <School className="text-blue-600" /> School Partners
        </h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {subTab === "active" && (
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search schools..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
          <button 
            onClick={() => router.push("/admin/schools/new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Plus size={16} /> Add School
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setSubTab("active")}
          className={`pb-4 px-4 font-display font-semibold text-sm border-b-2 transition-all ${
            subTab === "active"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Active Partners ({schools.length})
        </button>
        <button
          onClick={() => setSubTab("requests")}
          className={`pb-4 px-4 font-display font-semibold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
            subTab === "requests"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Partnership Requests
          {inquiries.filter(i => i.status === "PENDING").length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              {inquiries.filter(i => i.status === "PENDING").length}
            </span>
          )}
        </button>
      </div>

      {subTab === "active" ? (
        loading ? (
          <div className="py-20 text-center">Loading schools...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-quick">
            {filteredSchools.map(school => {
              const usedPct = Math.min(100, (school.used_quota / (school.quota || 1)) * 100);
              const isQuotaFull = school.used_quota >= school.quota;
              return (
              <div key={school.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col">
                
                {/* Card Header */}
                <div className="p-4 border-b border-slate-100">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 leading-snug text-sm truncate">{school.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{school.city} • <span className="text-indigo-600">{school.board}</span></p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${
                      school.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {school.status}
                    </span>
                  </div>
                </div>

                {/* Credentials Block */}
                <div
                  className="mx-4 mt-3 grid grid-cols-2 divide-x divide-slate-200 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer group hover:bg-indigo-50/50 hover:border-indigo-200 transition-colors"
                  onClick={() => copyToClipboard(school.school_code)}
                  title="Click to copy school code"
                >
                  <div className="p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">School Code</p>
                    <p className="font-mono font-bold text-slate-800 text-sm tracking-wide">{school.school_code}</p>
                  </div>
                  <div className="p-3 relative">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Login PIN</p>
                    <p className="font-mono font-bold text-slate-400 text-sm tracking-widest select-none">••••••••</p>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      {copiedCode === school.school_code
                        ? <Check size={13} className="text-emerald-500" />
                        : <Copy size={13} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />}
                    </div>
                  </div>
                </div>

                {/* Coordinator Info */}
                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Users size={11} className="text-indigo-500" />
                    </div>
                    <span className="text-slate-500 shrink-0">Coordinator</span>
                    <span className="font-semibold text-slate-800 truncate ml-auto text-right">{school.coordinator_name || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Phone size={11} className="text-emerald-500" />
                    </div>
                    <span className="text-slate-500 shrink-0">Mobile</span>
                    <span className="font-semibold text-slate-800 ml-auto font-mono">{school.coordinator_mobile || "—"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => openResetPinModal(school)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600 py-2 rounded-lg transition-all duration-200 border border-amber-200"
                    title="Reset PIN & dispatch Email/WhatsApp notification"
                  >
                    <Key size={13} /> Reset PIN
                  </button>
                  <button
                    onClick={() => openProfileModal(school)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 py-2 rounded-lg transition-all duration-200 border border-blue-100"
                  >
                    <Globe size={13} /> Profile ({school.profile_status || "DRAFT"})
                  </button>
                  <button
                    onClick={() => printCredentials(school)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 py-2 rounded-lg transition-all duration-200 border border-indigo-100 hover:border-indigo-600"
                  >
                    <FileDown size={13} /> Generate Credentials PDF
                  </button>
                </div>

                {/* Quota Footer */}
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 mt-auto">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <Users size={10} /> Quota
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {school.used_quota} <span className="text-slate-400 font-normal text-[10px]">/ {school.quota} seats</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isQuotaFull ? 'bg-rose-500' : usedPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${usedPct}%` }}
                    />
                  </div>
                </div>
              </div>
              );
            })}
            {filteredSchools.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
                <School size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-400">No schools found.</p>
              </div>
            )}
          </div>
        )
      ) : (
        loadingInquiries ? (
          <div className="py-20 text-center text-slate-500">Loading partnership requests...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-quick">
            {inquiries.map(inq => {
              const parsed = parseInquiryMessage(inq.message);
              const schoolName = parsed.schoolName || "Unknown School";
              const board = parsed.schoolBoard || "CBSE";
              const coordName = parsed.name || inq.name;
              const designation = parsed.designation || "Representative";
              const strength = parsed.studentStrength || "100-200";
              const remarks = parsed.message || inq.message;

              const onboardUrl = `/admin/schools/new?name=${encodeURIComponent(schoolName)}&board=${encodeURIComponent(board)}&coordinator_name=${encodeURIComponent(coordName)}&coordinator_email=${encodeURIComponent(inq.email)}&coordinator_mobile=${encodeURIComponent(inq.phone || "")}&quota=${encodeURIComponent(strength)}&remarks=${encodeURIComponent(remarks)}&inquiryId=${inq.id}`;

              return (
                <div key={inq.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-850 leading-tight">{schoolName}</h3>
                        <p className="text-xs text-slate-500 mt-1">Affiliation: {board} • Strength: {strength}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider ${
                        inq.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {inq.status || 'PENDING'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 mb-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Coordinator</span>
                        <span className="font-semibold text-slate-700">{coordName} ({designation})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email</span>
                        <span className="font-semibold text-slate-700">{inq.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact</span>
                        <span className="font-semibold text-slate-700">{inq.phone || "N/A"}</span>
                      </div>
                    </div>

                    {remarks && (
                      <div className="text-xs text-slate-600 bg-blue-50/40 p-3 rounded-xl border border-blue-100/50 leading-relaxed mb-4">
                        <span className="font-semibold text-blue-800 block mb-1">Message / Requirements:</span>
                        {remarks}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    {inq.status !== 'RESOLVED' ? (
                      <>
                        <button
                          onClick={() => router.push(onboardUrl)}
                          className="flex-1 text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                        >
                          Onboard School
                        </button>
                        <button
                          onClick={() => handleResolveInquiry(inq.id)}
                          className="flex-1 text-center py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all"
                        >
                          Mark as Resolved
                        </button>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-between gap-2 p-2 bg-emerald-50/80 rounded-xl border border-emerald-100 flex-wrap sm:flex-nowrap">
                        <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle size={14} className="text-emerald-600 shrink-0" /> Onboarded / Resolved
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(onboardUrl)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-2xs shrink-0"
                          >
                            Re-Onboard School →
                          </button>
                          <button
                            onClick={() => handleReopenInquiry(inq.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 underline shrink-0"
                            title="Reset status back to Pending"
                          >
                            Re-Open
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {inquiries.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-500">No school partnership inquiries found.</p>
              </div>
            )}
          </div>
        )
      )}

      {/* Edit Public Profile Modal */}
      {editingProfileSchool && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Public Profile Settings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure public visibility for <span className="font-semibold text-slate-700">{editingProfileSchool.name}</span>
                </p>
              </div>
              <button onClick={() => setEditingProfileSchool(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              {profileError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
                  {profileError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">State (Location) *</label>
                <input
                  required
                  type="text"
                  value={profileState}
                  onChange={(e) => setProfileState(e.target.value)}
                  placeholder="e.g. Rajasthan, Uttar Pradesh"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Public URL Slug *</label>
                <input
                  required
                  type="text"
                  value={profileSlug}
                  onChange={(e) => setProfileSlug(e.target.value)}
                  placeholder="e.g. courage-public-school-jaipur-rajasthan"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                />
                <p className="text-[10px] text-slate-400 font-mono">
                  URL: /schools/{profileSlug || "slug"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Profile Status</label>
                  <select
                    value={profileStatus}
                    onChange={(e) => setProfileStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  >
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="PUBLISHED">PUBLISHED (Public)</option>
                    <option value="VERIFIED">VERIFIED (Reviewed)</option>
                    <option value="ARCHIVED">ARCHIVED (Disabled)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Founding School 2026</label>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFounding}
                      onChange={(e) => setIsFounding(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-800">CNTS Founding Badge</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Public About Description</label>
                <textarea
                  rows={3}
                  value={publicDescription}
                  onChange={(e) => setPublicDescription(e.target.value)}
                  placeholder="Optional brief public description about this institution for their CNTS page..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              {profileStatus === "PUBLISHED" && profileSlug && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-900">Live Public Page</span>
                  <a
                    href={`/schools/${profileSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Preview Page <ExternalLink size={12} />
                  </a>
                </div>
              )}

              <div className="pt-4 flex gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProfileSchool(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  {savingProfile ? "Saving…" : "Save Profile Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset PIN Modal */}
      {resetPinSchool && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Reset School Access PIN</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  For <span className="font-semibold text-slate-700">{resetPinSchool.name}</span> ({resetPinSchool.school_code})
                </p>
              </div>
              <button onClick={() => setResetPinSchool(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            {resetSuccessInfo ? (
              <div className="p-6 space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle size={18} className="text-emerald-600" />
                    PIN Reset & Dispatched Successfully!
                  </div>
                  <p className="text-xs text-emerald-700">
                    New PIN: <span className="font-mono font-bold text-slate-900 text-base px-2 py-0.5 bg-white rounded border border-emerald-300">{resetSuccessInfo.clearPin}</span>
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-800 space-y-1 font-medium border-t border-emerald-200">
                    <p>• Brevo Email: {resetSuccessInfo.emailSent ? "✓ Delivered to coordinator" : "— Skipped/Pending"}</p>
                    <p>• Meta WhatsApp: {resetSuccessInfo.whatsappSent ? "✓ Delivered to mobile" : "— Skipped/Pending"}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => printCredentials(resetPinSchool, resetSuccessInfo.clearPin)}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <FileDown size={14} /> Print Credentials PDF
                  </button>
                  <button
                    onClick={() => setResetPinSchool(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPinSubmit} className="p-6 space-y-4">
                {resetErrorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
                    {resetErrorMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">New Access PIN *</label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="text"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="e.g. 5750"
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setNewPinInput(Math.floor(1000 + Math.random() * 9000).toString())}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Auto-Generate
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">The coordinator uses this 4-digit PIN to log into their dashboard.</p>
                </div>

                <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyCoordinatorOnReset}
                      onChange={(e) => setNotifyCoordinatorOnReset(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Send size={12} className="text-blue-600" /> Send Email & WhatsApp Credentials
                    </span>
                  </label>
                  <p className="text-[10px] text-slate-500 pl-6">
                    Dispatches credentials to <strong>{resetPinSchool.coordinator_email || "Email"}</strong> & <strong>{resetPinSchool.coordinator_mobile || "Mobile"}</strong>.
                  </p>
                </div>

                <div className="pt-3 flex gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setResetPinSchool(null)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resettingPin || !newPinInput.trim()}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    {resettingPin ? "Updating & Sending…" : "Update PIN & Notify"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
