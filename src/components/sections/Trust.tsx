import { Shield, Award, Users, Brain, Globe, FileText, GraduationCap, Compass, Cpu, BarChart3 } from "lucide-react";

const partners = [
  { name: "CBSE Curriculum", icon: GraduationCap },
  { name: "ICSE Curriculum", icon: Award },
  { name: "State Board Syllabus", icon: Compass },
  { name: "Cognitive Aptitude Framework", icon: Cpu },
  { name: "Diagnostic Analysis", icon: BarChart3 },
];

const trustPoints = [
  {
    icon: Users,
    title: "Designed by Educators",
    desc: "Crafted by leading educational developers to assess child aptitude, spatial logic, and critical thinking.",
  },
  {
    icon: Globe,
    title: "National Benchmarking",
    desc: "Understand exactly where your child stands relative to peers across multiple Indian states.",
  },
  {
    icon: Shield,
    title: "Secure Student Data",
    desc: "100% private student records, stored securely with zero commercial ads or third-party sharing.",
  },
  {
    icon: Brain,
    title: "Detailed Talent Profile",
    desc: "Go beyond marks. Receive a multi-dimensional assessment of reasoning, logic, and creativity.",
  },
  {
    icon: FileText,
    title: "Actionable Guidance Report",
    desc: "Receive customized feedback suggestions to nurture your child's natural learning style.",
  },
  {
    icon: Award,
    title: "Certificate for Every Child",
    desc: "Every participating student is awarded a verifiable digital certificate of achievement.",
  },
];

export default function Trust() {
  return (
    <section className="py-10 md:py-14 lg:py-16 bg-white border-y border-slate-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Partner strip - Upgraded with custom icons and group animations */}
        <div className="text-center mb-10">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6">
            Curriculum Alignment & Focus
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-bold bg-white border border-slate-200/60 rounded-full text-slate-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-0.5 transition-all duration-300 cursor-default shadow-sm group"
              >
                <p.icon size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent my-10" />

        {/* Trust points heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Scientific Framework
          </span>
          <h3 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
            Why Parents Trust CNTS
          </h3>
          <p className="text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
            A scientifically designed cognitive assessment built for long-term educational growth.
          </p>
        </div>

        {/* Trust points grid - SaaS Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((t) => (
            <div
              key={t.title}
              className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-gradient-to-b from-white to-slate-50/20 hover:to-slate-50/50 border border-slate-200/60 hover:border-blue-300/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/[0.02] transition-all duration-300 group"
            >
              {/* Icon container with hover inversion micro-animation */}
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-700 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-350 shadow-sm">
                <t.icon size={18} className="stroke-[2.2]" />
              </div>
              
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 text-base">{t.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-sans">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
