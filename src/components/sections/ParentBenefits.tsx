import { Heart, Target, TrendingUp, MessageSquare, Star } from "lucide-react";

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
    <section id="benefits" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="inline-block text-xs font-bold text-rose-700 uppercase tracking-widest mb-4 bg-rose-50 px-3 py-1 rounded-full">
            For Parents
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
            You know your child
            <br />
            is special.
            <br />
            <span className="gradient-text">We prove it.</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            CNTS gives parents the data, vocabulary, and confidence to advocate for their child&apos;s potential — at school, with tutors, and in life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-rose-100 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                  <b.icon size={18} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1.5">{b.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Early Access Program Callout */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-8 border border-white/5 relative overflow-hidden h-full flex flex-col justify-between shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                <Heart size={12} className="text-rose-400" />
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">
                  Early Access Program
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl tracking-tight leading-tight">
                Pilot Batch Reviews Coming Soon
              </h3>
              <p className="text-slate-350 text-xs md:text-sm leading-relaxed">
                We are currently registering our first batch of students for the CNTS 2026 Founding Edition.
              </p>
              <p className="text-slate-350 text-xs md:text-sm leading-relaxed">
                Rather than showcasing simulated reviews, we are building this platform on absolute transparency. Once the July 2026 talent profiles are delivered, parent feedback will be published here live and unedited.
              </p>
            </div>
            <div className="pt-8 mt-8 border-t border-white/10 flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-amber-400">
                <Star size={18} className="fill-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">CNTS Founding Edition</h4>
                <p className="text-xs text-blue-300">July 2026 Batch · Now Registering</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
