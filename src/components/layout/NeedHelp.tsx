import { Mail, ShieldAlert, Clock, Phone } from "lucide-react";
import Link from "next/link";

export default function NeedHelp() {
  return (
    <section id="support" className="py-10 md:py-14 lg:py-16 bg-white">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
        <div className="bg-white/95 backdrop-blur border border-slate-200/60 rounded-[32px] p-6 md:p-8 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl">
              Need Help? Parent Support Desk
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Our support desk is ready to help you and make your child&apos;s exam journey simple.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100/50 rounded-full text-blue-700 font-bold text-[10px] uppercase tracking-wider">
            <Clock size={11} className="stroke-[2.5]" />
            Commitment: 2-Hour Response
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: Email Support */}
          <div className="bg-slate-50/40 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[240px] transition-all hover:bg-slate-50 hover:border-blue-200/55 hover:shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600">
                <Mail size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Email Support</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Direct your queries to our academic support desk. Checked continuously.
                </p>
              </div>
            </div>
            <div className="space-y-2 mt-4 pt-3 border-t border-slate-200/50">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                <span>REPLY TIME</span>
                <span className="font-mono text-slate-550 font-extrabold uppercase">Within 24 Hours</span>
              </div>
              <a
                href="mailto:support@thecouragelibrary.com"
                className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] md:text-xs font-bold transition-all block shadow-sm shadow-blue-600/10 truncate px-2 border-none"
              >
                support@thecouragelibrary.com
              </a>
            </div>
          </div>

          {/* Card 2: Inquiry & Call Desk */}
          <div className="bg-slate-50/40 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[240px] transition-all hover:bg-slate-50 hover:border-blue-200/55 hover:shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600">
                <Phone size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Inquiry & Call Desk</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  For phone calls, dial <strong className="text-slate-700 font-bold">+91 83606 03173</strong>. Checked available.
                </p>
              </div>
            </div>
            <div className="space-y-2 mt-4 pt-3 border-t border-slate-200/50">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                <span>AVAILABILITY</span>
                <span className="font-mono text-blue-700 font-extrabold uppercase">Available Now</span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/contact"
                  className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/10"
                >
                  Message
                </Link>
                <a
                  href="tel:+918360603173"
                  className="flex-1 text-center py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 hover:border-slate-300 transition-all"
                >
                  Call
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Results & ID Recovery */}
          <div className="bg-slate-50/40 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[240px] transition-all hover:bg-slate-50 hover:border-blue-200/55 hover:shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600">
                <ShieldAlert size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Results & ID Recovery</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Lost your Candidate ID or need help with results? Access direct recovery tools.
                </p>
              </div>
            </div>
            <div className="space-y-2 mt-4 pt-3 border-t border-slate-200/50">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                <span>SELF SERVICE</span>
                <span className="font-mono text-slate-550 font-extrabold uppercase">Priority Desk</span>
              </div>
              <Link
                href="/recover-id"
                className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all block shadow-sm shadow-blue-600/10"
              >
                Recover Credentials
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
);
}
