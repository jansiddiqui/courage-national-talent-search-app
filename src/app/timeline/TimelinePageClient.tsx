"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import {
  Calendar,
  Play,
  BookOpen,
  AlertCircle,
  FileText,
  FileBarChart,
  Trophy,
  ArrowRight,
  ClipboardCheck,
  Brain,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
} from "lucide-react";
import { TIMELINE_LABELS, TIMELINE } from "@/config/timeline";

// ─── Phase Data ───────────────────────────────────────────────────────────────
interface TimelinePhase {
  phase: number;
  title: string;
  date: string;
  dateISO: string;
  endDateISO?: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
}

export default function TimelinePageClient() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [visiblePhases, setVisiblePhases] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Sync current date after client mount
    setCurrentDate(new Date());

    // Lightweight Intersection Observer for scroll-triggered entrance animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const phaseId = entry.target.getAttribute("data-phase-id");
            if (phaseId) {
              setVisiblePhases((prev) => ({ ...prev, [Number(phaseId)]: true }));
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll("[data-phase-id]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const phases: TimelinePhase[] = useMemo(
    () => [
      {
        phase: 1,
        title: "Registrations Open",
        date: TIMELINE_LABELS.REGISTRATION_OPEN,
        dateISO: TIMELINE.REGISTRATION_OPEN,
        desc: "Parents register their children online for the National Talent Search. Select class (5–8) and preferred language medium (English/Hindi).",
        icon: Play,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        phase: 2,
        title: "Learning Academy & Practice Papers",
        date: "20 July 2026",
        dateISO: "2026-07-20T00:00:00+05:30",
        desc: "CNTS Learning Academy goes live with interactive lessons, mock assessments, and solved examples across all four exam domains — Reasoning, Mathematics, Science, and Critical Thinking.",
        icon: BookOpen,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        phase: 3,
        title: "Registration Deadline",
        date: TIMELINE_LABELS.REGISTRATION_CLOSE,
        dateISO: TIMELINE.REGISTRATION_CLOSE,
        desc: "Registration window officially closes at 11:59 PM IST. Please make sure your child is registered before this date — no late entries are accepted after the cutoff.",
        icon: AlertCircle,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        phase: 4,
        title: "Admit Cards & Hall Tickets",
        date: TIMELINE_LABELS.ADMIT_CARD_RELEASE,
        dateISO: TIMELINE.ADMIT_CARD_RELEASE,
        desc: "Candidate roll numbers, testing slot passes, and device diagnostic checks become accessible for download in the parent portal.",
        icon: FileText,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
      },
      {
        phase: 5,
        title: "CNTS National Talent Assessment",
        date: TIMELINE_LABELS.EXAM_DATE,
        dateISO: TIMELINE.EXAM_DATE,
        desc: "The official online cognitive evaluation starting at 10:00 AM IST. Students appear from home on their registered desktop, tablet, or smartphone.",
        icon: Calendar,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
      },
      {
        phase: 6,
        title: "Evaluation & Analysis Period",
        date: "28 Sep – 9 Oct 2026",
        dateISO: TIMELINE.RESULT_COMPILATION_START,
        endDateISO: TIMELINE.RESULT_COMPILATION_END,
        desc: "Forensic verification, AI proctoring logs check, and percentile calculation across all participant cohorts.",
        icon: Clock,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
      },
      {
        phase: 7,
        title: "National Rankings Released",
        date: TIMELINE_LABELS.RESULTS_DATE,
        dateISO: TIMELINE.RESULTS_DATE,
        desc: "Overall percentiles, school topper standings, and state ranks published on the CNTS Result Portal. Tracked separately for Junior and Senior categories.",
        icon: FileBarChart,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
      {
        phase: 8,
        title: "Talent Profiles Released",
        date: TIMELINE_LABELS.TALENT_PROFILE_DATE,
        dateISO: TIMELINE.TALENT_PROFILE_DATE,
        desc: "Comprehensive diagnostic reports mapping discovered cognitive strengths and actionable growth advice released in parent dashboards.",
        icon: Brain,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        phase: 9,
        title: "Certificates Released",
        date: TIMELINE_LABELS.CERTIFICATE_DATE,
        dateISO: TIMELINE.CERTIFICATE_DATE,
        desc: "Verifiable digital certificates with secure verification QR codes issued to all candidates.",
        icon: ClipboardCheck,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
      },
      {
        phase: 10,
        title: "Awards & Recognition Announcement",
        date: TIMELINE_LABELS.AWARDS_DATE,
        dateISO: TIMELINE.AWARDS_DATE,
        desc: "School topper medals, state merit trophies, and national podium stars declared. Credentials synchronized with school registries.",
        icon: Trophy,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
    ],
    []
  );

  // Dynamic Date & Traffic-Light Status Engine
  const getPhaseStatus = (phase: TimelinePhase) => {
    const targetTime = new Date(phase.dateISO).getTime();
    const nowTime = currentDate.getTime();

    // Phase 1 (Registrations Open)
    if (phase.phase === 1) {
      const regCloseTime = new Date(TIMELINE.REGISTRATION_CLOSE).getTime();
      const isActive = nowTime >= targetTime && nowTime <= regCloseTime;
      const isDone = nowTime > regCloseTime;
      return {
        isActive,
        isDone,
        dynamicPillText: isActive ? "Active Stage" : isDone ? "Completed" : undefined,
        dynamicPillType: "emerald" as const,
        cardBorderClass: isActive ? "border-2 border-blue-200 ring-2 ring-blue-500/10 shadow-md shadow-blue-500/5" : "border border-slate-100"
      };
    }

    // Phase 2 (Learning Academy)
    if (phase.phase === 2) {
      const examTime = new Date(TIMELINE.EXAM_DATE).getTime();
      const isActive = nowTime >= targetTime && nowTime <= examTime;
      const isDone = nowTime > examTime;
      return {
        isActive,
        isDone,
        dynamicPillText: isActive ? "Active Stage" : isDone ? "Completed" : undefined,
        dynamicPillType: "emerald" as const,
        cardBorderClass: isActive ? "border-2 border-blue-200 ring-2 ring-blue-500/10 shadow-md shadow-blue-500/5" : "border border-slate-100"
      };
    }

    // Phase 3 (Registration Deadline - Dynamic Traffic Light)
    if (phase.phase === 3) {
      const closeTime = new Date(TIMELINE.REGISTRATION_CLOSE).getTime();
      const openTime = new Date(TIMELINE.REGISTRATION_OPEN).getTime();
      const diff = closeTime - nowTime;

      // 1. Closed
      if (nowTime > closeTime) {
        return {
          isActive: false,
          isDone: true,
          dynamicIconBg: "bg-slate-100",
          dynamicIconColor: "text-slate-500",
          dynamicPillText: "Registrations Closed",
          dynamicPillType: "slate" as const,
          cardBorderClass: "border border-slate-100"
        };
      }

      // 2. Final 3 days (Red state)
      if (diff <= 3 * 24 * 60 * 60 * 1000) {
        return {
          isActive: true,
          isDone: false,
          dynamicIconBg: "bg-rose-50",
          dynamicIconColor: "text-rose-600",
          dynamicPillText: "Final Call • Closes 11:59 PM",
          dynamicPillType: "rose" as const,
          cardBorderClass: "border-2 border-rose-200 ring-2 ring-rose-500/10 shadow-md shadow-rose-500/5"
        };
      }

      // 3. 3 to 7 days left (Yellow / Amber state)
      if (diff <= 7 * 24 * 60 * 60 * 1000) {
        return {
          isActive: true,
          isDone: false,
          dynamicIconBg: "bg-amber-50",
          dynamicIconColor: "text-amber-600",
          dynamicPillText: "Closing Soon • Last Few Days",
          dynamicPillType: "amber" as const,
          cardBorderClass: "border-2 border-amber-200 ring-2 ring-amber-500/10 shadow-md shadow-amber-500/5"
        };
      }

      // 4. Open with plenty of time (Green state - e.g. now in August)
      if (nowTime >= openTime) {
        return {
          isActive: true,
          isDone: false,
          dynamicIconBg: "bg-emerald-50",
          dynamicIconColor: "text-emerald-600",
          dynamicPillText: "Open & Accepting",
          dynamicPillType: "emerald" as const,
          cardBorderClass: "border-2 border-emerald-200/80 ring-2 ring-emerald-500/10 shadow-md shadow-emerald-500/5"
        };
      }

      return {
        isActive: false,
        isDone: false,
        cardBorderClass: "border border-slate-100"
      };
    }

    // Phase 5 (Exam Day)
    if (phase.phase === 5) {
      const examEndTime = new Date(TIMELINE.EXAM_GLOBAL_CUTOFF).getTime();
      const isToday = nowTime >= targetTime && nowTime <= examEndTime;
      const isDone = nowTime > examEndTime;
      return {
        isActive: isToday,
        isDone,
        dynamicPillText: isToday ? "Exam Today" : undefined,
        dynamicPillType: "emerald" as const,
        cardBorderClass: isToday ? "border-2 border-indigo-300 ring-2 ring-indigo-500/15" : "border-2 border-indigo-200"
      };
    }

    const isDone = nowTime >= targetTime;
    return {
      isActive: false,
      isDone,
      cardBorderClass: "border border-slate-100"
    };
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF] text-slate-800 antialiased selection:bg-blue-150">
      <Navbar theme="light" />

      {/* ── HERO ────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-36 sm:pt-40 pb-16 sm:pb-20 px-6 border-b border-slate-100">
        {/* Soft ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/2 translate-x-1/4" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#1E40AF 1px, transparent 1px), linear-gradient(90deg, #1E40AF 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
            <ShieldCheck size={13} className="text-blue-700" />
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              Founding Cohort 2026
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
            Assessment{" "}
            <span className="gradient-text">Timeline.</span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Everything that happens from the day you register to the day your
            child receives their talent profile, certificate, and awards.
          </p>

          {/* Three key dates */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-xs w-full sm:w-auto transition-transform hover:-translate-y-0.5 duration-300">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Play size={14} />
              </div>
              <div className="text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
                  Registration Opens
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {TIMELINE_LABELS.REGISTRATION_OPEN}
                </span>
              </div>
            </div>

            <ChevronRight size={16} className="text-slate-300 hidden sm:block shrink-0" />

            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-indigo-200 rounded-2xl shadow-xs ring-1 ring-indigo-100 w-full sm:w-auto transition-transform hover:-translate-y-0.5 duration-300">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                <Calendar size={14} />
              </div>
              <div className="text-left">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider block leading-none">
                  Exam Day
                </span>
                <span className="text-xs font-bold text-indigo-800">
                  {TIMELINE_LABELS.EXAM_DATE}
                </span>
              </div>
            </div>

            <ChevronRight size={16} className="text-slate-300 hidden sm:block shrink-0" />

            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-xs w-full sm:w-auto transition-transform hover:-translate-y-0.5 duration-300">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Award size={14} />
              </div>
              <div className="text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
                  Results &amp; Awards
                </span>
                <span className="text-xs font-bold text-slate-800">
                  October 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ────────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">

          {/* ── JOURNEY PHASES 1–4 ────────────────────────────────────────────── */}
          <div className="relative">
            {/* Vertical spine */}
            <div className="absolute left-5 sm:left-6 top-6 bottom-6 w-px bg-slate-200" aria-hidden="true" />

            <div className="space-y-5 sm:space-y-6">
              {phases.slice(0, 4).map((p) => {
                const status = getPhaseStatus(p);
                const Icon = p.icon;
                const isVisible = visiblePhases[p.phase] !== false;
                const iconBg = status.dynamicIconBg || p.iconBg;
                const iconColor = status.dynamicIconColor || p.iconColor;

                return (
                  <div
                    key={p.phase}
                    data-phase-id={p.phase}
                    className={`relative flex gap-3.5 sm:gap-5 transition-all duration-700 ease-out ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    {/* Node */}
                    <div className="relative z-10 shrink-0">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${iconBg} border border-slate-200/60 flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105`}
                      >
                        <Icon size={18} className={iconColor} />
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      className={`flex-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/[0.04] ${status.cardBorderClass}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Phase {p.phase}
                          </span>
                          
                          {/* Dynamic Traffic-Light Status Tag */}
                          {status.dynamicPillText && (
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-2xs border ${
                                status.dynamicPillType === "emerald"
                                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                  : status.dynamicPillType === "amber"
                                  ? "text-amber-800 bg-amber-50 border-amber-200"
                                  : status.dynamicPillType === "rose"
                                  ? "text-rose-700 bg-rose-50 border-rose-200"
                                  : "text-slate-600 bg-slate-100 border-slate-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  status.dynamicPillType === "emerald"
                                    ? "bg-emerald-500 animate-pulse"
                                    : status.dynamicPillType === "amber"
                                    ? "bg-amber-500 animate-pulse"
                                    : status.dynamicPillType === "rose"
                                    ? "bg-rose-500 animate-pulse"
                                    : "bg-slate-400"
                                }`}
                              />
                              {status.dynamicPillText}
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-semibold text-slate-400">
                          {p.date}
                        </span>
                      </div>

                      <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1 leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── KEYSTONE: EXAM DAY (Phase 5) ──────────────────────────────────── */}
          <div
            data-phase-id={5}
            className={`my-8 sm:my-10 transition-all duration-700 ease-out delay-100 ${
              visiblePhases[5] !== false ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-md shadow-indigo-100/50 overflow-hidden group">
              {/* Header band */}
              <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-6 py-4 sm:px-8 sm:py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                      <Calendar size={18} className="text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block">
                        Phase 5 — Main Assessment
                      </span>
                      <span className="text-sm sm:text-base font-bold text-white">
                        {TIMELINE_LABELS.EXAM_DATE}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-white bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                    Keystone Event
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight mb-2">
                    CNTS National Talent Assessment
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-lg font-medium">
                    The official online cognitive evaluation. Students appear
                    from home on their registered desktop, tablet, or
                    smartphone.
                  </p>
                </div>

                {/* Details in a clean mobile-aligned grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 sm:p-4 flex items-center sm:block gap-3.5 hover:bg-indigo-50/30 hover:border-indigo-100 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shrink-0 sm:mb-2">
                      <Clock size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none sm:leading-normal mb-0.5 sm:mb-0">
                        Exam Time
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        10:00 AM IST
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 sm:p-4 flex items-center sm:block gap-3.5 hover:bg-indigo-50/30 hover:border-indigo-100 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shrink-0 sm:mb-2">
                      <ClipboardCheck size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none sm:leading-normal mb-0.5 sm:mb-0">
                        Duration
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Class 5–6: 75m · Class 7–8: 90m
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 sm:p-4 flex items-center sm:block gap-3.5 hover:bg-indigo-50/30 hover:border-indigo-100 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shrink-0 sm:mb-2">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none sm:leading-normal mb-0.5 sm:mb-0">
                        Exam Mode
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Online from Home
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── EVALUATION (Phase 6) ─────────────────────────────────────────── */}
          <div
            data-phase-id={6}
            className={`relative mb-8 sm:mb-10 transition-all duration-700 ease-out delay-100 ${
              visiblePhases[6] !== false ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex gap-3.5 sm:gap-5">
              <div className="shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shadow-xs">
                  <Clock size={18} className="text-slate-500" />
                </div>
              </div>
              <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Phase 6
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    28 Sep – 9 Oct 2026
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1 leading-snug">
                  Evaluation &amp; Analysis Period
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Forensic verification, AI proctoring logs check, and
                  percentile calculation across all participant cohorts.
                </p>
              </div>
            </div>
          </div>

          {/* ── RESULTS & RECOGNITION (Phases 7–10) ────────────────────────────── */}
          <div
            data-phase-id={7}
            className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-700 ease-out delay-150 ${
              visiblePhases[7] !== false ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Group header */}
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 bg-gradient-to-r from-amber-50/80 to-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                  <Trophy size={18} className="text-amber-700" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Phases 7 – 10
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Results, Credentials &amp; Recognition
                  </h2>
                </div>
              </div>
            </div>

            {/* Outcome rows */}
            <div className="divide-y divide-slate-100">
              {phases.slice(6).map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.phase}
                    className="px-6 py-5 sm:px-8 sm:py-6 flex gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-2xl ${p.iconBg} border border-slate-200/60 flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={18} className={p.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-1">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {p.title}
                        </h4>
                        <span className="text-xs font-semibold text-slate-400 shrink-0">
                          {p.date}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-white py-16 sm:py-20 px-6 text-center">
        <div className="max-w-lg mx-auto space-y-6">
          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest">
            This is where you begin
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Start your child&apos;s journey today.
          </h2>

          <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed font-medium">
            Register for ₹99. Complete the assessment on{" "}
            {TIMELINE_LABELS.EXAM_DATE.replace(" (Sunday)", "")} and receive
            your child&apos;s talent profile, certificate, and awards in October.
          </p>

          <RegisterCTA
            unauthenticatedText="Register Now – ₹99"
            rightIcon={
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            }
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-800/20 transition-all hover:-translate-y-0.5 cursor-pointer group"
          />

          <p className="text-xs text-slate-400">
            Registration closes{" "}
            <span className="font-bold text-slate-600">
              {TIMELINE_LABELS.REGISTRATION_CLOSE} at 11:59 PM IST
            </span>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
