"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Play,
  ArrowRight,
  BookOpen
} from "lucide-react";

interface Question {
  id: number;
  domain: string;
  question: string;
  options: string[];
  answer: number; // Index of correct option
}

const mockQuestions: Question[] = [
  {
    id: 1,
    domain: "Logical & Pattern Deduction",
    question: "Complete the sequence: 🔴, 🔵, 🔴🔴, 🔵🔵, 🔴🔴🔴, ...",
    options: ["🔵🔵🔵", "🔴🔴🔴🔴", "🔵🔵", "🔴🔴"],
    answer: 0
  },
  {
    id: 2,
    domain: "Quantitative Logic & Mathematics",
    question: "If 3 pencils cost ₹15, how much will 7 pencils cost?",
    options: ["₹30", "₹35", "₹40", "₹25"],
    answer: 1
  },
  {
    id: 3,
    domain: "Verbal & Language Ability",
    question: "Find the odd word out: Book, Pen, Eraser, Plate",
    options: ["Book", "Pen", "Eraser", "Plate"],
    answer: 3
  },
  {
    id: 4,
    domain: "Logical & Pattern Deduction",
    question: "Light is to Candle as Heat is to ...",
    options: ["Ice", "Fire", "Dark", "Cold"],
    answer: 1
  },
  {
    id: 5,
    domain: "Quantitative Logic & Mathematics",
    question: "Find the next number in the pattern: 2, 5, 9, 14, 20, ...",
    options: ["25", "26", "27", "28"],
    answer: 2
  },
  {
    id: 6,
    domain: "Logical & Pattern Deduction",
    question: "If RED is coded as 18-5-4 (based on alphabet positions), how is BLUE coded?",
    options: ["2-12-21-5", "2-21-12-5", "1-12-21-5", "2-12-21-6"],
    answer: 0
  },
  {
    id: 7,
    domain: "General Awareness & Critical Logic",
    question: "Why do we see lightning before we hear thunder?",
    options: [
      "Light travels faster than sound", 
      "Sound travels faster than light", 
      "Thunder occurs later", 
      "Clouds block sound"
    ],
    answer: 0
  },
  {
    id: 8,
    domain: "Verbal & Language Ability",
    question: "Choose the word that best completes the sentence: The researcher was ______ by the results because they contradicted his hypothesis.",
    options: ["delighted", "surprised", "indifferent", "bored"],
    answer: 1
  },
  {
    id: 9,
    domain: "Logical & Pattern Deduction",
    question: "A doctor gives you 3 pills and tells you to take one every half hour. How long will the pills last?",
    options: ["1.5 Hours", "1 Hour", "2 Hours", "30 Minutes"],
    answer: 1
  },
  {
    id: 10,
    domain: "General Awareness & Critical Logic",
    question: "Plants absorb water from the soil primarily through their:",
    options: ["Leaves", "Stems", "Roots", "Flowers"],
    answer: 2
  }
];

export default function MockExamPage() {
  const [examStarted, setExamStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer loop
  useEffect(() => {
    if (!examStarted || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, submitted, timeLeft]);

  // Auto-submit on timer end
  useEffect(() => {
    if (timeLeft === 0 && examStarted && !submitted) {
      submitExam();
    }
  }, [timeLeft, examStarted, submitted]);

  const handleSelectOption = (qId: number, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const submitExam = () => {
    setSubmitted(true);
    let calculatedScore = 0;
    mockQuestions.forEach(q => {
      if (answers[q.id] === q.answer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remainingSecs).padStart(2, "0")}`;
  };

  const activeQuestion = mockQuestions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-36 pb-16 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_60%)] opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6 uppercase tracking-wider mx-auto">
            <BookOpen size={12} /> Practice Mock Test
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-4 leading-tight">
            CNTS Mock Practice Environment
          </h1>
          <p className="text-slate-450 text-xs md:text-sm max-w-xl mx-auto">
            Simulate the final conceptual cognitive exam structure. Test your layout navigation, timers, and submission confirmation.
          </p>
        </div>
      </section>

      {/* Main Panel */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center">
        {!examStarted ? (
          /* Start Screen */
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-center max-w-xl w-full space-y-6 animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mx-auto mb-4">
              <Clock size={32} />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">Practice Exam Instructions</h2>
            <div className="text-left space-y-3 text-xs text-slate-505 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p>• <strong>Questions:</strong> 10 conceptual cognitive reasoning multiple-choice questions.</p>
              <p>• <strong>Duration:</strong> 10 Minutes flat countdown timer.</p>
              <p>• <strong>Behavior:</strong> Simulates reporting question panels, next/previous buttons, and response logs.</p>
              <p>• <strong>Integrity:</strong> Webcam is disabled. Designed for candidate diagnostics validation.</p>
            </div>
            <button
              onClick={() => setExamStarted(true)}
              className="w-full bg-blue-600 hover:bg-blue-750 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Practice Exam <Play size={12} />
            </button>
          </div>
        ) : submitted ? (
          /* Result Summary */
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-center max-w-xl w-full space-y-6 animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">Practice Attempt Submitted!</h2>
            <p className="text-xs text-slate-505 max-w-md mx-auto leading-relaxed">
              Congratulations! Your candidate has completed the CNTS mock practice. This confirms layout capability and internet connection stability.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600">Practice Score:</span>
              <strong className="text-slate-900 font-bold">{score} / 10 Correct</strong>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  setAnswers({});
                  setTimeLeft(600);
                  setSubmitted(false);
                  setExamStarted(true);
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
              >
                Restart Practice
              </button>
              <Link
                href="/dashboard"
                className="flex-1 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1"
              >
                Back to Dashboard <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ) : (
          /* Active Exam Interface */
          <div className="grid md:grid-cols-4 gap-6 w-full items-start">
            
            {/* Left Column: Questions Grid Nav */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 md:col-span-1">
              <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Questions</span>
                <span className="text-xs font-black text-blue-900 font-mono flex items-center gap-1.5">
                  <Clock size={13} />
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {mockQuestions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isActive = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-800 text-white ring-2 ring-blue-400"
                          : isAnswered
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-250"
                      }`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Question Details */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm md:col-span-3 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-blue-800" />
              
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>{activeQuestion.domain}</span>
                <span>Question {currentIdx + 1} of 10</span>
              </div>

              <h3 className="text-sm font-bold text-slate-800 leading-relaxed min-h-[50px]">
                {activeQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {activeQuestion.options.map((opt, optIdx) => {
                  const isSelected = answers[activeQuestion.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(activeQuestion.id, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/50 border-blue-600 text-blue-850"
                          : "bg-slate-50 border-slate-200 text-slate-655 hover:bg-slate-100"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isSelected
                          ? "bg-blue-800 border-blue-800 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-6">
                <button
                  onClick={() => setCurrentIdx(prev => Math.max(prev - 1, 0))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 disabled:opacity-50 cursor-pointer border-none"
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                {currentIdx < mockQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => Math.min(prev + 1, mockQuestions.length - 1))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer border-none"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={submitExam}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-555 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer border-none shadow-md shadow-emerald-600/10"
                  >
                    <CheckCircle size={14} /> Submit Practice
                  </button>
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
