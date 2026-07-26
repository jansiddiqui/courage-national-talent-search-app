/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { BarChart2, UserCheck, Trophy, Sparkles, CheckCircle2 } from "lucide-react";

export default function DeliverablesShowcase() {
  const [activeStage, setActiveStage] = useState<"heatmap" | "dossier" | "benchmarks">("heatmap");

  return (
    <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 mb-3">
            <Sparkles size={14} className="text-blue-600" /> Institutional Deliverables
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-1">
            What your school, faculty, and students will receive
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-2 leading-relaxed">
            Clear, structured diagnostic reports designed for school leaders, department heads, and parents.
          </p>
        </div>

        {/* Interactive Tab Switcher Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8">
          <button
            onClick={() => setActiveStage("heatmap")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
              activeStage === "heatmap"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BarChart2 size={16} /> 1. Classroom Diagnostic Heatmap
          </button>

          <button
            onClick={() => setActiveStage("dossier")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
              activeStage === "dossier"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <UserCheck size={16} /> 2. Student Talent Dossier
          </button>

          <button
            onClick={() => setActiveStage("benchmarks")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
              activeStage === "benchmarks"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Trophy size={16} /> 3. State &amp; National Benchmarks
          </button>
        </div>

        {/* Apple Product Stage Preview Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          {activeStage === "heatmap" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in text-left">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  For School Leadership &amp; HODs
                </span>
                <h3 className="font-display font-bold text-slate-900 text-xl">
                  Section-wise classroom diagnostic heatmaps
                </h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Identify exact conceptual strengths and learning gaps across each class section (5A, 5B, 6A, 6B). Empower department heads with data to refine teaching strategies.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    <span>Section-level mastery breakdown across 5 aptitude domains</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    <span>Identify high-potential candidates for talent nurturing programs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    <span>Printable PDF summaries for academic review meetings</span>
                  </li>
                </ul>
              </div>

              {/* Mockup Card Stage */}
              <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-inner">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <strong className="text-slate-900 text-xs font-bold">Class 7B — Cognitive Mastery Heatmap</strong>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">64 Candidates</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-600">Logical Reasoning</span>
                        <span className="font-bold text-slate-900">84% (High)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[84%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-600">Spatial Analysis</span>
                        <span className="font-bold text-slate-900">76% (Proficient)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full w-[76%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-600">Pattern Recognition</span>
                        <span className="font-bold text-slate-900">91% (Superior)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full w-[91%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStage === "dossier" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in text-left">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  For Parents &amp; Students
                </span>
                <h3 className="font-display font-bold text-slate-900 text-xl">
                  Individual student cognitive talent dossier
                </h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Every participating student receives a detailed 5-axis cognitive profile. Move parent conversations away from mark-based stress toward scientific aptitude discovery.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Personalized cognitive radar chart across 5 skill areas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Encouraging pedagogical guidance &amp; learning recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Official CNTS 2026 Certificate of Merit or Participation</span>
                  </li>
                </ul>
              </div>

              {/* Mockup Card Stage */}
              <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-inner">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <strong className="text-slate-900 text-xs font-bold">Student Dossier — Aarav Sharma (Class 6A)</strong>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Roll: CNTS-2026-8492</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-700">
                      <span>Overall Cognitive Percentile:</span>
                      <strong className="text-slate-900 font-bold">96.4th Percentile</strong>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Primary Cognitive Strength:</span>
                      <strong className="text-blue-600 font-bold">Spatial Logic &amp; Pattern Match</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStage === "benchmarks" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in text-left">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  National Standing
                </span>
                <h3 className="font-display font-bold text-slate-900 text-xl">
                  State &amp; national academic benchmarks
                </h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Understand how your institution performs relative to participating schools across your state and nationwide board benchmarks.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                    <span>State and national board percentile comparisons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                    <span>School Excellence Certificate for top-performing partner schools</span>
                  </li>
                </ul>
              </div>

              {/* Mockup Card Stage */}
              <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-inner">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <strong className="text-slate-900 text-xs font-bold">Institutional Benchmark Summary</strong>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded">2026 Session</span>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-lg text-xs space-y-1">
                    <strong className="text-slate-900 block font-bold">Top 5% National Standing in Spatial Reasoning</strong>
                    <p className="text-slate-600 text-[11px]">Your school ranks in the 95th percentile among participating CBSE institutions in Western Region.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
