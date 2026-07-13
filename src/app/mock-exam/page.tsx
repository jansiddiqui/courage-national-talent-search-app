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
  HelpCircle,
  Play,
  ArrowRight,
  BookOpen,
  Loader2
} from "lucide-react";
import { LocalDb } from "@/domains/assessment/LocalDb";
import { AssessmentSyncManager } from "@/domains/assessment/AssessmentSyncManager";
import { AssessmentRecovery } from "@/domains/assessment/AssessmentRecovery";
import { CandidateQuestionDTO, SessionStatus } from "@/domains/assessment/core/types";

export default function MockExamPage() {
  const [examStarted, setExamStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(600); // authoritative timer in seconds
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<CandidateQuestionDTO[]>([]);
  const [status, setStatus] = useState<SessionStatus>("CREATED");
  const [receiptId, setReceiptId] = useState("");
  const [loading, setLoading] = useState(false);

  // Timer loop (visual countdown only, synchronized by sync endpoints)
  useEffect(() => {
    if (!examStarted || submitted || timeLeft <= 0 || status === "SUBMITTED" || status === "SCORED") return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Trigger server auto-submit
          submitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, submitted, timeLeft, status]);

  // Clean up sync interval on component unmount
  useEffect(() => {
    return () => {
      AssessmentSyncManager.stop();
    };
  }, []);

  const startExam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assessment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: "asm-1" })
      });

      if (!res.ok) throw new Error("Failed to start session");
      const data = await res.json();

      if (data.success) {
        setSessionId(data.sessionId);
        setQuestions(data.questions);
        setStatus("IN_PROGRESS");

        // 1. Authoritative Timer Setup
        const expiresAt = new Date(data.expiresAt).getTime();
        const timeRemaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        setTimeLeft(timeRemaining);

        // 2. Map existing server attempts
        const serverAnswers: Record<string, string[]> = {};
        let highestSeq = 0;
        if (data.attempts) {
          data.attempts.forEach((att: any) => {
            serverAnswers[att.question_id] = att.selected_answers;
            highestSeq = Math.max(highestSeq, att.last_sequence_number);
          });
        }

        // 3. Recovery Merge: Reconstruct state from IndexedDB + Server attempts
        const mergedAnswers = await AssessmentRecovery.reconstructState(data.sessionId, serverAnswers, highestSeq);
        setAnswers(mergedAnswers);

        // 4. Initialize Sync Manager
        AssessmentSyncManager.initialize(data.sessionId, highestSeq, (syncResult) => {
          // Re-synchronize remaining time authoritatively on every sync response
          setTimeLeft(syncResult.timeRemainingSeconds);
          setStatus(syncResult.status);
          if (syncResult.status === "AUTO_SUBMITTING" || syncResult.status === "SUBMITTED") {
            submitExam(true);
          }
        });

        setExamStarted(true);
      }
    } catch (err) {
      console.error("[Start] error:", err);
      alert("Failed to initialize mock exam session");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = async (qId: string, optId: string) => {
    if (submitted || status === "SUBMITTED" || status === "SCORED") return;

    // Update local state optimistically
    setAnswers(prev => ({ ...prev, [qId]: [optId] }));

    // Push mutation to LocalDb queue & Sync Manager
    await AssessmentSyncManager.recordMutation(qId, [optId]);
  };

  const submitExam = async (isAutoSubmit = false) => {
    if (submitted || status === "SUBMITTED" || status === "SCORED") return;
    setLoading(true);

    try {
      // Force trigger final flush of any remaining mutations in the queue
      await AssessmentSyncManager.triggerSync();

      // Transition local state machine status
      setStatus(isAutoSubmit ? "AUTO_SUBMITTING" : "SUBMITTING");

      const idempotencyKey = "idem_" + sessionId + "_" + Date.now();
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          idempotencyKey,
          isAutoSubmit
        })
      });

      if (!res.ok) throw new Error("Submission evaluation failed");
      const result = await res.json();

      if (result.success) {
        setScore(result.score);
        setReceiptId(result.receiptId);
        setSubmitted(true);
        setStatus("SCORED");

        // Clear local queue upon success
        await LocalDb.clearAll();
      } else {
        alert(result.message || "Failed to submit exam");
      }
    } catch (err) {
      console.error("[Submit] error:", err);
      alert("Network connection error. Retrying submission...");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remainingSecs).padStart(2, "0")}`;
  };

  const activeQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="light" />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 text-slate-800 pt-36 pb-16 ">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6 uppercase tracking-wider mx-auto">
            <BookOpen size={12} /> Practice Mock Test
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            CNTS Mock Practice Environment
          </h1>
          <p className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto">
            Simulate the final conceptual cognitive exam structure. Test your layout navigation, timers, and submission confirmation.
          </p>
        </div>
      </section>

      {/* Main Panel */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center">
        {loading && (
          <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-blue-800" size={32} />
              <span className="text-xs font-bold text-slate-700">Syncing with Exam Engine...</span>
            </div>
          </div>
        )}

        {!examStarted ? (
          /* Start Screen */
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-center max-w-xl w-full space-y-6 animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mx-auto mb-4">
              <Clock size={32} />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">Practice Exam Instructions</h2>
            <div className="text-left space-y-3 text-xs text-slate-500 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p>• <strong>Questions:</strong> 10 conceptual cognitive reasoning multiple-choice questions.</p>
              <p>• <strong>Duration:</strong> 10 Minutes flat countdown timer.</p>
              <p>• <strong>Behavior:</strong> Simulates reporting question panels, next/previous buttons, and response logs.</p>
              <p>• <strong>Integrity:</strong> Webcam is disabled. Designed for candidate diagnostics validation.</p>
            </div>
            <button
              onClick={startExam}
              className="w-full bg-blue-600 hover:bg-blue-750 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer border-none"
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
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Congratulations! Your candidate has completed the CNTS mock practice. This confirms layout capability and internet connection stability.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600">Practice Score:</span>
                <strong className="text-slate-900 font-bold">{score} / 10 Correct</strong>
              </div>
              {receiptId && (
                <div className="flex justify-between items-center border-t border-slate-150 pt-2 text-[10px] text-slate-400">
                  <span>Submission Receipt ID:</span>
                  <span className="font-mono font-bold text-slate-600">{receiptId}</span>
                </div>
              )}
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  setAnswers({});
                  setTimeLeft(600);
                  setSubmitted(false);
                  setExamStarted(false);
                  setSessionId("");
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
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined && answers[q.id].length > 0;
                  const isActive = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer border-none ${
                        isActive
                          ? "bg-blue-800 text-white ring-2 ring-blue-400"
                          : isAnswered
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Question Details */}
            {activeQuestion && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm md:col-span-3 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-blue-800" />
                
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>{activeQuestion.domain}</span>
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 leading-relaxed min-h-[50px]">
                  {activeQuestion.text}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {activeQuestion.options.map((opt) => {
                    const isSelected = answers[activeQuestion.id]?.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(activeQuestion.id, opt.id)}
                        className={`w-full text-left p-4 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/50 border-blue-600 text-blue-800"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isSelected
                            ? "bg-blue-800 border-blue-800 text-white"
                            : "bg-white border-slate-300 text-slate-400"
                        }`}>
                          ✓
                        </span>
                        {opt.text}
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

                  {currentIdx < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx(prev => Math.min(prev + 1, questions.length - 1))}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer border-none"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => submitExam(false)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer border-none shadow-md shadow-emerald-600/10"
                    >
                      <CheckCircle size={14} /> Submit Practice
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
