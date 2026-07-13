"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Database, RefreshCw, CheckCircle, XCircle, AlertCircle, BookOpen, Eye } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  subject: string;
  chapter: string;
  bloom_taxonomy: string;
  difficulty_index: number;
  approval_status: string;
  version: number;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  REVIEW: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  ARCHIVED: "bg-purple-50 text-purple-700",
};

export default function QuestionsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchPendingQuestions = async () => {
    try {
      const res = await fetch("/api/admin/questions/governance");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPendingQuestions(data.questions || []);
    } catch (e: any) {
      setError(e.message || "Failed to load pending questions.");
    }
  };

  const fetchAllQuestions = async () => {
    try {
      const res = await fetch("/api/admin/questions");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAllQuestions(data.questions || []);
    } catch (e: any) {
      setError(e.message || "Failed to load questions.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    await Promise.all([fetchPendingQuestions(), fetchAllQuestions()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGovernanceAction = async (questionId: string, action: "approve" | "reject", notes?: string) => {
    setActionLoading(questionId);
    try {
      const res = await fetch("/api/admin/questions/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, questionId, notes }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(action === "approve" ? "Question approved!" : "Question rejected.");
        fetchData();
      } else {
        showToast(data.message || `Failed to ${action} question.`);
      }
    } catch (e: any) {
      showToast(e.message || "Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Database size={20} className="text-blue-800" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-800">Question Bank Governance</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Review & Approve Questions</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/50 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8 space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-blue-800 text-white rounded-xl shadow-lg text-sm font-medium">
            {toast}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 -mx-4 md:-mx-12 px-4 md:px-12 shadow-sm">
          <div className="flex gap-6">
            {[
              { id: "pending", label: `Pending Review (${pendingQuestions.length})`, icon: AlertCircle },
              { id: "all", label: `All Questions (${allQuestions.length})`, icon: BookOpen },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? "border-blue-800 text-blue-800"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Pending Review Tab */}
            {activeTab === "pending" && (
              <div className="space-y-4">
                {pendingQuestions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No questions pending review!</p>
                  </div>
                ) : (
                  pendingQuestions.map(q => (
                    <div key={q.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{q.subject}</span>
                            {q.chapter && <span className="text-xs text-slate-400">{q.chapter}</span>}
                            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-semibold">{q.bloom_taxonomy}</span>
                            <span className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100">v{q.version}</span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium leading-relaxed">{q.question_text}</p>
                          <p className="text-xs text-slate-400">Difficulty: {q.difficulty_index}</p>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[180px]">
                          <button
                            onClick={() => handleGovernanceAction(q.id, "approve")}
                            disabled={actionLoading === q.id}
                            className="py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CheckCircle size={13} />
                            {actionLoading === q.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleGovernanceAction(q.id, "reject", rejectionNotes[q.id])}
                            disabled={actionLoading === q.id}
                            className="py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <XCircle size={13} />
                            Reject
                          </button>
                          <input
                            type="text"
                            placeholder="Rejection notes..."
                            value={rejectionNotes[q.id] || ""}
                            onChange={e => setRejectionNotes(prev => ({ ...prev, [q.id]: e.target.value }))}
                            className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-800/20 focus:border-blue-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* All Questions Tab */}
            {activeTab === "all" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Question</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bloom</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                          No questions found.
                        </td>
                      </tr>
                    ) : (
                      allQuestions.map(q => (
                        <tr key={q.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-slate-700 text-xs line-clamp-2 max-w-xs">{q.question_text}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{q.subject}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{q.bloom_taxonomy}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-bold ${STATUS_COLORS[q.approval_status] || "bg-slate-100 text-slate-600"}`}>
                              {q.approval_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs">v{q.version}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
