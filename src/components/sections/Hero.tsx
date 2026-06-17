"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, Trophy, Brain, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { fetchTotalRegistrationCount, fetchRegistrations } from "@/services/supabaseService";
import { BASELINE_REGISTRATIONS, BASELINE_STATES } from "@/config/stats";

const talentBadges = [
  { icon: Brain, label: "Critical Thinking", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { icon: Zap, label: "Logical Reasoning", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { icon: Star, label: "Creative Intelligence", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { icon: Trophy, label: "Problem Solving", color: "bg-purple-50 text-purple-700 border-purple-100" },
];

const stats = [
  { value: "Founding Edition", label: "2026 Cohort" },
  { value: "Eligibility", label: "Classes 5–8" },
  { value: "Assessment Format", label: "Online" },
  { value: "Outcome", label: "Talent Profile Report" },
];

const recentRegistrations = [
  { name: "Aarav", city: "Delhi", class: "6" },
  { name: "Priyanshi", city: "Lucknow", class: "7" },
  { name: "Arjun", city: "Jaipur", class: "8" },
  { name: "Zoya", city: "Hyderabad", class: "5" },
  { name: "Ayaan", city: "Pune", class: "7" },
  { name: "Karan", city: "Kanpur", class: "6" },
  { name: "Diya", city: "Patna", class: "5" },
];

const profiles = {
  Aarav: {
    name: "Aarav Gupta",
    classInfo: "Class 6 · Delhi",
    score: 84,
    percentile: "Top 7%",
    strengths: [
      { icon: Brain, label: "Critical Thinking", color: "bg-blue-50 text-blue-700 border-blue-100" },
      { icon: Trophy, label: "Problem Solving", color: "bg-purple-50 text-purple-700 border-purple-100" }
    ],
    skills: [
      { label: "Logical Reasoning", val: 89, tag: "Advanced", color: "bg-blue-600" },
      { label: "Language Analysis", val: 78, tag: "Strong", color: "bg-emerald-500" },
      { label: "Quantitative Thinking", val: 85, tag: "Strong", color: "bg-amber-500" },
    ],
    learningPattern: "Visual-Analytical",
    award: "National Merit Certificate"
  },
  Priyanshi: {
    name: "Priyanshi Singh",
    classInfo: "Class 7 · Lucknow",
    score: 91,
    percentile: "Top 2%",
    strengths: [
      { icon: Zap, label: "Logical Reasoning", color: "bg-amber-50 text-amber-700 border-amber-100" },
      { icon: Star, label: "Creative Intelligence", color: "bg-emerald-50 text-emerald-700 border-emerald-100" }
    ],
    skills: [
      { label: "Logical Reasoning", val: 94, tag: "Advanced", color: "bg-blue-600" },
      { label: "Language Analysis", val: 92, tag: "Advanced", color: "bg-emerald-500" },
      { label: "Quantitative Thinking", val: 76, tag: "Developing", color: "bg-amber-500" },
    ],
    learningPattern: "Verbal-Logical",
    award: "National Topper Medal"
  },
  Arjun: {
    name: "Arjun Sharma",
    classInfo: "Class 8 · Jaipur",
    score: 88,
    percentile: "Top 4%",
    strengths: [
      { icon: Brain, label: "Critical Thinking", color: "bg-blue-50 text-blue-700 border-blue-100" },
      { icon: Zap, label: "Logical Reasoning", color: "bg-amber-50 text-amber-700 border-amber-100" }
    ],
    skills: [
      { label: "Logical Reasoning", val: 81, tag: "Developing", color: "bg-blue-600" },
      { label: "Language Analysis", val: 85, tag: "Strong", color: "bg-emerald-500" },
      { label: "Quantitative Thinking", val: 92, tag: "Advanced", color: "bg-amber-500" },
    ],
    learningPattern: "Structured-Quantitative",
    award: "Mathematical Excellence Award"
  }
};

export default function Hero() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [dynamicStats, setDynamicStats] = useState(stats);
  const [selectedProfileKey, setSelectedProfileKey] = useState<"Aarav" | "Priyanshi" | "Arjun">("Aarav");

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
      setTickerIndex((prev) => (prev + 1) % recentRegistrations.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Keep stats static as requested by product guidelines (avoiding fake/dynamic scale indicators)
    setDynamicStats(stats);
  }, []);

  const currentReg = recentRegistrations[tickerIndex];

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

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
              <Sparkles size={14} className="text-blue-700" />
              <span className="text-blue-800 text-xs font-semibold tracking-wide uppercase">
                India&apos;s Talent Discovery Platform
              </span>
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
              A National Assessment for Classes 5–8. Designed to identify reasoning ability, mathematical thinking, language skills, and learning potential.
            </p>

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
                  {currentReg.name} ({currentReg.city}) · Class {currentReg.class} joined CNTS
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-blue-800 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-800/25 hover:shadow-blue-700/35 hover:-translate-y-0.5 w-full sm:w-auto text-center"
              >
                Register Candidate – Subsidized Founding Edition (₹99)
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sample-report"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 shadow-sm w-full sm:w-auto"
              >
                View Sample Talent Report
              </Link>
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
                  Join the <strong className="text-slate-700">Founding Edition of CNTS 2026</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Talent Profile Card */}
          <div className="relative flex flex-col items-center lg:items-end justify-center">
            {/* Profile Toggle Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl mb-4 w-full max-w-[340px] sm:max-w-[380px]">
              {(Object.keys(profiles) as Array<keyof typeof profiles>).map((profileKey) => (
                <button
                  key={profileKey}
                  type="button"
                  onClick={() => setSelectedProfileKey(profileKey)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedProfileKey === profileKey
                      ? "bg-white text-blue-900 shadow-md shadow-blue-900/5"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {profileKey}
                </button>
              ))}
            </div>

            <div className="relative animate-float">
              {/* Main card */}
              <div className="w-full max-w-[340px] sm:w-[380px] bg-white rounded-3xl shadow-2xl shadow-blue-900/15 border border-slate-100/80 overflow-hidden">
                {/* Card header */}
                <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-200 text-xs font-medium uppercase tracking-widest font-sans">
                        CNTS Talent Profile
                      </span>
                      <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                        <Star size={10} className="text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 text-white font-display font-bold text-xl">
                        {profiles[selectedProfileKey].name[0]}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-white text-lg leading-tight">
                          {profiles[selectedProfileKey].name}
                        </h3>
                        <p className="text-blue-200 text-sm mt-0.5">{profiles[selectedProfileKey].classInfo}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Talent score ring */}
                <div className="px-6 py-5 border-b border-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Overall Talent Score
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {profiles[selectedProfileKey].percentile}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#EFF6FF" strokeWidth="7" />
                        <circle
                          cx="32" cy="32" r="26"
                          fill="none"
                          stroke="url(#scoreGrad)"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 26 * (profiles[selectedProfileKey].score / 100)} ${2 * Math.PI * 26}`}
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#1E40AF" />
                            <stop offset="100%" stopColor="#10B981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display font-bold text-slate-800 text-sm">{profiles[selectedProfileKey].score}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {profiles[selectedProfileKey].skills.map((s) => (
                        <div key={s.label}>
                          <div className="flex justify-between text-[11px] mb-0.5">
                            <span className="text-slate-500 font-semibold">{s.label}</span>
                            <span className="font-bold text-slate-800">{s.val}% <span className="text-[9px] text-slate-400 font-bold uppercase">({s.tag})</span></span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${s.color} rounded-full`}
                              style={{ width: `${s.val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Talent tags & Learning pattern */}
                <div className="px-6 py-4 border-b border-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Discovered Strengths
                    </p>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 font-sans">
                      {profiles[selectedProfileKey].learningPattern}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profiles[selectedProfileKey].strengths.map((b) => (
                      <span
                        key={b.label}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border ${b.color}`}
                      >
                        <b.icon size={10} />
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Award badge */}
                <div className="mx-6 my-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-300/40">
                    <Trophy size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-800">{profiles[selectedProfileKey].award}</div>
                    <div className="text-[10px] text-amber-600 mt-0.5">Founding Edition Participant • 2026 Cohort</div>
                  </div>
                </div>
              </div>

              {/* Floating micro-cards */}
              <div className="absolute -top-5 -right-6 animate-float-slow hidden sm:flex" style={{ animationDelay: "1s" }}>
                <div className="glass rounded-2xl px-4 py-2.5 shadow-lg shadow-blue-900/10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-xs font-semibold text-slate-700">Talent profile active</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-8 animate-float-slow hidden sm:flex" style={{ animationDelay: "2s" }}>
                <div className="glass rounded-2xl px-4 py-2.5 shadow-lg shadow-blue-900/10 flex items-center gap-2">
                  <Trophy size={13} className="text-amber-500" />
                  <span className="text-xs font-semibold text-slate-700">Cohort member verified</span>
                </div>
              </div>
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
