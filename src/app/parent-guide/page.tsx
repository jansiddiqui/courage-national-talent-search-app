import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NeedHelp from "@/components/layout/NeedHelp";
import Link from "next/link";
import { 
  ShieldCheck, 
  HelpCircle, 
  Award, 
  ArrowRight,
  HeartHandshake
} from "lucide-react";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import { TIMELINE_LABELS } from "@/config/timeline";

export default function ParentGuidePage() {
  const journeySteps = [
    { step: 1, title: "Online Registration", desc: "Complete guardian contact and candidate profile. Fee: ₹99." },
    { step: 2, title: "Syllabus & Practice Mock", desc: "Access sample cognitive puzzles and standard formats inside the dashboard." },
    { step: 3, title: "Official Admit Card", desc: `Released on ${TIMELINE_LABELS.ADMIT_CARD_RELEASE}. Entry Pass details slot timings and portal link.` },
    { step: 4, title: "Final conceptual exam day", desc: `Conducted online on ${TIMELINE_LABELS.EXAM_DATE}. Designed for self-evaluation.` },
    { step: 5, title: "Cognitive Profile Report", desc: `Delivered on ${TIMELINE_LABELS.TALENT_PROFILE_DATE}, mapping strengths across 6 key domains.` },
    { step: 6, title: "Verified Achievement Certificates", desc: `Issued on ${TIMELINE_LABELS.CERTIFICATE_DATE} with verified registration ID & QR lookup.` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-36 pb-20 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_60%)] opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6 uppercase tracking-wider mx-auto">
            <ShieldCheck size={12} /> Parent Confidence Center
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            Parent's Guide to CNTS 2026
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Complete transparency regarding India's premier cognitive diagnostics talent search. Learn about our academic framework, details, timelines, and support commitments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <RegisterCTA
              unauthenticatedText="Register Candidate"
              rightIcon={<ArrowRight size={16} />}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-lg text-sm flex items-center gap-2"
            />
            <Link
              href="/exam-pattern"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-3.5 px-8 rounded-xl transition-all text-sm"
            >
              View Exam Pattern
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs & Answers Grid */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex-1 space-y-20">
        
        {/* Core FAQ Block */}
        <section className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-900">Core Assessment Questions</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  What makes CNTS different from school exams?
                </h4>
                <p className="text-xs text-slate-505 leading-relaxed pl-6">
                  School exams test memory and textbook syllabus recall. CNTS tests foundational cognitive aptitude—specifically pattern recognition, logical deduction, spatial reasoning, and conceptual language comprehension. We help you discover how your child thinks, not just what they memorized.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  Who is eligible to participate in the assessment?
                </h4>
                <p className="text-xs text-slate-505 leading-relaxed pl-6">
                  CNTS 2026 is strictly designed for students currently studying in Classes 5, 6, 7, and 8. The difficulty and scoring brackets are adjusted dynamically by grade to ensure precise benchmarks.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  Are there any hidden costs or upsells?
                </h4>
                <p className="text-xs text-slate-550 leading-relaxed pl-6">
                  Absolutely not. The ₹99 registration is a one-time flat fee. It covers the mock papers, system test checks, live assessment seat, cognitive scorecard delivery, and certificate generation. CNTS does not upsell coaching courses or books.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-900">Rules & Environment Questions</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  Is a webcam required for proctoring?
                </h4>
                <p className="text-xs text-slate-505 leading-relaxed pl-6">
                  No. We have removed all webcam proctoring requirements to ensure parent and student privacy and avoid device permission failures. Candidates are encouraged to attempt the 2-hour assessment independently for honest, actionable self-evaluation.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  What happens if the internet disconnects during the test?
                </h4>
                <p className="text-xs text-slate-505 leading-relaxed pl-6">
                  The exam system saves candidate progress locally. If disconnected, simply refresh or log back in on the same browser to resume exactly where the student left off, provided it is within the active slot timeframe.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                  <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  When and how are results delivered?
                </h4>
                <p className="text-xs text-slate-505 leading-relaxed pl-6">
                  Multi-dimensional talent reports are released inside the Candidate Dashboard on {TIMELINE_LABELS.TALENT_PROFILE_DATE}. Parents receive instant notification logs on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subsidy Highlight */}
        <section className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs font-bold text-amber-300">
              <HeartHandshake size={12} /> Price Transparency Pledge
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Why the Subsidized ₹99 Fee?</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Standard cognitive profiling diagnostics in India typically command fees between ₹1,500 and ₹5,000, placing them beyond the reach of average families. 
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              To drive talent discovery across India, the <strong>Courage Library Foundation</strong> has sponsored the Founding Edition of CNTS, subsidizing the entry fee to just ₹99. We believe conceptual diagnostics should be a developmental right, not a luxury.
            </p>
            <div className="flex gap-4 items-center pt-2 text-xs text-slate-300">
              <span>✓ Flat ₹99 Fee</span>
              <span>✓ Verifiable Merit Credentials</span>
              <span>✓ 100% Student Data Privacy</span>
            </div>
          </div>
        </section>

        {/* Post-Registration Timeline */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900">What Happens After Registration?</h2>
            <p className="text-slate-500 text-xs md:text-sm">
              We coordinate candidate progress from day one. Here is the pre-launch journey map.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeySteps.map((step) => (
              <div key={step.step} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                    0{step.step}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{step.title}</h4>
                  <p className="text-xs text-slate-505 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Support desk SLA block */}
      <NeedHelp />

      <Footer />
    </div>
  );
}
