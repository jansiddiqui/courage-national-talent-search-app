"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { School, Search, Plus, Copy, Check, Users, CheckCircle, RefreshCw } from "lucide-react";

export default function SchoolPartnersPanel() {
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
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
        const schoolInquiries = data.messages.filter(
          (m: any) => m.subject === "School Partnership Inquiry"
        );
        setInquiries(schoolInquiries);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleResolveInquiry = async (id: string) => {
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          updates: { status: "RESOLVED" }
        })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: "RESOLVED" } : inq));
      }
    } catch (err) {
      console.error("Failed to resolve inquiry:", err);
    }
  };

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

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.school_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printCredentials = (school: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
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
                <div class="value mono">${school.pin}</div>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div class="label">Dashboard Login Link</div>
              <div class="value" style="font-size: 14px;">https://www.thecouragelibrary.com/dashboard/school/login</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-quick">
            {filteredSchools.map(school => (
              <div key={school.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">{school.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{school.city} • {school.board}</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${school.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {school.status}
                  </span>
                </div>

                <div className="flex gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 relative group cursor-pointer" onClick={() => copyToClipboard(school.school_code)}>
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">School Code</p>
                    <p className="font-mono font-bold text-slate-700">{school.school_code}</p>
                  </div>
                  <div className="flex-1 border-l border-slate-200 pl-3">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Login PIN</p>
                    <p className="font-mono font-bold text-slate-700">{school.pin}</p>
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedCode === school.school_code ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-400" />}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Coordinator</span>
                    <span className="font-medium text-slate-700">{school.coordinator_name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-medium text-slate-700">{school.coordinator_mobile || "N/A"}</span>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => printCredentials(school)}
                      className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors border border-blue-100"
                    >
                      Generate Credentials PDF
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                      <Users size={12} /> Quota Usage
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {school.used_quota} <span className="text-slate-400 font-normal">/ {school.quota}</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${school.used_quota >= school.quota ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(100, (school.used_quota / (school.quota || 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            {filteredSchools.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-500">No schools found.</p>
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
                      <div className="w-full text-center py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center gap-1">
                        <CheckCircle size={14} /> Inquiry Resolved & Onboarded
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
    </div>
  );
}
