import { Brain, BarChart3, FileText, Globe2, Layers, Lightbulb } from "lucide-react";

const reasons = [
  {
    icon: Brain,
    title: "Beyond Marks — True Talent Discovery",
    desc: "CNTS identifies cognitive strengths, learning styles, and intellectual aptitudes that a school report card never shows. We see the full child.",
    accent: "bg-blue-50 text-blue-700",
    border: "hover:border-blue-200",
  },
  {
    icon: BarChart3,
    title: "Benchmarked Nationally",
    desc: "Your child is compared against a national cohort — giving a clear, honest national percentile and subject-level diagnostic breakdown.",
    accent: "bg-amber-50 text-amber-700",
    border: "hover:border-amber-200",
  },
  {
    icon: FileText,
    title: "A Lifelong Talent Portfolio",
    desc: "Every CNTS result builds a permanent, shareable academic profile useful for scholarships, school admissions, and career counseling.",
    accent: "bg-emerald-50 text-emerald-700",
    border: "hover:border-emerald-200",
  },
  {
    icon: Globe2,
    title: "Available in Hindi & English",
    desc: "Designed for India's diversity — full bilingual support so language is never a barrier to a child's potential.",
    accent: "bg-purple-50 text-purple-700",
    border: "hover:border-purple-200",
  },
  {
    icon: Layers,
    title: "Classes 5 to 8, One Platform",
    desc: "A cohesive, age-appropriate assessment journey that grows with your child year over year.",
    accent: "bg-rose-50 text-rose-700",
    border: "hover:border-rose-200",
  },
  {
    icon: Lightbulb,
    title: "Actionable Guidance, Not Just Scores",
    desc: "Post-result counseling reports give parents specific next steps — study strategies, enrichment programs, and strength areas to nurture.",
    accent: "bg-cyan-50 text-cyan-700",
    border: "hover:border-cyan-200",
  },
];

export default function WhyCNTS() {
  return (
    <section id="why-cnts" className="py-24 lg:py-32 mesh-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full">
            Why CNTS
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
            Not a test.
            <br />
            <span className="gradient-text">A revelation.</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Traditional exams measure memory. CNTS measures meaning — who your child is,
            what they&apos;re wired for, and where they can genuinely excel.
          </p>

          <div className="mt-8 p-5 rounded-3xl bg-blue-50/50 border border-blue-100 flex items-start gap-4 shadow-sm max-w-xl">
            <div className="w-10 h-10 rounded-2xl bg-blue-100/60 flex items-center justify-center shrink-0 text-blue-850">
              <Brain size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 leading-tight">
                CNTS is not a rote-learning examination.
              </p>
              <p className="text-xs text-slate-550 leading-relaxed mt-1">
                It is designed to help parents understand <strong>how their child thinks and learns</strong>, not merely what they have memorized.
              </p>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className={`group p-7 bg-white rounded-3xl border border-slate-100 ${r.border} card-glow transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-2xl ${r.accent} flex items-center justify-center mb-5`}>
                <r.icon size={20} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg mb-3 leading-snug">
                {r.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
