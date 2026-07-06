"use client";

import React from "react";
import { Brain, Target, Compass, XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FounderLetter() {
  return (
    <section className="py-10 md:py-14 lg:py-16 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Why It Matters
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
            Why Cognitive Profiling Matters
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            School report cards measure what a child can store. CNTS measures how they think.
          </p>
        </div>

        {/* Side-by-Side Modern Paradigm Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 items-stretch">
          
          {/* Left Panel: The Traditional Rote Way */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/50">
                  <XCircle size={22} className="stroke-[2px]" />
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  The Rote Paradigm
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-slate-800">
                  Standard School Marks
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Focuses on memorizing formulas, repeating textbook answers, and scoring highly. Only shows short-term retention, not capability.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 font-medium">Temporary facts retention (Cramming)</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 font-medium">Repetitive formula application</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 font-medium">Low developmental feedback for parents</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: The CNTS Cognitive Way (Glowing SaaS-Style Card) */}
          <div className="bg-slate-900 text-white rounded-3xl border border-blue-900/30 p-8 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Brain size={22} className="stroke-[2px] animate-pulse" />
                </div>
                <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  The CNTS Standard
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-white">
                  Cognitive Profiling
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Evaluates foundational skills like logical deduction, pattern recognition, and mathematical thinking. Identifies long-term potential.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200 font-medium">Critical reasoning and cause-and-effect thinking</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200 font-medium">Syllabus-independent spatial & quantitative logic</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200 font-medium">Detailed Growth Roadmap for the child</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* The 3 Core Pillars Dashboard below the comparison */}
        <div className="grid sm:grid-cols-3 gap-6 pt-4">
          
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Target size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 text-sm mb-1">Locate Natural Spikes</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Spot early spikes in analytical ability and problem deduction that standard exams miss.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Brain size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 text-sm mb-1">Optimize Learning Style</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Discover if your child excels in visual, linguistic, or structured-quantitative logic.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Compass size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 text-sm mb-1">Actionable Growth Roadmaps</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive independent, diagnostic feedback to nurture logic skills at home.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
