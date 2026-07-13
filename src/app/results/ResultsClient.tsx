"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Link from "next/link";
import { CandidateIdentityCard } from "@/components/shared/CandidateIdentityCard";
import Image from "next/image";
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Sparkles, 
  Trophy, 
  Download, 
  CheckCircle,
  HelpCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  User,
  X
} from "lucide-react";
import { fetchRegistrations, fetchSystemSettings } from "@/services/supabaseService";
import { RESULT_DATE } from "@/config/exam";
import { hasSupabaseConfig } from "@/lib/supabaseClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TIMELINE_LABELS } from "@/config/timeline";
import NeedHelp from "@/components/layout/NeedHelp";
import ResultHero from "@/components/results/ResultHero";
import ScoreOverview from "@/components/results/ScoreOverview";
import TalentDNAProfile from "@/components/results/TalentDNAProfile";
import MistakeIntelligence from "@/components/results/MistakeIntelligence";
import RecommendationCard from "@/components/results/RecommendationCard";
import CertificatePreview from "@/components/results/CertificatePreview";
import ResultPendingState from "@/components/results/ResultPendingState";

export default function ResultsPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [systemSettings, setSystemSettings] = useState<Record<string, string>>({});
  
  // Search state
  const [registrationId, setRegistrationId] = useState("");
  const [dob, setDob] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [candidateResult, setCandidateResult] = useState<any | null>(null);

  // Countdown state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 3D Tilt states
  const [tilt1, setTilt1] = useState({ x: 0, y: 0 });
  const [tilt2, setTilt2] = useState({ x: 0, y: 0 });
  const [activeModal, setActiveModal] = useState<"certificate" | "report" | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: 1 | 2) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 10;
    const rotateY = (x / (box.width / 2)) * 10;
    if (cardId === 1) {
      setTilt1({ x: rotateX, y: rotateY });
    } else {
      setTilt2({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = (cardId: 1 | 2) => {
    if (cardId === 1) {
      setTilt1({ x: 0, y: 0 });
    } else {
      setTilt2({ x: 0, y: 0 });
    }
  };

  // Polling hook for processing jobs
  useEffect(() => {
    if (!candidateResult || !candidateResult.processingStatus) return;
    if (candidateResult.processingStatus === "COMPLETED") return;

    const interval = setInterval(async () => {
      try {
        const queryParams = new URLSearchParams({
          regId: registrationId.trim(),
          dob: dob.trim()
        });
        const res = await fetch(`/api/results/search?${queryParams.toString()}`);
        const data = await res.json();
        if (res.ok && data.success) {
          if (!data.processingStatus) {
            setCandidateResult(data);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [candidateResult, registrationId, dob]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    
    // Load Settings
    const loadSettings = async () => {
      try {
        const settings = await fetchSystemSettings();
        setSystemSettings(settings);
      } catch (e) {
        console.error("Failed to load settings in results", e);
      } finally {
        setLoadingSettings(false);
      }
    };
    loadSettings();
    return () => clearTimeout(timer);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setCandidateResult(null);

    if (!registrationId.trim()) {
      setSearchError("Please enter your CNTS registration ID");
      return;
    }

    if (!dob) {
      setSearchError("Please select your date of birth");
      return;
    }

    setSearching(true);
    try {
      const queryParams = new URLSearchParams({
        regId: registrationId.trim(),
        dob: dob.trim()
      });
      const res = await fetch(`/api/results/search?${queryParams.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setCandidateResult(data);
      } else {
        setSearchError(data.message || "No candidate registration found matching this ID and Date of Birth.");
      }
    } catch (err: any) {
      console.error("Results query error:", err);
      setSearchError("An error occurred while querying. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  if (!isHydrated || loadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Display countdown gate if result_status is not "RELEASED"
  const isResultsReleased = systemSettings.result_status === "RELEASED";

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="light" />

      {/* Hero Section */}
      <section className="pt-36 pb-12 px-6 text-center border-b border-slate-100 bg-white w-full">
        
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700 mx-auto uppercase tracking-wider">
            <Trophy size={12} className="text-amber-500 fill-amber-500 animate-pulse" />
            <span>Evaluation Results</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-tight">
            National Cohort <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Performance Summary</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Retrieve candidate cognitive profiles, national benchmarking reports, and verified cohort certificates.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-2xl mx-auto py-20 px-6 animate-slide-up w-full">
        
        {/* Results Screen */}
        {!isResultsReleased ? (
          /* Results Release Window - Simple, Honest, Professional */
          <div className="bg-white border border-slate-150 rounded-3xl p-8 text-center relative overflow-hidden space-y-6 shadow-md max-w-lg mx-auto">
            <div className="space-y-4 animate-slide-up">
              <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                Results Release Window
              </h2>
              <div className="h-px bg-slate-100 my-2" />
              <div className="py-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-1">Expected Release Date</span>
                <strong className="text-2xl text-blue-900 font-extrabold">{TIMELINE_LABELS.RESULTS_DATE}</strong>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto font-medium">
                Your Talent Profile will be available after evaluation is completed.
              </p>
            </div>
          </div>
        ) : (
          /* Search Results Form & Display */
          <div className="space-y-6">
            {!candidateResult ? (
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 p-8 space-y-6">
                <div className="space-y-1 text-center">
                  <h2 className="font-display font-bold text-2xl text-slate-900">Search Evaluation Results</h2>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                    Enter the participant&apos;s registration ID and registered date of birth.
                  </p>
                </div>

                {searchError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2 text-xs text-red-800 animate-slide-up">
                    <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={14} />
                    <p className="font-semibold">{searchError}</p>
                  </div>
                )}

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Reg ID */}
                    <div className="space-y-1.5">
                      <label htmlFor="regId" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Search size={12} className="text-slate-400" />
                        CNTS Registration ID
                      </label>
                      <input
                        type="text"
                        id="regId"
                        placeholder="CNTS26-8XK4P"
                        value={registrationId}
                        onChange={(e) => setRegistrationId(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-xs rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10 transition-all font-semibold font-mono"
                        disabled={searching}
                      />
                    </div>

                    {/* DOB */}
                    <div className="space-y-1.5">
                      <label htmlFor="dob" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-xs rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10 transition-all font-semibold"
                        disabled={searching}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={searching}
                    className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-800/10 hover:shadow-blue-750/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {searching ? "Searching..." : "Retrieve Report"}
                    <ChevronRight size={14} />
                  </button>
                </form>
              </div>
            ) : candidateResult.processingStatus ? (
              <ResultPendingState status={candidateResult.processingStatus} />
            ) : (
              /* Gorgeous Result Mapping Board */
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 p-6 md:p-8 space-y-8 animate-scale-in">
                <ResultHero 
                  candidate={candidateResult.candidate} 
                  result={candidateResult.result} 
                  verificationToken={candidateResult.verificationToken} 
                  onViewCertificate={() => setActiveModal("certificate")} 
                />

                <ScoreOverview result={candidateResult.result} />

                <TalentDNAProfile analytics={candidateResult.analytics} result={candidateResult.result} />

                <MistakeIntelligence analytics={candidateResult.analytics} result={candidateResult.result} />

                <RecommendationCard analytics={candidateResult.analytics} result={candidateResult.result} />

                {/* Next actions: Certificate & Profile Downloads */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 no-print">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 bg-blue-800 hover:bg-blue-750 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-800/10 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} />
                    Download Profile Report
                  </button>
                  <button
                    onClick={() => setActiveModal("certificate")}
                    className="flex-1 py-3 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Award size={14} />
                    View Merit Certificate
                  </button>
                  <button
                    onClick={() => {
                      setCandidateResult(null);
                      setRegistrationId("");
                      setDob("");
                    }}
                    className="py-3 px-6 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Hidden printable overlay */}
            {candidateResult && (
              <div id="printable-area" className="hidden">
                <style dangerouslySetInnerHTML={{__html: `
                  @media print {
                    body {
                      background: white !important;
                      color: black !important;
                      font-family: 'Inter', sans-serif;
                    }
                    main > *, nav, footer, header, button, .no-print {
                      display: none !important;
                    }
                    #printable-area {
                      display: block !important;
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100% !important;
                      margin: 0 !important;
                      padding: 40px !important;
                      box-sizing: border-box;
                    }
                  }
                `}} />

                <div className="border-4 border-slate-900 p-8 rounded-3xl bg-white space-y-8" style={{ minHeight: "277mm" }}>
                  {/* Header branding */}
                  <div className="flex justify-between items-center border-b-2 border-slate-900 pb-6">
                    <div className="space-y-1">
                      <h1 className="text-2xl font-black tracking-tight text-slate-900">
                        COURAGE NATIONAL TALENT SEARCH 2026
                      </h1>
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                        Official Cognitive & Academic Evaluation Profile
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 border-2 border-slate-950 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Official Scorecard
                      </span>
                    </div>
                  </div>

                  {/* Candidate Metadata */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm border-b border-slate-200 pb-6">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Name</span>
                      <strong className="text-slate-900 text-base">{candidateResult.candidate.student_name}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">CNTS Registration ID</span>
                      <strong className="text-slate-900 font-mono text-base">{candidateResult.candidate.cnts_id || candidateResult.candidate.registration_id}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Class / Grade</span>
                      <strong className="text-slate-900">Grade {candidateResult.candidate.student_class}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Birth</span>
                      <strong className="text-slate-900">{candidateResult.candidate.dob}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Institution / School</span>
                      <strong className="text-slate-900">{candidateResult.candidate.school_name} ({candidateResult.candidate.school_city})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">District</span>
                      <strong className="text-slate-900">{candidateResult.candidate.district}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">State</span>
                      <strong className="text-slate-900">{candidateResult.candidate.state}</strong>
                    </div>
                  </div>

                  {/* Rankings Summary */}
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-6">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">National Percentile</span>
                      <strong className="text-2xl font-black text-slate-900">{Number(candidateResult.result.percentile || 0).toFixed(2)}%</strong>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">All India Rank (AIR)</span>
                      <strong className="text-2xl font-black text-slate-900">#{candidateResult.result.national_rank}</strong>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">State Rank</span>
                      <strong className="text-2xl font-black text-slate-900">#{candidateResult.result.state_rank}</strong>
                    </div>
                  </div>

                  {/* Metric breakdown */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-black text-slate-800">
                      Cognitive Performance Metrics
                    </h3>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-900 text-[10px] uppercase font-bold text-slate-400">
                          <th className="py-2">Evaluation Domain</th>
                          <th className="py-2 text-right">Domain Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs">
                        <tr>
                          <td className="py-3 font-bold">Quantitative & Analytical Ability</td>
                          <td className="py-3 text-right font-mono font-bold">{candidateResult.result.mathematics_score}%</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-bold">Verbal & Language Logic</td>
                          <td className="py-3 text-right font-mono font-bold">{candidateResult.result.language_score}%</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-bold">Logical & Pattern Deduction</td>
                          <td className="py-3 text-right font-mono font-bold">{candidateResult.result.logical_reasoning_score}%</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-bold">Critical Cognitive Reasoning</td>
                          <td className="py-3 text-right font-mono font-bold">{candidateResult.result.general_awareness_score}%</td>
                        </tr>
                        <tr className="border-t-2 border-slate-900 font-bold bg-slate-50">
                          <td className="py-3 px-2">Overall Evaluation Index</td>
                          <td className="py-3 px-2 text-right font-mono">{candidateResult.result.overall_score}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Footer verification note */}
                  <div className="pt-12 flex justify-between items-end">
                    <div className="space-y-1 text-[10px] text-slate-400 max-w-sm">
                      <p><strong>Verification Hash:</strong> {candidateResult.candidate.registration_id.slice(-6)}-{candidateResult.result.percentile.toString().replace('.', '')}</p>
                      <p>This is a certified digital report of the Courage National Talent Search (CNTS) 2026. Secure credential verification is hosted at: <u>cnts.in/results</u></p>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="w-36 border-b border-slate-900 h-10"></div>
                      <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block">Registrar of Evaluation</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* What Parents Will Receive Visual Preview Section */}
      <section className="bg-white border-t border-slate-100 py-16 px-6 w-full">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Talent Report Preview
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
              What Parents Will Receive
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
              Every registered candidate receives a comprehensive, multi-dimensional cognitive analysis. Here is what is included in your custom diagnostic report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "1. Cognitive Profile Mapping",
                desc: "A detailed radar assessment profiling the candidate's logic across 6 cognitive dimensions: spatial, logic, analytical, verbal reasoning, spatial logic, and pattern completion.",
                icon: Sparkles,
                badge: "Diagnostic Profile"
              },
              {
                title: "2. Subject-Specific Logic Scores",
                desc: "Percentage breakdown scores showing mastery in Quant reasoning, Language/Verbal logic, Pattern deduction, and Critical cognitive application.",
                icon: BookOpen,
                badge: "Domain Performance"
              },
              {
                title: "3. National Rank Scorecard",
                desc: "Official state-level and all-India rankings (AIR), along with percentile standings normalized across peer cohorts in the respective class.",
                icon: Trophy,
                badge: "National Benchmarking"
              },
              {
                title: "4. Tailored Learning Style Guide",
                desc: "Expert recommendations and actionable study tips customized to support the child's natural learning speed and conceptual style.",
                icon: Award,
                badge: "Actionable Guidance"
              }
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-200 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Icon size={18} />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-405 bg-slate-100 px-2 py-0.5 rounded">{p.badge}</span>
                    <h4 className="font-display font-bold text-slate-800 text-sm md:text-base mt-1">{p.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Certificate & Report Preview Showcase */}
      <section className="bg-slate-50 border-t border-b border-slate-150 py-16 px-6 w-full relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Interactive 3D Preview
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
              Interactive Certificate & Report Preview
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
              Hover to tilt on desktop or tap to view high-fidelity fullscreen modals of the official CNTS credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
            {/* Card 1: Merit Certificate Mockup */}
            <div
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseLeave={() => handleMouseLeave(1)}
              onClick={() => setActiveModal("certificate")}
              style={{
                transform: `perspective(1000px) rotateX(${tilt1.x}deg) rotateY(${tilt1.y}deg) scale3d(1.01, 1.01, 1.01)`,
                transition: "transform 0.1s ease-out",
                transformStyle: "preserve-3d"
              }}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 aspect-[1.414/1] relative overflow-hidden cursor-pointer select-none group"
            >
              {/* Outer decorative border */}
              <div className="absolute inset-4 border-[6px] border-double border-slate-800 rounded-xl flex flex-col justify-between p-4" style={{ transform: "translateZ(30px)" }}>
                
                {/* Certificate header */}
                <div className="text-center flex items-start justify-between">
                  <div className="w-8 h-10 invisible" /> {/* Spacer */}
                  <div className="space-y-1 text-center flex-1">
                    <span className="text-[7px] md:text-[9px] font-bold text-amber-700 tracking-widest block uppercase font-mono">
                      Founding Edition Participant Certificate
                    </span>
                    <h3 className="font-display font-black text-slate-900 text-sm md:text-base leading-none tracking-tight">
                      COURAGE NATIONAL TALENT SEARCH
                    </h3>
                  </div>
                  {/* Photo Profile */}
                  <div className="w-8 h-10 border border-slate-200 rounded shrink-0 overflow-hidden bg-slate-100 flex items-center justify-center">
                    {candidateResult?.candidate?.registration_id ? (
                      <img src={`/api/photo/${candidateResult.candidate.registration_id}`} alt="Photo" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                    ) : (
                      <User size={12} className="text-slate-300" />
                    )}
                  </div>
                </div>
                {/* Body */}
                <div className="text-center space-y-1.5 relative">
                  {/* Sample Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 transform -rotate-12">
                    <span className="text-4xl font-black text-red-500 uppercase tracking-widest border-4 border-red-500 px-4 py-1 rounded">SAMPLE</span>
                  </div>

                  <p className="text-[8px] md:text-[10px] italic text-slate-500 font-medium">This is to certify that</p>
                  <h4 className="font-display font-bold text-base md:text-lg text-slate-800 leading-none">
                    [Your Child&apos;s Name]
                  </h4>
                  <p className="text-[8px] md:text-[10px] text-slate-600 max-w-[280px] mx-auto leading-relaxed">
                    of Class [Class] has successfully qualified as a Founding Cohort Member in the Founding Edition of CNTS 2026.
                  </p>
                </div>

                {/* Verification Stamp */}
                <div className="text-center text-[5px] md:text-[6px] text-slate-400 font-mono tracking-wider pt-1 border-t border-slate-100/50 mt-1 select-none pointer-events-none">
                  Verified Credential | Digitally Signed | Publicly Verifiable
                </div>

                {/* Footer details */}
                <div className="flex justify-between items-end text-[7px] md:text-[9px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
                  <div className="space-y-0.5 text-left">
                    <p>AIR: <strong className="text-slate-800 font-bold">#[Rank]</strong></p>
                    <p>State Rank: <strong className="text-slate-800 font-bold">#[Rank]</strong></p>
                  </div>
                  
                  {/* Stylized QR Code for verification */}
                  <div className="flex items-center gap-1 border border-slate-200 p-1 rounded bg-white shadow-sm opacity-50">
                    <div className="w-6 h-6 bg-slate-900 flex flex-wrap p-0.5 gap-0.5 rounded shrink-0">
                      <div className="w-2.5 h-2.5 bg-white border border-slate-900 rounded-sm" />
                      <div className="w-2.5 h-2.5 bg-slate-900" />
                      <div className="w-2.5 h-2.5 bg-slate-900" />
                      <div className="w-2.5 h-2.5 bg-white border border-slate-900 rounded-sm" />
                    </div>
                    <div className="text-[5px] text-slate-400 font-mono leading-none text-left">
                      VERIFIED<br/>
                      No: [SAMPLE-CERT-ID]
                    </div>
                  </div>
                  
                  <div className="space-y-0.5 text-right font-mono">
                    <p className="text-[5px] md:text-[7px] text-slate-500">ID: [SAMPLE-ID]</p>
                    <p className="font-bold text-slate-800 font-sans">Registrar of Evaluation</p>
                  </div>
                </div>
              </div>

              {/* Shiny reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
            </div>

            {/* Card 2: Cognitive Profile Report Mockup */}
            <div
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseLeave={() => handleMouseLeave(2)}
              onClick={() => setActiveModal("report")}
              style={{
                transform: `perspective(1000px) rotateX(${tilt2.x}deg) rotateY(${tilt2.y}deg) scale3d(1.01, 1.01, 1.01)`,
                transition: "transform 0.1s ease-out",
                transformStyle: "preserve-3d"
              }}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 p-5 aspect-[1.414/1] relative overflow-hidden cursor-pointer select-none group flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-start relative" style={{ transform: "translateZ(20px)" }}>
                {/* Sample Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 transform -rotate-12 top-20">
                  <span className="text-4xl font-black text-red-500 uppercase tracking-widest border-4 border-red-500 px-4 py-1 rounded">SAMPLE</span>
                </div>
                
                <div>
                  <h4 className="font-display font-bold text-xs md:text-sm text-slate-800">Cognitive Profile Report</h4>
                  <p className="text-[7px] md:text-[9px] text-slate-500 font-mono">Candidate ID: [Candidate ID]</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[7px] md:text-[9px] font-bold uppercase tracking-wider">
                  Top 3% Cohort
                </span>
              </div>

              {/* Mini Charts / Skill bars */}
              <div className="space-y-2 py-2" style={{ transform: "translateZ(25px)" }}>
                {[
                  { domain: "Quantitative & Analytical", val: 92, color: "bg-blue-600" },
                  { domain: "Verbal & Language Logic", val: 85, color: "bg-indigo-600" },
                  { domain: "Logical & Pattern Deduction", val: 79, color: "bg-emerald-600" },
                  { domain: "Critical Reasoning", val: 88, color: "bg-purple-600" }
                ].map((d, index) => (
                  <div key={index} className="space-y-0.5">
                    <div className="flex justify-between text-[7px] md:text-[9px] font-bold text-slate-650">
                      <span>{d.domain}</span>
                      <span>{d.val}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="p-2 bg-blue-50/50 border border-blue-100 rounded-xl" style={{ transform: "translateZ(15px)" }}>
                <p className="text-[7px] md:text-[9px] font-bold text-blue-800 flex items-center gap-1">
                  <Sparkles size={8} /> Learning Style Verdict:
                </p>
                <p className="text-[6px] md:text-[8px] text-slate-500 leading-normal mt-0.5">
                  Strong logical reasoning. Excel in mathematical sequences and abstract concepts. Recommended for logic-based problem solving pathways.
                </p>
              </div>

              {/* Shiny reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Modals for Tap-to-Expand */}
      {activeModal === "certificate" && (
        <CertificatePreview
          candidate={candidateResult.candidate}
          result={candidateResult.result}
          verificationToken={candidateResult.verificationToken}
          onClose={() => setActiveModal(null)}
        />
      )}

      <NeedHelp />
      <Footer />
    </main>
  );
}
