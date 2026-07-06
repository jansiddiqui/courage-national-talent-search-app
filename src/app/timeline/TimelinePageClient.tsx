"use client";

import React, { useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import {
  Calendar,
  Play,
  BookOpen,
  AlertCircle,
  ShieldAlert,
  BadgeCheck,
  FileBarChart,
  Trophy,
  ArrowRight,
  ClipboardCheck,
  Award,
  Brain,
  Zap,
  Clock,
  Sparkles,
} from "lucide-react";
import { TIMELINE_LABELS } from "@/config/timeline";

interface TimelineEvent {
  phase: number;
  title: string;
  date: string;
  desc: string;
  isKeystone?: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  bulletBg: string;
  tagColor: string;
}

export default function TimelinePageClient() {
  const events: TimelineEvent[] = useMemo(() => [
    {
      phase: 1,
      title: "Registrations Open",
      date: TIMELINE_LABELS.REGISTRATION_OPEN,
      desc: "Parents register their children online for the Founding Edition. Select class (5–8) and preferred language medium (English/Hindi). Registrations are capped at 500 candidates for this founding pilot.",
      icon: Play,
      iconColor: "text-white",
      bulletBg: "bg-blue-500",
      tagColor: "text-blue-700 bg-blue-50",
    },
    {
      phase: 2,
      title: "Learning Academy Launch",
      date: "20 July 2026",
      desc: "CNTS Learning Academy goes live with bilingual interactive lessons, flashcard drills, and solved examples across all four exam domains — Reasoning, Mathematics, Language, and Critical Thinking.",
      icon: BookOpen,
      iconColor: "text-white",
      bulletBg: "bg-blue-600",
      tagColor: "text-blue-700 bg-blue-50",
    },
    {
      phase: 3,
      title: "Registration Deadline",
      date: TIMELINE_LABELS.REGISTRATION_CLOSE,
      desc: "Registration window closes at 11:59 PM. No late entries can be admitted to ensure stable remote testing server configurations for the pilot cohort.",
      icon: AlertCircle,
      iconColor: "text-white",
      bulletBg: "bg-red-500",
      tagColor: "text-red-700 bg-red-50",
    },
    {
      phase: 4,
      title: "Admit Cards & Logins",
      date: TIMELINE_LABELS.ADMIT_CARD_RELEASE,
      desc: "Candidate roll numbers, testing guidelines, and exam portal logins are generated and sent via WhatsApp to registered parents.",
      icon: ShieldAlert,
      iconColor: "text-white",
      bulletBg: "bg-violet-500",
      tagColor: "text-violet-700 bg-violet-50",
    },
    {
      phase: 5,
      title: "CNTS National Talent Assessment",
      date: TIMELINE_LABELS.EXAM_DATE,
      desc: "The official online cognitive evaluation. Students appear from home during their designated slot. Focuses on logic, reasoning, and thinking ability.",
      isKeystone: true,
      icon: Calendar,
      iconColor: "text-white",
      bulletBg: "bg-purple-600",
      tagColor: "text-purple-700 bg-purple-50",
    },
    {
      phase: 6,
      title: "Evaluation & Analysis Period",
      date: "31 Aug – 10 Sep 2026",
      desc: "Educational experts and scoring scripts process results. Every question is mapped to spatial logic, mathematical reasoning, and linguistic capability.",
      icon: Clock,
      iconColor: "text-white",
      bulletBg: "bg-slate-500",
      tagColor: "text-slate-700 bg-slate-50",
    },
    {
      phase: 7,
      title: "National Rankings Released",
      date: TIMELINE_LABELS.RESULTS_DATE,
      desc: "Overall percentiles, school topper standings, and state ranks published on the CNTS Result Portal. Tracked separately for Junior and Senior categories.",
      icon: FileBarChart,
      iconColor: "text-white",
      bulletBg: "bg-teal-500",
      tagColor: "text-teal-700 bg-teal-50",
    },
    {
      phase: 8,
      title: "Talent Profiles Released",
      date: TIMELINE_LABELS.TALENT_PROFILE_DATE,
      desc: "Comprehensive diagnostic reports mapping discovered cognitive strengths and actionable growth advice released in parent dashboards.",
      icon: Brain,
      iconColor: "text-white",
      bulletBg: "bg-emerald-500",
      tagColor: "text-emerald-700 bg-emerald-50",
    },
    {
      phase: 9,
      title: "Certificates Released",
      date: TIMELINE_LABELS.CERTIFICATE_DATE,
      desc: "Verifiable digital certificates with secure verification QR codes issued to all candidates.",
      icon: ClipboardCheck,
      iconColor: "text-white",
      bulletBg: "bg-green-500",
      tagColor: "text-green-700 bg-green-50",
    },
    {
      phase: 10,
      title: "Awards & Recognition Announcement",
      date: TIMELINE_LABELS.AWARDS_DATE,
      desc: "School topper medals, state merit trophies, and national podium stars declared. Credentials synchronized with school registries.",
      icon: Trophy,
      iconColor: "text-white",
      bulletBg: "bg-amber-500",
      tagColor: "text-amber-700 bg-amber-50",
    },
  ], []);

  return (
    <main className="min-h-screen bg-[#F8FAFF] text-slate-800 antialiased selection:bg-blue-150">
      <Navbar theme="light" />

      {/* ── PREMIUM SIMPLE HERO ────────────────────────────────── */}
      <section className="relative overflow-hidden pt-40 pb-16 px-6 text-center border-b border-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-[#F8FAFF]">
        {/* Soft background glow circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-150/20 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />
        
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#1E40AF 1px, transparent 1px), linear-gradient(90deg, #1E40AF 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100/50 rounded-full text-blue-700">
            <Sparkles size={11} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Founding Cohort 2026
            </span>
          </div>

          {/* Heading with elegant gradient accent */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Assessment{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Timeline.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            A structured, high-momentum schedule. Register in July or August, complete the online assessment, and receive your child&apos;s cognitive talent profile before the new school term begins.
          </p>
        </div>
      </section>

      {/* ── ALTERNATING TIMELINE SECTION ───────────────────────── */}
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#F8FAFF] shadow-md ${evt.bulletBg} group-hover:scale-110 transition-transform duration-300`}>
                      <EvtIcon size={12} className={`${evt.iconColor} stroke-[2.5]`} />
                    </div>
                  </div>

                  {/* Content Card Side */}
                  <div className="w-full md:w-[calc(50%-24px)] pl-10 md:pl-0">
                    <div className={`bg-white rounded-3xl border p-6 md:p-8 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative group card-glow ${
                      evt.isKeystone ? "border-purple-200 shadow-purple-50" : "border-slate-100"
                    }`}>
                      {/* Hover border glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                      
                      {/* Top Meta row */}
                      <div className="flex items-center justify-between gap-4 mb-3 relative z-10">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${evt.tagColor}`}>
                          Phase {evt.phase}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {evt.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-slate-800 text-lg mb-3 relative z-10">
                        {evt.title}
                      </h3>
                      
                      {/* Desc */}
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed relative z-10 font-medium">
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

      {/* ── CALL TO ACTION ─────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-slate-100 text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <span className="inline-block text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Immediate Opportunity
          </span>
          <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 leading-tight">
            Accelerated Outcomes. No Long Waiting.
          </h3>
          <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto font-medium">
            Secure your child&apos;s spot in the Founding Edition for ₹99. Complete the assessment in August, get verified credentials before September.
          </p>
          <RegisterCTA
            unauthenticatedText="Register Now – ₹99"
            rightIcon={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-800/20 transition-all hover:-translate-y-0.5 cursor-pointer group"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
