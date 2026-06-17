import { Shield, Award, Users, Brain, Globe, FileText, Landmark } from "lucide-react";
import Link from "next/link";

const partners = [
  "CBSE Curriculum",
  "ICSE Curriculum",
  "State Board Syllabus",
  "Cognitive Aptitude Framework",
  "Diagnostic Analysis",
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
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Partner strip */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Curriculum Alignment & Focus
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((p) => (
              <div
                key={p}
                className="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-500 hover:text-blue-700 hover:border-blue-100 hover:bg-blue-50 transition-all cursor-default"
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-10" />

        {/* Trust points heading */}
        <div className="text-center mb-10">
          <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
            Why Parents Trust CNTS
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            A scientifically designed cognitive assessment built for long-term educational growth.
          </p>
        </div>

        {/* Trust points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((t) => (
            <div
              key={t.title}
              className="flex flex-col items-start gap-3 p-6 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <t.icon size={18} className="text-blue-700" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm mb-1">{t.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* School Recognition Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Landmark size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">For Schools & Institutions</h4>
              <p className="text-xs text-slate-500 mt-1">
                Schools registering 25 or more candidates will receive a formal, verified <strong>School Participation Recognition Certificate</strong>.
              </p>
            </div>
          </div>
          <Link
            href="/for-schools"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 whitespace-nowrap bg-white border border-slate-200 px-5 py-3 rounded-xl hover:bg-slate-50 hover:border-blue-200 transition-all shrink-0 shadow-sm"
          >
            Access School Portal &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

