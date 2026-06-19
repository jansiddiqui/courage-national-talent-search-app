import { Mail, MessageSquare, ShieldAlert, Clock } from "lucide-react";
import Link from "next/link";

export default function NeedHelp() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 my-16">
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl">
              Need Assistance? Parent Support SLA
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Our support desk is dedicated to making your child's assessment journey seamless.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 font-semibold text-[11px] uppercase tracking-wider">
            <Clock size={12} />
            Commitment: 24h SLA
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Email Support Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                <Mail size={16} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Email Support</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Direct queries to our academic support desk. Checked continuously.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">SLA: 24-48 Hours</span>
              <a
                href="mailto:support@thecouragelibrary.com"
                className="text-xs font-bold text-blue-700 hover:text-blue-800 truncate pl-2"
              >
                support@thecouragelibrary.com
              </a>
            </div>
          </div>

          {/* Submit Inquiry Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <MessageSquare size={16} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Submit Inquiry</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Have a registration question, billing issue, or school inquiry? Send a request directly to our team.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">SLA: 2-4 Hours</span>
              <Link
                href="/contact"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* FAQ Hub Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                <ShieldAlert size={16} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Results & ID Recovery</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Lost your Candidate ID or need clarification regarding results? Access direct tools.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">SLA: Priority Desk</span>
              <Link
                href="/recover-id"
                className="text-xs font-bold text-purple-700 hover:text-purple-800"
              >
                Recover Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
