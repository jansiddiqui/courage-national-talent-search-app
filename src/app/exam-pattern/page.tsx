import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NeedHelp from "@/components/layout/NeedHelp";
import Link from "next/link";
import { RegisterCTA } from "@/components/shared/RegisterCTA";
import { 
  BookOpen, 
  HelpCircle, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Brain,
  MessageSquare
} from "lucide-react";

export default function ExamPatternPage() {
  const subjectStructure = [
    {
      subject: "Logical & Pattern Deduction",
      questions: 15,
      weightage: "30%",
      desc: "Focuses on abstract sequences, figure analogies, matrix completions, and spatial reasoning tasks.",
      sample: "Which figure completes the grid analogy when the shapes are rotated 90 degrees clockwise?"
    },
    {
      subject: "Quantitative Logic & Mathematics",
      questions: 15,
      weightage: "30%",
      desc: "Tests conceptual mathematics, arithmetic logic, and number sequences. Focuses on mental agility, not calculation drudgery.",
      sample: "Find the missing term in the sequence: 2, 6, 12, 20, 30, ?"
    },
    {
      subject: "Verbal & Language Ability",
      questions: 10,
      weightage: "20%",
      desc: "Evaluates reading comprehension, semantic inferences, logical sentence structures, and language logic.",
      sample: "Based on the short paragraph, which statement MUST be true regarding the researcher's conclusion?"
    },
    {
      subject: "General Awareness & Critical Logic",
      questions: 10,
      weightage: "20%",
      desc: "Assesses information synthesis, general conceptual awareness, and core critical thinking logic.",
      sample: "Select the most logical explanation for why solar panels are angled relative to geographical latitude."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-36 pb-20 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_60%)] opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6 uppercase tracking-wider mx-auto">
            <BookOpen size={12} /> Examination Blueprint
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            CNTS Exam Pattern & Syllabus
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Complete details on subjects, question weights, test slots, and marking criteria for Classes 5–8.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <RegisterCTA
              unauthenticatedText="Register Candidate"
              rightIcon={<ArrowRight size={16} />}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-lg text-sm flex items-center gap-2"
            />
            <Link
              href="/parent-guide"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-3.5 px-8 rounded-xl transition-all text-sm"
            >
              Parent Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex-1 space-y-16">
        
        {/* Core Specs Section */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center space-y-2">
            <Clock size={28} className="text-blue-700 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Test Duration</h4>
            <p className="text-xs text-slate-500">120 Minutes (2 Hours) online slot</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center space-y-2">
            <Brain size={28} className="text-emerald-700 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Question Count</h4>
            <p className="text-xs text-slate-505">50 Multiple-Choice Questions (MCQs)</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center space-y-2">
            <Award size={28} className="text-amber-700 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Marking Scheme</h4>
            <p className="text-xs text-slate-505">+4 Marks for Correct | No Negative Marking</p>
          </div>
        </section>

        {/* Subjects breakdown */}
        <section className="space-y-8">
          <h2 className="text-2xl font-display font-bold text-slate-900 text-center">Subject & Domain Analysis</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {subjectStructure.map((s, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{s.subject}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{s.questions} Questions · Weightage: {s.weightage}</p>
                  </div>
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-505 leading-relaxed">{s.desc}</p>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] text-slate-505 italic">
                  <strong>Sample Challenge Concept:</strong> "{s.sample}"
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guidelines section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-slate-900 text-lg">Assessment Guidelines & Code of Conduct</h3>
          <div className="h-px bg-slate-100" />
          <div className="grid md:grid-cols-2 gap-8 text-xs text-slate-655 leading-relaxed">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Testing Environment</h4>
              <p>
                The examination is fully web-based and can be taken on any modern device (desktop, laptop, or smartphone). A stable internet connection is required. We recommend taking the test in a quiet room with minimal distractions.
              </p>
              <p>
                Candidates should keep rough paper and pencils ready on their desks for mathematical scratching and sequence drawings.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Academic Integrity</h4>
              <p>
                CNTS is designed to serve as a developmental baseline for parents to understand their child's cognitive strengths. We do not use camera monitoring or proctor locks.
              </p>
              <p>
                <strong>Integrity Policy:</strong> We encourage students to attempt the assessment completely independently without parent support or reference books. An authentic assessment profile provides far more developmental value than assisted marks.
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
