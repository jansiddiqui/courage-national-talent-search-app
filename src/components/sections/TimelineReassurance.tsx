"use client";

import { CheckCircle2, FileText, CreditCard, Clipboard, Trophy, Award } from "lucide-react";
import { TIMELINE_LABELS } from "@/config/timeline";

const getEvents = () => [
  {
    title: "Registration Complete",
    date: "Immediate",
    desc: "Parent gets login credentials instantly and a dynamic Candidate Identity Card.",
    icon: CheckCircle2,
    status: "done", // done, active, pending
  },
  {
    title: "Learning Academy Live",
    date: "Available Now",
    desc: "Access bilingual interactive lessons, flashcard drills, and solved examples across all four exam domains inside the Academy.",
    icon: FileText,
    status: "done",
  },
  {
    title: "Admit Card Issued",
    date: TIMELINE_LABELS.ADMIT_CARD_RELEASE,
    desc: "Roll Number & login details generated. Receive official Entry Pass with detailed examination guidelines.",
    icon: CreditCard,
    status: "pending",
  },
  {
    title: "National Exam Day",
    date: TIMELINE_LABELS.EXAM_DATE,
    desc: "Online 75 or 90-minute conceptual evaluation. Multiple time slots with structured session scheduling.",
    icon: Clipboard,
    status: "pending",
  },
  {
    title: "Talent Scorecard & Ranks",
    date: TIMELINE_LABELS.RESULTS_DATE,
    desc: "Get cognitive strengths profile mapping, detailed subject analysis, and national rankings.",
    icon: Trophy,
    status: "pending",
  },
  {
    title: "Certificates & Medals",
    date: TIMELINE_LABELS.CERTIFICATE_DATE,
    desc: "Verifiable certificates generated. Medals and physical kits dispatched to achievers.",
    icon: Award,
    status: "pending",
  },
];

export default function TimelineReassurance() {
  const events = getEvents();
  return (
    <section className="py-10 md:py-14 lg:py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
            Roadmap to Discovery
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
            What Happens After <span className="text-blue-400">Registration?</span>
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            We guide parents and candidates through every step of the CNTS Talent Search journey. Here is what to expect after completing signup.
          </p>
        </div>

        {/* Timeline Grid Container */}
        <div className="relative pt-6 md:pt-8">
          
          {/* 
            Desktop Horizontal Node & Line Header:
            - Spans 6 columns with exact midpoint alignment.
            - Connecting track starts at midpoint of Column 1 (left-[8.333%]) and ends at midpoint of Column 6 (right-[8.333%]).
          */}
          <div className="hidden md:block relative mb-8 h-9">
            <div className="absolute top-[18px] left-[8.333%] right-[8.333%] h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500/35 to-white/5 z-0" />
            <div className="grid grid-cols-6 gap-4 relative z-10">
              {events.map((e, index) => {
                const Icon = e.icon;
                return (
                  <div key={e.title} className="flex justify-center items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        e.status === "done"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-lg shadow-blue-500/25 scale-105"
                          : "bg-slate-900 border-slate-700 text-slate-400"
                      }`}
                    >
                      <Icon size={14} className="stroke-[2.2]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Vertical Progress Track (only visible on mobile layout) */}
          <div className="block md:hidden absolute left-[18px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-blue-500 via-indigo-500/35 to-white/5 z-0" />

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4 relative z-10">
            {events.map((e, index) => {
              const Icon = e.icon;
              return (
                <div 
                  key={e.title} 
                  className="relative pl-12 md:pl-0 pt-0 group animate-slide-up" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Mobile Node Circle (only visible on mobile layout) */}
                  <div
                    className={`absolute left-0 top-0 w-9 h-9 rounded-full flex md:hidden items-center justify-center border-2 transition-all duration-300 z-20 ${
                      e.status === "done"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-lg shadow-blue-500/25"
                        : "bg-slate-900 border-slate-700 text-slate-400 group-hover:bg-blue-950/80 group-hover:border-blue-400 group-hover:text-blue-400 group-hover:scale-105"
                    }`}
                  >
                    <Icon size={14} className="stroke-[2.2]" />
                  </div>

                  {/* Card Content wrapper */}
                  <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      {/* Inline Header layout */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">
                          Step {index + 1}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                            e.status === "done"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-white/5 text-slate-300 border border-white/10"
                          }`}
                        >
                          {e.date}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-white text-base mb-1.5 leading-tight group-hover:text-blue-300 transition-colors">
                        {e.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {e.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
