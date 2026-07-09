"use client";
import React from "react";
import { Building, Users, Calendar, ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const schoolPillars = [
  {
    title: "Bulk Roster Uploads",
    desc: "Coordinators can upload candidate spreadsheets directly to enroll student classes in bulk.",
  },
  {
    title: "Institutional Reports",
    desc: "Principals receive school-wide talent charts comparing average scores to national medians.",
  },
  {
    title: "Coordinator Dashboard",
    desc: "Self-serve panel to verify registrations, print batch admit cards, and look up roll numbers.",
  },
  {
    title: "Sponsorship Quotas",
    desc: "Subsidized and sponsored seats allocated atomicaly using assigned institutional codes.",
  },
];

export default function SchoolPartnership() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#F8FAFF] border-b border-slate-100 relative overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-blue-500/[0.015] rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vision & Action Link */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-xs font-bold text-blue-750 rounded-full uppercase tracking-widest">
              <Building size={12} /> School Ecosystem
            </span>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Partner with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-750 to-indigo-600">CNTS 2026</span>
            </h2>
            
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              Join leading educational institutions across India. Partner with the Courage Library Foundation to implement cognitive aptitude assessments and discover hidden talents within your classes.
            </p>

            <div className="pt-2">
              <Link 
                href="/for-schools"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all duration-200 shadow-sm cursor-pointer group"
              >
                Become a School Partner <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Pillars Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {schoolPillars.map((p, idx) => (
              <div 
                key={idx} 
                className="p-6 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200/50 transition-all duration-250 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50/80 border border-blue-100/50 flex items-center justify-center text-blue-700 shadow-xs">
                    <CheckCircle2 size={15} className="stroke-[2.2]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-850 text-sm sm:text-base">{p.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
