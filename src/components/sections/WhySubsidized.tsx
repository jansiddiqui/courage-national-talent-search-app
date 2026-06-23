import { HeartHandshake, HelpCircle, Landmark, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function WhySubsidized() {
  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Heading and Mission */}
          <div className="space-y-6">
            <span className="inline-block text-[10px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Reduced Fee & Mission
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
              Why is the CNTS exam fee only ₹99?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              In India, logic and reasoning test reports usually cost ₹1,500 to ₹5,000. Most parents cannot afford this.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              To make sure every student gets this opportunity, the <strong>Courage Library Foundation</strong> has reduced the fee to only <strong>₹99</strong>. There are no hidden fees, and no books or courses will be sold to you later.
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
              <h4 className="font-bold text-slate-800 text-sm">Reduced Fee (Sponsor Backed)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Supported by the Courage Library Foundation to help students discover their natural talents across India.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ShieldCheck size={18} className="text-emerald-700" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Pay Only Once</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                A single ₹99 fee covers registration, practice papers, the main online exam, and the Brain Strength Report.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <HeartHandshake size={18} className="text-purple-700" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No Extra Sales (Coaching/Books)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We do not sell books, courses, or coaching classes later. Our only goal is to evaluate your child's strengths.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <HelpCircle size={18} className="text-amber-700" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Quick Help (2-Hour Reply)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get direct assistance via our online support system and Email. Our support team replies within 2 hours to help you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
