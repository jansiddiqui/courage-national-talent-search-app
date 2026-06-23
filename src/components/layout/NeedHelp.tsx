import { Mail, MessageSquare, ShieldAlert, Clock, Phone } from "lucide-react";
import Link from "next/link";

export default function NeedHelp() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 my-8 md:my-16">
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl">
              Need Help? Parent Support Desk
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Our support desk is ready to help you and make your child's exam journey simple.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 font-semibold text-[11px] uppercase tracking-wider">
            <Clock size={12} />
            Commitment: 2-Hour Response
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
                Direct your queries to our academic support desk. Checked continuously.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">Replies in 24 Hours</span>
              <a
                href="mailto:support@thecouragelibrary.com"
                className="text-xs font-bold text-blue-700 hover:text-blue-800 truncate pl-2"
              >
                support@thecouragelibrary.com
              </a>
            </div>
          </div>

          {/* Submit Inquiry & Calls */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Phone size={16} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Inquiry & Call Desk</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                For phone calls, dial <strong className="text-slate-700 font-bold">+91 83606 03173</strong>. For other issues, please use our online support system.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex justify-between items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono">Available Now</span>
              <div className="flex gap-2">
                <Link
                  href="/contact"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Write to Support
                </Link>
                <span className="text-slate-200">|</span>
                <a
                  href="tel:+918360603173"
                  className="text-xs font-bold text-blue-700 hover:text-blue-800"
                >
                  Call
                </a>
              </div>
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
                Lost your Candidate ID or need help with results? Access direct recovery tools.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">Priority Desk</span>
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
