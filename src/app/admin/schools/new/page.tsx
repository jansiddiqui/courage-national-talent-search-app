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
  const [studentDiscount, setStudentDiscount] = useState("20");
  const [schoolRebate, setSchoolRebate] = useState("10");

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
    notes: "",
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
    const remarksParam = searchParams.get("remarks") || "";
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
      quota: parsedQuota.toString(),
      notes: remarksParam || prev.notes
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
        body: JSON.stringify({
          ...formData,
          student_discount_percent: formData.sponsorship_mode === "PARTIAL" ? parseInt(studentDiscount) || 0 : (formData.sponsorship_mode === "FULL" ? 100 : 0),
          school_rebate_percent: formData.sponsorship_mode === "PARTIAL" ? parseInt(schoolRebate) || 0 : 0
        })
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
      <!DOCTYPE html>
      <html>
        <head>
          <title>CNTS 2026 - Certificate of Partnership - ${school.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
            
            :root {
              --primary: #1e3a8a;
              --primary-light: #eff6ff;
              --accent: #d97706;
              --dark: #0f172a;
              --slate-600: #475569;
              --slate-100: #f1f5f9;
              --slate-200: #e2e8f0;
            }

            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              margin: 0;
              padding: 20px;
              color: var(--dark);
              background: #f8fafc;
              line-height: 1.5;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .document-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              background: #ffffff;
              border: 1px solid var(--slate-200);
              border-radius: 24px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
              position: relative;
              overflow: hidden;
            }

            .bg-gradient-top {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 6px;
              background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #eab308 100%);
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid var(--slate-100);
              padding-bottom: 20px;
              margin-bottom: 30px;
            }

            .brand-logo {
              font-family: 'Outfit', sans-serif;
              font-size: 24px;
              font-weight: 800;
              color: var(--primary);
              letter-spacing: -0.5px;
              line-height: 1;
            }

            .brand-sub {
              font-size: 9px;
              font-weight: 700;
              color: var(--accent);
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-top: 4px;
            }

            .doc-badge {
              font-family: 'Outfit', sans-serif;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              color: var(--slate-600);
              background: var(--slate-100);
              padding: 6px 14px;
              border-radius: 99px;
              letter-spacing: 0.5px;
            }

            .hero {
              text-align: center;
              margin-bottom: 30px;
            }

            .hero-title {
              font-family: 'Outfit', sans-serif;
              font-size: 26px;
              font-weight: 800;
              color: var(--dark);
              margin: 0;
            }

            .hero-subtitle {
              font-size: 13px;
              color: var(--slate-600);
              margin-top: 6px;
              margin-bottom: 0;
            }

            .grid-container {
              display: grid;
              grid-template-columns: 1.2fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }

            .card {
              border: 1px solid var(--slate-200);
              border-radius: 16px;
              padding: 20px;
              background: #ffffff;
            }

            .card-title {
              font-family: 'Outfit', sans-serif;
              font-size: 13px;
              font-weight: 700;
              color: var(--primary);
              margin-top: 0;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1px solid var(--slate-100);
              padding-bottom: 6px;
            }

            .info-item {
              margin-bottom: 12px;
            }
            .info-item:last-child {
              margin-bottom: 0;
            }

            .info-label {
              font-size: 9px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .info-value {
              font-size: 14px;
              font-weight: 700;
              color: var(--dark);
              margin-top: 2px;
            }

            .credentials-card {
              background: var(--primary-light);
              border-color: #bfdbfe;
            }

            .code-box {
              background: #ffffff;
              border: 1px solid #93c5fd;
              border-radius: 10px;
              padding: 10px 14px;
              font-family: monospace;
              font-size: 18px;
              font-weight: 700;
              color: var(--primary);
              letter-spacing: 1px;
              display: inline-block;
              margin-top: 2px;
            }

            .link-box {
              background: #ffffff;
              border: 1px dashed #93c5fd;
              border-radius: 10px;
              padding: 10px;
              font-family: monospace;
              font-size: 11px;
              color: var(--primary);
              word-break: break-all;
              margin-top: 2px;
            }

            .sponsorship-badge {
              display: inline-flex;
              align-items: center;
              background: #fef3c7;
              color: #92400e;
              border: 1px solid #fde68a;
              border-radius: 99px;
              padding: 4px 10px;
              font-size: 10px;
              font-weight: 800;
              margin-top: 4px;
              text-transform: uppercase;
            }

            .roadmap-title {
              font-family: 'Outfit', sans-serif;
              font-size: 15px;
              font-weight: 700;
              margin-top: 0;
              margin-bottom: 15px;
              color: var(--dark);
            }

            .steps-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 15px;
              margin-bottom: 30px;
            }

            .step-card {
              border: 1px solid var(--slate-200);
              border-radius: 12px;
              padding: 14px;
              background: #fafafa;
            }

            .step-num {
              font-family: 'Outfit', sans-serif;
              font-size: 18px;
              font-weight: 800;
              color: var(--primary);
              margin-bottom: 6px;
            }

            .step-title {
              font-size: 11px;
              font-weight: 700;
              color: var(--dark);
              margin-bottom: 4px;
            }

            .step-desc {
              font-size: 10px;
              color: var(--slate-600);
              margin: 0;
              line-height: 1.4;
            }

            .warning-box {
              background: #fffbeb;
              border: 1px solid #fef3c7;
              border-radius: 12px;
              padding: 12px 16px;
              font-size: 11px;
              color: #b45309;
              margin-bottom: 30px;
              line-height: 1.4;
            }

            .footer {
              border-top: 1px solid var(--slate-100);
              padding-top: 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 10px;
              color: #94a3b8;
            }

            @media print {
              body {
                background: white;
                padding: 0;
              }
              .document-container {
                border: none;
                border-radius: 0;
                box-shadow: none;
                padding: 0;
              }
              @page {
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="document-container">
            <div class="bg-gradient-top"></div>
            
            <div class="header">
              <div>
                <div class="brand-logo">COURAGE</div>
                <div class="brand-sub">National Talent Search</div>
              </div>
              <div class="doc-badge">Official Credentials</div>
            </div>

            <div class="hero">
              <h1 class="hero-title">Certificate of School Partnership</h1>
              <p class="hero-subtitle">Welcome to CNTS 2026. This document contains secure access credentials for your school portal.</p>
            </div>

            <div class="grid-container">
              <!-- School Details -->
              <div class="card">
                <h3 class="card-title">School Partner Profile</h3>
                
                <div class="info-item">
                  <div class="info-label">Official Institution Name</div>
                  <div class="info-value">${school.name}</div>
                </div>
                
                <div class="grid-container" style="grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 0;">
                  <div class="info-item">
                    <div class="info-label">Affiliation Board</div>
                    <div class="info-value">${school.board}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">School City</div>
                    <div class="info-value">${school.city}</div>
                  </div>
                </div>

                <div class="info-item" style="margin-top: 12px;">
                  <div class="info-label">Academic Coordinator</div>
                  <div class="info-value">${school.coordinator_name} (${school.coordinator_mobile})</div>
                </div>
              </div>

              <!-- Credentials -->
              <div class="card credentials-card">
                <h3 class="card-title" style="color: var(--primary);">Secure Portal Credentials</h3>
                
                <div class="info-item">
                  <div class="info-label" style="color: #64748b;">Sponsorship Package</div>
                  <div>
                    <span class="sponsorship-badge">
                      ${school.sponsorship_mode === "FULL" ? "FULL SPONSORSHIP" : school.sponsorship_mode === "PARTIAL" ? "PARTIAL SPONSORSHIP" : "NO SPONSORSHIP"}
                    </span>
                  </div>
                </div>

                <div class="grid-container" style="grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 0;">
                  <div class="info-item">
                    <div class="info-label" style="color: #64748b;">School Code</div>
                    <div class="code-box">${school.school_code}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label" style="color: #64748b;">Access PIN</div>
                    <div class="code-box">${school.pin}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Links & Referral Section -->
            <div class="card" style="margin-bottom: 30px;">
              <h3 class="card-title">Registration & Referral Channels</h3>
              
              <div class="grid-container" style="grid-template-columns: 1fr 1.2fr; gap: 20px; margin-bottom: 0;">
                <div>
                  <div class="info-label">School Portal Login</div>
                  <div class="link-box">https://www.thecouragelibrary.com/dashboard/school/login</div>
                  <p style="font-size: 10px; color: var(--slate-600); margin-top: 6px;">Use this URL and your PIN to log in to the School Dashboard to manage rosters.</p>
                </div>
                <div>
                  <div class="info-label">Direct Student Referral Link</div>
                  <div class="link-box">https://www.thecouragelibrary.com/register?school=${school.school_code}</div>
                  <p style="font-size: 10px; color: var(--slate-600); margin-top: 6px;">
                    ${school.sponsorship_mode === "FULL" 
                      ? `Waives 100% of the student registration fee up to your quota of ${school.quota} seats.` 
                      : school.sponsorship_mode === "PARTIAL"
                        ? `Applies the custom ${studentDiscount}% student discount directly at checkout.`
                        : "Enables students to register under your school name at standard price."
                    }
                  </p>
                </div>
              </div>
            </div>

            <!-- Next Steps -->
            <h3 class="roadmap-title">Onboarding Roadmap for Coordinator</h3>
            <div class="steps-grid">
              <div class="step-card">
                <div class="step-num">01</div>
                <div class="step-title">Activate Portal</div>
                <p class="step-desc">Log in to the school dashboard to verify student seating allocation.</p>
              </div>
              <div class="step-card">
                <div class="step-num">02</div>
                <div class="step-title">Distribute Link</div>
                <p class="step-desc">Share the student referral link via school noticeboards or WhatsApp groups.</p>
              </div>
              <div class="step-card">
                <div class="step-num">03</div>
                <div class="step-title">Track Performance</div>
                <p class="step-desc">Monitor student registrations, download admit cards, and review final talent analytics.</p>
              </div>
            </div>

            <div class="warning-box">
              <strong>Security Notice:</strong> Keep these credentials confidential. Do not share the Access PIN with candidates or unauthorized personnel. The student registration link is dedicated strictly for candidates of your school.
            </div>

            <div class="footer">
              <div>Generated on ${new Date().toLocaleDateString()}</div>
              <div>Courage National Talent Search &copy; 2026. All rights reserved.</div>
            </div>
          </div>
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
      notes: "",
    });
    setStudentDiscount("20");
    setSchoolRebate("10");
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
                          <option value="NONE">NONE (No Sponsorship - 100% Paid by Student)</option>
                        </select>
                      </div>
                    </div>

                    {formData.sponsorship_mode === "PARTIAL" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-slide-up">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Student Discount (%) *</label>
                          <input 
                            type="number" 
                            required 
                            min="0"
                            max="100"
                            value={studentDiscount} 
                            onChange={e => setStudentDiscount(e.target.value)} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-bold shadow-inner" 
                            placeholder="e.g. 20"
                          />
                          <p className="text-[10px] text-slate-400">Discount student gets at checkout.</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">School Rebate (%) *</label>
                          <input 
                            type="number" 
                            required 
                            min="0"
                            max="100"
                            value={schoolRebate} 
                            onChange={e => setSchoolRebate(e.target.value)} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-bold shadow-inner" 
                            placeholder="e.g. 10"
                          />
                          <p className="text-[10px] text-slate-400">Commission credited to school ledger.</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 pt-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Internal Notes / Custom Requirements</label>
                      <textarea 
                        value={formData.notes} 
                        onChange={e => setFormData({...formData, notes: e.target.value})} 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner min-h-[80px]" 
                        placeholder="Tell us about preferred dates, bulk sponsorships, or request a visit by our team."
                      />
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
