/* eslint-disable react/no-unescaped-entities */
"use client";

import { CheckCircle2, FileText, Laptop, BarChart2, Award } from "lucide-react";

export default function AcademicJourneyStepper() {
  const steps = [
    {
      num: "01",
      icon: FileText,
      phase: "PHASE 01",
      title: "Onboarding & Briefing",
      desc: "School leadership approves participation. Simple digital registration with zero upfront cost or paperwork burden."
    },
    {
      num: "02",
      icon: Laptop,
      phase: "PHASE 02",
      title: "Candidate Testing",
      desc: "Assessment takes place in your school computer lab or online setup. Managed by our designated relationship officer."
    },
    {
      num: "03",
      icon: BarChart2,
      phase: "PHASE 03",
      title: "Diagnostic Evaluation",
      desc: "Instant section-wise heatmaps and individual student talent dossiers generated for school leadership and parents."
    },
    {
      num: "04",
      icon: Award,
      phase: "PHASE 04",
      title: "Recognition & Honors",
      desc: "Certificates of merit, school leadership trophies, and national honors awarded to participating candidates."
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-b border-slate-200 px-6 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Partnership Journey</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-1">
            Your school partnership journey
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-2">
            A smooth 4-phase academic lifecycle from initial onboarding to student honors.
          </p>
        </div>

        {/* 4-Step Stepper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {steps.map((step) => (
            <div 
              key={step.num}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {step.phase}
                  </span>
                  <step.icon size={20} className="text-slate-400" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-base mb-2">{step.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 size={14} /> Zero Faculty Burden
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
