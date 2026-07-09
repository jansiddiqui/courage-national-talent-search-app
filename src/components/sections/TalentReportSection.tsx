"use client";
import React from "react";
import { Brain, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

const reportFeatures = [
  {
    title: "Cognitive Profiling",
    desc: "Detailed mappings of raw spatial geometry, verbal reasoning, and numerical deduction indices.",
  },
  {
    title: "Strength Analysis",
    desc: "Pinpoint where your child naturally excels, distinguishing true aptitudes from rote memory.",
  },
  {
    title: "Improvement Areas",
    desc: "Actionable identification of learning gaps and critical obstacles in reasoning methods.",
  },
  {
    title: "National Benchmarks",
    desc: "Comparative percentile tables plotting performance against peer groups across all school boards.",
  },
  {
    title: "Learning Recommendations",
    desc: "Customized academic and logical training advice to cultivate reasoning habits at home.",
  },
  {
    title: "Future Career Guidance",
    desc: "Aptitude alignment linking cognitive styles to future pathways in data, sciences, and humanities.",
  },
];

export default function TalentReportSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white border-b border-slate-100 relative overflow-hidden select-none">
      {/* Background radial effects */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Report Mockup Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm">
              {/* Glow backdrop */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] opacity-[0.08] blur-xl group-hover:opacity-15 transition-all duration-500" />
              
              {/* Visual Report mockup card */}
              <div className="relative bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 shadow-xl space-y-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.03] rounded-full blur-2xl" />
                
                {/* Header mock strip */}
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">CL</div>
                    <div>
                      <div className="text-[10px] font-black text-slate-800 uppercase tracking-wider leading-none">Talent Profile</div>
                      <span className="text-[8px] text-slate-400 font-bold block mt-0.5">Report ID: CNTS-2026-98X4P</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Verified</span>
                </div>

                {/* Score indicators grid preview */}
                <div className="space-y-3.5">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cognitive Aptitude Index</div>
                  
                  {/* Mock graphs */}
                  {[
                    { label: "Spatial Reasoning", val: "94th percentile", width: "w-[94%]", bg: "bg-blue-600" },
                    { label: "Verbal Analogies", val: "88th percentile", width: "w-[88%]", bg: "bg-indigo-600" },
                    { label: "Quantitative Logic", val: "91st percentile", width: "w-[91%]", bg: "bg-emerald-600" },
                    { label: "Critical Deduction", val: "85th percentile", width: "w-[85%]", bg: "bg-amber-500" },
                  ].map((mock, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-700">
                        <span>{mock.label}</span>
                        <span className="font-mono text-slate-500">{mock.val}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                        <div className={`h-full ${mock.bg} ${mock.width} rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Report cover blur overlay */}
                <div className="bg-white/80 border border-slate-200/50 rounded-2xl p-4 text-center shadow-md relative mt-4">
                  <div className="text-xs font-black text-slate-800">12-Page Complete Profile Report</div>
                  <p className="text-[9.5px] text-slate-400 font-semibold mt-1">Detailed developmental recommendations included.</p>
                  <Link 
                    href="/sample-report"
                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-blue-700 hover:text-blue-800 mt-2.5 group/btn"
                  >
                    View Full Sample Report <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Title and 6 key areas */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100/50 rounded-full text-xs font-bold text-blue-750 uppercase tracking-widest">
                <FileText size={12} /> Diagnostic Mapping
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                Inside Your Child&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-750 to-indigo-600">Talent Report</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl font-medium">
                At the end of the CNTS 2026 assessment, parents receive a certified, multi-dimensional cognitive diagnostic profile detailing:
              </p>
            </div>

            {/* Features 2-column grid */}
            <div className="grid sm:grid-cols-2 gap-5">
              {reportFeatures.map((feat, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 shadow-sm">
                    <CheckCircle2 size={11} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-[13px]">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
