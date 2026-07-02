"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  Calendar,
  User,
  GraduationCap,
  MapPin,
  Clock,
  Home,
  UserPlus,
  Mail,
  ArrowRight,
  Info,
  Maximize2,
  X
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NeedHelp from "@/components/layout/NeedHelp";
import { CandidateIdentityCard } from "@/components/shared/CandidateIdentityCard";
import { TIMELINE_LABELS } from "@/config/timeline";

interface VerifyClientProps {
  candidateId: string;
}

interface CandidateData {
  registration_id: string;
  cnts_id?: string;
  student_name: string;
  student_class: string;
  school_name: string;
  school_city: string;
  state: string;
  district: string;
  payment_status: string;
  registration_status: string;
  created_at: string;
}

export default function VerifyClient({ candidateId }: VerifyClientProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [verifyTime, setVerifyTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setVerifyTime(new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata"
    }));

    const verifyCandidate = async () => {
      try {
        const response = await fetch(`/api/verify/${candidateId}`);
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setErrorMsg(data.message || "Candidate registration not found.");
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (data.success && data.candidate) {
          setCandidate(data.candidate);
        } else {
          setErrorMsg("Candidate registration not found.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setErrorMsg("Failed to connect to the verification registry.");
      } finally {
        setLoading(false);
      }
    };

    verifyCandidate();
  }, [candidateId]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Helper to determine status badge and color
  const getStatusBadge = (status: string, payment: string) => {
    if (status === "CANCELLED") {
      return {
        label: "CANCELLED",
        color: "bg-red-500/10 text-red-500 border-red-500/20"
      };
    }
    if (payment === "PAID" || status === "REGISTERED") {
      return {
        label: "ACTIVE",
        color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      };
    }
    return {
      label: "PENDING",
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20"
    };
  };

  const statusInfo = candidate ? getStatusBadge(candidate.registration_status, candidate.payment_status) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col font-sans">
      <Navbar theme="dark" />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 px-6 text-center w-full shrink-0">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-xl mx-auto space-y-6 relative z-10 animate-slide-up">
          {loading ? (
            <div className="space-y-4">
              <div className="relative w-14 h-14 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
              </div>
              <h3 className="font-semibold text-white/90 text-sm tracking-wide uppercase">Cryptographic Verification</h3>
              <p className="text-slate-400 text-xs">Validating credentials against CNTS Registry...</p>
            </div>
          ) : errorMsg ? (
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center border-4 border-red-500/20 shadow-inner animate-bounce">
                <XCircle size={44} className="stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Candidate Not Found
                </h1>
                <p className="text-slate-350 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  This registration could not be verified. Please check the QR code or contact CNTS Support.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border-4 border-emerald-500/20 shadow-inner scale-up-bounce">
                <CheckCircle2 size={44} className="stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Registration Successfully Verified
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
                  This candidate is officially registered for the Courage National Talent Search (CNTS) – Founding Edition 2026.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 pb-24 relative z-10 -mt-10 sm:-mt-14">
        {loading ? null : errorMsg ? (
          /* Verification Failed Page Body */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center shadow-md space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-slate-505 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              If you scanned a printed copy, check that the CNTS ID matches the text below the code.
            </p>
            <div className="h-px bg-slate-100 w-full" />
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/"
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Home size={14} /> Return Home
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-blue-800 hover:bg-blue-750 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-800/10"
              >
                <UserPlus size={14} /> Register Now
              </Link>
              <a
                href="mailto:support@thecouragelibrary.com"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Mail size={14} /> Contact Support
              </a>
            </div>
          </div>
        ) : (
          /* Success Verification Experience Body */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Modern Verification Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              {/* Decorative shield icon background watermark */}
              <div className="absolute -right-8 -top-8 w-32 h-32 text-emerald-500/5 pointer-events-none select-none">
                <ShieldCheck className="w-full h-full stroke-[1]" />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck size={16} /> Credential Validated
                </div>
                {statusInfo && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                    <svg className="w-1.5 h-1.5 fill-current shrink-0" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    {statusInfo.label}
                  </span>
                )}
              </div>

              {/* Grid Layout fields */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-slate-800">
                {/* Candidate Name */}
                <div className="flex gap-3">
                  <User className="text-slate-400 w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Candidate Name</span>
                    <strong className="text-xs font-bold text-slate-800">{candidate?.student_name}</strong>
                  </div>
                </div>

                {/* Candidate ID */}
                <div className="flex gap-3">
                  <Info className="text-slate-400 w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Candidate ID</span>
                    <strong className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wide">{candidate?.cnts_id || candidate?.registration_id}</strong>
                  </div>
                </div>

                {/* Class */}
                <div className="flex gap-3">
                  <GraduationCap className="text-slate-400 w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Class</span>
                    <strong className="text-xs font-bold text-slate-800">Class {candidate?.student_class}</strong>
                  </div>
                </div>

                {/* State */}
                <div className="flex gap-3">
                  <MapPin className="text-slate-400 w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">State</span>
                    <strong className="text-xs font-bold text-slate-800">{candidate?.state}</strong>
                  </div>
                </div>

                {/* Registration Date */}
                <div className="flex gap-3 border-t border-slate-100 pt-4">
                  <Calendar className="text-slate-400 w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Registration Date</span>
                    <strong className="text-xs font-bold text-slate-855">
                      {candidate && new Date(candidate.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </strong>
                  </div>
                </div>

                {/* Exam Date */}
                <div className="flex gap-3 border-t border-slate-100 pt-4">
                  <Calendar className="text-slate-400 w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Exam Date</span>
                    <strong className="text-xs font-bold text-slate-855">{TIMELINE_LABELS.EXAM_DATE.replace(' (Sunday)', '')}</strong>
                  </div>
                </div>

                {/* Session */}
                <div className="flex gap-3 border-t border-slate-100 pt-4">
                  <Clock className="text-slate-400 w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Session</span>
                    <strong className="text-xs font-bold text-slate-855">Online / Portal</strong>
                  </div>
                </div>

                {/* Verification Timestamp */}
                <div className="flex gap-3 border-t border-slate-100 pt-4">
                  <Clock className="text-slate-400 w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Verification Timestamp</span>
                    <strong className="text-xs font-bold text-slate-855">{verifyTime}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Identity Card Preview */}
            {candidate && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center sm:text-left">
                  Candidate ID Card Preview
                </h3>
                <div className="transform scale-95 origin-top border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <CandidateIdentityCard candidate={{
                    student_name: candidate.student_name,
                    student_class: candidate.student_class,
                    state: candidate.state,
                    registration_id: candidate.registration_id,
                    payment_status: candidate.payment_status,
                    photo_url: `/api/photo/${candidate.registration_id}`
                  }} />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Maximize2 size={13} /> View Full Identity Card
                  </button>
                </div>
              </div>
            )}

            {/* Call To Action Box */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white border border-blue-950 rounded-3xl p-8 shadow-md relative overflow-hidden text-center sm:text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
              <div className="relative space-y-5">
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-xl tracking-tight">
                    Want your child to participate?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-md">
                    Join thousands of students discovering their strengths through CNTS.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/register"
                    className="px-5 py-3 bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    Register Your Child <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/"
                    className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center border border-white/10"
                  >
                    Learn About CNTS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Premium Full-Scale Identity Card Modal Overlay */}
      {isModalOpen && candidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl border border-white/10 p-1 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-slate-700 flex items-center justify-center shadow-lg transition-colors cursor-pointer z-10"
            >
              <X size={16} />
            </button>
            <div className="p-2">
              <CandidateIdentityCard candidate={{
                student_name: candidate.student_name,
                student_class: candidate.student_class,
                state: candidate.state,
                registration_id: candidate.registration_id,
                payment_status: candidate.payment_status,
                photo_url: `/api/photo/${candidate.registration_id}`
              }} />
            </div>
          </div>
        </div>
      )}

      <NeedHelp />
      <Footer />
    </div>
  );
}
