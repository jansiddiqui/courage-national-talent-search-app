import { Trophy, Medal, Star, Gift, Zap, Award, Check } from "lucide-react";

const prizes = [
  {
    rank: "All India Rank 1",
    prize: "Gold Honor",
    extras: ["National Trophy + Gold Medal", "National Merit Certificate", "National Recognition"],
    cardBg: "bg-gradient-to-b from-slate-950 to-blue-950 border-2 border-amber-400/60 shadow-amber-500/5",
    accentColor: "text-amber-400",
    glowColor: "bg-amber-500/10",
    badge: "1st",
    tag: "Top Honor",
    tagBg: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
  },
  {
    rank: "Rank 2",
    prize: "Silver Honor",
    extras: ["National Trophy + Silver Medal", "National Merit Certificate"],
    cardBg: "bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-slate-500/5",
    accentColor: "text-slate-300",
    glowColor: "bg-slate-500/5",
    badge: "2nd",
    tag: "Runner Up",
    tagBg: "bg-slate-800 text-slate-300 border border-slate-700/80",
  },
  {
    rank: "Rank 3",
    prize: "Bronze Honor",
    extras: ["National Trophy + Bronze Medal", "National Merit Certificate"],
    cardBg: "bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-orange-500/5",
    accentColor: "text-orange-400",
    glowColor: "bg-orange-500/5",
    badge: "3rd",
    tag: "Podium",
    tagBg: "bg-orange-950/40 text-orange-400 border border-orange-900/40",
  },
];

const moreAwards = [
  { label: "Ranks 4–10", value: "Excellence Certificate + Medal", icon: Star, badgeBg: "bg-blue-50 text-blue-700 border border-blue-100/50" },
  { label: "Ranks 11–50", value: "Distinction Certificate + Medal", icon: Medal, badgeBg: "bg-blue-50 text-blue-700 border border-blue-100/50" },
  { label: "State Toppers", value: "State Rank Certificate + Badge", icon: Trophy, badgeBg: "bg-indigo-50 text-indigo-700 border border-indigo-100/50" },
  { label: "School Toppers", value: "School Topper Medal + Certificate", icon: Gift, badgeBg: "bg-cyan-50 text-cyan-700 border border-cyan-100/50" },
  { label: "Perfect Score", value: "Academic Excellence Star", icon: Zap, badgeBg: "bg-amber-50 text-amber-700 border border-amber-100/50" },
];

export default function PrizePool() {
  return (
    <section id="prizes" className="py-10 md:py-14 lg:py-16 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full">
            Recognition & Honors
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            National Recognition.
            <br />
            <span className="gradient-text">Real Achievement.</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed">
            Every student who participates gets a detailed Talent Profile and Certificate. High achievers earn prestigious medals and national rankings.
          </p>
        </div>

        {/* Podium Layout - Elegant Card Stack */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-5xl mx-auto mb-16">
          {[prizes[1], prizes[0], prizes[2]].map((p, displayIdx) => {
            const isCenter = displayIdx === 1;
            return (
              <div
                key={p.rank}
                className={`relative flex flex-col justify-between p-6 md:p-8 rounded-[28px] ${p.cardBg} text-white shadow-xl hover:-translate-y-1 transition-all duration-300 flex-1 relative overflow-hidden group ${
                  isCenter ? "md:scale-105 z-10 md:-translate-y-2 border-2" : "border"
                }`}
              >
                {/* Radial glow background orb */}
                <div className={`absolute top-0 right-0 w-36 h-36 ${p.glowColor} rounded-full blur-3xl pointer-events-none`} />

                {/* Card Tag */}
                <span className={`absolute top-4 right-4 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider ${p.tagBg}`}>
                  {p.tag}
                </span>

                <div>
                  {/* Badge & Rank Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`font-display font-extrabold text-lg bg-white/10 w-9 h-9 rounded-full flex items-center justify-center border border-white/20 ${p.accentColor}`}>
                      {p.badge}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Rank Category
                      </span>
                      <span className="text-sm font-semibold text-white/80">
                        {p.rank}
                      </span>
                    </div>
                  </div>

                  {/* Prize Title */}
                  <h3 className="font-display font-black text-2xl lg:text-3xl mb-4 text-white">
                    {p.prize}
                  </h3>

                  {/* Features List */}
                  <div className="space-y-2.5 mt-6 border-t border-white/5 pt-6">
                    {p.extras.map((e) => (
                      <div key={e} className="text-xs text-slate-300 flex items-start gap-2">
                        <Check size={14} className={`shrink-0 mt-0.5 ${p.accentColor}`} />
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* More awards table - SaaS tier layout */}
        <div className="max-w-3xl mx-auto bg-slate-50/50 rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200/80 bg-white">
            <h3 className="font-display font-bold text-slate-800 text-base md:text-lg">
              Additional Tiers & Recognition
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {moreAwards.map((a) => (
              <div key={a.label} className="px-6 py-4 flex flex-row items-center justify-between gap-4 bg-white/80 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <a.icon size={16} />
                  </div>
                  <span className="font-semibold text-slate-700 text-xs sm:text-sm">
                    {a.label}
                  </span>
                </div>
                <span className={`text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full ${a.badgeBg}`}>
                  {a.value}
                </span>
              </div>
            ))}
          </div>
          <div className="px-6 py-5 bg-blue-50/30 border-t border-blue-100/50 flex items-start sm:items-center gap-2.5 text-blue-800">
            <Award size={16} className="shrink-0 text-blue-600 mt-0.5 sm:mt-0" />
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              All participating candidates receive a comprehensive digital Talent Profile Report and participation certificate valid for official admissions & academic record-keeping.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
