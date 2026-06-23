import { CheckCircle2, XCircle } from "lucide-react";

export default function WhyCNTS() {
  return (
    <section id="why-cnts" className="py-12 md:py-24 lg:py-32 mesh-bg">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full">
            Why CNTS
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
            What makes CNTS different
            <br />
            <span className="gradient-text">from school exams?</span>
          </h2>
          
          <div className="mt-8 p-6 md:p-8 rounded-3xl bg-blue-800 text-white shadow-xl shadow-blue-900/20 text-left md:text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400"></div>
            <p className="text-xl md:text-2xl font-medium leading-relaxed">
              &ldquo;A child can score 95% in school exams and still struggle with real-world logic, reasoning, or problem solving. CNTS helps discover those hidden strengths.&rdquo;
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          
          <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200">
            <div className="p-6 md:p-8 text-center border-r border-slate-200">
              <h3 className="font-display font-bold text-slate-500 text-lg md:text-xl uppercase tracking-wider">Most School Exams</h3>
            </div>
            <div className="p-6 md:p-8 text-center bg-blue-50/50">
              <h3 className="font-display font-black text-blue-800 text-lg md:text-xl uppercase tracking-wider">CNTS</h3>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Row 1 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/50 transition-colors">
              <div className="p-5 md:p-6 border-r border-slate-100 flex items-center gap-3">
                <XCircle className="text-slate-300 shrink-0 hidden md:block" size={20} />
                <span className="text-slate-600 font-medium text-sm md:text-base">Tests what a child remembers</span>
              </div>
              <div className="p-5 md:p-6 bg-blue-50/30 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden md:block" size={20} />
                <span className="text-blue-900 font-bold text-sm md:text-base">Tests how a child thinks and reasons</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/50 transition-colors">
              <div className="p-5 md:p-6 border-r border-slate-100 flex items-center gap-3">
                <XCircle className="text-slate-300 shrink-0 hidden md:block" size={20} />
                <span className="text-slate-600 font-medium text-sm md:text-base">Focuses only on school marks</span>
              </div>
              <div className="p-5 md:p-6 bg-blue-50/30 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden md:block" size={20} />
                <span className="text-blue-900 font-bold text-sm md:text-base">Focuses on real future potential</span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/50 transition-colors">
              <div className="p-5 md:p-6 border-r border-slate-100 flex items-center gap-3">
                <XCircle className="text-slate-300 shrink-0 hidden md:block" size={20} />
                <span className="text-slate-600 font-medium text-sm md:text-base">Gives only one total score</span>
              </div>
              <div className="p-5 md:p-6 bg-blue-50/30 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden md:block" size={20} />
                <span className="text-blue-900 font-bold text-sm md:text-base">Gives a Detailed Brain Strength Report</span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/50 transition-colors">
              <div className="p-5 md:p-6 border-r border-slate-100 flex items-center gap-3">
                <XCircle className="text-slate-300 shrink-0 hidden md:block" size={20} />
                <span className="text-slate-600 font-medium text-sm md:text-base">No details on strengths & weaknesses</span>
              </div>
              <div className="p-5 md:p-6 bg-blue-50/30 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden md:block" size={20} />
                <span className="text-blue-900 font-bold text-sm md:text-base">Personalized tips on how your child learns best</span>
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-2 hover:bg-slate-50/50 transition-colors">
              <div className="p-5 md:p-6 border-r border-slate-100 flex items-center gap-3">
                <XCircle className="text-slate-300 shrink-0 hidden md:block" size={20} />
                <span className="text-slate-600 font-medium text-sm md:text-base">Increases student stress</span>
              </div>
              <div className="p-5 md:p-6 bg-blue-50/30 flex items-center gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0 hidden md:block" size={20} />
                <span className="text-blue-900 font-bold text-sm md:text-base">Helps your child learn and grow</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
