import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import { Trophy, Star, ShieldCheck, FileText, Globe, ArrowRight, Check, Medal } from "lucide-react";

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
    badge: <Medal size={48} className="text-yellow-100 drop-shadow-md" />,
    isCenter: true,
  },
  {
    rank: "National Rank 2",
    prize: "Silver Honor",
    extras: ["National Silver Trophy", "Silver Medal of Honor", "Merit Scholarship Certificate"],
    gradient: "from-slate-400 via-slate-300 to-slate-400",
    glow: "shadow-slate-400/30",
    badge: <Medal size={40} className="text-slate-100 drop-shadow-md" />,
    isCenter: false,
  },
  {
    rank: "National Rank 3",
    prize: "Bronze Honor",
    extras: ["National Bronze Trophy", "Bronze Medal of Honor", "Merit Scholarship Certificate"],
    gradient: "from-orange-700 via-orange-500 to-amber-600",
    glow: "shadow-orange-500/30",
    badge: <Medal size={40} className="text-orange-200 drop-shadow-md" />,
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
      <Navbar theme="light" />

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/30 via-white to-[#F8FAFF] pt-36 pb-20 md:pb-28 px-6 text-center border-b border-slate-100/80">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-7 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200/70">
            <Trophy size={12} className="text-amber-500" />
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
              CNTS Recognition Pool
            </span>
          </span>

          <div className="space-y-2">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-[3.75rem] tracking-tight text-slate-900 leading-[1.08]">
              National Rankings
            </h1>
            <div className="font-display font-bold text-4xl md:text-5xl lg:text-[3.75rem] tracking-tight leading-[1.08]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400">&amp; Awards.</span>
            </div>
          </div>

          <p className="text-slate-500 text-[15px] leading-relaxed max-w-lg mx-auto">
            Every participant is recognised. Top performers earn gold medals, trophies &amp; national rankings — and every child receives a Talent Profile and verified certificate.
          </p>

          {/* Trust stat strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-3 pt-1">
            {[
              { value: "3", label: "Podium Medals" },
              { value: "State", label: "Rank Trophies" },
              { value: "100%", label: "Get Brain Report" },
              { value: "₹0", label: "Hidden Fees" },
            ].map(({ value, label }, i, arr) => (
              <div key={label} className="flex items-center gap-1">
                <div className="flex items-center gap-2 px-4 py-2">
                  <span className="font-display font-black text-slate-900 text-base">{value}</span>
                  <span className="text-[12px] text-slate-500 font-medium">{label}</span>
                </div>
                {i < arr.length - 1 && <div className="w-px h-4 bg-slate-200" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category divisions */}
      <section className="py-14 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-5">

          {/* Junior Category */}
          <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-8 hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-2xl" />
            <div className="pl-4 space-y-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border border-blue-100">
                    Classes 5 &amp; 6
                  </span>
                  <h3 className="font-display font-bold text-xl text-slate-900 mt-2">Junior Category</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Trophy size={18} className="text-blue-600" />
                </div>
              </div>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Evaluates core foundational cognitive strengths — logical structures, primary mathematical relationships, and language clarity. Questions are specifically calibrated for their cognitive stage.
              </p>
              <div className="space-y-2 pt-1">
                {["Syllabus focused on primary logic & reasoning", "Eligible for National Rank 1, 2, and 3 awards"].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-[12.5px] text-slate-700 font-medium">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Check size={9} className="text-emerald-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm">60</div>
                  <div className="text-[10px] text-slate-500 font-medium">Questions</div>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm">75 min</div>
                  <div className="text-[10px] text-slate-500 font-medium">Duration</div>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm">4</div>
                  <div className="text-[10px] text-slate-500 font-medium">Domains</div>
                </div>
              </div>
            </div>
          </div>

          {/* Senior Category */}
          <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-8 hover:border-purple-300/60 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-purple-600 rounded-l-2xl" />
            <div className="pl-4 space-y-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border border-purple-100">
                    Classes 7 &amp; 8
                  </span>
                  <h3 className="font-display font-bold text-xl text-slate-900 mt-2">Senior Category</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  <Medal size={18} className="text-purple-600" />
                </div>
              </div>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Evaluates advanced deductive logic, problem-solving speed, reading comprehension, and abstract relationships. Questions push critical thinking boundaries suited for middle schoolers.
              </p>
              <div className="space-y-2 pt-1">
                {["Syllabus focused on abstract logic & advanced reasoning", "Separate National Podium ranking and reward structures"].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-[12.5px] text-slate-700 font-medium">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Check size={9} className="text-emerald-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm">80</div>
                  <div className="text-[10px] text-slate-500 font-medium">Questions</div>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm">90 min</div>
                  <div className="text-[10px] text-slate-500 font-medium">Duration</div>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm">4</div>
                  <div className="text-[10px] text-slate-500 font-medium">Domains</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Podium Awards */}
      <section className="py-16 border-y border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <span className="inline-block text-[10px] font-extrabold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200/70 px-3 py-1 rounded-full">
              Top Performers
            </span>
            <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight">National Podium Awards</h2>
            <p className="text-slate-500 text-sm">Separate podiums are tracked for both the Junior and Senior categories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Silver — Rank 2 */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 rounded-t-2xl" />
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 mt-2">
                <Medal size={28} className="text-slate-500" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">National Rank 2</span>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-4">Silver Honor</h3>
              <div className="space-y-1.5 w-full pt-4 border-t border-slate-100">
                {podiumAwards[1].extras.map(e => (
                  <div key={e} className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                    <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {/* Gold — Rank 1 (elevated) */}
            <div className="relative bg-gradient-to-b from-amber-50 to-white rounded-2xl border-2 border-amber-300/60 p-6 flex flex-col items-center text-center shadow-xl shadow-amber-100 hover:shadow-amber-200/60 transition-all duration-300 overflow-hidden md:-translate-y-4">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-t-2xl" />
              <div className="absolute top-3 right-3">
                <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                  Top Award
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-4 mt-2 shadow-lg shadow-amber-200">
                <Medal size={32} className="text-white drop-shadow" />
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-1">National Rank 1</span>
              <h3 className="font-display font-bold text-2xl text-slate-900 mb-4">Gold Honor</h3>
              <div className="space-y-1.5 w-full pt-4 border-t border-amber-200/60">
                {podiumAwards[0].extras.map(e => (
                  <div key={e} className="flex items-center gap-2 text-[12px] text-slate-700 font-semibold">
                    <div className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {/* Bronze — Rank 3 */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-300 via-amber-600 to-orange-400 rounded-t-2xl" />
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4 mt-2">
                <Medal size={28} className="text-orange-600" />
              </div>
              <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest mb-1">National Rank 3</span>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-4">Bronze Honor</h3>
              <div className="space-y-1.5 w-full pt-4 border-t border-slate-100">
                {podiumAwards[2].extras.map(e => (
                  <div key={e} className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                    <div className="w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Rankings */}
      <section className="py-16 max-w-4xl mx-auto px-6 space-y-6">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-xl text-slate-900">Additional Rankings &amp; Rewards</h3>
          <p className="text-slate-500 text-sm">Every performer is recognised — not just the top three.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {segmentPrizes.map((p, i) => (
            <div key={p.rank} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-6 py-5 hover:bg-slate-50 transition-colors ${i !== 0 ? 'border-t border-slate-100' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Trophy size={14} className="text-blue-600" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-sm block">{p.rank}</span>
                  <p className="text-[12px] text-slate-500">{p.desc}</p>
                </div>
              </div>
              <span className="ml-12 sm:ml-0 text-[11.5px] font-bold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-lg border border-blue-100 shrink-0 whitespace-nowrap">
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
          <RegisterCTA
            unauthenticatedText="Start Your Child's Journey"
            rightIcon={<ArrowRight size={16} />}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-800/15 transition-all hover:-translate-y-0.5 cursor-pointer"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
