import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Sparkles, Brain, Trophy, Star, Shield, ArrowRight } from "lucide-react";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import FounderLetter from "@/components/sections/FounderLetter";
import NeedHelp from "@/components/layout/NeedHelp";

export const metadata: Metadata = {
  title: "About CNTS – Our Talent Discovery Mission",
  description: "Learn about the mission, philosophy, and talent discovery engine behind the Courage National Talent Search (CNTS), powered by Courage Library.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center md:text-left">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
              <Sparkles size={12} className="text-amber-400" />
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                Our Philosophy
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-white tracking-tight">
              Finding the genius <br />
              in <span className="text-blue-400">every single</span> child.
            </h1>
            <p className="text-slate-350 text-sm md:text-base leading-relaxed">
              CNTS is not a race for raw marks. We are a talent discovery engine built to identify cognitive strengths, logical capabilities, and creative intelligence—revealing who your child is, not just what they memorized. <strong>Courage National Talent Search (CNTS) is an official program operated by Courage Library.</strong>
            </p>
          </div>

          <div className="shrink-0 flex justify-center">
            <div className="relative animate-float">
              <div className="w-64 h-64 rounded-[2rem] bg-gradient-to-br from-blue-700 to-indigo-650 flex items-center justify-center border border-white/10 shadow-2xl shadow-blue-900/40">
                <Brain size={110} className="text-blue-200 stroke-[1.25]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3 space-y-6">
          <span className="inline-block text-[10px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Our Mission
          </span>
          <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight leading-tight">
            Moving beyond the limits of marks and rote memory.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            The Indian education system is heavily focused on examination scores. However, a single score card is an incomplete representation of a student&apos;s actual potential. Children are over-examined but under-discovered.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            Our mission is to establish CNTS as a national standard for cognitive diagnostics. By evaluating critical thinking, linguistic aptitude, spatial and mathematical reasoning, and creative problem-solving, we map a child&apos;s natural learning styles and core strengths.
          </p>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center space-y-2">
            <Trophy size={28} className="text-amber-500 mx-auto" />
            <h4 className="font-display font-bold text-slate-800 text-sm">Recognize Aptitude</h4>
            <p className="text-[10px] text-slate-400">Locating logical strengths across major domains.</p>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center space-y-2">
            <Brain size={28} className="text-blue-700 mx-auto" />
            <h4 className="font-display font-bold text-slate-800 text-sm">Map Learning Styles</h4>
            <p className="text-[10px] text-slate-400">Discovering how children absorb information.</p>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center space-y-2 col-span-2">
            <Star size={28} className="text-emerald-600 mx-auto" />
            <h4 className="font-display font-bold text-slate-800 text-sm">Build Future Profiles</h4>
            <p className="text-[10px] text-slate-400">Creating verified, multi-dimensional profiles for future admissions.</p>
          </div>
        </div>
      </section>

      <FounderLetter />

      {/* Talent Discovery Philosophy */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="inline-block text-[10px] font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
              Talent Discovery
            </span>
            <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight">
              CNTS is NOT an Olympiad.
            </h2>
            <p className="text-slate-500 text-sm">
              We focus on mapping aptitude rather than memory.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-800">Traditional Olympiads</h3>
              <ul className="space-y-3 text-xs text-slate-500 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 text-sm shrink-0">✕</span>
                  <span>Rely heavily on prescribed school board syllabus.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 text-sm shrink-0">✕</span>
                  <span>Test memorized formulas, facts, and textbook definitions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 text-sm shrink-0">✕</span>
                  <span>Categorize children into a single raw score and rank.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 text-sm shrink-0">✕</span>
                  <span>Increase academic anxiety and rote study patterns.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-md shadow-blue-50 space-y-4">
              <h3 className="font-display font-bold text-lg text-blue-800 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                The CNTS Philosophy
              </h3>
              <ul className="space-y-3 text-xs text-slate-500 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 text-sm font-bold shrink-0">✓</span>
                  <span>Tests basic cognitive reasoning independent of board syllabus.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 text-sm font-bold shrink-0">✓</span>
                  <span>Focuses on critical thinking, problem-solving, and creative IQ.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 text-sm font-bold shrink-0">✓</span>
                  <span>Outputs a multi-dimensional 6-domain profile with counselor feedback.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 text-sm font-bold shrink-0">✓</span>
                  <span>Encourages cognitive curiosity and maps natural learning styles.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by Courage Library */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <div className="relative">
            <div className="w-full h-72 rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-900 border border-slate-900/50 shadow-2xl p-8 flex flex-col justify-between text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Shield size={24} className="text-blue-350" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-white text-xl">Courage Library</h3>
                <p className="text-xs text-blue-200">A foundation of learning excellence.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <span className="inline-block text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
            Our Foundation
          </span>
          <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight leading-tight">
            Trust. Credibility. Educational Legacy.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            CNTS is powered by Courage Library. For years, we have worked directly with educational institutions, parents, and students to build better libraries, reading curriculums, and diagnostic tools.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            Through CNTS, we combine our deep understanding of cognitive development with modern assessment methodology. We ensure bilingual review, scientific question design, and a reliable testing process that parents and schools trust.
          </p>
        </div>
      </section>

      {/* Need Help block */}
      <NeedHelp />

      {/* Bottom CTA */}
      <section className="py-16 bg-white border-t border-slate-100 text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <h3 className="font-display font-bold text-2xl text-slate-900">
            Discover your child&apos;s genius today.
          </h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Registration takes less than 3 minutes. Secure your child&apos;s national rank and receive their customized Talent Profile.
          </p>
          <RegisterCTA
            unauthenticatedText="Register Candidate"
            rightIcon={<ArrowRight size={16} />}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-800/15 transition-all hover:-translate-y-0.5 cursor-pointer"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
