"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Sparkles, 
  Brain, 
  BookOpen, 
  FileText,
  UserCheck,
  Zap, 
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <Brain size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Our Core Vision
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Uncovering Potential, <span className="text-blue-400">Beyond Cramming</span>.
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Discover why India&apos;s leading educators are recommending Courage National Talent Search (CNTS) over traditional competitive exams.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-5xl mx-auto py-20 px-6 space-y-12 animate-slide-up">
        
        {/* Persuasion Block: Rote Learning vs Cognitive Diagnostic */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-xl text-slate-850">
              Traditional Olympiads vs. CNTS 2026
            </h2>
            <p className="text-slate-400 text-xs">
              Traditional assessments grade what a student remembers. CNTS maps how a student thinks.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {comparisonData.map((row, idx) => (
              <div key={idx} className="grid md:grid-cols-5 border border-slate-100 rounded-2xl overflow-hidden text-xs">
                {/* Metric Title */}
                <div className="md:col-span-1 bg-slate-50 p-4 font-bold text-slate-850 flex items-center border-b md:border-b-0 md:border-r border-slate-100">
                  {row.metric}
                </div>
                {/* Traditional */}
                <div className="md:col-span-2 p-4 text-slate-500 space-y-1 border-b md:border-b-0 md:border-r border-slate-100">
                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest block flex items-center gap-1">
                    <ShieldAlert size={10} /> Traditional Exams
                  </span>
                  <p className="font-medium leading-relaxed">{row.traditional}</p>
                </div>
                {/* CNTS */}
                <div className="md:col-span-2 p-4 text-slate-700 bg-blue-50/10 space-y-1">
                  <span className="text-[9px] font-bold text-blue-800 uppercase tracking-widest block flex items-center gap-1">
                    <Zap size={10} className="text-blue-800" /> CNTS Diagnostic
                  </span>
                  <p className="font-semibold leading-relaxed">{row.cnts}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talent Profile Mapping Details */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-850 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-850">
              The 12-Page Talent Profile Report
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Every registered candidate receives a certified cognitive mapping. It breaks down performance into 8 distinct dimensional matrices, maps natural learning speed, identifies logical affinities, and highlights custom career profiles.
            </p>
            <Link 
              href="/sample-report" 
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-700 mt-2"
            >
              View Sample Profile Report
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-950 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
              <Award size={18} />
            </div>
            <h3 className="font-display font-bold text-white text-lg">
              Certified Recognition Kits
            </h3>
            <p className="text-xs text-slate-350 leading-relaxed">
              We reward structural curiosity. Over ₹5,00,000 worth of academic research grants, national ranking certificates, and customized physical medals are awarded to students exhibiting exceptional cognitive reasoning indices.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-6 shadow-lg shadow-slate-900/10 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-850/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative space-y-2 max-w-lg mx-auto">
            <h3 className="font-display font-bold text-xl text-white">Give Your Child the Cognitive Edge</h3>
            <p className="text-xs text-slate-400">Registration for the Founding Edition 2026 is currently open for Classes 5–8. Slot allocation is limited.</p>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Start Candidate Registration (₹99)
            </Link>
            <Link
              href="/about"
              className="px-8 py-3.5 border border-slate-700 text-slate-300 hover:text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
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
