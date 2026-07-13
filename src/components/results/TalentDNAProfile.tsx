"use client";

import { Sparkles, Info } from "lucide-react";

interface TalentDNAProfileProps {
  analytics: any;
  result: any;
}

export default function TalentDNAProfile({ analytics, result }: TalentDNAProfileProps) {
  // Configured DNA dimensions derived from analytics output
  const dimensions = analytics?.talentDna 
    ? Object.keys(analytics.talentDna).map(name => ({
        name,
        ...analytics.talentDna[name]
      }))
    : [
        {
          name: "Analytical Thinking",
          level: result.mathematics_score >= 80 ? "Advanced" : "Developing",
          evidence: ["Exhibited high logical precision on Quantitative items."],
          opportunities: ["Practice multi-variable formula exercises."]
        },
        {
          name: "Pattern Recognition",
          level: result.logical_reasoning_score >= 80 ? "Advanced" : "Developing",
          evidence: ["Identified sequence rotations in Logical matrix problems."],
          opportunities: ["Attempt pattern-based deduction quizzes."]
        },
        {
          name: "Verbal Analysis",
          level: result.language_score >= 80 ? "Advanced" : "Developing",
          evidence: ["Demonstrated high vocabulary reasoning accuracy."],
          opportunities: ["Read conceptual biographies and logic digests."]
        },
        {
          name: "Critical Thinking",
          level: result.general_awareness_score >= 80 ? "Advanced" : "Developing",
          evidence: ["Resolved critical science and lightning reasoning item."],
          opportunities: ["Discuss structural 'why' behind everyday physics."]
        }
      ];

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "Advanced": return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      case "Proficient": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "Developing": return "bg-amber-500/10 text-amber-700 border-amber-500/20";
      case "Beginning": return "bg-slate-500/10 text-slate-700 border-slate-500/20";
      default: return "bg-red-500/10 text-red-700 border-red-500/20";
    }
  };

  return (
    <div className="space-y-6 w-full pt-2">
      <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-3xl space-y-2">
        <h4 className="font-display font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-500" />
          CNTS Talent DNA Profile
        </h4>
        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
          Cognitive dimensions describe observed performance patterns in this assessment. They do not represent innate potential or fixed intelligence levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimensions.map((dim, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-150 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">{dim.name}</span>
              <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-wider ${getBadgeColor(dim.level)}`}>
                {dim.level === "INSUFFICIENT_EVIDENCE" ? "Insufficient Evidence" : dim.level}
              </span>
            </div>

            {dim.level !== "INSUFFICIENT_EVIDENCE" && (
              <div className="space-y-2 text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-500 block uppercase tracking-widest text-[8px]">Supporting Evidence:</span>
                  <span className="text-slate-700 leading-relaxed block">{dim.evidence?.[0] || "Evidence evaluated during test attempts."}</span>
                </div>
                <div className="space-y-1 pl-1">
                  <span className="font-bold text-slate-400 block uppercase tracking-widest text-[8px]">Growth Opportunity:</span>
                  <span className="text-slate-600 leading-relaxed block">{dim.opportunities?.[0] || "Practice related topic segments."}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
