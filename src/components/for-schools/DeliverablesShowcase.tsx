import { BarChart3, Brain, Globe } from "lucide-react";

export default function DeliverablesShowcase() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Institutional Deliverables</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-2">
            What Your School Receives
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Clear, structured diagnostic reports designed for school leaders, department heads, and parents.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Deliverable 1: School Summary Report */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg mb-2">School Summary Report</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-6">
                Section-level diagnostic heatmaps identifying curriculum strengths, logical reasoning levels, and specific conceptual gaps across classes.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <BarChart3 size={32} className="text-blue-600 mx-auto mb-2" />
              <span className="text-[11px] font-bold text-slate-700">Class &amp; Section Conceptual Heatmap</span>
            </div>
          </div>

          {/* Deliverable 2: Student Talent Profile */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg mb-2">Student Talent Profile</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-6">
                Individual cognitive radar charts mapping 5 core dimensions: Logical Reasoning, Spatial Analysis, Pattern Recognition, Verbal Ability, and Numerical Logic.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <Brain size={32} className="text-emerald-600 mx-auto mb-2" />
              <span className="text-[11px] font-bold text-slate-700">Individual Student Skill Dossier</span>
            </div>
          </div>

          {/* Deliverable 3: National Benchmarks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg mb-2">National &amp; Board Benchmarks</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-6">
                Comparative percentile scores benchmarking your institution's average performance against state-wide and national board averages.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <Globe size={32} className="text-indigo-600 mx-auto mb-2" />
              <span className="text-[11px] font-bold text-slate-700">State &amp; National Percentile Matrix</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
