import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NeedHelp from "@/components/layout/NeedHelp";
import Link from "next/link";
import { 
  Clipboard, 
  Laptop, 
  Globe, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  AlertOctagon
} from "lucide-react";

export default function ExamInstructionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-36 pb-20 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_60%)] opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6 uppercase tracking-wider mx-auto">
            <Clipboard size={12} /> Test Day Protocol
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            Candidate Exam Guidelines & Rules
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Essential instructions for candidates preparing to take the CNTS 2026 assessment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/system-check"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-lg text-sm flex items-center gap-2"
            >
              Run System Check <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-3.5 px-8 rounded-xl transition-all text-sm"
            >
              Candidate Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Main Instructions Content */}
      <main className="max-w-5xl mx-auto px-6 py-20 flex-1 space-y-16">
        
        {/* Core Specs Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <Laptop size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Supported Devices</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Desktop, laptop, tablet, or smartphone. Please use the latest versions of Google Chrome, Safari, Mozilla Firefox, or Microsoft Edge.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Globe size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Internet & Power</h4>
            <p className="text-xs text-slate-505 leading-relaxed">
              Requires a stable internet connection (minimum 1 Mbps). Ensure your testing device is fully charged or connected to power.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <RefreshCw size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Disconnection Policy</h4>
            <p className="text-xs text-slate-550 leading-relaxed">
              If the page closes or connection drops, candidate progress is cached. Log back in from the same browser slot to resume the test.
            </p>
          </div>
        </section>

        {/* Detailed Rules */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl">Important Assessment Guidelines</h3>
            <p className="text-xs text-slate-500">Read these rules thoroughly before starting the cognitive test.</p>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="grid md:grid-cols-2 gap-8 text-xs text-slate-655 leading-relaxed">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-700" />
                Assessment Integrity Guidelines
              </h4>
              <p>
                The Courage National Talent Search is built to provide an honest, conceptual aptitude profile for the candidate. It is a developmental baseline, not a competitive placement test.
              </p>
              <p>
                <strong>No Webcam Required:</strong> To minimize parent anxiety and solve device permission challenges, front-facing camera verification is not required.
              </p>
              <p>
                <strong>Independent Attempt:</strong> Candidates are strongly encouraged to attempt the evaluation completely independently without parent assistance, search engines, or books. An authentic evaluation is vital to pinpoint actual learning strengths.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <AlertOctagon size={16} className="text-amber-700" />
                Active Test Day Conduct
              </h4>
              <p>
                <strong>Double Tabs / Navigation:</strong> Do not close or refresh the tab actively. If navigating away, your session timer will keep running. 
              </p>
              <p>
                <strong>Rough Sheets:</strong> Keep blank sheets of paper and pencils ready on the desk. You will need them to solve the logical pattern drawings and arithmetic series puzzles.
              </p>
              <p>
                <strong>Test Slots:</strong> Candidate admission pass details the allocated testing window. Log in 15 minutes before reporting time to clear system checks.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Support desk SLA block */}
      <NeedHelp />

      <Footer />
    </div>
  );
}
