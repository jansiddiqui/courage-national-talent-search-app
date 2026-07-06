import { HeartHandshake, HelpCircle, Landmark, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function WhySubsidized() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white via-slate-50/30 to-white border-b border-slate-100 relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Heading, Mission and Dynamic Comparison Card */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Reduced Fee & Mission
            </span>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Why is the CNTS exam fee{" "}
              <span className="text-blue-650 font-extrabold block sm:inline">only ₹99?</span>
            </h2>
            
            <div className="space-y-4 text-slate-650 text-sm md:text-base leading-relaxed font-medium">
              <p>
                In India, conceptual cognitive test reports usually cost ₹1,500 to ₹5,000. Most parents cannot afford this high barrier of entry.
              </p>
              <p>
                To make sure every student gets this opportunity, the <strong className="text-slate-800">Courage Library Foundation</strong> has subsidized the fee to only <strong className="text-slate-800">₹99</strong>. There are no hidden charges, and no books or courses will be sold to you later.
              </p>
            </div>

            {/* Visual SaaS Pricing Comparison Card */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-3.5 max-w-sm">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wide">
                <span>Standard Assessments</span>
                <span className="line-through font-mono text-slate-400">₹1,500 - ₹5,000</span>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex justify-between items-center text-sm font-extrabold text-slate-850">
                <span>CNTS Founding Fee</span>
                <span className="text-emerald-600 font-mono text-base font-black bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl shadow-sm">
                  ₹99 Only
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/parent-guide"
                className="text-sm font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 group"
              >
                Read our full Parent Confidence Guide
                <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right: Key Pillars - Grid with unified blue-coded interactive cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            
            {/* Sponsor Backed Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-slate-100/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/40 flex items-center justify-center text-blue-650 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent group-hover:scale-105 transition-all duration-300 shrink-0">
                <Landmark size={18} className="stroke-[2.2]" />
              </div>
              <h4 className="font-bold text-slate-850 text-base mt-4 mb-2">
                Reduced Fee (Sponsor Backed)
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Supported by the Courage Library Foundation to help students discover their natural talents across India.
              </p>
            </div>

            {/* Pay Only Once Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-slate-100/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/40 flex items-center justify-center text-blue-650 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent group-hover:scale-105 transition-all duration-300 shrink-0">
                <ShieldCheck size={18} className="stroke-[2.2]" />
              </div>
              <h4 className="font-bold text-slate-850 text-base mt-4 mb-2">
                Pay Only Once
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                A single ₹99 fee covers registration, practice papers, the main online exam, and the Brain Strength Report.
              </p>
            </div>

            {/* No Extra Sales Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-slate-100/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/40 flex items-center justify-center text-blue-650 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent group-hover:scale-105 transition-all duration-300 shrink-0">
                <HeartHandshake size={18} className="stroke-[2.2]" />
              </div>
              <h4 className="font-bold text-slate-850 text-base mt-4 mb-2">
                No Extra Sales
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                We do not sell books, courses, or coaching classes later. Our only goal is to evaluate your child&apos;s strengths.
              </p>
            </div>

            {/* Quick Help Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-slate-100/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/40 flex items-center justify-center text-blue-650 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent group-hover:scale-105 transition-all duration-300 shrink-0">
                <HelpCircle size={18} className="stroke-[2.2]" />
              </div>
              <h4 className="font-bold text-slate-850 text-base mt-4 mb-2">
                Quick Help (2-Hour Reply)
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Get direct assistance via our online support system and Email. Our support team replies within 2 hours to help you.
              </p>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
}
