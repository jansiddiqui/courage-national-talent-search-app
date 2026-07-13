"use client";

interface ScoreOverviewProps {
  result: any;
}

export default function ScoreOverview({ result }: ScoreOverviewProps) {
  const sections = [
    { label: "Quant & Analytical Ability", score: result.mathematics_score, color: "bg-blue-600" },
    { label: "Verbal & Language Logic", score: result.language_score, color: "bg-indigo-600" },
    { label: "Logical & Pattern Deduction", score: result.logical_reasoning_score, color: "bg-emerald-600" },
    { label: "Critical Cognitive Reasoning", score: result.general_awareness_score, color: "bg-purple-600" }
  ];

  return (
    <div className="space-y-4 pt-2 w-full">
      <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">
        Cognitive Index Matrices:
      </h4>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((idxData, index) => (
          <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>{idxData.label}</span>
              <span>{idxData.score}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className={`${idxData.color} h-full rounded-full transition-all duration-700`}
                style={{ width: `${idxData.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
