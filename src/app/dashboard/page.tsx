"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Trophy, 
  Download, 
  LogOut, 
  User, 
  BookOpen, 
  MapPin, 
  Calendar,
  MessageSquare,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle,
  Copy,
  Check,
  Lock,
  FileText,
  Share2,
  Bell,
  Play
} from "lucide-react";
import { fetchRegistrations, fetchSystemSettings } from "@/services/supabaseService";
import { hasSupabaseConfig } from "@/lib/supabaseClient";
import NeedHelp from "@/components/layout/NeedHelp";

interface Candidate {
  id: string;
  registration_id: string;
  student_name: string;
  dob: string;
  student_class: string;
  school_name: string;
  school_city: string;
  state: string;
  district: string;
  language: string;
  payment_status: string;
  payment_id: string | null;
  created_at: string;
  parent_name?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [parentSession, setParentSession] = useState<any>(null);
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [systemSettings, setSystemSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [referralsCount, setReferralsCount] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("cnts_dashboard_checklist");
    if (saved) {
      try {
        setChecklistState(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChecklistToggle = (id: string) => {
    const updated = { ...checklistState, [id]: !checklistState[id] };
    setChecklistState(updated);
    localStorage.setItem("cnts_dashboard_checklist", JSON.stringify(updated));
  };

  // Authentication gate
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { authService } = await import("@/services/authService");
        const session = await authService.checkSession();
        if (!session.isAuthenticated) {
          router.push("/login");
          return;
        }
        setParentSession(session);
      } catch (err) {
        console.error("Session check failed in dashboard:", err);
        router.push("/login");
      } finally {
        setIsHydrated(true);
      }
    };
    checkUserSession();
  }, [router]);

  // Load Dashboard Data
  useEffect(() => {
    if (!isHydrated || !parentSession) return;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch system settings
        const settings = await fetchSystemSettings();
        setSystemSettings(settings);

        // 2. Fetch registrations and filter by parent user_id, mobile number or whatsapp number
        const dbData = await fetchRegistrations();
        
        const loginPhone = parentSession.phoneNumber;
        const loginUserId = parentSession.userId;
        const filteredCandidates = dbData.filter(
          (reg: any) => 
            (loginUserId && reg.user_id === loginUserId) ||
            reg.mobile_number === loginPhone || 
            reg.whatsapp_number === loginPhone
        );

        if (!hasSupabaseConfig || dbData.length === 0 || filteredCandidates.length === 0) {
          // Fallback to sample data for evaluation/development
          setIsDemoMode(true);
          const mockCandidates: Candidate[] = [
            {
              id: "demo-1",
              registration_id: "CNTS26-8XK4P",
              student_name: "Aditya Verma",
              dob: "2013-05-14",
              student_class: "7",
              school_name: "Delhi Public School",
              school_city: "Kanpur",
              state: "Uttar Pradesh",
              district: "Kanpur Nagar",
              language: "English",
              payment_status: "PAID",
              payment_id: "pay_mock_123456",
              created_at: new Date().toISOString()
            }
          ];
          setCandidates(mockCandidates);

          // Calculate mock referrals (e.g. 3 referrals for demo display)
          setReferralsCount(3);
        } else {
          setIsDemoMode(false);
          setCandidates(filteredCandidates);

          // Calculate actual referrals based on the candidate's registration code
          const regIds = filteredCandidates.map((c: any) => c.registration_id);
          const totalReferrals = dbData.filter((reg: any) => 
            regIds.includes(reg.referral_code)
          ).length;
          setReferralsCount(totalReferrals);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isHydrated, parentSession]);

  const handleLogout = async () => {
    try {
      const { authService } = await import("@/services/authService");
      await authService.logout();
    } catch (e) {
      console.error("Logout error:", e);
    }
    router.push("/login");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    });
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Active primary candidate (usually the first registered child)
  const activeCandidate = candidates[0];

  // Journey Timeline calculations
  const timelineSteps = [
    {
      key: "enrollment",
      label: "Enrollment Complete",
      date: activeCandidate?.payment_status === "PAID" ? "Candidate ID Active" : "Pending Registration Fee",
      completed: activeCandidate?.payment_status === "PAID"
    },
    {
      key: "preparation",
      label: "Preparation Active",
      date: activeCandidate?.payment_status === "PAID" ? "Practice Papers & Mock Test Open" : "Unlock on Enrollment",
      completed: activeCandidate?.payment_status === "PAID"
    },
    {
      key: "assessment",
      label: "Assessment Window Pending",
      date: "Scheduled: 19 July 2026",
      completed: false
    },
    ...(systemSettings.result_status === "RELEASED" ? [
      {
        key: "results",
        label: "Talent Profile Available",
        date: "View Profile & Certificate",
        completed: true
      }
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
      {/* Header bar */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-35">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <Image
              src="/images/logo.png"
              alt="CNTS Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-display font-bold text-slate-900 text-sm leading-tight block">
              Parent Dashboard
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
              Founding Edition 2026
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer"
        >
          <LogOut size={13} />
          Logout
        </button>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
        
        {/* Left 2 Columns: Profiles, Journey, and Action Center */}
        <div className="lg:col-span-2 space-y-6">
          
          {isDemoMode && (
            <div className="p-3.5 bg-amber-50 border border-amber-100 text-amber-850 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
              <AlertCircle size={15} className="shrink-0" />
              <span>
                <strong>Developer Evaluation Mode:</strong> Showing mock data for phone <strong>{parentSession.phoneNumber}</strong>. Register a student using this number to link real registrations.
              </span>
            </div>
          )}

          {/* Welcome Header */}
          <div className="space-y-1.5">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900 leading-tight">
              Welcome back, <span className="gradient-text">{parentSession?.name || activeCandidate?.parent_name || "Parent"}</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">
              Manage registrations, download prep resources, and track {activeCandidate?.student_name || "your child"}&apos;s learning path here.
            </p>
          </div>

          {/* Candidate Journey Card */}
          {activeCandidate && (
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-950 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-blue-300 bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                    Candidate Journey Status
                  </span>
                  <h3 className="font-display font-bold text-lg text-white">
                    Current Stage: <span className="text-amber-400">Registration Complete</span>
                  </h3>
                  <div className="flex flex-col gap-1.5 text-xs text-slate-350 pt-1">
                    <p>
                      <strong>Current Action:</strong> Download Practice Papers & Attempt Practice Mock Test
                    </p>
                    <p>
                      <strong>Next Milestone:</strong> Admit Card Release — 10 July 2026
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex gap-2 w-full sm:w-auto font-sans">
                  <Link
                    href="/parent-guide"
                    className="flex-1 sm:flex-initial text-center px-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    Parent Guide
                  </Link>
                  <Link
                    href="/exam-pattern"
                    className="flex-1 sm:flex-initial text-center px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-bold hover:bg-white/25 transition-colors"
                  >
                    Exam Pattern
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Action Center Block */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
              <Sparkles size={18} className="text-blue-800" />
              My Action Center
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Practice Papers download card */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-blue-200 hover:bg-blue-50/20 transition-all duration-200">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider inline-block">Recommended</span>
                  <h4 className="text-xs font-bold text-slate-800">Download practice sample papers</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">Practice structured Logical Reasoning and Language problems before exam day.</p>
                </div>
                <a
                  href={`/sample-papers/class${activeCandidate?.student_class || "7"}.pdf`}
                  download={`CNTS_Class${activeCandidate?.student_class || "7"}_Sample_Paper.pdf`}
                  className="w-full py-2 bg-blue-800 hover:bg-blue-750 text-white rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download size={12} />
                  Download Class {activeCandidate?.student_class || "7"} Paper
                </a>
              </div>

              {/* Admit Card card — locked/unlocked based on system settings */}
              {systemSettings.admit_card_status === "AVAILABLE" ? (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider inline-block">✓ Now Available</span>
                    <h4 className="text-xs font-bold text-slate-800">Admit Card Ready</h4>
                    <p className="text-[10px] text-slate-400 leading-normal">Your admit card has been issued. Download and keep it ready for exam day.</p>
                  </div>
                  <a
                    href={`/api/admit-card/${activeCandidate?.registration_id}`}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download size={12} />
                    Download Admit Card
                  </a>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between space-y-3 opacity-70">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider inline-block">⏳ Expected 10 July</span>
                    <h4 className="text-xs font-bold text-slate-700">Admit Card</h4>
                    <p className="text-[10px] text-slate-400 leading-normal">Your admit card will be available here once issued. You will be notified via WhatsApp.</p>
                  </div>
                  <div className="w-full py-2 bg-slate-200 text-slate-400 rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <Lock size={12} />
                    Locked — Not Yet Issued
                  </div>
                </div>
              )}

              {/* WhatsApp update channels */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-emerald-355 hover:bg-emerald-50/10 transition-all duration-250">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider inline-block">Realtime Alerts</span>
                  <h4 className="text-xs font-bold text-slate-800">Get Important Exam Updates</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">Connect WhatsApp updates to receive real-time notifications about credentials release, test day timing, and ranking results directly to your phone.</p>
                </div>
                <a
                  href="https://whatsapp.com/channel/0029Vb8NYaiEquiRSLwDD338"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-none"
                >
                  <MessageSquare size={12} />
                  Activate WhatsApp Updates
                </a>
              </div>

              {/* Mock Exam Practice Card */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-blue-200 hover:bg-blue-50/20 transition-all duration-200">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider inline-block">Practice Test</span>
                  <h4 className="text-xs font-bold text-slate-800">Attempt Mock Practice Test</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">Let your child practice with a 10-question, 10-minute simulated testing environment to build familiarity.</p>
                </div>
                <Link
                  href="/mock-exam"
                  className="w-full py-2 bg-blue-800 hover:bg-blue-750 text-white rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-none"
                >
                  <Play size={12} />
                  Start Practice Test
                </Link>
              </div>


            </div>
          </div>

          {/* Candidates Registered Cards */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-slate-850 text-base">
              My Registrations ({candidates.length})
            </h3>

            {candidates.map((c) => {
              const isJunior = parseInt(c.student_class) <= 6;
              const catTitle = isJunior 
                ? "Sub-Junior Talent Category (Class 5–6)" 
                : "Junior Talent Category (Class 7–8)";
              return (
                <div key={c.id} className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                  {/* Candidate Identity Card */}
                  <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl border border-indigo-900/40 p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-800/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                    
                    {/* Watermark text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] font-display font-extrabold text-2xl tracking-widest text-white/5 uppercase select-none pointer-events-none whitespace-nowrap">
                      Founding Edition 2026
                    </div>

                    <div className="relative space-y-6">
                      {/* Header */}
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-display font-bold text-sm">C</div>
                          <div>
                            <h4 className="font-display font-extrabold text-xs text-white tracking-tight leading-none">CNTS</h4>
                            <span className="text-[7px] text-blue-400 font-black tracking-wider uppercase">Founding Edition 2026</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[8px] font-black uppercase tracking-wider font-sans">
                          Identity Card
                        </span>
                      </div>

                      {/* Body Info Grid */}
                      <div className="grid grid-cols-3 gap-4 items-center">
                        {/* Photo Area */}
                        <div className={`col-span-1 border border-white/10 rounded-xl bg-white/5 aspect-[3/4] flex flex-col items-center justify-center text-center p-0 relative overflow-hidden group-hover:border-white/20 transition-colors`}>
                          <img src={`/api/photo/${c.registration_id || c.cnts_id || c.id}`} alt="Candidate Photo" className="w-full h-full object-cover rounded-xl z-10 relative" onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }} />
                          <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-white/5">
                            <User size={24} className="text-white/20" />
                            <span className="text-[6px] text-white/30 uppercase font-bold tracking-wider mt-2">Affix Photo</span>
                          </div>
                        </div>

                        {/* Candidate Info Details */}
                        <div className="col-span-2 space-y-3 pl-2">
                          <div>
                            <span className="text-[7px] text-white/40 uppercase font-black tracking-wider block">Candidate Name</span>
                            <strong className="text-white text-xs md:text-sm font-semibold truncate block">{c.student_name}</strong>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[7px] text-white/40 uppercase font-black tracking-wider block">Class</span>
                              <strong className="text-white text-xs font-semibold">Class {c.student_class}</strong>
                            </div>
                            <div>
                              <span className="text-[7px] text-white/40 uppercase font-black tracking-wider block">State</span>
                              <strong className="text-white text-xs font-semibold">{c.state}</strong>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[7px] text-white/40 uppercase font-black tracking-wider block">Candidate ID</span>
                              <strong className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider block truncate">{c.registration_id}</strong>
                            </div>
                            <div>
                              <span className="text-[7px] text-white/40 uppercase font-black tracking-wider block">Enrollment Status</span>
                              <strong className="text-white text-[10px] font-semibold block">{c.payment_status === "PAID" ? "Enrolled / Active" : "Pending Payment"}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Exam Date & Venue Footer */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 grid grid-cols-2 gap-2 text-center text-xs">
                        <div>
                          <span className="text-[6px] text-white/40 uppercase font-bold tracking-widest block">Exam Date</span>
                          <strong className="text-white text-[10px] font-bold">19 July 2026</strong>
                        </div>
                        <div>
                          <span className="text-[6px] text-white/40 uppercase font-bold tracking-widest block">Slot Venue</span>
                          <strong className="text-white text-[10px] font-bold">Online / Portal</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-xs">
                    <h5 className="font-bold text-slate-800">Exam Center Details:</h5>
                    <div className="grid sm:grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div>School: <strong className="text-slate-700">{c.school_name}</strong></div>
                      <div>City: <strong className="text-slate-700">{c.school_city}</strong></div>
                      <div className="sm:col-span-2">
                        Exam Category Syllabus: <strong className="text-slate-700">{catTitle}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Receipt Link */}
                  {c.payment_status === "PAID" && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      <a
                        href={`/api/receipt/${c.registration_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-800 hover:bg-blue-50/20 rounded-xl text-xs font-semibold shadow-sm transition-all"
                      >
                        <Download size={12} />
                        Download Payment Receipt
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right 1 Column: Journey Steps & Referrals Widget */}
        <div className="space-y-6">
          
          {/* Journey Steps Tracking Timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-slate-800 text-base">
              My CNTS Journey
            </h3>

            <div className="space-y-6 relative pl-6 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {timelineSteps.map((step) => (
                <div key={step.key} className="flex gap-4 items-start relative pl-1">
                  {/* Circle status dot */}
                  <div className={`absolute -left-[24px] w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0 border z-10 transition-all ${
                    step.completed
                      ? "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/20"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}>
                    {step.completed ? (
                      <Check size={10} className="stroke-[3.5]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className={`text-xs font-bold leading-tight ${
                      step.completed ? "text-slate-800" : "text-slate-450"
                    }`}>
                      {step.label}
                    </h4>
                    <span className={`text-[10px] font-semibold block leading-none ${
                      step.completed ? "text-emerald-650 font-bold" : "text-slate-400"
                    }`}>
                      {step.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Before Exam Day Checklist */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
              <CheckCircle size={18} className="text-blue-800" />
              Before Exam Day Checklist
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete these steps to ensure a smooth, stress-free assessment day for your child.
            </p>
            <div className="space-y-3 pt-2">
              {[
                { id: "sample", label: "Download sample paper & syllabus" },
                { id: "rules", label: "Read exam guidelines & instructions" },
                { id: "syscheck", label: "Run device system compatibility check" },
                { id: "admit", label: "Download candidate admit card" },
                { id: "slot", label: "Note scheduled exam date & time slot" }
              ].map((item) => (
                <label key={item.id} className="flex items-start gap-3 text-xs text-slate-650 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklistState[item.id] || false}
                    onChange={() => handleChecklistToggle(item.id)}
                    className="mt-0.5 rounded border-slate-350 text-blue-650 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>Readiness Progress:</span>
              <span>{Object.values(checklistState).filter(Boolean).length} / 5 completed</span>
            </div>
          </div>

        </div>

      </main>
      <NeedHelp />
    </div>
  );
}
