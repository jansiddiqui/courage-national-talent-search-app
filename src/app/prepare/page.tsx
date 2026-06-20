"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import { 
  ArrowLeft, 
  ArrowRight,
  BookOpen, 
  Download, 
  Clock, 
  Award, 
  ChevronRight, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  HelpCircle as QuestionIcon,
  ShieldAlert,
  BrainCircuit,
  MessageSquare,
  Check,
  X,
  Crown,
  Lightbulb,
  Sprout
} from "lucide-react";
import { TOTAL_QUESTIONS, EXAM_DURATION, EXAM_MODE, NEGATIVE_MARKING } from "@/config/exam";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Plan {
  classLevel: string;
  duration: string;
  plan: string[];
}

const studyPlans: Plan[] = [
  {
    classLevel: "Class 5",
    duration: "20 Minutes Daily",
    plan: [
      "5 Mins: Verbal analogies & spelling logic",
      "10 Mins: Mathematical mental math puzzles",
      "5 Mins: Logic patterns & pattern completion"
    ]
  },
  {
    classLevel: "Class 6",
    duration: "25 Minutes Daily",
    plan: [
      "5 Mins: Sentence structuring & contextual vocabulary",
      "12 Mins: Fractional word sums & basic algebra puzzles",
      "8 Mins: Direction test & non-verbal reasoning problems"
    ]
  },
  {
    classLevel: "Class 7",
    duration: "30 Minutes Daily",
    plan: [
      "8 Mins: Critical reading passages & grammatical reasoning",
      "12 Mins: Applied percentages & data charts",
      "10 Mins: Syllogisms & visual relationship matrices"
    ]
  },
  {
    classLevel: "Class 8",
    duration: "35 Minutes Daily",
    plan: [
      "10 Mins: Logical deduction & sentence correction",
      "15 Mins: Probability, equations, and number sequences",
      "10 Mins: Complex spatial rotation & verbal reasoning grids"
    ]
  }
];

interface QuizQuestion {
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    category: "Logical Reasoning",
    question: "If a logical sequence of shapes shows: Triangle (3 sides), Square (4 sides), Pentagon (5 sides)... What is the next shape in the sequence?",
    options: [
      "Hexagon (6 sides)",
      "Octagon (8 sides)",
      "Circle (0 sides)",
      "Heptagon (7 sides)"
    ],
    correctIndex: 0,
    explanation: "The sequence increases the number of sides by 1 at each step: 3, 4, 5, so the next shape must have 6 sides (Hexagon)."
  },
  {
    category: "Arithmetic Series",
    question: "Complete the number pattern: 2, 6, 12, 20, 30, ...? What is the next number in the series?",
    options: [
      "36",
      "40",
      "42",
      "44"
    ],
    correctIndex: 2,
    explanation: "The difference between consecutive terms increases by 2: +4, +6, +8, +10. The next difference should be +12. So, 30 + 12 = 42."
  },
  {
    category: "Analytical Reasoning",
    question: "At exactly 3:15, what is the angle between the hour hand and the minute hand of an analog clock?",
    options: [
      "0°",
      "7.5°",
      "15°",
      "30°"
    ],
    correctIndex: 1,
    explanation: "At 3:15, the minute hand is exactly on the 3 mark. However, the hour hand has moved 15 minutes (1/4 of an hour) towards 4. Since a full hour gap is 30°, the hour hand has moved 30° * 0.25 = 7.5° away from the minute hand."
  }
];

export default function PreparePage() {
  const [activeTab, setActiveTab] = useState<"syllabus" | "pattern" | "plan">("syllabus");
  const [selectedClass, setSelectedClass] = useState<string>("5");
  const [isHydrated, setIsHydrated] = useState(false);

  // Quiz Widget State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectOption = (optIdx: number) => {
    setSelectedOption(optIdx);
    if (optIdx === quizQuestions[currentQuestionIndex].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Syllabus detail structure
  const classSyllabus: Record<string, { subject: string; details: string[] }[]> = {
    "5": [
      { subject: "Logical Reasoning", details: ["Pattern completion", "Odd one out", "Alphabet sequences", "Direction mapping (Basic)"] },
      { subject: "Mathematics", details: ["Mental calculations", "LCM & HCF puzzles", "Basic geometrical coordinates", "Measurement systems"] },
      { subject: "Language & Verbal", details: ["Word analogies", "Antonyms & Synonyms in context", "Spell check puzzles", "Sentence connectors"] },
      { subject: "Critical Thinking", details: ["Sorting structures", "Cause and effect reasoning", "Visual comparisons"] }
    ],
    "6": [
      { subject: "Logical Reasoning", details: ["Series completion", "Analogy codes", "Direction tests", "Venn diagrams (Basic)"] },
      { subject: "Mathematics", details: ["Fraction operations", "Ratio & proportion puzzles", "Data representation & tables", "Angles & shapes"] },
      { subject: "Language & Verbal", details: ["Idiomatic expressions", "Fill in blanks (prepositions/verbs)", "Paragraph ordering", "Fact vs opinion"] },
      { subject: "Critical Thinking", details: ["Grid puzzle solving", "Sequential ordering logic", "Identifying contradictions"] }
    ],
    "7": [
      { subject: "Logical Reasoning", details: ["Coding & Decoding matrix", "Blood relation maps", "Syllogisms (Basic)", "Paper folding visuals"] },
      { subject: "Mathematics", details: ["Simple linear equations", "Percentage application sums", "Averages & unitary puzzles", "Triangles & congruence"] },
      { subject: "Language & Verbal", details: ["Reading comprehension keys", "Subject-verb agreement check", "Conjunction logic", "Sentence completion"] },
      { subject: "Critical Thinking", details: ["Analyzing assumptions", "Evaluating arguments", "Logical deductions"] }
    ],
    "8": [
      { subject: "Logical Reasoning", details: ["Clock and calendar problems", "Mathematical operator logic", "Advanced Venn diagrams", "3D shape rotation"] },
      { subject: "Mathematics", details: ["Probability & permutations basics", "Algebraic factors & equations", "Mensuration & volume ratios", "Simple interest logic"] },
      { subject: "Language & Verbal", details: ["Critical comprehension analysis", "Direct/Indirect speech logic", "Word usage context", "Paragraph summaries"] },
      { subject: "Critical Thinking", details: ["Multivariable grid puzzles", "Assessing statement strength", "Scientific reasoning analogies"] }
    ]
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <Sparkles size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Preparation Portal
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Prepare for <span className="text-blue-400">CNTS Assessment</span>.
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            CNTS does not evaluate rote memorization. Our portal helps students prepare their cognitive analytical dimensions, reasoning patterns, and contextual logic.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-5xl mx-auto py-20 px-6 space-y-12 animate-slide-up">
        
        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
          {[
            { id: "syllabus", label: "Syllabus Checklist" },
            { id: "pattern", label: "Exam Pattern" },
            { id: "plan", label: "Daily Study Plan" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "syllabus" | "pattern" | "plan")}
              className={`pb-3 transition-all cursor-pointer relative ${
                activeTab === tab.id
                  ? "text-blue-800 border-b-2 border-blue-800"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content 1: Syllabus Checklist */}
        {activeTab === "syllabus" && (
          <div className="grid md:grid-cols-4 gap-8 items-start">
            
            {/* Sidebar class selector */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-sm">Select Student Class</h3>
              <div className="flex flex-col gap-2">
                {["5", "6", "7", "8"].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`w-full py-3 px-4 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      selectedClass === cls
                        ? "border-blue-800 bg-blue-50/50 text-blue-850 ring-2 ring-blue-800/10"
                        : "border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50/50"
                    }`}
                  >
                    Class {cls} Syllabus
                  </button>
                ))}
              </div>
            </div>

            {/* Syllabus columns */}
            <div className="md:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-800">
                      Class {selectedClass} Detailed Syllabus
                    </h3>
                    <p className="text-slate-400 text-[11px] mt-0.5">Syllabus is mapped to explore primary reasoning dimensions.</p>
                  </div>
                  <a
                    href={`/sample-papers/class${selectedClass}.pdf`}
                    download={`CNTS_Class${selectedClass}_Sample_Paper.pdf`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Download size={13} />
                    Download Class {selectedClass} Paper
                  </a>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  {classSyllabus[selectedClass]?.map((sub, idx) => (
                    <div key={idx} className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                        <BookOpen size={14} className="text-blue-800" />
                        {sub.subject}
                      </h4>
                      <ul className="space-y-2">
                        {sub.details.map((d, dIdx) => (
                          <li key={dIdx} className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-350 shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab Content 2: Exam Pattern */}
        {activeTab === "pattern" && (
          <div className="grid md:grid-cols-3 gap-8 items-start">
            
            {/* Pattern numbers */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-lg text-slate-800">
                  Assessment Structure
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Questions", value: `${TOTAL_QUESTIONS} MCQs` },
                    { label: "Time Duration", value: EXAM_DURATION },
                    { label: "Assessment Mode", value: EXAM_MODE },
                    { label: "Negative Marking", value: NEGATIVE_MARKING }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        {p.label}
                      </span>
                      <strong className="text-slate-800 font-display font-bold text-base mt-1 block">
                        {p.value}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-display font-bold text-slate-800 text-sm">Subject Weightage (20 Questions each):</h4>
                  <div className="space-y-2">
                    {[
                      { subject: "Verbal Ability & Language Context", percent: "25%" },
                      { subject: "Mathematical & Quant Analysis", percent: "25%" },
                      { subject: "Logical & Inductive Reasoning", percent: "25%" },
                      { subject: "Critical Thinking & Cognitive Aptitude", percent: "25%" }
                    ].map((w, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold">
                        <span className="text-slate-650">{w.subject}</span>
                        <span className="text-blue-800 font-bold">{w.percent}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern advice */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-md border border-slate-950 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
                    <BrainCircuit size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base">Cognitive Discovery</h3>
                    <p className="text-xs text-slate-350 leading-relaxed mt-1">
                      Our assessment is configured to pinpoint your child&apos;s natural affinity toward mathematical sequences, language nuances, or logic patterns. It exposes the hidden dimensions of genius.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 text-xs">
                <h4 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <ShieldAlert size={16} className="text-amber-500" />
                  Assessment Rules
                </h4>
                <ul className="space-y-2.5 text-slate-500 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0 mt-1.5" />
                    <span>Calculators and smart devices are strictly prohibited.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0 mt-1.5" />
                    <span>No camera permissions or webcam are required; the assessment relies on student integrity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0 mt-1.5" />
                    <span>Questions must be attempted sequentially. Once skipped, they cannot be modified.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* Tab Content 3: Daily Study Plan */}
        {activeTab === "plan" && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-8">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-slate-850">
                Recommended Daily Study Plans
              </h3>
              <p className="text-slate-450 text-xs">Recommended micro-preparation intervals to build analytical patterns before exam day.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {studyPlans.map((plan, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4 flex flex-col justify-between hover:border-blue-200 transition-all duration-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                        {plan.classLevel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Clock size={11} /> {plan.duration}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200/50">
                      {plan.plan.map((p, pIdx) => (
                        <div key={pIdx} className="text-xs text-slate-600 leading-normal flex gap-2">
                          <CheckCircle size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Interactive Quiz Widget */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                CNTS Quiz Challenge
              </span>
              <h3 className="font-display font-bold text-lg md:text-xl text-slate-850">
                Try the Interactive Sample Quiz
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Test your logical, arithmetic, and spatial analytics in under 2 minutes.</p>
            </div>
            
            {/* Progress Tracker dots */}
            {!quizCompleted && (
              <div className="flex items-center gap-2">
                {quizQuestions.map((_, qIdx) => (
                  <div key={qIdx} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      currentQuestionIndex === qIdx
                        ? "bg-blue-800 text-white shadow-md shadow-blue-800/20"
                        : qIdx < currentQuestionIndex
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-400"
                    }`}>
                      {qIdx < currentQuestionIndex ? <Check size={14} className="mx-auto mt-1" /> : qIdx + 1}
                    </div>
                    {qIdx < quizQuestions.length - 1 && (
                      <div className={`w-8 h-0.5 transition-all ${
                        qIdx < currentQuestionIndex ? "bg-emerald-200" : "bg-slate-200"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!quizCompleted ? (
            <div className="space-y-6">
              {/* Question */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {quizQuestions[currentQuestionIndex].category}
                </span>
                <h4 className="font-display font-bold text-sm md:text-base text-slate-800 leading-relaxed">
                  {quizQuestions[currentQuestionIndex].question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid sm:grid-cols-2 gap-4">
                {quizQuestions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === quizQuestions[currentQuestionIndex].correctIndex;
                  const isAnswered = selectedOption !== null;

                  let btnClass = "border-slate-200 hover:border-slate-350 bg-white text-slate-700 hover:bg-slate-50";
                  if (isAnswered) {
                    if (isCorrect) {
                      btnClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-sm shadow-emerald-100 ring-2 ring-emerald-500/10";
                    } else if (isSelected) {
                      btnClass = "border-red-500 bg-red-50 text-red-950 font-bold shadow-sm shadow-red-100 ring-2 ring-red-500/10 animate-shake";
                    } else {
                      btnClass = "border-slate-100 bg-slate-50 opacity-60 text-slate-400 cursor-not-allowed";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <span className="text-emerald-600 font-bold flex items-center"><Check size={14} className="mr-1" /> Correct</span>}
                      {isAnswered && isSelected && !isCorrect && <span className="text-red-600 font-bold flex items-center"><X size={14} className="mr-1" /> Incorrect</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Banner */}
              {selectedOption !== null && (
                <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl text-xs text-blue-900 leading-relaxed animate-fade-in">
                  <p className="font-bold text-blue-800 mb-1 flex items-center gap-1.5">
                    <BrainCircuit size={14} />
                    Analytical Explanation:
                  </p>
                  <p>{quizQuestions[currentQuestionIndex].explanation}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  disabled={selectedOption === null}
                  onClick={handleNextQuestion}
                  className={`px-6 h-11 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                    selectedOption === null
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-blue-800 text-white hover:bg-blue-700 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  }`}
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Results / Completion state */
            <div className="py-8 text-center space-y-6 max-w-md mx-auto animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-300/40 animate-bounce">
                <Award size={28} className="text-white" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-display font-bold text-slate-800 text-xl">
                  Challenge Completed!
                </h4>
                <p className="text-slate-500 text-xs">
                  You scored <strong className="text-slate-850">{score} out of {quizQuestions.length}</strong> correct.
                </p>
              </div>

              {/* Badge & profiling results */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-150 rounded-2xl space-y-3">
                <span className="text-[9px] font-bold text-blue-800 uppercase tracking-widest block">
                  CNTS Cognitive Profile
                </span>
                <div className="font-display font-bold text-base text-slate-800">
                  {score === 3 ? <span className="flex items-center gap-1"><Crown size={20} className="text-amber-500" /> Cognitive Champion</span> : score === 2 ? <span className="flex items-center gap-1"><Lightbulb size={20} className="text-amber-500" /> Logical Mind</span> : <span className="flex items-center gap-1"><Sprout size={20} className="text-emerald-500" /> Analytical Starter</span>}
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {score === 3 
                    ? "Outstanding analytical and logical reasoning skills! Your child shows a natural talent for cognitive reasoning and pattern matching."
                    : score === 2
                      ? "Great job! Strong reasoning capabilities with good attention to mathematical and logical sequences."
                      : "Good effort! Practice helps wire logical pathways. Exploring detailed CNTS guides will help unlock full potential."
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleResetQuiz}
                  className="flex-grow h-11 border border-slate-200 hover:border-slate-300 text-slate-650 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Retake Quiz
                </button>
                <RegisterCTA
                  unauthenticatedText="Register for CNTS 2026"
                  rightIcon={<ArrowRight size={13} />}
                  className="flex-grow h-11 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Call to Login / Register */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg shadow-slate-900/10 border border-slate-800">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-display font-bold text-base text-white">Registered Candidate?</h3>
            <p className="text-xs text-slate-400">Log in to download your practice papers instantly from the dashboard.</p>
          </div>
          <div className="flex gap-4 flex-wrap justify-center shrink-0">
            <Link
              href="/login"
              className="px-6 py-3 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              Parent Login
            </Link>
            <RegisterCTA
              unauthenticatedText="Register Candidate"
              className="px-6 py-3 bg-blue-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-850/15 hover:bg-blue-700 cursor-pointer"
            />
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
