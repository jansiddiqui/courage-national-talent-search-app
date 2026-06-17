import Image from "next/image";
import { Quote } from "lucide-react";

export default function FounderLetter() {
  return (
    <section className="py-20 bg-slate-50/50 border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100 relative overflow-hidden">
          {/* Decorative quote mark */}
          <div className="absolute top-6 right-8 text-slate-100 pointer-events-none select-none">
            <Quote size={80} className="opacity-40" />
          </div>

          <div className="relative space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                A Message from Team Courage Library
              </span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
                Why Cognitive Profiling Matters
              </h3>
            </div>

            <div className="h-px bg-slate-150" />

            <div className="space-y-4 text-slate-650 text-sm leading-relaxed font-serif">
              <p>Dear Parent,</p>
              <p>
                For decades, the standard measure of a student's intelligence has been their report card. We push our children to memorize formulas, cram facts, and repeat textbook answers to score highly. But a grade card only shows what a child can store, not how they reason. In a world shifting rapidly towards problem-solving and critical thinking, rote memory is no longer enough.
              </p>
              <p>
                We designed the <strong>Courage National Talent Search (CNTS)</strong> to move beyond this paradigm. CNTS is not a high-stakes exam or a race for marks. It is a diagnostic engine built to map the foundational cognitive capabilities of students in Classes 5–8—evaluating logical reasoning, mathematical thinking, verbal aptitude, and general awareness.
              </p>
              <p>
                Our objective is simple: to help parents discover how their child learns best, identify their natural strengths, and provide actionable developmental feedback. Every child has intellectual potential; our role is to help you locate and nurture it.
              </p>
              <p>
                Thank you for partner-investing in your child's cognitive growth. We commit to supporting you with diagnostic depth, absolute data privacy, and premium guidance.
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-t border-slate-100">
              <div>
                <p className="font-display font-bold text-slate-800 text-sm">Team Courage Library</p>
                <p className="text-[11px] text-slate-400">Courage Library Foundation</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 italic">Founding Edition 2026</span>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-display font-bold text-blue-800 text-xs shadow-sm">
                  CNTS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
