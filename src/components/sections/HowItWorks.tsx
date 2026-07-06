"use client";

import { useState } from "react";
import { 
  UserPlus, 
  BookOpen, 
  ClipboardList, 
  BarChart2, 
  Award, 
  ArrowRight, 
  Check, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { RegisterCTA } from "@/components/shared/RegisterCTA";

interface StepDetail {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  stepNum: string;
  title: string;
  shortDesc: string;
  longTitle: string;
  longDesc: string;
  bullets: string[];
  ctaText?: string;
  ctaLink?: string;
  isRegisterCta?: boolean;
}

const stepsData: StepDetail[] = [
  {
    icon: UserPlus,
    stepNum: "Step 01",
    title: "Register",
    shortDesc: "Sign up in under 3 minutes",
    longTitle: "Frictionless Candidate Registration",
    longDesc: "Enrolling your child takes less than three minutes. The process is completely streamlined and optimized for mobile devices.",
    bullets: [
      "Quick parent-candidate form signup",
      "Select Class 5 to 8 category",
      "Bilingual medium options (EN/HN)",
      "Instant WhatsApp ID card generation"
    ],
    ctaText: "Begin Registration",
    isRegisterCta: true
  },
  {
    icon: BookOpen,
    stepNum: "Step 02",
    title: "Prepare",
    shortDesc: "Interactive Academy",
    longTitle: "Interactive Learning Academy",
    longDesc: "Registered candidates receive immediate, unlimited access to our preparation portal designed to build conceptual reasoning.",
    bullets: [
      "Bilingual lessons in all domains",
      "Cognitive reasoning flashcard drills",
      "Step-by-step logic explanations",
      "Bite-sized prep sets (no coaching needed)"
    ],
    ctaText: "Explore Academy",
    ctaLink: "/academy"
  },
  {
    icon: ClipboardList,
    stepNum: "Step 03",
    title: "Appear",
    shortDesc: "Take the online test from home",
    longTitle: "100% Online Cognitive Assessment",
    longDesc: "Candidates attempt the diagnostic test from home during their scheduled slot under standard self-evaluation guidelines.",
    bullets: [
      "Classes 5-6: 60 Qs / 75 Mins",
      "Classes 7-8: 80 Qs / 90 Mins",
      "Camera-free (zero stress setup)",
      "Progress auto-save protections"
    ],
    ctaText: "Exam Instructions",
    ctaLink: "/exam-instructions"
  },
  {
    icon: BarChart2,
    stepNum: "Step 04",
    title: "Discover",
    shortDesc: "Get your Talent Profile",
    longTitle: "Multi-Dimensional Talent Profiling",
    longDesc: "In 21 days, receive a detailed brain strength report mapping core cognitive, spatial, and analytical parameters.",
    bullets: [
      "Scores across 4 cognitive domains",
      "Identification of key learning style",
      "National percentile & class metrics",
      "Custom growth path recommendations"
    ],
    ctaText: "View Sample Report",
    ctaLink: "/sample-report"
  },
  {
    icon: Award,
    stepNum: "Step 05",
    title: "Shine",
    shortDesc: "Certificates & medals",
    longTitle: "National Rankings & Credentials",
    longDesc: "Celebrate candidate milestones with verifiable academic credentials and physical awards mailed to toppers.",
    bullets: [
      "Cryptographically secure certificate QR",
      "Physical gold/silver/bronze medals",
      "National percentile standings list",
      "Verified entry in registry archives"
    ],
    ctaText: "Awards & Prizes",
    ctaLink: "/prizes"
  }
];

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const active = stepsData[currentStep];
  const ActiveIcon = active.icon;

  const handleStepChange = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= stepsData.length) return;
    setDirection(nextIndex > currentStep ? "right" : "left");
    setCurrentStep(nextIndex);
  };

  const handleNext = () => {
    if (currentStep < stepsData.length - 1) {
      handleStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  return (
    <section id="how-it-works" className="py-10 md:py-14 lg:py-16 bg-[#F6F9FF] relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16 space-y-4">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/50">
            How It Works
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Simple steps.
            <br />
            <span className="gradient-text">Complete roadmap.</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            From registration to national ranks, explore your candidate&apos;s developmental roadmap.
          </p>
        </div>

        {/* Premium Gamified Booklet Container */}
        <div className="space-y-4 md:space-y-6">
          
          {/* Step Selector Hub */}
          <div className="relative bg-white/80 backdrop-blur border border-slate-200/60 pt-5 pb-5 md:pb-8 px-4 md:px-5 rounded-3xl shadow-sm max-w-xl mx-auto">
            <div className="absolute left-[36px] right-[36px] top-[44px] -translate-y-1/2 h-0.5 bg-slate-100 z-0" />
            <div 
              className="absolute left-[36px] top-[44px] -translate-y-1/2 h-0.5 bg-blue-800 transition-all duration-300 z-0"
              style={{ width: `${(currentStep / (stepsData.length - 1)) * 100}%` }}
            />

            <div className="relative flex justify-between items-center z-10">
              {stepsData.map((s, idx) => {
                const StepIcon = s.icon;
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;

                return (
                  <button
                    key={s.stepNum}
                    onClick={() => handleStepChange(idx)}
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 cursor-pointer relative group ${
                      isActive
                        ? "bg-blue-800 border-blue-800 text-white shadow-lg shadow-blue-800/25 scale-110"
                        : isCompleted
                        ? "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100/60"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-350 hover:text-slate-655"
                    }`}
                  >
                    <StepIcon size={16} className={isActive ? "scale-110" : ""} />
                    <span className="absolute -bottom-6 text-[8px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors hidden md:block">
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Card Console */}
          <div className="relative flex items-center gap-4">
            
            {/* Left Control Arrow */}
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="hidden md:flex w-12 h-12 rounded-2xl border border-slate-200 bg-white items-center justify-center text-slate-400 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:border-slate-350 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
              aria-label="Previous step"
            >
              <ChevronLeft size={20} className="stroke-[2.5]" />
            </button>

            {/* Premium Slate Card */}
            <div 
              className="flex-1 bg-slate-900 border border-slate-800/80 p-5 md:p-10 shadow-xl rounded-3xl md:rounded-[32px] flex flex-col justify-between min-h-[400px] relative overflow-hidden text-white"
            >
              {/* Radial gradient background highlights */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Inner transitioning container */}
              <div 
                key={currentStep}
                className={`flex-1 flex flex-col justify-between h-full w-full ${
                  direction === "right" ? "animate-content-slide-right" : "animate-content-slide-left"
                }`}
              >
                <div className="space-y-8">
                  {/* Header */}
                  <div className="pb-5 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                          <ActiveIcon size={20} className="md:w-[22px] md:h-[22px]" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                          {active.stepNum} · ONBOARDING
                        </span>
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 font-mono bg-white/5 border border-white/10 px-3 py-1 md:px-3.5 md:py-1.5 rounded-lg md:rounded-xl">
                        {currentStep + 1} / {stepsData.length}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white text-xl md:text-2xl leading-tight">
                      {active.longTitle}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                    {active.longDesc}
                  </p>

                  {/* Features Grid */}
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Key Points Included:</h4>
                    <div className="grid sm:grid-cols-2 gap-3.5">
                      {active.bullets.map((bullet, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex gap-3 items-center hover:bg-white/[0.05] hover:border-white/10 transition-colors"
                        >
                          <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center shrink-0">
                            <Check size={11} className="text-blue-400 stroke-[3]" />
                          </div>
                          <span className="text-xs text-slate-200 font-medium leading-tight">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-8 border-t border-white/5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Mobile controls */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      className="flex md:hidden items-center justify-center px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-xs font-bold shadow-sm disabled:opacity-20 disabled:pointer-events-none cursor-pointer border-none"
                    >
                      <ChevronLeft size={14} className="stroke-[2.5] mr-1" /> Prev
                    </button>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                      {currentStep === stepsData.length - 1 ? "End of Guide" : "Next up: " + stepsData[currentStep + 1].title}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={currentStep === stepsData.length - 1}
                      className="flex md:hidden items-center justify-center px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-xs font-bold shadow-sm disabled:opacity-20 disabled:pointer-events-none cursor-pointer border-none"
                    >
                      Next <ChevronRight size={14} className="stroke-[2.5] ml-1" />
                    </button>
                  </div>

                  {/* Primary CTA */}
                  <div className="shrink-0 w-full sm:w-auto text-right">
                    {active.isRegisterCta ? (
                      <RegisterCTA
                        unauthenticatedText={active.ctaText}
                        rightIcon={<ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 cursor-pointer border-none group w-full sm:w-auto"
                      />
                    ) : active.ctaText && active.ctaLink ? (
                      <Link
                        href={active.ctaLink}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 group w-full sm:w-auto"
                      >
                        {active.ctaText}
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ) : null}
                  </div>

                </div>
              </div>

            </div>

            {/* Right Control Arrow */}
            <button
              onClick={handleNext}
              disabled={currentStep === stepsData.length - 1}
              className="hidden md:flex w-12 h-12 rounded-2xl border border-slate-200 bg-white items-center justify-center text-slate-400 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:border-slate-350 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
              aria-label="Next step"
            >
              <ChevronRight size={20} className="stroke-[2.5]" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
