import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, Brain, Trophy, Star, Shield, ArrowRight, XCircle, CheckCircle2 } from "lucide-react";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import FounderLetter from "@/components/sections/FounderLetter";
import NeedHelp from "@/components/layout/NeedHelp";

export const metadata: Metadata = {
  title: "About CNTS – Our Talent Discovery Mission",
  description: "Learn about the mission, philosophy, and talent discovery engine behind the Courage National Talent Search (CNTS), powered by Courage Library.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
      <Navbar theme="light" />

      {/* ── HERO BANNER ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-40 pb-16 px-6 border-b border-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-[#FAFCFF]">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/3" />
        
        {/* Decorative Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-12 items-center gap-12 relative z-10">
          <div className="md:col-span-7 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-blue-700">
              <Sparkles size={11} className="text-blue-600 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Our Philosophy
              </span>
            </div>
            
            <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-[1.05]">
              Finding the genius in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                every child.
              </span>
            </h1>
            
            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
              CNTS is not a race for raw marks. We are a talent discovery engine built to identify cognitive strengths, logical capabilities, and creative intelligence—revealing who your child is, not just what they memorized.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <RegisterCTA
                unauthenticatedText="Start Diagnostic Journey"
                rightIcon={<ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/10 transition-all cursor-pointer group"
              />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                operated by Courage Library
              </span>
            </div>
          </div>

          {/* Premium visual widget on the right */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2.5rem] opacity-20 blur-lg group-hover:opacity-30 transition-all duration-500" />
              
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
                {/* Mesh pattern inside container */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl" />
                
                {/* Float brain representation */}
                <div className="relative z-10 flex flex-col items-center gap-3 animate-float">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <Brain size={42} className="text-blue-400 stroke-[1.5]" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-mono font-black text-white/50 uppercase tracking-widest">Cognitive Engine</div>
                    <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Courage Library Diagnostic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Stat Strip */}
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-200/60 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            {[
              { value: "4 Aptitude Domains", label: "Logic, math, language & reasoning" },
              { value: "Class 5 – 8 Mapping", label: "Age-standardized diagnostic criteria" },
              { value: "National Standing", label: "Percentiles across all boards" },
              { value: "Bilingual Standard", label: "English & Hindi mediums supported" }
            ].map(({ value, label }, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-display font-black text-slate-900 text-base">{value}</div>
                <div className="text-xs text-slate-500 font-medium leading-normal">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION SECTION ───────────────────────────────────── */}
      <section className="py-16 max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-6">
          <span className="inline-block text-[10px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            Our Mission
          </span>
          <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">
            Moving beyond the limits of raw marks and memory.
          </h2>
          <div className="space-y-4 text-slate-500 text-sm leading-relaxed font-medium">
            <p>
              The Indian education system is heavily focused on exam scores. However, a single raw score card is an incomplete representation of a student&apos;s actual potential. Children are over-examined but under-discovered.
            </p>
            <p>
              Our mission is to establish CNTS as a national standard for cognitive diagnostics. By evaluating critical thinking, linguistic aptitude, spatial and mathematical reasoning, and creative problem-solving, we map a child&apos;s natural learning styles and core strengths.
            </p>
          </div>
        </div>

        <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm text-center space-y-3 hover:border-slate-300 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-amber-600 transition-all duration-300">
              <Trophy size={16} className="stroke-[2.2]" />
            </div>
            <h4 className="font-display font-bold text-slate-900 text-sm">Recognize Aptitude</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Locating logical strengths across major domains.</p>
          </div>
          
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm text-center space-y-3 hover:border-slate-300 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-700 transition-all duration-300">
              <Brain size={16} className="stroke-[2.2]" />
            </div>
            <h4 className="font-display font-bold text-slate-900 text-sm">Map Learning</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Discovering how children absorb information.</p>
          </div>
          
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm text-center space-y-3 hover:border-slate-300 transition-all duration-300 sm:col-span-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 transition-all duration-300">
              <Star size={16} className="stroke-[2.2]" />
            </div>
            <h4 className="font-display font-bold text-slate-900 text-sm">Build Future Profiles</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Creating verified, multi-dimensional profiles for future admissions.</p>
          </div>
        </div>
      </section>

      {/* ── PARADIGM COMPARISON (WHY COGNITIVE MATTERS) ───────── */}
      <FounderLetter />

      {/* ── TALENT DISCOVERY PHILOSOPHY ───────────────────────── */}
      <section className="py-16 bg-white border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-block text-[10px] font-bold text-purple-700 uppercase tracking-widest bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
              Talent Discovery
            </span>
            <h2 className="font-display font-black text-slate-900 text-3xl tracking-tight">
              CNTS is NOT an Olympiad.
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              We focus on mapping aptitude rather than memory.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Left box: Traditional */}
            <div className="bg-[#FCFDFF] p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all duration-300 space-y-4">
              <h3 className="font-display font-black text-base text-slate-900 uppercase tracking-wide">Traditional Olympiads</h3>
              <ul className="space-y-3 text-[12.5px] text-slate-500 font-medium">
                <li className="flex items-start gap-2.5">
                  <XCircle size={14} className="text-red-400 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Rely heavily on prescribed school board syllabus.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle size={14} className="text-red-400 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Test memorized formulas, facts, and textbook definitions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle size={14} className="text-red-400 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Categorize children into a single raw score and rank.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle size={14} className="text-red-400 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Increase academic anxiety and rote study patterns.</span>
                </li>
              </ul>
            </div>

            {/* Right box: CNTS */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-blue-200/50 shadow-md shadow-blue-100/35 hover:shadow-lg transition-all duration-300 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="font-display font-black text-base text-blue-750 flex items-center gap-2 uppercase tracking-wide">
                <Sparkles size={14} className="text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
                The CNTS Philosophy
              </h3>
              <ul className="space-y-3 text-[12.5px] text-slate-500 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Tests basic cognitive reasoning independent of board syllabus.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Focuses on critical thinking, problem-solving, and creative IQ.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Outputs a multi-dimensional 6-domain profile with counselor feedback.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Encourages cognitive curiosity and maps natural learning styles.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── POWERED BY COURAGE LIBRARY ────────────────────────── */}
      <section className="py-16 max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 flex justify-center">
          <div className="relative group w-full max-w-xs">
            <div className="absolute -inset-4 bg-gradient-to-tr from-slate-900 to-indigo-900 rounded-3xl opacity-10 blur-lg group-hover:opacity-15 transition-all duration-300" />
            
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#060b27] via-[#09133a] to-[#050b21] border border-blue-950/40 shadow-xl p-8 flex flex-col justify-between text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-blue-400">
                <Shield size={24} className="stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-white text-lg">Courage Library</h3>
                <p className="text-xs text-blue-200">A foundation of learning excellence.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <span className="inline-block text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
            Our Foundation
          </span>
          <h2 className="font-display font-black text-3xl text-slate-900 tracking-tight leading-tight">
            Trust. Credibility. Educational Legacy.
          </h2>
          <div className="space-y-4 text-slate-500 text-sm leading-relaxed font-medium">
            <p>
              CNTS is powered by Courage Library. For years, we have worked directly with educational institutions, parents, and students to build better libraries, reading curriculums, and diagnostic tools.
            </p>
            <p>
              Through CNTS, we combine our deep understanding of cognitive development with modern assessment methodology. We ensure bilingual review, scientific question design, and a reliable testing process that parents and schools trust.
            </p>
          </div>
        </div>
      </section>

      {/* ── NEED HELP WIDGET ──────────────────────────────────── */}
      <NeedHelp />

      {/* ── BOTTOM CTA ────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-t border-slate-100 text-center">
        <div className="max-w-md mx-auto space-y-5">
          <h3 className="font-display font-black text-3xl tracking-tight text-slate-900 leading-tight">
            Discover your child&apos;s genius today.
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Registration takes less than 3 minutes. Secure your child&apos;s national rank and receive their customized Talent Profile.
          </p>
          <div className="pt-2">
            <RegisterCTA
              unauthenticatedText="Register Candidate"
              rightIcon={<ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5 cursor-pointer group"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
