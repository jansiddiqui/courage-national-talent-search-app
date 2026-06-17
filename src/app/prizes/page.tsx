import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Trophy, Star, ShieldCheck, FileText, Globe, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "CNTS Prizes & National Recognition",
  description: "Explore the scholarships, gold medals, certificates, and Talent Profile reports awarded to students in the Junior & Senior Categories of the CNTS.",
};

const podiumAwards = [
  {
    rank: "National Rank 1",
    prize: "Gold Honor",
    extras: ["National Gold Trophy", "Gold Medal of Honor", "Merit Scholarship Certificate"],
    gradient: "from-amber-400 via-yellow-400 to-orange-400",
    glow: "shadow-amber-400/30",
    badge: "🥇",
    isCenter: true,
  },
  {
    rank: "National Rank 2",
    prize: "Silver Honor",
    extras: ["National Silver Trophy", "Silver Medal of Honor", "Merit Scholarship Certificate"],
    gradient: "from-slate-400 via-slate-300 to-slate-400",
    glow: "shadow-slate-400/30",
    badge: "🥈",
    isCenter: false,
  },
  {
    rank: "National Rank 3",
    prize: "Bronze Honor",
    extras: ["National Bronze Trophy", "Bronze Medal of Honor", "Merit Scholarship Certificate"],
    gradient: "from-orange-700 via-orange-500 to-amber-600",
    glow: "shadow-orange-500/30",
    badge: "🥉",
    isCenter: false,
  },
];

const segmentPrizes = [
  { rank: "Ranks 4–10", reward: "National Merit Medal + Certificate", desc: "For candidates scoring in the top tier nationally." },
  { rank: "Ranks 11–50", reward: "Distinction Medal + Certificate", desc: "For candidates showcasing high logical excellence." },
  { rank: "State Toppers", reward: "State Rank Trophy + Merit Certificate", desc: "Awarded to the top candidate in each state." },
  { rank: "School Toppers", reward: "Medal of Honor + Excellence Certificate", desc: "Awarded to top performers within each participating school." },
];

export default function PrizesPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="dark" />

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E40AF] via-blue-900 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <Trophy size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              CNTS Recognition Pool
            </span>
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            National <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Rankings & Awards</span>.
          </h1>
          <p className="text-blue-200 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            We celebrate cognitive development and logical thinking. The top performers earn prestigious trophies, medals, and rankings, while every single participant receives a diagnostic Talent Profile and digital certificate.
          </p>
        </div>
      </section>

      {/* Category divisions */}
      <section className="py-16 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        
        {/* Junior Category card */}
        <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm space-y-4 relative overflow-hidden group hover:border-blue-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Classes 5 & 6
          </div>
          <h3 className="font-display font-bold text-2xl text-slate-800">Junior Category</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Evaluates core foundational cognitive strengths. Logical structures, primary mathematical relationships, and language clarity are tested. The questions are specifically structured for their cognitive stage.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pt-2 font-medium">
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500 shrink-0" />
              Syllabus focused on primary logic & reasoning
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500 shrink-0" />
              Eligible for National Rank 1, 2, and 3 awards
            </li>
          </ul>
        </div>

        {/* Senior Category card */}
        <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm space-y-4 relative overflow-hidden group hover:border-purple-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Classes 7 & 8
          </div>
          <h3 className="font-display font-bold text-2xl text-slate-800">Senior Category</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Evaluates advanced deductive logic, problem-solving speed, reading comprehension, and abstract relationships. Questions push critical thinking boundaries suitable for middle schoolers.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pt-2 font-medium">
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500 shrink-0" />
              Syllabus focused on abstract logic & advanced reasoning
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500 shrink-0" />
              Separate National Podium ranking and reward structures
            </li>
          </ul>
        </div>

      </section>

      {/* The Podium awards */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-md mx-auto space-y-2">
            <h2 className="font-display font-bold text-3xl text-slate-800 tracking-tight">
              National Podium Awards
            </h2>
            <p className="text-slate-500 text-xs">
              Separate podiums are tracked for both the Junior and Senior categories.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6">
            {[podiumAwards[1], podiumAwards[0], podiumAwards[2]].map((p) => (
              <div 
                key={p.rank} 
                className={`relative w-64 p-6 rounded-xl bg-gradient-to-br ${
                  p.gradient
                } text-white shadow-xl ${
                  p.glow
                } group hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center ${
                  p.isCenter ? "md:py-10 md:w-72 relative z-10 order-first md:order-none" : ""
                }`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none rounded-xl" />
                <span className="text-4xl mb-2 block">{p.badge}</span>
                <h3 className="font-display font-bold text-3xl mb-1 select-all">{p.prize}</h3>
                <span className="text-xs font-semibold text-white/80 block uppercase tracking-wider">{p.rank}</span>
                
                <div className="mt-4 pt-4 border-t border-white/20 w-full space-y-1.5 text-xs text-white/90">
                  {p.extras.map(e => (
                    <p key={e} className="flex items-center gap-1 justify-center">
                      <Star size={8} className="fill-white shrink-0" /> {e}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Category breakdown table */}
      <section className="py-20 max-w-3xl mx-auto px-6 space-y-8">
        <h3 className="font-display font-bold text-xl text-slate-800 text-center md:text-left">
          Additional Rankings & Rewards
        </h3>
        
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
          {segmentPrizes.map((p) => (
            <div key={p.rank} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 text-sm block">{p.rank}</span>
                <p className="text-xs text-slate-500">{p.desc}</p>
              </div>
              <span className="text-xs font-bold text-blue-900 bg-blue-50/50 px-3.5 py-1.5 rounded-xl border border-blue-100/30">
                {p.reward}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Certificates, Talent Profile, and National Ranking Details */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-800/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="inline-block text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Credentials & Reports
            </span>
            <h2 className="font-display font-bold text-3xl tracking-tight">
              Honoring every participant&apos;s journey.
            </h2>
            <p className="text-slate-400 text-xs">
              We provide deep value to every candidate, not just the top scorers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Verified Certificates */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Verifiable Certificates</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                All candidates receive a digital certificate containing a secure verification QR code. This credential can be shared directly with school administrations and is valid for merit-based admissions.
              </p>
            </div>

            {/* Talent Profile Report */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                <FileText size={20} />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Talent Profile Report</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Instead of a single raw score, parents receive a multi-dimensional feedback document mapping cognitive strengths in reasoning, logic, and analysis, as well as concrete learning style advice.
              </p>
            </div>

            {/* National Ranking */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-purple-400">
                <Globe size={20} />
              </div>
              <h3 className="font-display font-bold text-white text-lg">National Rankings</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Understand where your child stands at a national scale. Percentile scores are provided across each subject, alongside State-wise rankings and overall standing benchmarks.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 text-center bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <h3 className="font-display font-bold text-2xl text-slate-900">
            Register your child today.
          </h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Give your child the opportunity to showcase their reasoning strengths at a national level and earn prestigious scholarships.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-800/15 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Start Your Child&apos;s Journey
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
