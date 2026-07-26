export default function AcademicTimeline() {
  const steps = [
    { num: "01", label: "Partnership Request" },
    { num: "02", label: "15-Min Briefing" },
    { num: "03", label: "School Code Issued" },
    { num: "04", label: "Student List Upload" },
    { num: "05", label: "Online Lab Test" },
    { num: "06", label: "AI & Faculty Eval" },
    { num: "07", label: "School Diagnostics" },
    { num: "08", label: "Student Profiles" },
    { num: "09", label: "Certificates & Medals" },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Operational Roadmap</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-2 mb-10">
          9-Stage Academic Lifecycle
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 text-center">
          {steps.map((step) => (
            <div key={step.num} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1">{step.num}</span>
              <span className="text-[11px] font-bold text-slate-800 leading-tight">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
