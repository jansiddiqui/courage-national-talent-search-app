"use client";

import { AlertTriangle, Lightbulb } from "lucide-react";

interface MistakeIntelligenceProps {
  analytics: any;
  result: any;
}

export default function MistakeIntelligence({ analytics, result }: MistakeIntelligenceProps) {
  const patterns = analytics?.mistakeIntelligence?.patterns || [
    "Fatigue Recovery Pattern",
    "Conceptual Logic Precision"
  ];
  const explanations = analytics?.mistakeIntelligence?.explanations || [
    "Sustained stable accuracy in final 20% of session timeline.",
    "Struggled with multi-variable deduction items requiring multi-step reasoning."
  ];

  return (
    <div className="space-y-4 pt-2 w-full">
      <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">
        Mistake Intelligence Patterns
      </h4>

      <div className="space-y-3">
        {patterns.map((pat: string, idx: number) => (
          <div key={idx} className="p-4 bg-amber-50/20 border border-amber-100 rounded-2xl flex gap-3 text-xs">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0 h-fit">
              <AlertTriangle size={15} />
            </div>
            <div className="space-y-1">
              <strong className="font-bold text-amber-900 block">{pat}</strong>
              <p className="text-slate-600 leading-relaxed">{explanations[idx] || "Cognitive error logic evaluated."}</p>
            </div>
          </div>
        ))}

        {patterns.length === 0 && (
          <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-2xl flex gap-3 text-xs">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 h-fit">
              <Lightbulb size={15} />
            </div>
            <div className="space-y-1">
              <strong className="font-bold text-emerald-900 block">High Response Precision</strong>
              <p className="text-slate-600 leading-relaxed">No recurring cognitive error patterns detected in attempt history.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
