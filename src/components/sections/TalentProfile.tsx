import { Sparkles, TrendingUp, Award, CheckCircle2 } from "lucide-react";

const profileAreas = [
  { label: "Reasoning", score: 82, rank: "Top 12%" },
  { label: "Problem Solving", score: 74, rank: "Top 18%" },
  { label: "Learning Agility", score: 90, rank: "Top 5%" },
  { label: "Attention to Detail", score: 65, rank: "Top 25%" },
  { label: "Creativity", score: 81, rank: "Top 15%" },
];

const colorMap = [
  { bar: "bg-blue-600", bg: "bg-blue-50", text: "text-blue-700" },
  { bar: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  { bar: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  { bar: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-700" },
  { bar: "bg-rose-500", bg: "bg-rose-50", text: "text-rose-700" },
];

export default function TalentProfile() {
  return (
    <section id="sample-profile" className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="space-y-8">
            <div>
              <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 bg-emerald-100 px-3 py-1 rounded-full">
                The Outcome
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                A blueprint of your child&apos;s mind.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mt-5">
                No more vague grades. The CNTS Talent Profile gives you a precise, actionable breakdown of your child's cognitive strengths, learning style, and areas for growth.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">National Benchmarking</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    See exactly where your child stands against a national cohort, not just their classroom.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Actionable Recommendations</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Personalized strategies to nurture their unique talents and improve their weaknesses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sample profile */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden">
              
              <div className="text-center mb-8 border-b border-slate-100 pb-6">
                <h3 className="font-display font-bold text-slate-800 text-xl">Talent Snapshot</h3>
                <p className="text-slate-500 text-sm">Class 6 Participant</p>
              </div>

              {/* Score bars */}
              <div className="space-y-5 relative mb-8 pb-8 border-b border-slate-100">
                {profileAreas.map((area, i) => {
                  const c = colorMap[i % colorMap.length];
                  return (
                    <div key={area.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-700 text-sm font-bold">{area.label}</span>
                        <span className="text-slate-900 font-black text-sm">{area.score}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${c.bar} rounded-full`}
                          style={{ width: `${area.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-emerald-800 mb-3 text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Key Strengths
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      Strong logical thinker
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      Learns new concepts quickly
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      Excellent pattern recognition
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-blue-800 mb-3 text-sm flex items-center gap-2">
                    <TrendingUp size={16} />
                    Recommended Growth Areas
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      Improve attention to detail
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      Practice multi-step reasoning
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Decorative badge */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-xl shadow-slate-900/20 w-48 hidden sm:block border border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <Award size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-slate-200">Sample Report</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">This is a preview. Your child will receive a comprehensive digital diagnostic profile on the portal.</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}