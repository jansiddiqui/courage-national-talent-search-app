import { CheckCircle2, XCircle, Quote } from "lucide-react";

export default function WhyCNTS() {
  return (
    <section id="why-cnts" className="py-10 md:py-14 lg:py-16 mesh-bg border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full">
            Why CNTS
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            What makes CNTS different
            <br />
            <span className="gradient-text">from school exams?</span>
          </h2>
          
          {/* Glowing SaaS-Style Callout Box */}
          <div className="mt-8 p-8 md:p-10 rounded-3xl bg-[#091125] text-white border border-blue-900/40 shadow-xl relative overflow-hidden text-left md:text-center group">
            {/* Soft decorative background glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Watermark Quote Icon */}
            <div className="absolute top-4 right-6 text-blue-500/10 pointer-events-none select-none">
              <Quote size={80} className="stroke-[1.5]" />
            </div>

            <p className="text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto font-display italic text-slate-200 relative z-10">
              &ldquo;A child can score 95% in school exams and still struggle with real-world logic, reasoning, or problem solving. CNTS helps discover those hidden strengths.&rdquo;
            </p>
          </div>
        </div>

        {/* Comparison Table - SaaS Paradigm Matrix */}
        <div className="max-w-4xl mx-auto bg-white rounded-[28px] shadow-md border border-slate-200/80 overflow-hidden">
          
          <div className="grid grid-cols-2 bg-slate-50/50 border-b border-slate-200/80">
            <div className="p-4 sm:p-6 md:p-8 text-center border-r border-slate-200/80">
              <h3 className="font-display font-bold text-slate-400 text-xs sm:text-sm md:text-base uppercase tracking-widest">
                Most School Exams
              </h3>
            </div>
            <div className="p-4 sm:p-6 md:p-8 text-center bg-blue-50/20 border-l-2 border-l-blue-600">
              <h3 className="font-display font-black text-blue-700 text-xs sm:text-sm md:text-base uppercase tracking-widest">
                CNTS Standard
              </h3>
            </div>
          </div>

          <div className="divide-y divide-slate-100/80">
            {/* Row 1 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/30 transition-colors">
              <div className="p-4 sm:p-5 md:p-6 border-r border-slate-100/80 flex items-center gap-3">
                <XCircle className="text-slate-400 shrink-0 hidden sm:block" size={18} />
                <span className="text-slate-500 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                  Tests what a child remembers
                </span>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-blue-50/10 border-l-2 border-l-blue-600 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden sm:block" size={18} />
                <span className="text-blue-900 font-bold text-xs sm:text-sm md:text-base leading-relaxed">
                  Tests how a child thinks and reasons
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/30 transition-colors">
              <div className="p-4 sm:p-5 md:p-6 border-r border-slate-100/80 flex items-center gap-3">
                <XCircle className="text-slate-355 shrink-0 hidden sm:block" size={18} />
                <span className="text-slate-500 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                  Focuses only on school marks
                </span>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-blue-50/10 border-l-2 border-l-blue-600 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden sm:block" size={18} />
                <span className="text-blue-900 font-bold text-xs sm:text-sm md:text-base leading-relaxed">
                  Focuses on real future potential
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/30 transition-colors">
              <div className="p-4 sm:p-5 md:p-6 border-r border-slate-100/80 flex items-center gap-3">
                <XCircle className="text-slate-355 shrink-0 hidden sm:block" size={18} />
                <span className="text-slate-500 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                  Gives only one total score
                </span>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-blue-50/10 border-l-2 border-l-blue-600 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden sm:block" size={18} />
                <span className="text-blue-900 font-bold text-xs sm:text-sm md:text-base leading-relaxed">
                  Gives a Detailed Brain Strength Report
                </span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/30 transition-colors">
              <div className="p-4 sm:p-5 md:p-6 border-r border-slate-100/80 flex items-center gap-3">
                <XCircle className="text-slate-355 shrink-0 hidden sm:block" size={18} />
                <span className="text-slate-500 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                  No details on strengths & weaknesses
                </span>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-blue-50/10 border-l-2 border-l-blue-600 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden sm:block" size={18} />
                <span className="text-blue-900 font-bold text-xs sm:text-sm md:text-base leading-relaxed">
                  Personalized tips on how your child learns best
                </span>
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/30 transition-colors">
              <div className="p-4 sm:p-5 md:p-6 border-r border-slate-100/80 flex items-center gap-3">
                <XCircle className="text-slate-355 shrink-0 hidden sm:block" size={18} />
                <span className="text-slate-500 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                  Increases student stress
                </span>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-blue-50/10 border-l-2 border-l-blue-600 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden sm:block" size={18} />
                <span className="text-blue-900 font-bold text-xs sm:text-sm md:text-base leading-relaxed">
                  Helps your child learn and grow
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
