import { HeartHandshake, HelpCircle, Landmark, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function WhySubsidized() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Heading and Mission */}
          <div className="space-y-6">
            <span className="inline-block text-[10px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Registration Subsidy & Mission
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
              Why is the CNTS registration fee only ₹99?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Standard cognitive profiling tests and diagnostic evaluations in India typically cost between ₹1,500 and ₹5,000, making them inaccessible to the majority of student families.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              To ensure that high-quality cognitive diagnostics are accessible to every student regardless of their economic background, the <strong>Courage Library Foundation</strong> has subsidized the Founding Edition registration fee to a nominal <strong>₹99</strong>. There are no hidden charges or upsells.
            </p>
            <div className="pt-2">
              <Link
                href="/parent-guide"
                className="text-xs font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 group"
              >
                Read our full Parent Confidence Guide
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right: Key Pillars */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Landmark size={18} className="text-blue-700" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Foundation Subsidized</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Funded by the Courage Library Foundation to foster cognitive and academic potential across India.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ShieldCheck size={18} className="text-emerald-700" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">One-Time Fee</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                A flat ₹99 fee covers registration, practice mock tests, the final exam, and the diagnostic report.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <HeartHandshake size={18} className="text-purple-700" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No Commercial Upsells</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We do not sell test prep courses, subscription plans, or reference books. Our focus is pure diagnostics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <HelpCircle size={18} className="text-amber-700" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Dedicated SLA Support</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Includes priority parent email support and WhatsApp updates, backed by our pre-exam response commitment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
