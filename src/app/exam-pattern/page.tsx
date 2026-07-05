import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NeedHelp from "@/components/layout/NeedHelp";
import Link from "next/link";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import {
  BookOpen,
  Clock,
  Award,
  ArrowRight,
  Brain,
  Monitor,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";
import {
  EXAM_DOMAINS,
  EXAM_MODE,
  NEGATIVE_MARKING,
  SUB_JUNIOR_QUESTIONS,
  SUB_JUNIOR_DURATION,
  SUB_JUNIOR_PER_DOMAIN,
  SUB_JUNIOR_TOTAL_MARKS,
  JUNIOR_QUESTIONS,
  JUNIOR_DURATION,
  JUNIOR_PER_DOMAIN,
  JUNIOR_TOTAL_MARKS,
} from "@/config/exam";

export const metadata: Metadata = {
  title: "CNTS 2026 Exam Pattern & Syllabus — Assessment Blueprint | Courage Library",
  description: "Explore the complete CNTS 2026 exam pattern: 60 MCQs for Classes 5–6 (75 min) and 80 MCQs for Classes 7–8 (90 min). Four equal domains — Reasoning, Mathematics, Language, and Critical Thinking.",
  alternates: { canonical: "https://thecouragelibrary.com/exam-pattern" },
  openGraph: {
    title: "CNTS 2026 Exam Pattern & Syllabus — Assessment Blueprint",
    description: "60 MCQs for Classes 5–6 (75 min) and 80 MCQs for Classes 7–8 (90 min). Four equal domains with no negative marking.",
    url: "https://thecouragelibrary.com/exam-pattern",
    images: [{ url: "/og-cnts.png", width: 1200, height: 630, alt: "CNTS 2026 Exam Pattern" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CNTS 2026 Exam Pattern & Syllabus",
    description: "60 MCQs for Classes 5–6 (75 min) and 80 MCQs for Classes 7–8 (90 min). No negative marking.",
    images: ["/og-cnts.png"],
  },
};

const domainColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
  },
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-800",
  },
};

export default function ExamPatternPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
      <Navbar theme="dark" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-24 px-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-300 uppercase tracking-wider">
            <BookOpen size={12} /> Examination Blueprint
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            CNTS Exam Pattern{" "}
            <span className="text-blue-400">&amp; Syllabus</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            A fully online cognitive assessment with two age-appropriate categories.
            Four equal domains. No negative marking. Results within 21 days.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <RegisterCTA
              unauthenticatedText="Register Candidate"
              rightIcon={<ArrowRight size={16} />}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-lg text-sm flex items-center gap-2"
            />
            <Link
              href="/academy"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-3.5 px-8 rounded-xl transition-all text-sm flex items-center gap-2"
            >
              <Sparkles size={14} /> Learning Academy
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-20 flex-1 space-y-20">

        {/* ── Quick Spec Badges ─────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Monitor, label: "Exam Mode", value: EXAM_MODE, sub: "No OMR. No physical centre." },
            { icon: ShieldCheck, label: "Negative Marking", value: NEGATIVE_MARKING, sub: "Attempt every question freely." },
            { icon: Award, label: "Marking Scheme", value: "+1 per correct", sub: "Simple, transparent scoring." },
            { icon: Brain, label: "Domains", value: "4 Equal (25% each)", sub: "Reasoning · Math · Language · Critical" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-center space-y-2">
              <Icon size={24} className="text-blue-700 mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
              <p className="font-display font-bold text-slate-900 text-sm leading-tight">{value}</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">{sub}</p>
            </div>
          ))}
        </section>

        {/* ── Two-Category Structure ─────────────────────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
              <Users size={12} className="text-blue-700" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Two Age Categories</span>
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
              Designed for Every Age Group
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Question count and duration are calibrated to match the cognitive stamina and attention span of each class group.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sub-Junior */}
            <div className="bg-white rounded-3xl border border-blue-100 p-8 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 mb-4">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Sub-Junior Category</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-1">Classes 5 &amp; 6</h3>
                <p className="text-slate-400 text-xs mb-6">Age group: 10–12 years</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Questions", value: `${SUB_JUNIOR_QUESTIONS} MCQs` },
                    { label: "Duration", value: SUB_JUNIOR_DURATION },
                    { label: "Per Domain", value: `${SUB_JUNIOR_PER_DOMAIN} Questions` },
                    { label: "Total Marks", value: `${SUB_JUNIOR_TOTAL_MARKS} Marks` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">{label}</p>
                      <p className="font-display font-bold text-slate-900 text-base">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Clock size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    75 seconds per question on average — comfortable pace for younger students with time to review.
                  </p>
                </div>
              </div>
            </div>

            {/* Junior */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-800/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/40 rounded-full border border-blue-800/50 mb-4">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Junior Category</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-1">Classes 7 &amp; 8</h3>
                <p className="text-slate-400 text-xs mb-6">Age group: 12–14 years</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Questions", value: `${JUNIOR_QUESTIONS} MCQs` },
                    { label: "Duration", value: JUNIOR_DURATION },
                    { label: "Per Domain", value: `${JUNIOR_PER_DOMAIN} Questions` },
                    { label: "Total Marks", value: `${JUNIOR_TOTAL_MARKS} Marks` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">{label}</p>
                      <p className="font-display font-bold text-white text-base">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                  <Clock size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    67 seconds per question on average — enough time for deep reasoning with 20 questions per domain for a detailed Brain Strength Report.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Domain Breakdown ──────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
              4 Assessment Domains — Equal 25% Weight
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Every domain carries identical weight. No domain is more important than another — the test measures your child&apos;s complete cognitive profile.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {EXAM_DOMAINS.map((domain, index) => {
              const colors = domainColors[domain.color];
              return (
                <div
                  key={domain.name}
                  className={`bg-white border ${colors.border} rounded-3xl p-6 md:p-8 shadow-sm space-y-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${colors.badge} mb-2`}>
                        Domain {index + 1} · {domain.weightage}
                      </span>
                      <h3 className="font-display font-bold text-slate-900 text-base leading-snug">
                        {domain.name}
                      </h3>
                    </div>
                    <div className={`shrink-0 w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                      <span className={`font-black text-sm ${colors.text}`}>{index + 1}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{domain.desc}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Class 5–6</p>
                      <p className="font-bold text-slate-800">{SUB_JUNIOR_PER_DOMAIN} Questions</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Class 7–8</p>
                      <p className="font-bold text-slate-800">{JUNIOR_PER_DOMAIN} Questions</p>
                    </div>
                  </div>

                  <div className={`p-3.5 ${colors.bg} border ${colors.border} rounded-xl text-[11px] text-slate-600 italic leading-relaxed`}>
                    <strong className="not-italic font-bold text-slate-700">Sample concept: </strong>
                    &ldquo;{domain.sample}&rdquo;
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Why No Negative Marking ───────────────────────────────── */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white space-y-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 mb-4">
              <ShieldCheck size={12} className="text-blue-300" />
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Assessment Philosophy</span>
            </div>
            <h3 className="font-display font-bold text-2xl md:text-3xl mb-4 leading-tight">
              Why No Negative Marking?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              CNTS is a cognitive <em>discovery</em> tool — not a gatekeeping competition. Negative marking
              introduces anxiety and risk-aversion, which distorts the true measurement of a child&apos;s thinking ability.
              Attempting every question freely gives us a more accurate Brain Strength Report.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: CheckCircle2, text: "Attempt every question without fear" },
                { icon: CheckCircle2, text: "True cognitive profile — not test strategy" },
                { icon: CheckCircle2, text: "Encourages analytical guessing — a real skill" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2">
                  <Icon size={14} className="text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Online-Only Section ───────────────────────────────────── */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <Monitor size={24} className="text-blue-700" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-xl mb-2">100% Online Assessment</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                The CNTS 2026 assessment is conducted entirely online — no physical exam centre, no OMR sheet, no travel required.
                Candidates appear from home on any modern device with a stable internet connection.
              </p>
            </div>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="grid md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-sm">Devices Supported</h4>
              <p>Desktop, laptop, tablet, or smartphone. Use the latest version of Chrome, Safari, Firefox, or Edge.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-sm">Connection Required</h4>
              <p>Stable internet connection (minimum 1 Mbps). Keep your device fully charged or plugged into power.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-sm">Session Recovery</h4>
              <p>If your connection drops, your progress is cached. Log back in from the same browser to resume — timer continues.</p>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="text-center space-y-6 py-4">
          <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
            Ready to Register?
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Founding Edition registration is open for Classes 5–8 at just ₹99.
            Slots are limited to 500 candidates.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <RegisterCTA
              unauthenticatedText="Register Now – ₹99"
              rightIcon={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group"
            />
            <Link
              href="/exam-instructions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold transition-all"
            >
              Exam Instructions
            </Link>
          </div>
        </section>

      </main>

      <NeedHelp />
      <Footer />
    </div>
  );
}
