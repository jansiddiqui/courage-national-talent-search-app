import { Heart, Target, TrendingUp, MessageSquare, Star, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Know your child's real strengths",
    desc: "Go beyond gut feeling. Get data-backed insight into where your child truly excels — so you can nurture, not guess.",
  },
  {
    icon: TrendingUp,
    title: "Guide their future with confidence",
    desc: "With a complete CNTS profile, choose the right stream, tuition focus, and extracurriculars with clarity.",
  },
  {
    icon: Heart,
    title: "Boost their self-confidence",
    desc: "Children who understand their strengths perform better. Recognition at a national level changes how students see themselves.",
  },
  {
    icon: MessageSquare,
    title: "Counseling report in plain language",
    desc: "No jargon. The parent report is written the way a caring teacher would speak — honest, clear, and actionable.",
  },
];

export default function ParentBenefits() {
  return (
    <section id="benefits" className="py-10 md:py-14 lg:py-16 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/50">
            For Parents
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            You know your child is special.
            <br />
            <span className="gradient-text">We prove it.</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed max-w-xl">
            CNTS gives parents the data, vocabulary, and confidence to advocate for their child&apos;s potential — at school, with tutors, and in life.
          </p>
        </div>

        {/* Dynamic Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Benefits Grid */}
          <div className="space-y-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 p-5 md:p-6 rounded-2xl border border-slate-200/60 bg-slate-50/40 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <b.icon size={18} className="stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm md:text-base mb-1.5">
                    {b.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Glowing SaaS Console Card (Founding Families callout) */}
          <div className="bg-[#091125] text-white rounded-3xl p-8 border border-blue-900/40 relative overflow-hidden h-full flex flex-col justify-between shadow-xl">
            {/* Radial background glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-300">
                <Sparkles size={12} className="text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Early Access Program
                </span>
              </div>
              
              <h3 className="font-display font-bold text-2xl tracking-tight leading-tight text-white">
                Pilot Batch Reviews Coming Soon
              </h3>
              
              <div className="space-y-4 text-slate-300 text-xs md:text-sm leading-relaxed">
                <p>
                  We are currently registering our first batch of students for the CNTS 2026 Founding Edition.
                </p>
                <p>
                  Rather than showcasing simulated reviews, we are building this platform on absolute transparency. Once the September 2026 talent profiles are delivered, parent feedback will be published here live and unedited.
                </p>
              </div>
            </div>

            {/* Glowing Footer Status Bar */}
            <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-400">
                  <Star size={18} className="fill-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">CNTS Founding Edition</h4>
                  <p className="text-xs text-blue-300">August 2026 Batch</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-400 font-mono shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Now Enrolling
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
