import { Sparkles, TrendingUp, Award, BookOpen } from "lucide-react";

const profileAreas = [
  { label: "Verbal Reasoning", score: 94, rank: "Top 2%" },
  { label: "Numerical Ability", score: 81, rank: "Top 8%" },
  { label: "Spatial Intelligence", score: 77, rank: "Top 12%" },
  { label: "Abstract Thinking", score: 89, rank: "Top 5%" },
  { label: "General Science", score: 73, rank: "Top 15%" },
  { label: "Environmental Awareness", score: 85, rank: "Top 7%" },
];

const colorMap = [
  { bar: "bg-blue-600", bg: "bg-blue-50", text: "text-blue-700" },
  { bar: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  { bar: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  { bar: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-700" },
  { bar: "bg-rose-500", bg: "bg-rose-50", text: "text-rose-700" },
  { bar: "bg-cyan-500", bg: "bg-cyan-50", text: "text-cyan-700" },
];

export default function TalentProfile() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Sample profile */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 shadow-2xl shadow-slate-900/30 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Profile header */}
              <div className="relative flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="font-display font-bold text-white text-xl">A</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">Aryan Mehta</h3>
                    <p className="text-blue-300 text-sm">Class 6 · Mumbai · CNTS 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-white text-3xl">86</div>
                  <div className="text-blue-300 text-xs">Overall Score</div>
                </div>
              </div>

              {/* Score bars */}
              <div className="space-y-4 relative">
                {profileAreas.map((area, i) => {
                  const c = colorMap[i % colorMap.length];
                  return (
                    <div key={area.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-slate-300 text-sm font-medium">{area.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 ${c.text}`}>
                            {area.rank}
                          </span>
                          <span className="text-white font-bold text-sm">{area.score}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${c.bar} rounded-full opacity-90`}
                          style={{ width: `${area.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer badge */}
              <div className="relative mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-amber-400" />
                  <span className="text-amber-300 text-sm font-semibold">Gold Certificate · All India Rank 1,243</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-700 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-display font-bold text-xs">C</span>
                </div>
              </div>
            </div>

            {/* Floating detail card */}
            <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-4 shadow-xl shadow-slate-200/50 w-52 hidden sm:block">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-amber-500" />
                <span className="text-xs font-bold text-slate-700">Top Strength</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">Verbal Reasoning</p>
              <p className="text-xs text-slate-500 mt-1">Suited for: Law, Journalism, Civil Services</p>
            </div>
          </div>

          {/* Right: Copy */}
          <div className="space-y-8 lg:pl-8">
            <div>
              <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 bg-emerald-50 px-3 py-1 rounded-full">
                Talent Profile
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
                A profile that
                <br />
                lasts a lifetime.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Every student gets a verified, shareable CNTS Talent Profile — a multi-dimensional report that captures their intellectual DNA across 6 core ability domains.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: TrendingUp,
                  title: "National Percentile Rankings",
                  desc: "See exactly where your child stands on a national percentile scale.",
                },
                {
                  icon: BookOpen,
                  title: "Subject-Wise Deep Dive",
                  desc: "Granular topic-level analysis — not just where they scored, but what they know deeply.",
                },
                {
                  icon: Award,
                  title: "Verifiable Digital Certificate",
                  desc: "A QR-code certificate sharable with schools, colleges, and scholarship boards.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <item.icon size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
