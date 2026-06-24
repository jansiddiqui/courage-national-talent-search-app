"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NeedHelp from "@/components/layout/NeedHelp";
import Link from "next/link";
import { 
  FileText, 
  Calendar, 
  Search, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Printer, 
  Download,
  ArrowLeft
} from "lucide-react";
import { authService } from "@/services/authService";

export default function AdmitCardPortal() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [cntsId, setCntsId] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [registrationId, setRegistrationId] = useState("");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!cntsId.trim()) {
      setError("Please enter your CNTS ID.");
      return;
    }
    if (!dob) {
      setError("Please enter the student's Date of Birth.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.loginWithCredentials(cntsId.trim(), dob);
      if (res.success) {
        // Find candidate details using session
        const session = await authService.checkSession();
        setCandidateName(session.email || "Candidate");
        setRegistrationId(cntsId.trim().toUpperCase());
        setSuccess(true);
        
        // Instant redirect to direct admit card document
        window.location.href = `/api/admit-card/${cntsId.trim().toUpperCase()}`;
      } else {
        setError(res.message || "Invalid CNTS ID or Date of Birth. Please check and try again.");
      }
    } catch (err) {
      console.error("Admit card lookup error:", err);
      setError("An error occurred while connecting to the database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white pt-36 pb-16 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_60%)] opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6 uppercase tracking-wider mx-auto">
            <FileText size={12} /> Admit Card Gate
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-4 leading-tight">
            Download Admit Card &amp; Entry Pass
          </h1>
          <p className="text-slate-450 text-xs md:text-sm max-w-xl mx-auto">
            Enter your candidate details below to verify your slot timing, test center credentials, and access the print portal.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <main className="max-w-md w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm w-full space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-display font-bold text-lg text-slate-800">Candidate Lookup</h2>
            <Link 
              href="/recover-id" 
              className="text-xs font-semibold text-blue-800 hover:underline flex items-center gap-1"
            >
              Forgot CNTS ID?
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-slide-up">
              <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={16} />
              <div>
                <p className="font-bold">Lookup Failed</p>
                <p className="mt-0.5 opacity-90">{error}</p>
              </div>
            </div>
          )}

          {success ? (
            <div className="space-y-6 text-center py-4 animate-slide-up">
              <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-slate-850 text-base">Session Verified!</h3>
                <p className="text-xs text-slate-400">
                  Opening Admit Card document for candidate <span className="font-semibold text-slate-700">{registrationId}</span>...
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-650 text-left space-y-2 leading-relaxed">
                <p>✓ <strong>Note:</strong> If the admit card document did not open automatically, please click the button below to force view.</p>
                <p>✓ Ensure you print a physical copy of the admit card to keep on your desk on exam day.</p>
              </div>
              <a
                href={`/api/admit-card/${registrationId}`}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Printer size={14} /> Open &amp; Print Admit Card
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="cntsId" className="text-xs font-bold text-slate-700">
                  CNTS ID or Registration ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cntsId"
                    placeholder="e.g., CNTS26-8XK4P"
                    value={cntsId}
                    onChange={(e) => setCntsId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 bg-slate-50/50 text-sm font-semibold rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10 transition-all uppercase placeholder:normal-case placeholder:text-slate-400"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={15} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="dob" className="text-xs font-bold text-slate-700">
                  Candidate Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 bg-slate-50/50 text-sm font-semibold rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10 transition-all placeholder:text-slate-400"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Calendar size={15} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-800 hover:bg-blue-750 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? "Verifying Session..." : "Download Admit Card"}
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          <div className="pt-2 text-center border-t border-slate-100">
            <Link 
              href="/login"
              className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 font-semibold"
            >
              <ArrowLeft size={13} /> Back to standard Login
            </Link>
          </div>
        </div>
      </main>

      <NeedHelp />
      <Footer />
    </div>
  );
}
