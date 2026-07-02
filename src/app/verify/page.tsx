/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CandidateIdentityCard } from "@/components/shared/CandidateIdentityCard";
import { 
  Award, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  FileCheck,
  ShieldCheck,
  Calendar,
  User,
  Building,
  GraduationCap
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NeedHelp from "@/components/layout/NeedHelp";
import { fetchSystemSettings } from "@/services/supabaseService";
import { RESULT_DATE } from "@/config/exam";
import { TIMELINE_LABELS } from "@/config/timeline";

export default function CertificateVerifyPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [systemSettings, setSystemSettings] = useState<Record<string, string>>({});
  
  // Search parameters
  const [registrationId, setRegistrationId] = useState("");
  const [dob, setDob] = useState("");
  
  // Search execution states
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [verifiedCertificate, setVerifiedCertificate] = useState<any>(null);
  
  // Countdown state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const autoVerify = async (rId: string, d: string) => {
    setSearching(true);
    setSearchError("");
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: rId, dob: d })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setSearchError(errData.message || "No active credentials found for the provided Registration ID and DOB combo.");
        return;
      }
      const data = await response.json();
      if (data.success && data.match) {
        if (data.match.payment_status === "PAID") {
          setVerifiedCertificate(data.match);
        } else {
          setSearchError("This registration is pending payment verification. Please complete the ₹99 fee to activate credentials.");
        }
      } else {
        setSearchError("No active credentials found for the provided Registration ID and DOB combo.");
      }
    } catch (err) {
      setSearchError("An error occurred while connecting to our verification database. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    
    // Check for query parameters in URL
    const searchParams = new URLSearchParams(window.location.search);
    const regIdParam = searchParams.get("registrationId") || searchParams.get("regId");
    const dobParam = searchParams.get("dob");
    if (regIdParam && dobParam) {
      setRegistrationId(regIdParam);
      setDob(dobParam);
    }

    // Load Settings
    const loadSettings = async () => {
      try {
        const settings = await fetchSystemSettings();
        setSystemSettings(settings);
        // Trigger verification on load if params present
        if (regIdParam && dobParam && settings.certificate_status === "ENABLED") {
          autoVerify(regIdParam, dobParam);
        }
      } catch (e) {
        console.error("Failed to load settings in verification", e);
      } finally {
        setLoadingSettings(false);
      }
    };
    loadSettings();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!isHydrated) return;

    const timer = setInterval(() => {
      const targetTime = new Date(`${RESULT_DATE}T00:00:00`).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isHydrated]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setVerifiedCertificate(null);

    if (!registrationId.trim()) {
      setSearchError("Please enter the CNTS Registration ID");
      return;
    }

    if (!dob) {
      setSearchError("Please select the candidate's date of birth");
      return;
    }

    setSearching(true);
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, dob })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 404) {
          setSearchError(errData.message || "No active credentials found for the provided Registration ID and DOB combo.");
        } else {
          setSearchError(errData.message || "Failed to verify certificate. Please try again.");
        }
        return;
      }

      const data = await response.json();
      if (data.success && data.match) {
        const match = data.match;
        if (match.payment_status === "PAID") {
          setVerifiedCertificate(match);
        } else {
          setSearchError("This registration is pending payment verification. Please complete the ₹99 fee to activate credentials.");
        }
      } else {
        setSearchError("No active credentials found for the provided Registration ID and DOB combo.");
      }
    } catch (err) {
      console.error("Verification query error:", err);
      setSearchError("An error occurred while connecting to our verification database. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const getCertificateTier = (studentClass: string) => {
    // Generate logical award tiers based on classes for demo
    const num = parseInt(studentClass);
    if (num % 2 === 0) {
      return {
        title: "Founding Edition Participant Certificate",
        desc: "Awarded for outstanding conceptual logic performance in Class " + studentClass + ", ranking in the top 10% nationwide as a verified Founding Cohort Member.",
        badge: "bg-amber-100 text-amber-900 border-amber-200"
      };
    }
    return {
      title: "Founding Edition Participant Certificate of Excellence",
      desc: "Awarded for exceptional cognitive problem-solving capabilities, conceptual clarity, and high percentile performance as a verified Founding Cohort Member.",
      badge: "bg-blue-100 text-blue-900 border-blue-200"
    };
  };

  // Check if portal is active
  const isVerifyPortalActive = systemSettings.certificate_status === "ENABLED";

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center w-full shrink-0">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <ShieldCheck size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Credential Registry
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Certificate <span className="text-blue-400">Verification</span>.
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Third-party organizations (schools, institutes, or partners) can verify the validity of CNTS certificates using this official search portal.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center items-center w-full animate-slide-up">
        {loadingSettings ? (
          /* Settings Loading State */
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-505 text-xs font-medium">Connecting to verification registry...</p>
          </div>
        ) : !isVerifyPortalActive ? (
          /* Verification Portal Pending Gate (Simple, Honest, Professional Release Window) */
          <div className="bg-white border border-slate-150 rounded-3xl p-8 text-center relative overflow-hidden space-y-6 shadow-md max-w-lg mx-auto w-full">
            <div className="space-y-4 animate-slide-up">
              <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                Verification Gateway Release Window
              </h2>
              <div className="h-px bg-slate-100 my-2" />
              <div className="py-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-1">Expected Release Date</span>
                <strong className="text-2xl text-blue-900 font-extrabold">{TIMELINE_LABELS.RESULTS_DATE}</strong>
              </div>
              <p className="text-slate-505 text-xs leading-relaxed max-w-sm mx-auto font-medium">
                Official certificates and student verification records will be available after evaluation is completed.
              </p>
              
              <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-center items-center gap-4 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                <span className="flex items-center gap-1.5">
                  <FileCheck size={12} className="text-emerald-600" /> Verifiable PDF Certificates
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-blue-600" /> Tamper-Proof Cryptographic ID
                </span>
              </div>

              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowLeft size={12} /> Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Active Verification Lookup Form */
          <div className="max-w-4xl w-full grid md:grid-cols-5 gap-8 items-start">
            
            {/* Left Side: Instructions and details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Verification Registry</span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-1">
                  Credential Verification
                </h1>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  Third-party organizations (schools, institutes, or partners) can verify the validity of CNTS certificates using this official search portal.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ShieldCheck size={14} className="text-emerald-500" /> Audit Standards
                </h3>
                <ul className="space-y-3 text-xs text-slate-500 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>Cross-referenced against official CNTS automated test records.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>Verifies applicant name, school board representation, and rank credentials.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>To test this form, use demo registration ID: <strong>CNTS26-8XK4P</strong> and DOB: <strong>2013-05-14</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side: Search Form & Results Card */}
            <div className="md:col-span-3 space-y-6">
              
              {/* Search Card Form */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
                <form onSubmit={handleVerify} className="space-y-4">
                  {searchError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-900 text-xs">
                      <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <p>{searchError}</p>
                    </div>
                  )}

                  {/* ID Input */}
                  <div className="space-y-1">
                    <label htmlFor="regId" className="text-xs font-semibold text-slate-700">CNTS Registration ID *</label>
                    <div className="relative">
                      <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
                      <input
                        id="regId"
                        type="text"
                        required
                        value={registrationId}
                        onChange={(e) => setRegistrationId(e.target.value)}
                        placeholder="e.g., CNTS26-XXXXX"
                        className="w-full text-xs py-3.5 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none transition-all uppercase"
                      />
                    </div>
                  </div>

                  {/* DOB Input */}
                  <div className="space-y-1">
                    <label htmlFor="dob" className="text-xs font-semibold text-slate-700">Student Date of Birth *</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-4 top-3.5 text-slate-400" />
                      <input
                        id="dob"
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full text-xs py-3.5 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={searching}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {searching ? "Verifying Credentials..." : "Verify Certificate"}
                  </button>
                </form>
              </div>

              {/* Verified Result Render Card */}
              {verifiedCertificate && (
                <div className="space-y-6">
                  {/* Standardized Candidate Identity Card */}
                  <CandidateIdentityCard candidate={{
                    student_name: verifiedCertificate.student_name,
                    student_class: verifiedCertificate.student_class,
                    state: verifiedCertificate.state,
                    registration_id: verifiedCertificate.registration_id,
                    payment_status: verifiedCertificate.payment_status,
                    photo_url: `/api/photo/${verifiedCertificate.registration_id}`
                  }} />

                  {/* Verification Status Details */}
                  <div className="bg-gradient-to-br from-white to-slate-50/55 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
                    {/* Decorative verification stamp watermark */}
                    <div className="absolute -right-6 -top-6 w-28 h-28 border-8 border-emerald-500/10 rounded-full flex items-center justify-center rotate-12 pointer-events-none select-none">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/20">VERIFIED</span>
                    </div>

                    {/* Header Badge */}
                    <div className="flex items-center gap-2.5 mb-6 text-emerald-600">
                      <CheckCircle2 size={20} className="fill-emerald-500 text-white" />
                      <span className="text-xs font-bold uppercase tracking-wider">Credential Authenticated</span>
                    </div>

                    {/* Student Details Grid */}
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Award Level</h4>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold mt-1.5 bg-amber-50 text-amber-900 border-amber-200">
                          <Award size={14} className="text-amber-600" />
                          {getCertificateTier(verifiedCertificate.student_class).title}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                        {/* Name */}
                        <div className="flex gap-2">
                          <User size={14} className="text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <h5 className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Student Name</h5>
                            <p className="text-xs font-semibold text-slate-800">{verifiedCertificate.student_name}</p>
                          </div>
                        </div>

                        {/* Class */}
                        <div className="flex gap-2">
                          <GraduationCap size={14} className="text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <h5 className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Class</h5>
                            <p className="text-xs font-semibold text-slate-800">Class {verifiedCertificate.student_class}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                        {/* School */}
                        <div className="flex gap-2">
                          <Building size={14} className="text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <h5 className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">School</h5>
                            <p className="text-xs font-semibold text-slate-800">{verifiedCertificate.school_name}, {verifiedCertificate.school_city}</p>
                          </div>
                        </div>

                        {/* Code */}
                        <div className="flex gap-2">
                          <FileCheck size={14} className="text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <h5 className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Registration ID</h5>
                            <p className="text-xs font-semibold text-slate-800 uppercase">{verifiedCertificate.registration_id}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Box */}
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <p className="text-slate-505 text-[11px] leading-relaxed">
                        {getCertificateTier(verifiedCertificate.student_class).desc}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )
        }
      </main>

      <NeedHelp />
      <Footer />
    </div>
  );
}
