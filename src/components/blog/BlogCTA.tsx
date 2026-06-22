import Link from "next/link";
import { ArrowRight, School, Sparkles } from "lucide-react";

export default function BlogCTA() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 not-prose">
      {/* Candidate Registration Card */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            <Sparkles size={10} className="text-amber-400" />
            National Assessment
          </div>
          <h4 className="font-display font-bold text-xl leading-tight">
            Register for Courage National Talent Search (CNTS)
          </h4>
          <p className="text-slate-350 text-xs leading-relaxed">
            Assess cognitive aptitude, verbal reasoning, mathematical logic, and critical thinking. Complete mapping reports + digital verifiable certificates included.
          </p>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-550 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer"
        >
          Register Candidate Now
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* School Partnership Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <School size={10} className="text-blue-700 shrink-0" />
            Institution Portal
          </div>
          <h4 className="font-display font-bold text-xl text-slate-950 leading-tight">
            Partner Schools & Group Enrollments
          </h4>
          <p className="text-slate-500 text-xs leading-relaxed">
            Get school dashboard access to manage registrations, upload rosters in bulk via Excel, track progress, and unlock comparison matrices.
          </p>
        </div>
        <Link
          href="/for-schools"
          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          Partner School Program
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
