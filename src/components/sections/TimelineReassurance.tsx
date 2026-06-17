"use client";

import { CheckCircle2, FileText, CreditCard, Clipboard, Trophy, Award } from "lucide-react";

const events = [
  {
    title: "Registration Complete",
    date: "Immediate",
    desc: "Parent gets login credentials instantly and a dynamic Candidate Identity Card.",
    icon: CheckCircle2,
    status: "done", // done, active, pending
  },
  {
    title: "Practice Papers Released",
    date: "Available Now",
    desc: "Access mock cognitive questions and prep resources instantly inside the dashboard.",
    icon: FileText,
    status: "done",
  },
  {
    title: "Admit Card Issued",
    date: "July 10, 2026",
    desc: "Roll Number & login details generated. Receive official Entry Pass with detailed examination guidelines.",
    icon: CreditCard,
    status: "pending",
  },
  {
    title: "National Exam Day",
    date: "July 19, 2026",
    desc: "Online 2-hour conceptual evaluation. Multiple time slots with structured session scheduling.",
    icon: Clipboard,
    status: "pending",
  },
  {
    title: "Talent Scorecard & Ranks",
    date: "July 28, 2026",
    desc: "Get cognitive strengths profile mapping, detailed subject analysis, and national rankings.",
    icon: Trophy,
    status: "pending",
  },
  {
    title: "Certificates & Medals",
    date: "August 5, 2026",
    desc: "Verifiable certificates generated. Medals and physical kits dispatched to achievers.",
    icon: Award,
    status: "pending",
  },
];

export default function TimelineReassurance() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
            Roadmap to Discovery
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-4 text-white">
            What Happens After <span className="text-blue-400">Registration?</span>
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            We guide parents and candidates through every step of the CNTS Talent Search journey. Here is what to expect after completing signup.
          </p>
        </div>

        {/* Timeline Grid (Vertical on Mobile, Horizontal-ish on Desktop) */}
        <div className="relative border-l border-white/15 md:border-l-0 md:border-t md:border-white/15 ml-4 md:ml-0 pt-6 md:pt-12 grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4">
          {events.map((e, index) => {
            const Icon = e.icon;
            return (
              <div key={e.title} className="relative pl-8 md:pl-0 group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Node circle wrapper */}
                <div
                  className={`absolute -left-[17px] md:left-0 top-0 md:-top-[22px] w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-20 ${
                    e.status === "done"
                      ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-slate-800 border-slate-700 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-400"
                  }`}
                >
                  <Icon size={14} />
                </div>

                {/* Event number helper for desktop */}
                <div className="hidden md:block absolute -top-[52px] left-0 text-[10px] font-extrabold text-blue-500 uppercase tracking-wider">
                  Step {index + 1}
                </div>

                {/* Card Content */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                  <span
                    className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded mb-2 ${
                      e.status === "done"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
                    {e.date}
                  </span>
                  <h3 className="font-display font-bold text-white text-sm md:text-base mb-1.5 leading-tight group-hover:text-blue-300 transition-colors">
                    {e.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {e.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
