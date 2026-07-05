import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Brain, 
  Calculator, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Unlock,
  Layers,
  Award,
  BookMarked,
  Printer
} from "lucide-react";

export const metadata: Metadata = {
  title: "CNTS Learning Academy | Official Cognitive Preparation Portal",
  description: "Bilingual prep classes, mock tests, and cognitive skill paths in Reasoning, Mathematics, and Language Skills for Classes 5–8.",
  alternates: {
    canonical: "https://thecouragelibrary.com/academy",
  }
};

export default function AcademyPage() {
  const subjects = [
    {
      id: "reasoning",
      title: "Reasoning Academy",
      subtitle: "Classes 5–8 Level",
      description: "Master verbal analogies, logical classification, coding patterns, spatial geometry, and complex puzzle matrix arrangements.",
      icon: Brain,
      active: true,
      href: "/academy/reasoning",
      accent: "blue" as const,
      badge: "Active Module",
      curriculum: ["12 Chapters", "Active Recall Flashcards", "Mistake Lab", "Bilingual Worksheets"]
    },
    {
      id: "mathematics",
      title: "Mathematics Academy",
      subtitle: "Classes 5–8 Level",
      description: "Develop applied mathematical logic, coordinate puzzles, algebraic equations, LCM intervals, and graphical data analysis.",
      icon: Calculator,
      active: true,
      href: "/academy/mathematics",
      accent: "blue" as const,
      badge: "Active Module",
      curriculum: ["Applied Math Puzzles", "Coordinate Geometry", "Equation Balancing", "Speed Shortcuts"]
    },
    {
      id: "language",
      title: "Language Skills",
      subtitle: "Classes 5–8 Level",
      description: "Improve vocabulary classification, structural grammar rules, subject-verb agreement patterns, and advanced reading comprehensions.",
      icon: BookOpen,
      active: true,
      href: "/academy/language",
      accent: "blue" as const,
      badge: "Active Module",
      curriculum: ["Word Analogies", "Syntax Logic", "Comprehension Drills", "Bilingual Grammar Guides"]
    },
    {
      id: "critical",
      title: "Critical Thinking",
      subtitle: "Classes 5–8 Level",
      description: "Learn to evaluate logic statements, analyze arguments, identify syllogism patterns, and establish cause-effect relationships.",
      icon: Sparkles,
      active: true,
      href: "/academy/critical",
      accent: "blue" as const,
      badge: "Active Module",
      curriculum: ["Syllogisms & Truth Tables", "Argument Fallacies", "Data Sufficiency", "Analytical Grids"]
    }
  ];

  const pillars = [
    {
      icon: Layers,
      title: "Bilingual Instruction (द्विभाषी)",
      desc: "All concept summaries, flashcard modules, and practice worksheets are translated side-by-side in English & Hindi for national talent exams."
    },
    {
      icon: Award,
      title: "Adaptive Practice (Mistake Lab)",
      desc: "Get instant hints, try alternative examples, and log errors to the Mistake Lab to retry challenging questions until mastery is achieved."
    },
    {
      icon: BookMarked,
      title: "Cognitive Insight Heatmap",
      desc: "Diagnostics trace performance across verbal, numerical, spatial, and analytical logic to locate and resolve child learning barriers."
    },
    {
      icon: Printer,
      title: "Printable School Workbooks",
      desc: "Download full-length offline worksheets designed with letter helper grids, drawing sketchpads, and structured student credentials."
    }
  ];

  // Premium design tokens mapping based on card accent color
  const accentClasses = {
    blue: {
      outer: "bg-blue-50/70 border-blue-100/60",
      inner: "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xs",
      tag: "bg-blue-50/50 border-blue-100/40 text-blue-700",
      glow: "bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400"
    },
    amber: {
      outer: "bg-amber-50/40 border-amber-100/50",
      inner: "bg-gradient-to-br from-amber-500/80 to-orange-600/80 text-white opacity-80",
      tag: "bg-amber-50/30 border-amber-100/30 text-amber-600/85",
      glow: "bg-gradient-to-r from-amber-400 to-orange-500"
    },
    emerald: {
      outer: "bg-emerald-50/40 border-emerald-100/50",
      inner: "bg-gradient-to-br from-emerald-500/80 to-teal-600/80 text-white opacity-80",
      tag: "bg-emerald-50/30 border-emerald-100/30 text-emerald-600/85",
      glow: "bg-gradient-to-r from-emerald-400 to-teal-500"
    },
    purple: {
      outer: "bg-purple-50/40 border-purple-100/50",
      inner: "bg-gradient-to-br from-purple-500/80 to-pink-600/80 text-white opacity-80",
      tag: "bg-purple-50/30 border-purple-100/30 text-purple-650/85",
      glow: "bg-gradient-to-r from-purple-400 to-pink-500"
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF] mesh-bg flex flex-col justify-between overflow-x-hidden">
      <Navbar />
      
      {/* Hero Header Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 px-4 max-w-7xl mx-auto w-full text-center">
        {/* Glow Backdrops */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-400/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-50/80 border border-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider shadow-inner">
          <Sparkles size={12} className="text-blue-650 animate-pulse" />
          Bilingual Learning Platform
        </span>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 mt-6 max-w-4xl mx-auto leading-[1.1] tracking-tight">
          CNTS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-500">Learning Academy</span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed font-medium">
          Step-by-step interactive paths designed to build logical thinking, conceptual mastery, and diagnostic clarity for national competitive talent assessments.
        </p>
      </section>

      {/* Subjects Cards Grid Section */}
      <section className="px-4 max-w-7xl mx-auto w-full pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {subjects.map(sub => {
            const Icon = sub.icon;
            const styles = accentClasses[sub.accent];
            return (
              <div 
                key={sub.id} 
                className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-350 relative overflow-hidden group ${
                  sub.active 
                    ? "bg-white border-slate-100/90 hover:border-blue-200/80 hover:shadow-[0_20px_50px_rgba(30,64,175,0.06)] hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/[0.07] hover:to-blue-50/15" 
                    : "bg-white/70 backdrop-blur-[1px] border-slate-100/60 shadow-xs opacity-75 grayscale-[15%] transition-all duration-300 hover:opacity-85 hover:border-slate-200"
                }`}
              >
                {/* Glow border line for active module */}
                {sub.active && (
                  <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400" />
                )}

                {/* Faded watermark icon in card background */}
                <div className={`absolute -bottom-8 -right-8 transition-all duration-500 pointer-events-none ${
                  sub.active 
                    ? "text-slate-900/[0.02] group-hover:text-blue-900/[0.05] group-hover:scale-105" 
                    : "text-slate-900/[0.01]"
                }`}>
                  <Icon size={140} />
                </div>

                <div>
                  <div className="flex justify-between items-start">
                    {/* Double-layer premium nested icon container */}
                    <div className={`p-2 rounded-2xl border flex items-center justify-center shrink-0 ${
                      sub.active ? styles.outer : "bg-slate-50/80 border-slate-150/40"
                    }`}>
                      <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                        sub.active ? styles.inner : "bg-slate-200 text-slate-400"
                      }`}>
                        <Icon size={24} />
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                      sub.active 
                        ? "bg-emerald-50/60 border-emerald-100 text-emerald-700 font-bold animate-pulse-slow" 
                        : "bg-slate-50 border-slate-100 text-slate-450"
                    }`}>
                      {sub.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />}
                      {sub.badge}
                    </span>
                  </div>

                  {/* Text Details */}
                  <h3 className="text-xl sm:text-2xl font-black font-display text-slate-800 mt-6 group-hover:text-slate-900 transition-colors">
                    {sub.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-1">
                    {sub.subtitle}
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm mt-4 leading-relaxed font-medium">
                    {sub.description}
                  </p>

                  {/* Curriculum list */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {sub.curriculum.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                          sub.active 
                            ? styles.tag 
                            : "bg-slate-50/60 border-slate-200/40 text-slate-500/80"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Footer action link - Overhauled to full-width button deck */}
                <div className="mt-8 pt-4 border-t border-slate-50">
                  {sub.active ? (
                    <Link 
                      href={sub.href}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-700 via-indigo-650 to-indigo-800 text-white rounded-2xl flex items-center justify-between font-black text-xs sm:text-sm shadow-md hover:shadow-lg hover:from-blue-800 hover:to-indigo-900 hover:scale-[1.01] hover:ring-4 hover:ring-blue-100 transition-all duration-300 group/btn"
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={14} className="text-blue-200 animate-pulse" />
                        Enter {sub.title}
                      </span>
                      <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  ) : (
                    <div className="w-full py-3.5 px-5 bg-slate-50/50 border border-slate-150 text-slate-400/80 rounded-2xl flex items-center justify-between font-bold text-xs sm:text-sm select-none">
                      <span className="flex items-center gap-1.5">
                        <Lock size={14} className="text-slate-400" />
                        Launches Soon
                      </span>
                      <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Locked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pillars / Features overview Section */}
      <section className="px-4 max-w-7xl mx-auto w-full pb-28 border-t border-slate-100 pt-20 sm:pt-24 relative">
        {/* Soft decorative radial gradient to add modern depth */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-450/5 to-indigo-450/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-16 sm:mb-20 relative z-10">
          <span className="px-3.5 py-1.5 bg-blue-50/80 border border-blue-100/70 text-blue-800 text-[10px] font-black rounded-full uppercase tracking-widest shadow-xs">
            Preparation Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-800 mt-5 leading-tight">
            How The CNTS Academy Works
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-3.5 max-w-lg mx-auto leading-relaxed font-semibold">
            Our prep engine goes beyond memory recall to measure and build actual cognitive capability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
          {pillars.map((pillar, idx) => {
            const PillarIcon = pillar.icon;
            return (
              <div 
                key={idx} 
                className="bg-gradient-to-b from-white to-slate-50/20 rounded-3xl border border-slate-100/90 p-7 flex flex-col justify-start gap-5 hover:border-blue-200/70 hover:shadow-[0_22px_45px_rgba(30,64,175,0.06)] hover:-translate-y-1.5 transition-all duration-350 relative overflow-hidden group"
              >
                {/* Glowing top line strip on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-350" />

                {/* Faded watermark icon in background */}
                <div className="absolute -bottom-6 -right-6 text-slate-900/[0.01] group-hover:text-blue-900/[0.035] group-hover:scale-110 transition-all duration-500 pointer-events-none">
                  <PillarIcon size={90} />
                </div>

                {/* Animated icon container */}
                <div className="p-3 rounded-2xl bg-blue-50/70 text-blue-700 border border-blue-100/40 w-fit group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-650 group-hover:text-white group-hover:scale-105 group-hover:shadow-md group-hover:shadow-blue-500/10 transition-all duration-350">
                  <PillarIcon size={20} className="transition-transform duration-350" />
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-black text-slate-800 text-base leading-snug group-hover:text-blue-950 transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed font-semibold group-hover:text-slate-600 transition-colors">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
