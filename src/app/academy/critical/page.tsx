"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import { localProgressRepository } from "@/domains/academy/core/repositories/LocalRepository";
import { ProgressService } from "@/domains/academy/core/services/ProgressService";
import { PrerequisiteGraph } from "@/domains/academy/core/PrerequisiteGraph";
import { ContentCMS } from "@/domains/academy/content/ContentCMS";
import { StudentProgress, TopicContent } from "@/domains/academy/core/types";
import { 
  Sparkles,
  Flame, 
  Award, 
  CheckCircle2, 
  Lock, 
  BookMarked,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Users,
  Calendar,
  Globe,
  Target,
  Trophy
} from "lucide-react";

export default function CriticalThinkingHub() {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi">("en");
  const [learningMode, setLearningMode] = useState<"beginner" | "revision" | "challenge" | "parent">("beginner");
  const [isHydrated, setIsHydrated] = useState(false);

  const topics = ContentCMS.getAllTopics().filter(t => t.slug === "syllogisms" || t.slug === "cause-effect" || t.slug === "data-sufficiency" || t.slug === "argument-evaluation");
  const paths = ContentCMS.getLearningPaths("critical");
  const progressService = new ProgressService(localProgressRepository);

  useEffect(() => {
    const fetchProgress = async () => {
      const prog = await localProgressRepository.getProgress();
      setProgress(prog);
      setSelectedLanguage((prog.profile.preferredLanguage as "en" | "hi") || "en");
      setLearningMode(prog.profile.preferredLearningMode || "beginner");
      
      const acc = await progressService.getOverallAccuracy();
      setAccuracy(acc);
      setIsHydrated(true);
    };
    fetchProgress();
  }, []);

  const handleLanguageChange = async (lang: "en" | "hi") => {
    setSelectedLanguage(lang);
    await progressService.setPreferredLanguage(lang);
    const updated = await localProgressRepository.getProgress();
    setProgress(updated);
  };

  const handleModeChange = async (mode: "beginner" | "revision" | "challenge" | "parent") => {
    setLearningMode(mode);
    await progressService.setLearningMode(mode);
    const updated = await localProgressRepository.getProgress();
    setProgress(updated);
  };

  const renderParentHeatmap = () => {
    if (!progress) return null;
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl sm:text-2xl font-black font-display text-slate-800 mb-2">
          {selectedLanguage === "en" ? "For Parents: Cognitive Insight Heatmap" : "माता-पिता के लिए: संज्ञानात्मक समझ हीटमैप"}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
          School exams focus on memory recall, but CNTS measures core cognitive ability. Here is a diagnostic breakdown of your child's thinking strengths based on quiz attempts:
        </p>

        {/* Heatmap progress visualizer */}
        <div className="space-y-4">
          {[
            { title: "Formal Deductive Logic", desc: "Syllogisms, truth tables, Venn boundaries", key: "Verbal" },
            { title: "Information Sufficiency", desc: "Data sufficiency, clue checking", key: "Numerical" },
            { title: "Causal Evaluation", desc: "Cause-effect relationships, event sequencing", key: "Spatial" },
            { title: "Argument Analysis", desc: "Strong-weak argument evaluations, fallacies", key: "Analytical" }
          ].map(skill => {
            const xp = progress.skillsXP?.[skill.key] || 0;
            
            let levelText = "No Practice";
            let filledCount = 0;
            if (xp > 150) {
              levelText = "Outstanding";
              filledCount = 5;
            } else if (xp > 80) {
              levelText = "Excellent";
              filledCount = 4;
            } else if (xp > 30) {
              levelText = "Proficient";
              filledCount = 3;
            } else if (xp > 0) {
              levelText = "Needs Practice";
              filledCount = 1;
            }

            return (
              <div key={skill.key} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 pb-4 last:pb-0 last:border-b-0 gap-3">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-800 leading-tight">{skill.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{skill.desc}</p>
                </div>

                <div className="flex items-center gap-3.5 mt-1 sm:mt-0">
                  {/* High fidelity progress dots */}
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-2.5 h-2.5 rounded-full ${
                          i < filledCount 
                            ? skill.key === "Verbal" ? "bg-blue-800 animate-pulse" : "bg-blue-800"
                            : "bg-slate-100"
                        }`} 
                      />
                    ))}
                  </div>
                  
                  <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                    levelText === "Outstanding" 
                      ? "bg-amber-50 text-amber-700 border border-amber-200" 
                      : levelText === "Excellent" 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : levelText === "Proficient" 
                      ? "bg-blue-50 text-blue-700 border border-blue-100" 
                      : "bg-slate-50 text-slate-500 border border-slate-100"
                  }`}>
                    {levelText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isHydrated || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate stats
  const completedCount = progress.completedTopics.length;
  const totalTopics = topics.length;
  const streakCount = progress.profile.streak;
  const totalXP = progress.profile.totalXP;

  // Find next recommended lesson
  const recommendedTopic = topics.find(t => {
    const isCompleted = progress.completedTopics.includes(t.slug);
    const isUnlocked = PrerequisiteGraph.isUnlocked(t.slug, progress.completedTopics);
    return !isCompleted && isUnlocked;
  }) || topics.find(t => !progress.completedTopics.includes(t.slug));

  return (
    <main className="min-h-screen bg-[#F8FAFF] flex flex-col justify-between mesh-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 pt-32 lg:pt-36 pb-12 flex-grow">
        {/* Top Profile Header */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 animate-slide-up">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-800">
                {selectedLanguage === "en" ? "Good Evening, Explorer" : "नमस्ते, अन्वेषक"}
              </h2>
              <span className="bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                Class 5–8 Level
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-2">
              {selectedLanguage === "en" 
                ? "Track your progress, unlock topics, and build logical skills." 
                : "अपनी प्रगति ट्रैक करें, विषयों को अनलॉक करें और तार्किक कौशल का निर्माण करें।"}
            </p>
          </div>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full lg:w-auto">
            {/* XP Badge */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 sm:p-4 flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-xl bg-blue-100 text-blue-800 shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">XP Earned</p>
                <p className="text-sm sm:text-lg font-black text-slate-800 truncate">{totalXP} XP</p>
              </div>
            </div>

            {/* Streak Badge */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 sm:p-4 flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-xl bg-orange-100 text-orange-600 shrink-0">
                <Flame size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Day Streak</p>
                <p className="text-sm sm:text-lg font-black text-slate-800 truncate">{streakCount} Days</p>
              </div>
            </div>

            {/* Accuracy Badge */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 sm:p-4 flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <TrendingUp size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Accuracy</p>
                <p className="text-sm sm:text-lg font-black text-slate-800 truncate">{accuracy}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Controls Panel */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {/* Language Selector */}
          <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 flex items-center justify-between sm:justify-start gap-4">
            <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5 shrink-0">
              <Globe size={14} /> Language
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => handleLanguageChange("en")}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedLanguage === "en" ? "bg-blue-800 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                English
              </button>
              <button 
                onClick={() => handleLanguageChange("hi")}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedLanguage === "hi" ? "bg-blue-800 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Learning Mode Selector */}
          <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 flex items-center justify-between sm:justify-start gap-4 overflow-x-auto">
            <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5 shrink-0">
              <UserCheck size={14} /> Mode
            </span>
            <div className="flex gap-1 shrink-0">
              {(["beginner", "revision", "challenge", "parent"] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                    learningMode === mode ? "bg-indigo-800 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Left Column: Learning Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. BEGINNER MODE: Next Recommended Lesson Banner */}
            {learningMode === "beginner" && recommendedTopic && (
              <div className="bg-blue-55 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 animate-fade-in shadow-xs">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-md uppercase tracking-wider">
                    <Target size={10} /> {selectedLanguage === "en" ? "Next Recommended Step" : "अनुशंसित अगला कदम"}
                  </span>
                  <h4 className="font-extrabold text-base text-slate-800 mt-3 leading-tight">
                    {recommendedTopic.title[selectedLanguage]}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {selectedLanguage === "en" 
                      ? "Continue your cognitive journey. Unlocks the next critical milestones." 
                      : "अपनी संज्ञानात्मक यात्रा जारी रखें। अगले तार्किक मील के पत्थर को अनलॉक करें।"}
                  </p>
                </div>
                <Link
                  href={`/academy/critical/${recommendedTopic.slug}/learn`}
                  className="w-full sm:w-auto px-5 py-3 bg-blue-800 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center shrink-0 active:scale-95"
                >
                  {selectedLanguage === "en" ? "Start Lesson" : "पाठ शुरू करें"}
                </Link>
              </div>
            )}

            {/* 2. REVISION MODE: Global Revision Toolkit */}
            {learningMode === "revision" && (
              <div className="bg-violet-50/50 border border-violet-100 rounded-3xl p-6 sm:p-8 space-y-4 animate-fade-in shadow-xs">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-violet-100 text-violet-850 text-[10px] font-black rounded-md uppercase tracking-wider">
                    <Sparkles size={10} /> Quick Revision Hub
                  </span>
                  <h4 className="font-extrabold text-base text-slate-800 mt-3 leading-tight">
                    {selectedLanguage === "en" ? "Global Revision Shortcuts" : "क्विक रिवीजन शॉर्टकट्स"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Access cheatsheets and fast tricks templates for actively unlocked topics:
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link 
                    href="/academy/critical/alphabet-series/tricks"
                    className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 flex justify-between items-center transition-colors"
                  >
                    <span>Alphabet EJOTY Rank Tables</span>
                    <ArrowRight size={14} className="text-slate-400" />
                  </Link>
                  <Link 
                    href="/academy/critical/number-series/tricks"
                    className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 flex justify-between items-center transition-colors"
                  >
                    <span>Perfect Squares & Cubes Grid</span>
                    <ArrowRight size={14} className="text-slate-400" />
                  </Link>
                </div>
              </div>
            )}

            {/* 3. CHALLENGE MODE: Scoreboard Focus Tag */}
            {learningMode === "challenge" && (
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 sm:p-8 flex items-center gap-4 animate-fade-in shadow-xs">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl shrink-0 flex items-center justify-center">
                  <Trophy size={24} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-850 text-sm leading-tight">Challenge Mode Active</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Topic entries below now redirect directly to **Practice Quizzes**. Complete Olympiad challenges to earn merit badge tokens.
                  </p>
                </div>
              </div>
            )}

            {/* 4. PARENT MODE: Pull diagnostic heatmap and checklist to the TOP */}
            {learningMode === "parent" && (
              <div className="space-y-6 animate-fade-in">
                {/* Heatmap pulled from bottom */}
                {renderParentHeatmap()}

                {/* Parent-Child Activity Planner checklist */}
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h4 className="font-extrabold text-emerald-950 text-sm uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Users size={16} className="text-emerald-700" />
                    Parent-Child Activity Planner
                  </h4>
                  <p className="text-slate-500 text-xs mb-4">
                    Auditing child learning? Spend 5 minutes playing these quick verbal games at home tonight:
                  </p>
                  <div className="space-y-3">
                    {topics
                      .filter(t => PrerequisiteGraph.isUnlocked(t.slug, progress.completedTopics) && !progress.completedTopics.includes(t.slug))
                      .slice(0, 2)
                      .map(t => {
                        const noteBlock = t.blocks.find(b => b.type === "parent-note");
                        const homeActivity = (noteBlock?.metadata as any)?.homeActivity?.[selectedLanguage] || "Practice classification sorting together.";
                        return (
                          <div key={t.slug} className="p-3.5 bg-white rounded-xl border border-slate-100 flex gap-3 text-xs font-semibold text-slate-700">
                            <span className="text-base shrink-0">🏡</span>
                            <div>
                              <strong className="text-slate-800">{t.title[selectedLanguage]}:</strong>
                              <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{homeActivity}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* LEARNING PATH ROADMAP CARD */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-black font-display text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles className="text-blue-800" size={22} />
                {selectedLanguage === "en" ? "Learning Path Roadmap" : "लर्निंग पाथ रोडमैप"}
                {learningMode === "parent" && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Audit View
                  </span>
                )}
              </h3>

              {/* Loop through paths */}
              {paths.map((path, pIdx) => (
                <div key={path.id} className="relative pl-6 border-l-2 border-dashed border-slate-200 pb-6 last:pb-0 last:border-l-0">
                  {/* Path Title Badge dot */}
                  <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />
                  
                  <div className="mb-4">
                    <h4 className="text-base sm:text-lg font-black text-slate-800 leading-tight">{path.title[selectedLanguage]}</h4>
                    <p className="text-xs text-slate-500 mt-1">{path.description[selectedLanguage]}</p>
                  </div>

                  {/* Topics in Path */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {path.topics.map(slug => {
                      const topic = topics.find(t => t.slug === slug);
                      if (!topic) return null;

                      const isCompleted = progress.completedTopics.includes(slug);
                      const isUnlocked = PrerequisiteGraph.isUnlocked(slug, progress.completedTopics);

                      // Redirect URL dynamically based on learning mode preference
                      const linkHref = learningMode === "revision" 
                        ? `/academy/critical/${slug}/worksheet` 
                        : learningMode === "challenge" 
                        ? `/academy/critical/${slug}/practice` 
                        : `/academy/critical/${slug}/learn`;

                      return (
                        <div 
                          key={slug}
                          className={`rounded-2xl border p-4 sm:p-5 flex items-start justify-between transition-all ${
                            isCompleted 
                              ? "bg-emerald-50/40 border-emerald-100" 
                              : isUnlocked 
                              ? learningMode === "challenge" 
                                ? "bg-amber-50/10 border-amber-200 hover:border-amber-400"
                                : "bg-white hover:bg-slate-50/50 border-slate-100 hover:border-blue-200" 
                              : "bg-slate-50/80 border-slate-100 opacity-60 pointer-events-none"
                          }`}
                        >
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                              {topic.category}
                            </span>
                            <h5 className="font-bold text-slate-800 leading-tight">
                              {topic.title[selectedLanguage]}
                            </h5>
                            <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-2.5 ${
                              topic.difficulty === "Foundation" 
                                ? "bg-blue-50 text-blue-700" 
                                : "bg-indigo-50 text-indigo-700"
                            }`}>
                              {topic.difficulty}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <div className="text-emerald-600 p-1">
                                <CheckCircle2 size={20} fill="#ECFDF5" />
                              </div>
                            ) : isUnlocked ? (
                              <Link 
                                href={linkHref}
                                className={`p-2 rounded-xl transition-colors ${
                                  learningMode === "challenge" 
                                    ? "bg-amber-150 text-amber-900 hover:bg-amber-200" 
                                    : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                                }`}
                              >
                                <ArrowRight size={14} />
                              </Link>
                            ) : (
                              <div className="text-slate-400 p-2">
                                <Lock size={14} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Parent insight report (only shown here in non-parent modes) */}
            {learningMode !== "parent" && renderParentHeatmap()}
          </div>

          {/* Right Column: Achievements, Today's Challenge, CTA */}
          <div className="space-y-6">
            
            {/* Bookmarks Section */}
            {progress.bookmarks && progress.bookmarks.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-black font-display text-slate-800 mb-4 flex items-center gap-2">
                  <BookMarked className="text-blue-800" size={18} />
                  Saved Topics
                </h3>
                <div className="space-y-2.5">
                  {progress.bookmarks.map(slug => {
                    const topic = topics.find(t => t.slug === slug);
                    if (!topic) return null;
                    return (
                      <Link 
                        key={slug} 
                        href={`/academy/critical/${slug}/learn`}
                        className="flex justify-between items-center p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-sm font-bold text-slate-700">{topic.title[selectedLanguage]}</span>
                        <ArrowRight size={14} className="text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Daily challenge card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
              
              <span className="px-2.5 py-1 bg-indigo-855 border border-indigo-700/50 text-indigo-200 text-[9px] font-bold rounded-full uppercase tracking-wider block w-fit">
                Daily Practice
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display mt-4">Today's Challenge</h3>
              <p className="text-indigo-200/80 text-xs sm:text-sm mt-2.5 leading-relaxed">
                Test your logic with a daily-changing critical puzzle. No login required.
              </p>
              
              <Link 
                href="/academy/critical/analogy/practice" 
                className="mt-6 inline-flex items-center gap-2 justify-center w-full px-5 py-3.5 bg-white text-indigo-900 font-extrabold text-sm rounded-2xl hover:bg-indigo-50 hover:-translate-y-0.5 transition-all shadow-md"
              >
                Attempt Now
              </Link>
            </div>

            {/* Achievements System Gallery */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black font-display text-slate-800 mb-5 flex items-center gap-2">
                <Award className="text-blue-800" size={20} />
                Unlocked Badges
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "first_step", icon: <Target className="text-blue-800" size={24} />, label: "First Step" },
                  { id: "quest_begun", icon: <Sparkles className="text-amber-600" size={24} />, label: "Quest Begun" },
                  { id: "logic_novice", icon: <Trophy className="text-indigo-800" size={24} />, label: "Logic Novice" }
                ].map(badge => {
                  const isUnlocked = progress.achievements.some(a => a.id === badge.id);
                  return (
                    <div key={badge.id} className="flex flex-col items-center text-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm ${
                        isUnlocked 
                          ? "bg-amber-50 border border-amber-200 scale-100" 
                          : "bg-slate-50 border border-dashed border-slate-200 opacity-40 grayscale"
                      }`}>
                        {badge.icon}
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-500 mt-2 tracking-wide leading-tight">
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Register CTA conversion box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
              <h4 className="font-black text-slate-800 font-display text-base">Ready to challenge your child?</h4>
              <p className="text-[11px] text-slate-500 mt-2 max-w-[220px] leading-relaxed">
                Confirm their true potential. Register them for the official CNTS 2026 assessment.
              </p>
              <RegisterCTA className="btn-primary w-full mt-4 text-xs py-3 rounded-2xl" />
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
