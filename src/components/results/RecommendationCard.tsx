"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface RecommendationCardProps {
  analytics: any;
  result: any;
}

export default function RecommendationCard({ analytics, result }: RecommendationCardProps) {
  const recommendations = analytics?.recommendations || [
    {
      topic: "Verbal & Language Ability",
      priority: "Medium",
      reason: "Semantic logic accuracy is currently 78%.",
      action: "Complete Verbal Logic Foundation Module in the Academy.",
      duration: "15 minutes/day for 7 days"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-700 bg-red-50 border-red-100";
      case "Medium": return "text-amber-700 bg-amber-50 border-amber-100";
      default: return "text-slate-700 bg-slate-50 border-slate-100";
    }
  };

  const getAcademyPath = (topic: string) => {
    const slug = topic.toLowerCase().includes("math") || topic.toLowerCase().includes("quant")
      ? "mathematics"
      : topic.toLowerCase().includes("verbal") || topic.toLowerCase().includes("language")
      ? "language"
      : topic.toLowerCase().includes("critical")
      ? "critical"
      : "reasoning";
    return `/academy/${slug}`;
  };

  return (
    <div className="space-y-4 pt-2 w-full">
      <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles size={12} className="text-blue-600" />
        Educational Growth Recommendations
      </h4>

      <div className="space-y-4">
        {recommendations.map((rec: any, idx: number) => (
          <div key={idx} className="p-5 border border-slate-150 rounded-3xl bg-white shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <strong className="text-xs font-bold text-slate-800">{rec.topic}</strong>
              <span className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${getPriorityColor(rec.priority)}`}>
                {rec.priority} Priority
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 font-medium">
              <div>Reason: <span className="text-slate-700 font-semibold">{rec.reason}</span></div>
              <div>Action: <span className="text-slate-700 font-semibold">{rec.action}</span></div>
              <div>Duration: <span className="text-slate-700 font-semibold">{rec.duration}</span></div>
            </div>

            <Link
              href={getAcademyPath(rec.topic)}
              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-800 hover:bg-blue-750 text-white rounded-xl text-[10px] font-bold transition-all shadow-md shadow-blue-800/10 cursor-pointer"
            >
              Start Academy Path <ArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
