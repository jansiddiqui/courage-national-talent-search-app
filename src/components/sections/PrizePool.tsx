import { Trophy, Medal, Star, Gift, Zap, Award } from "lucide-react";

const prizes = [
  {
    rank: "All India Rank 1",
    prize: "Gold Honor",
    extras: ["National Trophy + Gold Medal", "National Merit Certificate", "National Recognition"],
    gradient: "from-amber-400 via-yellow-400 to-orange-400",
    glow: "shadow-amber-400/40",
    badge: "1st",
    size: "lg",
  },
  {
    rank: "Rank 2",
    prize: "Silver Honor",
    extras: ["National Trophy + Silver Medal", "National Merit Certificate"],
    gradient: "from-slate-400 via-slate-350 to-slate-400",
    glow: "shadow-slate-400/40",
    badge: "2nd",
    size: "md",
  },
  {
    rank: "Rank 3",
    prize: "Bronze Honor",
    extras: ["National Trophy + Bronze Medal", "National Merit Certificate"],
    gradient: "from-orange-700 via-orange-500 to-amber-600",
    glow: "shadow-orange-500/40",
    badge: "3rd",
    size: "md",
  },
];

const moreAwards = [
  { label: "Ranks 4–10", value: "Excellence Certificate + Medal", icon: Star },
  { label: "Ranks 11–50", value: "Distinction Certificate + Medal", icon: Medal },
  { label: "State Toppers", value: "State Rank Certificate + Badge", icon: Trophy },
  { label: "School Toppers", value: "School Topper Medal + Certificate", icon: Gift },
  { label: "Perfect Score", value: "Academic Excellence Star", icon: Zap },
];

export default function PrizePool() {
  return (
    <section id="prizes" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 bg-amber-50 px-3 py-1 rounded-full">
            Recognition & Honors
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            National Recognition.
            <br />
            <span className="gradient-text-amber">Real Achievement.</span>
          </h2>
          <p className="text-lg text-slate-500">
            Every student who participates gets a detailed Talent Profile and Certificate. High achievers earn prestigious medals and national rankings.
          </p>
        </div>

        {/* Podium */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-4 mb-12">
          {[prizes[1], prizes[0], prizes[2]].map((p, displayIdx) => {
            const isCenter = displayIdx === 1;
            return (
              <div
                key={p.rank}
                className={`relative flex flex-col items-center text-center group w-full ${
                  isCenter ? "max-w-[280px] sm:max-w-none sm:w-auto order-first md:order-none" : "max-w-[260px] sm:max-w-none sm:w-auto"
                }`}
              >
                <div
                  className={`w-full ${
                    isCenter ? "sm:w-60 p-8" : "sm:w-52 p-7"
                  } rounded-t-2xl sm:rounded-xl bg-gradient-to-br ${p.gradient} text-white relative overflow-hidden shadow-2xl ${p.glow} shadow-lg group-hover:-translate-y-1 transition-transform duration-300`}
                >
                  {/* Background shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-xl" />
                  <div className={`relative mb-3 font-display font-extrabold ${isCenter ? "text-4xl" : "text-3xl"} bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-white/20`}>{p.badge}</div>
                  <div className={`font-display font-bold relative ${isCenter ? "text-4xl" : "text-3xl"} mb-1`}>
                    {p.prize}
                  </div>
                  <div className="relative text-sm font-semibold text-white/80">{p.rank}</div>
                  <div className="relative mt-4 space-y-1">
                    {p.extras.map((e) => (
                      <div key={e} className="text-xs text-white/70 flex items-center gap-1 justify-center">
                        <Star size={8} className="fill-white/60 text-white/60 shrink-0" />
                        {e}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Podium base */}
                <div
                  className={`w-full rounded-b-xl ${
                    isCenter ? "h-8 bg-gradient-to-b from-amber-100 to-amber-50" : "h-5 bg-gradient-to-b from-slate-100 to-slate-50"
                  } mt-0`}
                />
              </div>
            );
          })}
        </div>

        {/* More awards table */}
        <div className="max-w-3xl mx-auto bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-7 py-4 border-b border-slate-100 bg-white">
            <h3 className="font-display font-bold text-slate-800 text-lg">More Awards & Recognition</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {moreAwards.map((a) => (
              <div key={a.label} className="px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 hover:bg-white transition-colors">
                <div className="flex items-center gap-3">
                  <a.icon size={16} className="text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-700 text-sm">{a.label}</span>
                </div>
                <span className="font-bold text-slate-900 text-sm pl-7 sm:pl-0">{a.value}</span>
              </div>
            ))}
          </div>
          <div className="px-7 py-4 bg-blue-50 border-t border-blue-100 flex items-center gap-2 text-blue-800">
            <Award size={16} className="shrink-0" />
            <p className="text-sm font-medium">
              All participants receive a digital certificate valid for school admissions & scholarship applications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
