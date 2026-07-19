"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Copy, Check, CheckCircle, XCircle, RefreshCw, FileText, School } from "lucide-react";

export default function OnboardNewSchoolPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500 font-semibold">Loading Onboarding Form...</div>}>
      <OnboardNewSchoolForm />
    </Suspense>
  );
}

function OnboardNewSchoolForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [inquiryId, setInquiryId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    board: "",
    school_type: "PRIVATE",
    coordinator_name: "",
    coordinator_mobile: "",
    coordinator_email: "",
    quota: "50",
    sponsorship_mode: "FULL",
    pin: "",
    school_code: "",
  });

  const generateCode = () => {
    const cityPrefix = formData.city.substring(0, 3).toUpperCase() || "XXX";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `CNTS-${cityPrefix}-${randomNum}`;
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setFormData(prev => ({ ...prev, school_code: code, pin }));
  };

  // Generate initial code on mount and parse query parameters
  useEffect(() => {
    const nameParam = searchParams.get("name") || "";
    const boardParam = searchParams.get("board") || "";
    const coordName = searchParams.get("coordinator_name") || "";
    const coordEmail = searchParams.get("coordinator_email") || "";
    const coordMobile = searchParams.get("coordinator_mobile") || "";
    const pool = searchParams.get("quota") || "";
    const inqId = searchParams.get("inquiryId");

    if (inqId) {
      setInquiryId(inqId);
    }

    let parsedQuota = 50;
    if (pool) {
      const match = pool.match(/(\d+)\s*(?:to|-)\s*(\d+)/i);
      if (match) {
        parsedQuota = Math.floor((parseInt(match[1]) + parseInt(match[2])) / 2);
      } else {
        const singleMatch = pool.match(/(\d+)/);
        if (singleMatch) {
          parsedQuota = parseInt(singleMatch[1]);
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      name: nameParam || prev.name,
      board: boardParam || prev.board,
      coordinator_name: coordName || prev.coordinator_name,
      coordinator_email: coordEmail || prev.coordinator_email,
      coordinator_mobile: coordMobile || prev.coordinator_mobile,
      quota: parsedQuota.toString()
    }));

    const cityPrefix = formData.city.substring(0, 3).toUpperCase() || "XXX";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `CNTS-${cityPrefix}-${randomNum}`;
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setFormData(prev => ({ ...prev, school_code: code, pin }));
  }, [searchParams]);

  const handleCityChange = (city: string) => {
    setFormData(prev => {
      const cityPrefix = city.substring(0, 3).toUpperCase() || "XXX";
      const suffix = prev.school_code ? prev.school_code.split("-")[2] : Math.floor(1000 + Math.random() * 9000).toString();
      const code = `CNTS-${cityPrefix}-${suffix}`;
      return { ...prev, city, school_code: code };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        if (inquiryId) {
          try {
            await fetch("/api/admin/support", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: inquiryId,
                updates: { status: "RESOLVED" }
              })
            });
          } catch (inqErr) {
            console.error("Failed to auto-resolve inquiry:", inqErr);
          }
        }
      } else {
        setError(data.message || "Failed to add school");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      board: "",
      school_type: "PRIVATE",
      coordinator_name: "",
      coordinator_mobile: "",
      coordinator_email: "",
      quota: "50",
      sponsorship_mode: "FULL",
      pin: "",
      school_code: "",
    });
    setIsSuccess(false);
    setError("");
    // Generate new code for next onboarding
    setTimeout(() => generateCode(), 0);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs & Back Nav */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => router.push("/admin")}>Admin</span>
            <span>/</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => router.push("/admin?tab=schools")}>School Partners</span>
            <span>/</span>
            <span className="text-slate-600 font-bold">Onboard</span>
          </div>
          <button 
            onClick={() => router.push("/admin?tab=schools")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Schools
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-md max-w-2xl mx-auto text-center space-y-8 animate-fadeIn">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle size={40} />
              </div>
              <h1 className="font-display font-bold text-3xl text-slate-800 tracking-tight">School Onboarded Successfully!</h1>
              <p className="text-slate-500 mt-2 max-w-md">
                <strong>{formData.name}</strong> has been registered. Share the generated onboarding credentials with the coordinator.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-5 text-left max-w-md mx-auto shadow-sm">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">School Access Code</span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-700 font-mono shadow-sm">
                    {formData.school_code}
                  </code>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(formData.school_code)} 
                    className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                    title="Copy Code"
                  >
                    {copiedCode === formData.school_code ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} className="text-slate-500" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dashboard PIN</span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-700 font-mono shadow-sm">
                    {formData.pin}
                  </code>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(formData.pin)} 
                    className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                    title="Copy PIN"
                  >
                    {copiedCode === formData.pin ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} className="text-slate-500" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <button 
                type="button"
                onClick={() => printCredentials(formData)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 font-bold rounded-xl border border-blue-200 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <FileText size={18} /> Credentials PDF
              </button>
              <button 
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Onboard Another
              </button>
              <button 
                type="button"
                onClick={() => router.push("/admin?tab=schools")}
                className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl shadow-sm transition-all"
              >
                Back to List
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <div className="space-y-8">
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight flex items-center gap-2.5">
                <School className="text-blue-600" size={32} /> Onboard New School
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-2">
                Create a new school partner and generate onboarding credentials.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 flex items-center gap-2 font-medium">
                <XCircle size={18} className="shrink-0" /> {error}
              </div>
            )}

            <form id="onboard-school-form" onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* LEFT COLUMN: School Info & Sponsorship Settings */}
                <div className="space-y-8">
                  
                  {/* Section 1: School Information */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">1. School Information</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Primary registration details for the school partner.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">School Name *</label>
                        <input 
                          required 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner" 
                          placeholder="e.g. Delhi Public School" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">City *</label>
                          <input 
                            required 
                            value={formData.city} 
                            onChange={e => handleCityChange(e.target.value)} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner" 
                            placeholder="e.g. Lucknow" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Board *</label>
                          <select 
                            required 
                            value={formData.board} 
                            onChange={e => setFormData({...formData, board: e.target.value})} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm appearance-none cursor-pointer"
                          >
                            <option value="">Select Board</option>
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                            <option value="State Board">State Board</option>
                            <option value="IB">IB</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">School Type</label>
                        <select 
                          required 
                          value={formData.school_type} 
                          onChange={e => setFormData({...formData, school_type: e.target.value})} 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm appearance-none cursor-pointer"
                        >
                          <option value="PRIVATE">Private</option>
                          <option value="GOVERNMENT">Government</option>
                          <option value="TRUST">Trust</option>
                          <option value="COACHING">Coaching</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Sponsorship Settings */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">3. Sponsorship Settings</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Control registrations and sponsorship terms.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Seat Quota *</label>
                        <input 
                          type="number" 
                          required 
                          value={formData.quota} 
                          onChange={e => setFormData({...formData, quota: e.target.value})} 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-bold shadow-inner" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sponsorship Mode</label>
                        <select 
                          value={formData.sponsorship_mode} 
                          onChange={e => setFormData({...formData, sponsorship_mode: e.target.value})} 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm appearance-none cursor-pointer"
                        >
                          <option value="FULL">FULL (100% Free for Student)</option>
                          <option value="PARTIAL">PARTIAL (Split Payment)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Coordinator Info & Generated Credentials */}
                <div className="space-y-8">

                  {/* Section 2: Coordinator Information */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">2. Coordinator Information</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Contact details of the point of contact at the school.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Coordinator Name *</label>
                        <input 
                          required 
                          value={formData.coordinator_name} 
                          onChange={e => setFormData({...formData, coordinator_name: e.target.value})} 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner" 
                          placeholder="e.g. Ramesh Kumar" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mobile Number *</label>
                          <input 
                            required 
                            value={formData.coordinator_mobile} 
                            onChange={e => setFormData({...formData, coordinator_mobile: e.target.value})} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner" 
                            placeholder="10-digit number" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                          <input 
                            type="email" 
                            value={formData.coordinator_email} 
                            onChange={e => setFormData({...formData, coordinator_email: e.target.value})} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner" 
                            placeholder="coordinator@school.com" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Generated Credentials */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">4. Generated Credentials</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">Secure access credentials generated automatically.</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={generateCode} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-xs font-bold transition-all shadow-sm"
                        title="Regenerate credentials"
                      >
                        <RefreshCw size={12} /> Regenerate
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/50 space-y-3.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">School Code</span>
                          <span className="font-mono font-bold text-slate-800 text-sm bg-white px-2.5 py-0.5 rounded border border-blue-200/60 shadow-sm">{formData.school_code || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Access PIN</span>
                          <span className="font-mono font-bold text-slate-800 text-sm bg-white px-2.5 py-0.5 rounded border border-blue-200/60 shadow-sm">{formData.pin || "-"}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        Credentials will be locked and saved upon submitting this form.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/60">
                <button 
                  type="button" 
                  onClick={() => router.push("/admin?tab=schools")} 
                  className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 bg-white border border-slate-200 rounded-xl transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  {saving ? "Creating..." : <><CheckCircle size={18} /> Create School</>}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
