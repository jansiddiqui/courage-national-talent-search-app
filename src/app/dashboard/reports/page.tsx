"use client";

import { usePortal } from "@/contexts/PortalContext";
import { BarChart2, Lock, Star, TrendingUp, Brain, BookOpen, Award, ArrowRight, Activity, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ResultData {
  overall_score: number;
  percentile: number;
  national_rank: number;
  state_rank: number;
  logical_reasoning_score: number;
  mathematics_score: number;
  language_score: number;
  general_awareness_score: number;
}

export default function ReportsPage() {
  const { activeCandidate, candidates, systemSettings } = usePortal();
  const [result, setResult] = useState<ResultData | null>(null);
  const [siblingResults, setSiblingResults] = useState<Record<string, ResultData>>({});
  const [loading, setLoading] = useState(false);
  const released = systemSettings.result_status === "RELEASED";

  useEffect(() => {
    if (!activeCandidate || !released) return;

    const fetchResult = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/results/search?regId=${activeCandidate.registration_id}&dob=${activeCandidate.dob}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.result) {
            setResult(data.result);
          }
        }
      } catch (err) {
        console.error("Error loading candidate results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [activeCandidate, released]);

  // Fetch sibling results for comparison overlay
  useEffect(() => {
    if (!released || candidates.length <= 1) return;

    const fetchSiblings = async () => {
      const resultsMap: Record<string, ResultData> = {};
      for (const sibling of candidates) {
        if (sibling.registration_id === activeCandidate?.registration_id) continue;
        try {
          const response = await fetch(
            `/api/results/search?regId=${sibling.registration_id}&dob=${sibling.dob}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.result) {
              resultsMap[sibling.registration_id] = data.result;
            }
          }
        } catch (err) {
          console.error("Error loading sibling results:", err);
        }
      }
      setSiblingResults(resultsMap);
    };

    fetchSiblings();
  }, [candidates, activeCandidate, released]);

  if (!activeCandidate) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">No candidate selected</div>
  );

  const getInsights = (res: ResultData) => [
    { label: "Quantitative & Analytical Ability", score: res.mathematics_score, level: res.mathematics_score >= 80 ? "Excellent" : res.mathematics_score >= 60 ? "Good" : "Needs Practice", color: "bg-blue-500" },
    { label: "Verbal & Language Logic", score: res.language_score, level: res.language_score >= 80 ? "Excellent" : res.language_score >= 60 ? "Good" : "Needs Practice", color: "bg-purple-500" },
    { label: "Logical & Pattern Deduction", score: res.logical_reasoning_score, level: res.logical_reasoning_score >= 80 ? "Excellent" : res.logical_reasoning_score >= 60 ? "Good" : "Needs Practice", color: "bg-emerald-500" },
    { label: "Critical Cognitive Reasoning", score: res.general_awareness_score, level: res.general_awareness_score >= 80 ? "Excellent" : res.general_awareness_score >= 60 ? "Good" : "Needs Practice", color: "bg-amber-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Talent Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Cognitive insights and performance analysis for {activeCandidate.student_name}</p>
        </div>
        {released && (
          <span className="text-[10px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-xl">Results Live</span>
        )}
      </div>

      {!released ? (
        /* ── Locked State ─────────────────────────────────────── */
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_60%)]" />
            <div className="relative space-y-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <BarChart2 size={28} className="text-indigo-300" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Talent Profile</h2>
                <p className="text-blue-200 text-sm mt-1 max-w-md">
                  After the exam, you'll receive a detailed cognitive report — showing your child's unique strengths, improvement areas, and national standing.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-blue-300" />
                <span className="text-blue-300 text-xs font-semibold">Available after {systemSettings.exam_date_label || "30 August 2026"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Star, title: "Cognitive Strengths", desc: "Know exactly what your child excels at — not just scores, but abilities." },
              { icon: TrendingUp, title: "National Percentile", desc: "See where your child stands among thousands of students across India." },
              { icon: BookOpen, title: "Next Steps", desc: "Personalized recommendations — which topics to practice and how." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="w-9 h-9 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={17} />
                </div>
                <h3 className="text-xs font-bold text-slate-800 mb-1">{title}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Released State ────────────────────────────────────── */
        <div className="space-y-6">
          {loading ? (
            <div className="p-8 bg-white border border-slate-100 rounded-2xl text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Retrieving evaluation logs...</p>
            </div>
          ) : result ? (
            <>
              {/* Cognitive Scorecard */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
                  <Brain size={15} className="text-indigo-600" /> Learning Insights
                </h2>
                <div className="space-y-4">
                  {getInsights(result).map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-xs text-slate-700">{item.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-lg ${item.score >= 80 ? "bg-emerald-100 text-emerald-700" : item.score >= 60 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                          {item.level} ({item.score}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full transition-all duration-700 ${item.color}`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <p className="text-xs font-semibold text-indigo-800">
                    💡 <strong>Key Recommendation:</strong> {activeCandidate.student_name} displays cognitive strength in{" "}
                    {result.mathematics_score > result.logical_reasoning_score ? "Quantitative & Analytical ability" : "Logical deduction tasks"}.
                    To boost their All India standing (currently #{result.national_rank}), we recommend prioritizing lessons in the Academy.
                  </p>
                </div>
              </div>

              {/* Sibling Comparison Matrix */}
              {candidates.length > 1 && Object.keys(siblingResults).length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                  <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Users size={15} className="text-blue-700" /> Sibling Performance Comparison
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold">
                          <th className="py-2">Candidate</th>
                          <th className="py-2 text-center">Quant Score</th>
                          <th className="py-2 text-center">Logical Score</th>
                          <th className="py-2 text-center">Verbal Score</th>
                          <th className="py-2 text-center">Overall</th>
                          <th className="py-2 text-right">Percentile</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        <tr className="bg-blue-50/50">
                          <td className="py-2.5 font-bold text-slate-900">{activeCandidate.student_name} (Active)</td>
                          <td className="py-2.5 text-center">{result.mathematics_score}%</td>
                          <td className="py-2.5 text-center">{result.logical_reasoning_score}%</td>
                          <td className="py-2.5 text-center">{result.language_score}%</td>
                          <td className="py-2.5 text-center font-bold">{result.overall_score}%</td>
                          <td className="py-2.5 text-right text-blue-700 font-bold">{result.percentile}%</td>
                        </tr>
                        {candidates.map((sibling) => {
                          const sibRes = siblingResults[sibling.registration_id];
                          if (!sibRes) return null;
                          return (
                            <tr key={sibling.registration_id}>
                              <td className="py-2.5">{sibling.student_name}</td>
                              <td className="py-2.5 text-center">{sibRes.mathematics_score}%</td>
                              <td className="py-2.5 text-center">{sibRes.logical_reasoning_score}%</td>
                              <td className="py-2.5 text-center">{sibRes.language_score}%</td>
                              <td className="py-2.5 text-center">{sibRes.overall_score}%</td>
                              <td className="py-2.5 text-right font-bold">{sibRes.percentile}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Verified Certificate Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Verified Merit Certificate</p>
                    <p className="text-[10px] text-slate-500">Official cryptographic credentials profile</p>
                  </div>
                </div>
                <Link
                  href="/results"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  View Certificate
                </Link>
              </div>
            </>
          ) : (
            <div className="p-8 bg-white border border-slate-100 rounded-2xl text-center text-slate-500 text-xs">
              No evaluation results record found for {activeCandidate.student_name}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
