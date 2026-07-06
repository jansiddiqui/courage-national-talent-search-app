"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CandidateIdentityCard } from "@/components/shared/CandidateIdentityCard";
import { 
  CheckCircle2, 
  Download, 
  ArrowLeft, 
  User, 
  MapPin, 
  BookOpen,
  Trophy,
  Copy,
  Check,
  Languages,
  Sparkles,
  School,
  Star,
  MessageSquare
} from "lucide-react";
import { TIMELINE_LABELS } from "@/config/timeline";

interface RegDetails {
  registrationId: string;
  studentName: string;
  dob: string;
  studentClass: string;
  schoolName: string;
  parentName: string;
  whatsapp_number: string;
  parentEmail: string;
  state: string;
  district: string;
  language: string;
  registeredAt: string;
  finalPrice?: number;
}

// Fallback details for evaluation/preview if no registration was submitted
const fallbackDetails: RegDetails = {
  registrationId: "CNTS26-8XK4P",
  studentName: "Aditya Verma",
  dob: "2013-05-14",
  studentClass: "7",
  schoolName: "Delhi Public School",
  parentName: "Sanjay Verma",
  whatsapp_number: "9876543210",
  parentEmail: "sanjay.verma@example.com",
  state: "Maharashtra",
  district: "Pune",
  language: "English",
  registeredAt: new Date().toISOString(),
};

export default function SuccessPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regDetails, setRegDetails] = useState<RegDetails | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Defer state updates to satisfy react-hooks/set-state-in-effect rule
    const timer = setTimeout(() => {
      setIsHydrated(true);
      const saved = sessionStorage.getItem("cnts_last_registration");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Convert camelCase variables from RegistrationData to match RegDetails format if needed
          const mappedDetails: RegDetails = {
            registrationId: parsed.registrationId || parsed.registration_id || fallbackDetails.registrationId,
            studentName: parsed.studentName || parsed.student_name || fallbackDetails.studentName,
            dob: parsed.dob || fallbackDetails.dob,
            studentClass: parsed.studentClass || parsed.student_class || fallbackDetails.studentClass,
            schoolName: parsed.schoolName || parsed.school_name || fallbackDetails.schoolName,
            parentName: parsed.parentName || parsed.parent_name || fallbackDetails.parentName,
            whatsapp_number: parsed.whatsapp_number || fallbackDetails.whatsapp_number,
            parentEmail: parsed.parentEmail || parsed.parent_email || fallbackDetails.parentEmail,
            state: parsed.state || fallbackDetails.state,
            district: parsed.district || fallbackDetails.district,
            language: parsed.language || fallbackDetails.language,
            registeredAt: parsed.created_at || new Date().toISOString(),
            finalPrice: typeof parsed.finalPrice === 'number' ? parsed.finalPrice : 99
          };
          setRegDetails(mappedDetails);
          setIsDemoMode(false);
        } catch (e) {
          console.error("Failed to parse last registration details", e);
          setRegDetails(fallbackDetails);
          setIsDemoMode(true);
        }
      } else {
        // Set fallback details for preview purposes
        setRegDetails(fallbackDetails);
        setIsDemoMode(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleCopyLink = () => {
    if (!regDetails) return;
    const refLink = `https://thecouragelibrary.com/register?ref=${regDetails.registrationId}`;
    navigator.clipboard.writeText(refLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isHydrated || !regDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Derive Exam Category
  const isJunior = parseInt(regDetails.studentClass) <= 6;
  const examCategory = isJunior 
    ? "Sub-Junior Talent Category (Class 5–6)" 
    : "Junior Talent Category (Class 7–8)";
    


  return (
    <main className="min-h-screen mesh-bg py-12 px-6 flex flex-col justify-center items-center">
      {/* Container card */}
      <div className="max-w-2xl w-full space-y-8 animate-slide-up">
        
        {/* CNTS branding */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="CNTS Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-tight tracking-tight text-slate-900">
                CNTS
              </div>
              <div className="text-[10px] text-slate-500 leading-tight font-medium tracking-wide uppercase">
                Founding Edition 2026
              </div>
            </div>
          </Link>
        </div>

        {/* Demo Mode banner */}
        {isDemoMode && (
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between text-xs text-amber-800">
            <span>
              <strong>Demo Mode:</strong> Displaying sample database record. Complete a registration at <Link href="/register" className="underline font-bold hover:text-amber-900">/register</Link> to save your own data.
            </span>
            <button 
              onClick={() => router.push("/register")}
              className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 cursor-pointer"
            >
              Try Form
            </button>
          </div>
        )}

        {/* Success Header Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 p-8 text-center relative overflow-hidden">
          {/* Confetti-like elements */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none translate-x-1/3 translate-y-1/3" />
          
          <div className="relative space-y-6 flex flex-col items-center">
            {/* Pulsing checkmark */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25 scale-125" />
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-md">
                <CheckCircle2 size={36} className="stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-100 text-[10px] font-bold uppercase tracking-wider mb-2">
                Founding Cohort Member
              </div>
              <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight">
                Candidate Record Created
              </h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Officially enrolled in the Founding Edition 2026.
              </p>
            </div>

            {/* Registration ID Badge */}
            <div className="bg-slate-900 text-amber-400 font-mono text-sm px-6 py-3 rounded-2xl shadow-inner border border-slate-800 flex items-center gap-3 tracking-wider select-all">
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest font-sans">
                ID:
              </span>
              <strong className="font-bold">{regDetails.registrationId}</strong>
            </div>

            {/* Payment Details */}
            <div className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1.5 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Payment Amount: <strong className="text-slate-800 font-bold">₹{regDetails.finalPrice !== undefined ? regDetails.finalPrice : 99}</strong> {regDetails.finalPrice === 0 ? "(Free Registration)" : "(Paid successfully)"}
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            main > *, nav, footer, header, button, .no-print {
              display: none !important;
            }
            #printable-card-area {
              display: block !important;
              position: absolute;
              left: 50% !important;
              top: 50% !important;
              transform: translate(-50%, -50%) !important;
              width: 450px !important;
              margin: 0 !important;
              box-sizing: border-box;
              background: #0f172a !important;
              color: white !important;
              border: 1px solid #1e1b4b !important;
              padding: 24px !important;
              border-radius: 24px !important;
            }
            #printable-card-area button {
              display: none !important;
            }
            #printable-card-area .no-print {
              display: none !important;
            }
          }
        `}} />

        {/* Candidate Identity Card Container */}
        <div id="printable-card-area" className="relative group">
          <CandidateIdentityCard candidate={{
            student_name: regDetails.studentName,
            student_class: regDetails.studentClass,
            state: regDetails.state,
            registration_id: regDetails.registrationId,
            payment_status: "PAID",
            photo_url: `/api/photo/${regDetails.registrationId}`
          }} />

          {/* Print Trigger Button */}
          <div className="pt-4 no-print">
            <a
              href={`/api/admit-card/${regDetails.registrationId}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 border-none transition-all cursor-pointer no-underline"
            >
              <Download size={16} />
              Download Candidate Pass
            </a>
          </div>
        </div>

        {/* Viral Referral Loop Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-955/20 border border-indigo-950 relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
              <Star size={28} className="text-white fill-white" />
            </div>
            
            <div className="flex-1 space-y-3 text-center md:text-left min-w-0">
              <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles size={11} className="text-amber-400" />
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                  Viral Reward Loop
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Invite Friends & Get the Badge
              </h3>
              <p className="text-indigo-200 text-xs leading-relaxed">
                Refer 3 friends to register for CNTS. Upon their completion, you will unlock the exclusive <strong className="text-amber-300">Founding Participant Badge</strong> on your learning profile!
              </p>

              {/* Clipboard copy box */}
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 w-full max-w-md mx-auto md:mx-0">
                <div className="text-[10px] sm:text-xs font-mono px-2 py-1 text-indigo-300 truncate w-full text-center sm:text-left min-w-0 flex-1">
                  https://thecouragelibrary.com/register?ref={regDetails.registrationId}
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`w-full sm:w-auto shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    copied 
                      ? "bg-emerald-650 text-white" 
                      : "bg-white text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Timeline */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 p-6 md:p-8 space-y-8 relative z-10">
          <h3 className="font-display font-bold text-xl text-slate-900">
            Next Steps in Your Journey
          </h3>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-100 before:via-blue-100 before:to-transparent">
            {[
              {
                step: 1,
                title: "Start Preparing in the Learning Academy",
                desc: "Immediately access interactive bilingual lessons, flashcard drills, and solved examples across all exam domains for Class " + regDetails.studentClass + ".",
                badge: "Immediate Action",
                badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
                action: (
                  <Link
                    href="/academy"
                    className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-700/20 transition-all cursor-pointer"
                  >
                    <Sparkles size={14} className="animate-pulse" />
                    Enter Learning Academy
                  </Link>
                )
              },
              {
                step: 2,
                title: "Join Official WhatsApp Updates Channel",
                desc: "Follow the official parent broadcast community to secure real-time announcements.",
                badge: "Action Required",
                badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                action: (
                  <Link
                    href="/updates"
                    className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <MessageSquare size={14} />
                    Join Broadcast Group
                  </Link>
                )
              },
              {
                step: 3,
                title: "Diagnostic Portal Login Credentials",
                desc: "Parent and child diagnostic test portal logins will be generated. We will notify you via SMS & WhatsApp.",
                badge: `Release Date: ${TIMELINE_LABELS.ADMIT_CARD_RELEASE}`,
                badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
              },
              {
                step: 4,
                title: "Final CNTS Talent Discovery Exam",
                desc: "Log in to the diagnostic portal to complete the talent search test.",
                badge: `Exam Date: ${TIMELINE_LABELS.EXAM_DATE.replace(' (Sunday)', '')}`,
                badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
              }
            ].map((item, index, array) => (
              <div key={item.step} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Icon */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-blue-100 text-blue-700 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="text-xs font-bold">{item.step}</span>
                </div>
                {/* Content */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-100">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-lg border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  {item.action && <div className="pt-2">{item.action}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-slate-900/10 transition-all cursor-pointer text-center"
          >
            Go to Parent Dashboard
          </Link>
          <a
            href={`/api/receipt/${regDetails.registrationId}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-2xl text-sm font-semibold shadow-sm transition-all cursor-pointer text-center"
          >
            <Download size={14} />
            Print Payment Receipt
          </a>
          <Link
            href="/academy"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-blue-500/10 transition-all cursor-pointer text-center"
          >
            <Sparkles size={14} className="animate-pulse" />
            Enter Learning Academy
          </Link>
        </div>

      </div>
    </main>
  );
}
