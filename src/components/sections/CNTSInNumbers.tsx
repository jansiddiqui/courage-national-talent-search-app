"use client";
import React from "react";
import { Sparkles } from "lucide-react";

const stats = [
  { value: "4", suffix: "Core Domains", label: "Logic, math, language & critical reasoning" },
  { value: "26+", suffix: "Topics Covered", label: "From pattern series to syllogisms" },
  { value: "12", suffix: "Page Brain Profile", label: "Multi-dimensional cognitive feedback" },
  { value: "2", suffix: "Exam Categories", label: "Sub-Junior (5–6) & Junior (7–8)" },
  { value: "₹99", suffix: "Subsidized Fee", label: "Sponsor-backed, zero subsequent upsells" },
];

export default function CNTSInNumbers() {
  return (
    <section className="py-12 bg-[#04081a] border-y border-white/[0.05] relative overflow-hidden select-none text-white">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-750/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] border border-white/[0.08] text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
            <Sparkles size={11} className="text-blue-400" />
            CNTS Framework Metrics
          </div>
          <h3 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            CNTS in Numbers
          </h3>
        </div>

        {/* Grid strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1 md:border-r border-white/[0.05] last:border-0 pr-2">
              <div className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 leading-none">
                {stat.value}
              </div>
              <div className="text-[11.5px] font-bold text-slate-300 mt-2">{stat.suffix}</div>
              <div className="text-[9.5px] text-slate-500 font-semibold leading-normal mt-1 max-w-[130px] mx-auto">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
