"use client";

import React from "react";
import { Brain, Sparkles, TrendingUp, Lightbulb } from "lucide-react";

const discoveries = [
  {
    icon: Brain,
    title: "How your child approaches problems",
    desc: "Understand the underlying logical pathways and deduction strategies your child uses to solve complex, novel challenges.",
    color: "text-blue-700 bg-blue-50 border-blue-100/50"
  },
  {
    icon: Lightbulb,
    title: "How your child learns best",
    desc: "Discover whether your child excels in visual-spatial, verbal-logical, or structured-quantitative learning styles.",
    color: "text-amber-700 bg-amber-50 border-amber-100/50"
  },
  {
    icon: Sparkles,
    title: "Areas of natural strength",
    desc: "Identify early talent spikes in pattern deduction, analytical reasoning, and conceptual interpretation.",
    color: "text-emerald-700 bg-emerald-50 border-emerald-100/50"
  },
  {
    icon: TrendingUp,
    title: "Areas for future development",
    desc: "Gain clear, actionable guidance on nurturing reasoning speed, linguistic logic, and mathematical thinking.",
    color: "text-purple-700 bg-purple-50 border-purple-100/50"
  }
];

export default function WhatParentsDiscover() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-xs font-bold text-blue-800 uppercase tracking-widest bg-blue-50 border border-blue-100/50 px-3.5 py-1.5 rounded-full font-sans">
            Aspirational Insights
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            What Parents Discover
          </h2>
          <p className="text-sm md:text-base text-slate-550 leading-relaxed">
            CNTS is not just a test. It is a diagnostic mirror designed to reveal how your child approaches learning and problem solving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {discoveries.map((d, i) => (
            <div 
              key={i} 
              className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-200 flex gap-5 items-start group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${d.color} group-hover:scale-105 transition-transform`}>
                <d.icon size={20} className="stroke-[2]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-slate-800 text-lg leading-snug">
                  {d.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                  {d.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
