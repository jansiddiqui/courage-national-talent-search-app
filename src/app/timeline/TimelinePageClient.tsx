"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  Play, 
  BookOpen, 
  AlertCircle, 
  ShieldAlert, 
  BadgeCheck, 
  FileBarChart, 
  Trophy, 
  ArrowRight,
  ClipboardCheck
} from "lucide-react";
import { TIMELINE_LABELS } from "@/config/timeline";

interface TimelineEvent {
  phase: number;
  title: string;
  date: string;
  desc: string;
  status: "completed" | "active" | "upcoming";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  bulletColor: string;
}

const getTimelineEvents = (): TimelineEvent[] => [
  {
    phase: 1,
    title: "Registrations Open",
    date: TIMELINE_LABELS.REGISTRATION_OPEN,
    desc: "Parents register their children online for the Founding Edition. Select class (5–8) and preferred language medium (English/Hindi). Registrations are capped at 500 candidates for this founding pilot.",
    status: "upcoming",
    icon: Play,
    bulletColor: "bg-blue-600 border-blue-200 text-white",
  },
  {
    phase: 2,
    title: "Learning Academy Launch",
    date: "20 July 2026",
    desc: "The CNTS Learning Academy goes fully live with bilingual interactive lessons, flashcard drills, and solved examples across all four exam domains — Reasoning, Mathematics, Language, and Critical Thinking.",
    status: "upcoming",
    icon: BookOpen,
    bulletColor: "bg-blue-500 border-blue-200 text-white",
  },
  {
    phase: 3,
    title: "Registration Deadline",
    date: TIMELINE_LABELS.REGISTRATION_CLOSE,
    desc: "The registration window closes officially at 11:59 PM. No late entries can be admitted to ensure stable remote proctoring configurations for the examination servers.",
    status: "upcoming",
    icon: AlertCircle,
    bulletColor: "bg-red-500 border-red-200 text-white",
  },
  {
    phase: 4,
    title: "Admit Cards & Logins Available",
    date: TIMELINE_LABELS.ADMIT_CARD_RELEASE,
    desc: "Candidate roll numbers, technical testing guidelines, and exam portal logins are generated and dispatched. Parents receive immediate setup instructions on their registered WhatsApp numbers.",
    status: "upcoming",
    icon: ShieldAlert,
    bulletColor: "bg-indigo-500 border-indigo-200 text-white",
  },
  {
    phase: 5,
    title: "CNTS National Talent Assessment",
    date: TIMELINE_LABELS.EXAM_DATE,
    desc: "The official online cognitive evaluation. Students appear online from home following standard independent self-evaluation guidelines, or at their partner school campus. Focuses on logic, reasoning, and learning potential.",
    status: "upcoming",
    icon: Calendar,
    bulletColor: "bg-purple-600 border-purple-200 text-white",
  },
  {
    phase: 6,
    title: "Evaluation & Analysis Period",
    date: "31 August - 10 September 2026",
    desc: "Educational experts and scoring scripts process the multi-dimensional assessments. Every question is analyzed to map spatial logic, mathematical reasoning, and linguistic capability.",
    status: "upcoming",
    icon: Clock,
    bulletColor: "bg-slate-400 border-slate-200 text-white",
  },
  {
    phase: 7,
    title: "National Rankings Released",
    date: TIMELINE_LABELS.RESULTS_DATE,
    desc: "Overall percentiles, school topper standings, and state ranks are published on the CNTS Result Portal. Rankings are tracked separately for Junior and Senior categories.",
    status: "upcoming",
    icon: FileBarChart,
    bulletColor: "bg-teal-500 border-teal-200 text-white",
  },
  {
    phase: 8,
    title: "Talent Profiles Released",
    date: TIMELINE_LABELS.TALENT_PROFILE_DATE,
    desc: "The comprehensive PDF reports mapping discovered cognitive strengths and actionable growth advice are released in parent dashboards.",
    status: "upcoming",
    icon: BadgeCheck,
    bulletColor: "bg-emerald-500 border-emerald-200 text-white",
  },
  {
    phase: 9,
    title: "Certificates Released",
    date: TIMELINE_LABELS.CERTIFICATE_DATE,
    desc: "Verifiable digital certificates with secure verification QR codes are issued to all candidates.",
    status: "upcoming",
    icon: ClipboardCheck,
    bulletColor: "bg-emerald-600 border-emerald-200 text-white",
  },
  {
    phase: 10,
    title: "Awards & Recognition Announcement",
    date: TIMELINE_LABELS.AWARDS_DATE,
    desc: "Honoring achievement. School topper medals, state merit trophies, and national podium stars are declared. Verifiable credentials are synchronized with school registries.",
    status: "upcoming",
    icon: Trophy,
    bulletColor: "bg-amber-600 border-amber-200 text-white",
  },
];

export default function TimelinePageClient() {
  const events = getTimelineEvents();

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="dark" />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <Sparkles size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              CNTS 2026 Founding Edition
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Assessment <span className="text-blue-400">Timeline</span>.
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            A fast-paced, high-momentum schedule. Register in July/August, test in August, and receive your child&apos;s cognitive roadmap before the new school term fully settles.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        
        <div className="relative">
          {/* Vertical central tracking line (desktop) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-slate-200" />
          
          {/* Vertical left tracking line (mobile) */}
          <div className="md:hidden absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />

          {/* Events list */}
          <div className="space-y-12">
            {events.map((evt, i) => {
              const isEven = i % 2 === 0;
              const EvtIcon = evt.icon;
              
              return (
                <div 
                  key={evt.phase} 
                  className={`relative flex flex-col md:flex-row items-stretch gap-8 md:gap-0 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  
                  {/* Bullet Marker (Middle) */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 flex items-center justify-center z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#F8FAFF] shadow-md ${evt.bulletColor} group-hover:scale-110 transition-transform duration-300`}>
                      <EvtIcon size={12} className="stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Content Card Side */}
                  <div className="w-full md:w-[calc(50%-24px)] pl-10 md:pl-0">
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative group card-glow">
                      {/* Hover border glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                      
                      <div className="flex items-center justify-between gap-4 mb-3 relative z-10">
                        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                          Phase {evt.phase}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {evt.date}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-slate-800 text-lg mb-3 relative z-10">
                        {evt.title}
                      </h3>
                      <p className="text-slate-505 text-xs md:text-sm leading-relaxed relative z-10">
                        {evt.desc}
                      </p>
                    </div>
                  </div>

                  {/* Spacing card side (Desktop only, hides card on the other side) */}
                  <div className="hidden md:block w-[calc(50%-24px)]" />

                </div>
              );
            })}
          </div>

        </div>

      </section>

      {/* Call to Action bar */}
      <section className="py-16 bg-white border-t border-slate-100 text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <span className="inline-block text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Immediate Opportunity
          </span>
          <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 leading-tight">
            Accelerated Outcomes. No Long Waiting.
          </h3>
          <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
            Secure your child&apos;s spot in the Founding Edition for Rs. 99. Complete the assessment in August, get verified credentials before September.
          </p>
          <RegisterCTA
            unauthenticatedText="Register Now – Rs. 99"
            rightIcon={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-850/20 transition-all hover:-translate-y-0.5 cursor-pointer group"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
