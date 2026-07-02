"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, Trophy, Brain, Zap, CheckCircle2, AlertCircle, GraduationCap, Banknote, Calendar, ScrollText, Award } from "lucide-react";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import { fetchTotalRegistrationCount, fetchRegistrations } from "@/services/supabaseService";
import { BASELINE_REGISTRATIONS, BASELINE_STATES } from "@/config/stats";
import { TIMELINE_LABELS, getContextualRegistrationEndsLabel } from "@/config/timeline";

const talentBadges = [
  { icon: Brain, label: "Critical Thinking", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { icon: Zap, label: "Logical Reasoning", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { icon: Star, label: "Creative Intelligence", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { icon: Trophy, label: "Problem Solving", color: "bg-purple-50 text-purple-700 border-purple-100" },
];

const stats = [
  { value: "Classes 5–8", label: "Eligibility" },
  { value: "Online Assessment", label: "Format" },
  { value: "India & International", label: "Reach" },
  { value: "Founding Edition", label: "2026 Cohort" },
];

const authenticMessages = [
  "Founding Edition 2026",
  "Early Participants Across India",
  "Building India's Next Generation Talent Discovery Platform",
];

export default function Hero() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [dynamicStats, setDynamicStats] = useState(stats);
  const [dbCount, setDbCount] = useState<number | null>(null);

  // Eligibility Checker State
  const [checkClass, setCheckClass] = useState("");
  const [checkDob, setCheckDob] = useState("");
  const [eligibilityResult, setEligibilityResult] = useState<{
    status: "eligible" | "ineligible";
    title: string;
    message: string;
    age?: number;
  } | null>(null);

  const handleVerifyEligibility = () => {
    if (!checkClass || !checkDob) {
      alert("Please select a grade and enter date of birth.");
      return;
    }

    const birthDate = new Date(checkDob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (isNaN(age) || age < 1) {
      setEligibilityResult({
        status: "ineligible",
        title: "Invalid Birth Date",
        message: "Please double check the entered date of birth."
      });
      return;
    }

    const grade = parseInt(checkClass);
    // Class brackets mapping: Class 5 -> ages 9-11, Class 6 -> 10-12, Class 7 -> 11-13, Class 8 -> 12-15
    const minAge = grade + 4; // e.g. Class 5 -> age 9
    const maxAge = grade + 7; // e.g. Class 5 -> age 12

    if (age >= minAge && age <= maxAge) {
      setEligibilityResult({
        status: "eligible",
        title: `Eligible for Class ${checkClass} Talent Search!`,
        message: `Your child is ${age} years old and meets all the registration criteria for CNTS 2026. Secure a seat in the Founding Edition now for ₹99.`,
        age
      });
    } else {
      setEligibilityResult({
        status: "ineligible",
        title: "Age / Grade Mismatch",
        message: `Typically, Class ${checkClass} candidates are between ${minAge} and ${maxAge} years old. Your child's calculated age is ${age} years. Please verify that the selected grade and birth date are correct.`
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % authenticMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentMessage = authenticMessages[tickerIndex];

  useEffect(() => {
    const getCount = async () => {
      try {
        const count = await fetchTotalRegistrationCount();
        setDbCount(count);
        
        if (count > 0) {
          setDynamicStats([
            { value: "Classes 5–8", label: "Eligibility" },
            { value: "Online Assessment", label: "Format" },
            { value: `${count.toLocaleString()}+`, label: "Students Registered" },
            { value: "India & International", label: "Reach" }
          ]);
        } else {
          setDynamicStats([
            { value: "Classes 5–8", label: "Eligibility" },
            { value: "Online Assessment", label: "Format" },
            { value: "100+", label: "Registered Students" },
            { value: "India & International", label: "Reach" }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch registration count:", err);
      }
    };
    getCount();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden mesh-bg pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/40 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(#1E40AF 1px, transparent 1px), linear-gradient(90deg, #1E40AF 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                <Sparkles size={14} className="text-blue-700" />
                <span className="text-blue-800 text-xs font-semibold tracking-wide uppercase">
                  India&apos;s Talent Discovery Platform
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                ✓ Hindi & English (दोनों भाषाओं में उपलब्ध)
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight">
                Courage National
                <br />
                <span className="gradient-text">Talent Search</span> (CNTS)
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              Discover what your child is naturally good at. A national test for Classes 5–8 to find their real strengths, thinking ability, and learning potential.
            </p>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/75 backdrop-blur-sm border border-slate-200/80 p-5 rounded-3xl max-w-xl shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5"><GraduationCap size={14} /></div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">For Classes</span>
                  <span className="text-xs font-bold text-slate-850">Classes 5, 6, 7 & 8</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5"><Banknote size={14} /></div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Exam Fee</span>
                  <span className="text-xs font-bold text-blue-800">₹99 <span className="text-[9px] text-slate-500 font-semibold">(Subsidized)</span></span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5"><Calendar size={14} /></div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Exam Date</span>
                  <span className="text-xs font-bold text-slate-855">{TIMELINE_LABELS.EXAM_DATE.replace(' (Sunday)', '')} <span className="text-[9px] text-slate-500 font-semibold">(Online)</span></span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5"><ScrollText size={14} /></div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">What You Get</span>
                  <span className="text-xs font-bold text-slate-850">Detailed Brain Strength Report & Certificate</span>
                </div>
              </div>
            </div>

            {/* Live Registration Activity Ticker */}
            <div className="h-9 bg-blue-50/50 border border-blue-100/50 px-4 py-1.5 rounded-2xl flex items-center gap-2 max-w-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                Live Activity:
              </span>
              <div className="overflow-hidden relative h-5 flex-1">
                <span 
                  key={tickerIndex} 
                  className="absolute left-0 w-full text-xs font-semibold text-slate-600 animate-slide-in-ticker truncate"
                >
                  {currentMessage}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <RegisterCTA
                unauthenticatedText="Secure Your Child's Spot — ₹99"
                rightIcon={<ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-blue-800 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-800/25 hover:shadow-blue-700/35 hover:-translate-y-0.5 w-full sm:w-auto text-center font-display"
              />
              <a
                href="/sample-report"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 shadow-sm w-full sm:w-auto font-display"
              >
                View Sample Talent Profile
              </a>
            </div>

            {/* Contextual Timeline Status Alert */}
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start pt-1">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
              </span>
              <span>{getContextualRegistrationEndsLabel()}</span>
            </div>

            {/* Trust badge strip & Legitimacy subtitle */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500 shrink-0" /> Classes 5–8</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500 shrink-0" /> Online Assessment</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500 shrink-0" /> Digital Certificate</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500 shrink-0" /> Talent Profile Report</span>
              </div>
              <div className="text-xs text-slate-500 font-semibold leading-relaxed">
                <p>Trusted by students, parents and schools across India.</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Founding Edition 2026 • Classes 5–8 • Online Nationwide</p>
              </div>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {[
                  "bg-blue-400",
                  "bg-emerald-400",
                  "bg-amber-400",
                  "bg-purple-400",
                ].map((c, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center`}
                  >
                    <span className="text-white text-[10px] font-bold">
                      {["A", "P", "R", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {dbCount && dbCount > 0 ? (
                    <>
                      Join over <strong className="text-blue-800">{dbCount.toLocaleString()} students</strong> in the <strong className="text-slate-700">Founding Edition of CNTS 2026</strong>
                    </>
                  ) : (
                    <>
                      Registrations Open Nationwide — <strong className="text-slate-700">Founding Edition 2026</strong>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Premium Bento Grid of Program Assets */}
          <div className="relative w-full max-w-lg mx-auto lg:mx-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Box 1: Verified National Certificate */}
            <div className="col-span-1 sm:col-span-2 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg relative overflow-hidden group hover:border-blue-300 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <Award size={22} className="stroke-[1.5]" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Verified Certificate</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                      ✓ Secure QR
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-slate-800 text-sm">National Merit & Participation Certificate</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Every candidate receives a verified certificate, marked with a unique QR code register ID for institutional verify.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Detailed Strength Report Preview */}
            <div className="col-span-1 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg relative overflow-hidden group hover:border-blue-300 transition-all duration-300 flex flex-col justify-between min-h-[170px]">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <Brain size={18} className="stroke-[1.5]" />
                </div>
                <h4 className="font-display font-bold text-slate-800 text-xs">Detailed Strength Report</h4>
                <p className="text-[10px] text-slate-550 leading-normal">
                  6-domain logic and reasoning skills evaluation.
                </p>
              </div>
              <div className="mt-3 space-y-1">
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[85%]" />
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[72%]" />
                </div>
              </div>
            </div>

            {/* Box 3: Medal & Trophy Honors */}
            <div className="col-span-1 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-5 border border-slate-850 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all duration-300 flex flex-col justify-between min-h-[170px]">
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
                  <Trophy size={18} className="stroke-[1.5]" />
                </div>
                <h4 className="font-display font-bold text-white text-xs">National Medals & Ranks</h4>
                <p className="text-[10px] text-slate-400 leading-normal">
                  All India Rankings with trophies & physical gold/silver/bronze medals for toppers.
                </p>
              </div>
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block pt-2 border-t border-white/5">
                AIR Rankings 1–50
              </span>
            </div>
          </div>
        </div>

        {/* Eligibility Checker Section */}
        <div className="mt-16 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
              Instant Validation
            </span>
            <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900">
              Check Your Child&apos;s Exam Eligibility
            </h3>
            <p className="text-xs text-slate-500">
              Enter details below to instantly verify if your child is eligible for the Founding Edition of CNTS 2026.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Class Selection */}
            <div className="w-full sm:w-1/3 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Class / Grade
              </label>
              <select
                value={checkClass}
                onChange={(e) => setCheckClass(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/5 transition-all text-slate-700"
              >
                <option value="">Select Grade</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
              </select>
            </div>

            {/* Date of Birth Input */}
            <div className="w-full sm:w-1/3 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Date of Birth
              </label>
              <input
                type="date"
                value={checkDob}
                onChange={(e) => setCheckDob(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/5 transition-all text-slate-700"
              />
            </div>

            {/* Check Button */}
            <div className="w-full sm:w-1/3 pt-5 sm:pt-6">
              <button
                onClick={handleVerifyEligibility}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Verify Eligibility
              </button>
            </div>
          </div>

          {/* Checker Results Alert */}
          {eligibilityResult && (
            <div className={`p-4 rounded-2xl border text-xs leading-normal animate-slide-up ${
              eligibilityResult.status === "eligible"
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : "bg-red-50 border-red-100 text-red-800"
            }`}>
              <div className="flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5">
                  {eligibilityResult.status === "eligible" ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : (
                    <AlertCircle size={16} className="text-red-600" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-bold">{eligibilityResult.title}</p>
                  <p className="opacity-90 leading-relaxed">{eligibilityResult.message}</p>
                  {eligibilityResult.status === "eligible" && (
                    <div className="pt-2 flex flex-wrap gap-x-6 gap-y-1 opacity-80 text-[10px] font-semibold uppercase tracking-wider">
                      <span>✓ Class 5-8 Bracket</span>
                      <span>✓ Age verified ({eligibilityResult.age} years)</span>
                      <span>✓ Seat availability: HIGH</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {dynamicStats.map((s) => (
            <div
              key={s.label}
              className="text-center px-2 py-4 sm:p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white shadow-sm flex flex-col justify-center min-h-[90px] sm:min-h-0"
            >
              <div className="font-display text-sm sm:text-xl md:text-3xl font-bold tracking-tight text-blue-800 mb-1 break-words leading-tight">
                {s.value}
              </div>
              <div className="text-[10px] sm:text-sm text-slate-500 font-medium leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
