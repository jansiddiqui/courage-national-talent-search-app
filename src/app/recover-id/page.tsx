"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NeedHelp from "@/components/layout/NeedHelp";
import Link from "next/link";
import { 
  Search, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  User,
  Hash,
  School,
  Lock,
  Mail,
  Phone
} from "lucide-react";

interface RecoveredCandidate {
  registration_id: string;
  cnts_id: string | null;
  student_name: string;
  student_class: string;
  payment_status: string;
}

export default function RecoverIdPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [candidates, setCandidates] = useState<RecoveredCandidate[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCandidates([]);
    setSuccess(false);

    const input = contactInfo.trim();
    if (!input) {
      setError("Please enter your registered mobile number or email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/recover-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactInfo: input })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "No registrations found matching this contact info.");
      }
    } catch (err) {
      console.error("Recovery error:", err);
      setError("An error occurred while connecting to our database. Please check your network and try again.");
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
            <Hash size={12} /> Candidate Verification & Recovery
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-4 leading-tight">
            Recover Candidate CNTS ID
          </h1>
          <p className="text-slate-450 text-xs md:text-sm max-w-xl mx-auto">
            Retrieve your child&apos;s credentials instantly using the registered mobile number or parent email address.
          </p>
        </div>
      </section>

      {/* Content Form & Results Panel */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12 flex-1 flex flex-col items-center">
        
        {/* Recovery Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm w-full space-y-6 animate-scale-in">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-display font-bold text-lg text-slate-800">Search Recovery Desk</h2>
            <Link 
              href="/login" 
              className="text-xs font-semibold text-blue-850 hover:underline flex items-center gap-1"
            >
              <ArrowLeft size={13} /> Back to Login
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-slide-up">
              <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={16} />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {!success ? (
            /* Input Form */
            <form onSubmit={handleRecover} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="contactInfo" className="text-xs font-bold text-slate-700 block">
                  Registered Mobile Number or Email Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="contactInfo"
                    placeholder="Enter registered mobile (e.g. 9876543210) or email address"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 bg-slate-50/50 text-sm font-semibold rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-850/10 transition-all placeholder:text-slate-400"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={16} />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Note: The contact detail must match exactly with what you entered during registration.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-800 hover:bg-blue-750 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? "Searching Database..." : "Verify & Retrieve CNTS ID"}
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            /* Dispatch Success Card */
            <div className="space-y-6 animate-slide-up text-center py-6">
              <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={36} />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-slate-800">IDs Dispatched Successfully!</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                  If there are any candidate registrations matching <strong className="text-slate-700">{contactInfo}</strong>, their CNTS IDs and login credentials have been dispatched directly to your registered WhatsApp number and parent email.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 text-xs text-slate-600 leading-normal">
                <div className="flex gap-2.5">
                  <span className="font-bold text-slate-750 shrink-0">1. Check WhatsApp:</span>
                  <span>Look for a message from Courage National Talent Search with your ID(s).</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="font-bold text-slate-750 shrink-0">2. Check Email:</span>
                  <span>Look in your inbox (and spam folder) for the login credentials email.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="font-bold text-slate-750 shrink-0">3. Login using DOB:</span>
                  <span>Use the recovered ID and your student's Date of Birth to access the dashboard.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setError("");
                    setContactInfo("");
                  }}
                  className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Search Another Number
                </button>
                <Link
                  href="/login"
                  className="flex-1 py-3.5 bg-blue-800 hover:bg-blue-750 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Proceed to Login
                </Link>
              </div>
            </div>
          )}

        </div>

      </main>

      <NeedHelp />
      <Footer />
    </div>
  );
}
