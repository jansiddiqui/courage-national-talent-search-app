"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Brain, 
  FileText,
  Zap, 
  ShieldAlert,
  ArrowRight,
  Award
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import Trust from "@/components/sections/Trust";
import ParentBenefits from "@/components/sections/ParentBenefits";

export default function WhyCNTSPage() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const comparisonData = [
    {
      metric: "Evaluation Core",
      traditional: "Cramming ability, memory retention of textbook formulas, and speed-writing.",
      cnts: "Cognitive logic, conceptual clarity, pattern matching, and analytical depth."
    },
    {
      metric: "Feedback Output",
      traditional: "A single percentage score (e.g., 85%) which shows rank but fails to explain learning styles.",
      cnts: "A 12-page Talent Profile Mapping detailing verbal, spatial, quant, and logic aptitudes."
    },
    {
      metric: "Student Impact",
      traditional: "Rote-learning anxiety, peer competition comparison pressure, and memory fatigue.",
      cnts: "Self-discovery of unique cognitive strengths, building confidence, and early profiling."
    },
    {
      metric: "Future Readiness",
      traditional: "Prepares students for board exams but lacks reasoning patterns required for modern career paths.",
      cnts: "Instills logical patterns and deductive reasoning crucial for AI and data-driven profiles."
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="light" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-[#F8FAFF] pt-36 pb-20 md:pb-28 px-6 text-center border-b border-slate-100/85">
        {/* Background glow elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 border border-blue-100/50 rounded-full text-blue-700">
            <Brain size={12} className="text-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Our Core Vision
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-tight">
            Uncovering Potential,{" "}
            <span className="gradient-text font-black block sm:inline">Beyond Cramming.</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Discover why India&apos;s leading educators are recommending Courage National Talent Search (CNTS) over traditional competitive exams.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-5xl mx-auto pt-16 md:pt-20 px-6 space-y-12 animate-slide-up">
        
        {/* Persuasion Block: Rote Learning vs Cognitive Diagnostic */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-10 shadow-xl shadow-slate-100/40 space-y-6 hover:shadow-2xl transition-all duration-300">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <h2 className="font-display font-black text-xl text-slate-850">
              Traditional Olympiads vs. CNTS 2026
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Traditional assessments grade what a student remembers. CNTS maps how a student thinks.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {comparisonData.map((row, idx) => (
              <div 
                key={idx} 
                className="grid md:grid-cols-5 border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200/50 transition-all duration-200 isolate"
              >
                {/* Metric Title */}
                <div className="md:col-span-1 bg-slate-50/80 p-5 flex items-center justify-center md:justify-start font-black text-slate-800 border-b md:border-b-0 md:border-r border-slate-100 text-[10px] uppercase tracking-wider text-center md:text-left leading-normal rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none md:rounded-br-none">
                  {row.metric}
                </div>
                {/* Traditional */}
                <div className="md:col-span-2 p-5 bg-red-50/[0.08] border-b md:border-b-0 md:border-r border-slate-100 space-y-2">
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldAlert size={12} className="stroke-[2.5]" />
                    Traditional Exams
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    {row.traditional}
                  </p>
                </div>
                {/* CNTS */}
                <div className="md:col-span-2 p-5 bg-blue-50/10 space-y-2 rounded-b-2xl md:rounded-r-2xl md:rounded-tl-none md:rounded-bl-none">
                  <div className="text-[10px] font-black text-blue-650 uppercase tracking-widest flex items-center gap-1.5">
                    <Zap size={12} className="text-blue-650 stroke-[2.5]" />
                    CNTS Diagnostic
                  </div>
                  <p className="text-xs text-slate-800 font-bold leading-relaxed">
                    {row.cnts}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talent Profile Mapping Details */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* 12-Page Report card */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-slate-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 text-blue-650 flex items-center justify-center shrink-0">
                <FileText size={18} className="stroke-[2.2]" />
              </div>
              <h3 className="font-display font-black text-slate-850 text-lg leading-tight">
                The 12-Page Talent Profile Report
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Every registered candidate receives a certified cognitive mapping. It breaks down performance into 8 distinct dimensional matrices, maps natural learning speed, identifies logical affinities, and highlights custom career profiles.
              </p>
            </div>
            <div className="pt-2">
              <Link 
                href="/sample-report" 
                className="inline-flex items-center gap-1.5 text-xs font-black text-blue-800 hover:text-blue-700 transition-colors group"
              >
                <span>View Sample Profile Report</span>
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Recognition Kits card - Dark indigo theme */}
          <div className="bg-gradient-to-br from-[#060b27] via-[#09133a] to-[#050b21] border border-blue-950/40 text-white rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                <Award size={18} className="stroke-[2.2]" />
              </div>
              <h3 className="font-display font-black text-white text-lg leading-tight">
                Certified Recognition Kits
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                We reward structural curiosity. Over ₹5,00,000 worth of academic research grants, national ranking certificates, and customized physical medals are awarded to students exhibiting exceptional cognitive reasoning indices.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Migrated Homepage Sections - Full Width */}
      <div className="animate-slide-up">
        <Trust />
        <ParentBenefits />
      </div>

      {/* CTA Banner Container */}
      <div className="max-w-5xl mx-auto py-16 md:py-20 px-6 animate-slide-up">
        <div className="bg-gradient-to-br from-[#060b27] via-[#09133a] to-[#050b21] border border-blue-950/40 text-white rounded-3xl p-8 md:p-10 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-800/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative space-y-2 max-w-lg mx-auto z-10">
            <h3 className="font-display font-black text-xl md:text-2xl text-white">
              Give Your Child the Cognitive Edge
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              Registration for the Founding Edition 2026 is currently open for Classes 5–8. Slot allocation is limited.
            </p>
          </div>
          <div className="flex gap-4 justify-center flex-wrap relative z-10">
            <RegisterCTA
              unauthenticatedText="Start Candidate Registration (₹99)"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-600/10 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            />
            <Link
              href="/about"
              className="px-8 py-3.5 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Read About Schema
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
