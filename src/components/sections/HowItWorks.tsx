import { UserPlus, BookOpen, ClipboardList, BarChart2, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { RegisterCTA } from "@/components/shared/RegisterCTA";

const steps = [
  {
    icon: UserPlus,
    step: "Register",
    title: "Sign up in 3 minutes",
    desc: "Parents register their child with basic details. Choose class level and preferred language medium (English or Hindi).",
    color: "text-blue-700 bg-blue-50",
    connector: "bg-blue-200",
  },
  {
    icon: BookOpen,
    step: "Prepare",
    title: "Interactive Learning Academy",
    desc: "Access the CNTS Learning Academy — bilingual interactive lessons, flashcard drills, and solved examples across Reasoning, Mathematics, Language, and Critical Thinking.",
    color: "text-indigo-700 bg-indigo-50",
    connector: "bg-indigo-200",
  },
  {
    icon: ClipboardList,
    step: "Appear",
    title: "Take the exam",
    desc: "Take the 75 or 90-minute online assessment comfortably from home during your allocated slot. No stress, authentic evaluation.",
    color: "text-sky-700 bg-sky-50",
    connector: "bg-sky-200",
  },
  {
    icon: BarChart2,
    step: "Discover",
    title: "Receive your Talent Profile",
    desc: "Within 21 days, receive a full diagnostic report with national rank, percentile, subject scores, and strength mapping.",
    color: "text-blue-600 bg-blue-50/70",
    connector: "bg-blue-200",
  },
  {
    icon: Award,
    step: "Shine",
    title: "Awards & recognition",
    desc: "Top rankers receive scholarships, medals, and national recognition. Every participant gets a verifiable certificate.",
    color: "text-indigo-600 bg-indigo-50/70",
    connector: null,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-24 lg:py-32 mesh-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full">
            How It Works
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            Simple steps.
            <br />
            <span className="gradient-text">Lasting impact.</span>
          </h2>
          <p className="text-lg text-slate-500">
            From registration to results — the CNTS journey is straightforward, supportive, and transformative.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[72px] left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 mx-[calc(10%)] pointer-events-none" />

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center group">
                {/* Step number */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${s.color} flex items-center justify-center shadow-sm border border-white group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <s.icon size={22} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                    {i + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-blue-100 hover:shadow-md transition-all w-full card-glow">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{s.step}</div>
                  <h3 className="font-display font-bold text-slate-900 text-base mb-2 leading-tight">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <RegisterCTA
            unauthenticatedText="Start Registration Now"
            rightIcon={<ArrowRight size={16} />}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-800/15 transition-all hover:-translate-y-0.5 cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
}
