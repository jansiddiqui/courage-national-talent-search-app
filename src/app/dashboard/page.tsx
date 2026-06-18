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

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:px-8 space-y-8 animate-slide-up">
        
        {isDemoMode && (
          <div className="p-3.5 bg-amber-50 border border-amber-100 text-amber-850 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
            <AlertCircle size={15} className="shrink-0" />
            <span>
              <strong>Developer Evaluation Mode:</strong> Showing mock data for phone <strong>{parentSession?.phoneNumber}</strong>.
            </span>
          </div>
        )}

        {/* Welcome Header */}
        <div className="space-y-1.5 pb-2">
          <h2 className="font-display font-bold text-3xl text-slate-900 leading-tight">
            Welcome Back
          </h2>
          {activeCandidate && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
              <div className="text-slate-600 text-sm font-medium">Candidate: <strong className="text-slate-900">{activeCandidate.student_name}</strong></div>
              <div className="hidden sm:block text-slate-300">•</div>
              <div className="text-slate-600 text-sm font-medium">Candidate ID: <strong className="text-blue-700 font-mono tracking-wider">{activeCandidate.registration_id}</strong></div>
            </div>
          )}
        </div>

        {candidates.map((c) => {
          return (
            <div key={c.id} className="space-y-8">
              
              {/* Section 1: Candidate Identity Card */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl border border-indigo-900/40 p-6 sm:p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-800/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] font-display font-extrabold text-4xl sm:text-5xl tracking-widest text-white/5 uppercase select-none pointer-events-none whitespace-nowrap">
                  Founding Edition 2026
                </div>

                <div className="relative space-y-6 sm:space-y-8">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-4 sm:pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-display font-bold text-lg">C</div>
                      <div>
                        <h4 className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight leading-none">CNTS</h4>
                        <span className="text-[9px] sm:text-[10px] text-blue-400 font-black tracking-wider uppercase">Founding Edition 2026</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                      Identity Card
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 sm:gap-6 items-center">
                    <div className="col-span-1 border border-white/10 rounded-xl bg-white/5 aspect-[3/4] flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:border-white/20 transition-colors">
                      <img src={`/api/photo/${c.registration_id || c.id}`} alt="Candidate Photo" className="w-full h-full object-cover rounded-xl z-10 relative" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }} />
                      <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-white/5">
                        <User size={24} className="text-white/20" />
                        <span className="text-[6px] sm:text-[8px] text-white/30 uppercase font-bold tracking-wider mt-2">Affix Photo</span>
                      </div>
                    </div>

                    <div className="col-span-3 sm:col-span-4 space-y-4 sm:space-y-5 pl-2">
                      <div>
                        <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-0.5">Candidate Name</span>
                        <strong className="text-white text-base sm:text-lg font-semibold truncate block tracking-wide">{c.student_name}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-0.5">Class</span>
                          <strong className="text-white text-sm sm:text-base font-semibold">Class {c.student_class}</strong>
                        </div>
                        <div>
                          <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-0.5">State</span>
                          <strong className="text-white text-sm sm:text-base font-semibold truncate block">{c.state}</strong>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-0.5">Candidate ID</span>
                          <strong className="text-amber-400 font-mono text-sm sm:text-base font-bold uppercase tracking-wider block truncate">{c.registration_id}</strong>
                        </div>
                        <div>
                          <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-0.5">Enrollment Status</span>
                          <strong className="text-emerald-400 text-xs sm:text-sm font-semibold block uppercase tracking-wide">{c.payment_status === "PAID" ? "Enrolled / Active" : "Pending"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Important Dates Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-display font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-800" />
                  Important Dates
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x md:divide-slate-100">
                  <div className="md:px-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Registration Status</span>
                    <strong className="text-emerald-600 text-sm font-bold flex items-center gap-1.5"><CheckCircle size={14} /> Completed</strong>
                  </div>
                  <div className="md:px-4">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Admit Card Release</span>
                    <strong className="text-slate-800 text-sm font-bold">15 July 2026</strong>
                  </div>
                  <div className="md:px-4">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Assessment Date</span>
                    <strong className="text-slate-800 text-sm font-bold">19 July 2026</strong>
                  </div>
                  <div className="md:px-4">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Results Release</span>
                    <strong className="text-slate-800 text-sm font-bold">28 July 2026</strong>
                  </div>
                </div>
              </div>

              {/* Section 3: What Should I Do Now? Checklist */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <h3 className="font-display font-bold text-slate-800 text-xl mb-6">
                  What Should I Do Now?
                </h3>
                <div className="space-y-4">
                  
                  {/* Step 1: Complete */}
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-1 border border-emerald-200 shadow-sm shrink-0">
                      <Check size={16} className="stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-emerald-700 font-bold text-sm">Registration Complete</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Your candidate is fully enrolled for the Founding Edition.</p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div className="w-px h-6 bg-slate-200 ml-4 border-l-2 border-dashed border-slate-200"></div>

                  {/* Step 2: Current */}
                  <div className="flex items-start gap-4 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                    <div className="mt-0.5 bg-blue-600 text-white rounded-full p-1.5 shadow-md shadow-blue-500/30 shrink-0">
                      <Play size={12} className="fill-current" />
                    </div>
                    <div>
                      <h4 className="text-blue-900 font-bold text-sm flex items-center gap-2">
                        Current Step
                        <span className="text-[9px] uppercase tracking-wider bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-black hidden sm:inline-block">Action Required</span>
                      </h4>
                      <p className="text-sm text-blue-800 font-medium mt-1">Download Sample Papers & Start Mock Test</p>
                      <p className="text-xs text-blue-600/80 mt-1">Familiarize the candidate with the exam pattern and testing interface.</p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div className="w-px h-6 bg-slate-200 ml-4 border-l-2 border-dashed border-slate-200"></div>

                  {/* Step 3: Upcoming Admit Card */}
                  <div className="flex items-start gap-4 opacity-60">
                    <div className="mt-1 bg-slate-100 text-slate-400 rounded-full p-1 border border-slate-200 shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                    </div>
                    <div>
                      <h4 className="text-slate-600 font-bold text-sm">Upcoming: Admit Card Release</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Scheduled for 15 July 2026. You will be notified via WhatsApp.</p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div className="w-px h-6 bg-slate-200 ml-4 border-l-2 border-dashed border-slate-200"></div>

                  {/* Step 4: Upcoming Assessment */}
                  <div className="flex items-start gap-4 opacity-60">
                    <div className="mt-1 bg-slate-100 text-slate-400 rounded-full p-1 border border-slate-200 shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                    </div>
                    <div>
                      <h4 className="text-slate-600 font-bold text-sm">Upcoming: Assessment Day</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Scheduled for 19 July 2026. Ensure devices are ready.</p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div className="w-px h-6 bg-slate-200 ml-4 border-l-2 border-dashed border-slate-200"></div>

                  {/* Step 5: Upcoming Results */}
                  <div className="flex items-start gap-4 opacity-60">
                    <div className="mt-1 bg-slate-100 text-slate-400 rounded-full p-1 border border-slate-200 shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                    </div>
                    <div>
                      <h4 className="text-slate-600 font-bold text-sm">Upcoming: Talent Profile Release</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Scheduled for 28 July 2026. Detailed diagnostic report will be available.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 4: Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Sample Papers */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <BookOpen size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">Sample Papers</h4>
                    <p className="text-xs text-slate-500 mt-1">Download Class {c.student_class} logical reasoning and language papers.</p>
                  </div>
                  <a href={`/sample-papers/class${c.student_class}.pdf`} download={`CNTS_Class${c.student_class}_Sample_Paper.pdf`} className="w-full py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors">
                    <Download size={14} /> Download Papers
                  </a>
                </div>

                {/* Mock Test */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                      <Play size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">Mock Test</h4>
                    <p className="text-xs text-slate-500 mt-1">Familiarize yourself with the 10-minute simulated testing environment.</p>
                  </div>
                  <Link href="/mock-exam" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors">
                    <Play size={14} className="fill-current" /> Start Practice Test
                  </Link>
                </div>

                {/* Admit Card / Assessment Window */}
                <div className="col-span-1 md:col-span-2">
                  {systemSettings.admit_card_status === "AVAILABLE" ? (
                    <div className="bg-white border border-emerald-200 shadow-sm p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="space-y-4 flex-1">
                        <div>
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-widest">Assessment Window Active</span>
                          <h4 className="text-lg font-bold text-slate-900 mt-2">Official Admit Card & Examination Details</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400">Date & Time</span>
                            <strong className="text-sm text-slate-800">19 July 2026, 10:00 AM</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400">Technical Requirements</span>
                            <strong className="text-sm text-slate-800">Chrome/Safari (Desktop/Laptop)</strong>
                          </div>
                          <div className="col-span-2">
                            <span className="block text-[10px] uppercase font-bold text-slate-400">Reporting Instructions</span>
                            <strong className="text-xs text-slate-600 mt-0.5 block leading-relaxed">Log into the portal 15 minutes before the start time. Ensure a stable internet connection. Webcams must remain on for the duration of the assessment.</strong>
                          </div>
                        </div>
                      </div>
                      <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2">
                        <a href={`/api/admit-card/${c.registration_id}`} className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2 transition-colors shadow-sm shadow-emerald-600/20">
                          <Download size={16} /> Download Admit Card
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 border-dashed p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 opacity-75">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <Lock size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700">Assessment Window Locked</h4>
                          <p className="text-xs text-slate-500 mt-1">The official admit card and examination instructions will appear here on 15 July 2026.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Receipts & Support */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {c.payment_status === "PAID" && (
                    <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                          <FileText size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Payment Receipt</h4>
                          <p className="text-[10px] text-slate-500">Transaction ID: {c.payment_id}</p>
                        </div>
                      </div>
                      <a href={`/api/receipt/${c.registration_id}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <Download size={18} />
                      </a>
                    </div>
                  )}
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:border-emerald-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Support & Updates</h4>
                        <p className="text-[10px] text-slate-500">Get help via WhatsApp</p>
                      </div>
                    </div>
                    <a href="https://whatsapp.com/channel/0029Vb8NYaiEquiRSLwDD338" target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50 transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

      </main>
      <NeedHelp />
    </div>
  );
}
