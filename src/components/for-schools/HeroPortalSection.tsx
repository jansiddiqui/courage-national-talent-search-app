import Link from "next/link";
import { Building, School, ArrowRight, Download, ShieldCheck, FileText, PhoneCall, Rocket } from "lucide-react";
import InquiryForm from "./InquiryForm";

export default function HeroPortalSection() {
  return (
    <section className="pt-24 md:pt-32 pb-16 px-6 border-b border-slate-200 bg-white relative overflow-hidden">
      
      {/* Subtle light mesh ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (60% Desktop - lg:col-span-7) */}
          <div className="lg:col-span-7 text-left">
            
            {/* Official Institutional Badge */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 tracking-wide shadow-sm">
                <Building size={14} className="text-blue-600" />
                <span>Founding Partner School Cohort — 2026 Academic Session</span>
              </div>
              <Link
                href="/schools"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-xs font-bold text-slate-700 transition-all shadow-2xs"
              >
                <School size={13} className="text-blue-600" />
                <span>Browse Partner Schools</span>
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-slate-900 mb-4 leading-tight">
              Discover potential beyond marks: CNTS 2026 Founding Edition
            </h1>

            <p className="text-slate-600 text-sm md:text-base mb-6 font-normal leading-relaxed">
              Supporting schools across India in evaluating student cognitive reasoning, analytical logic, and conceptual problem-solving in Classes 5–8 at zero administrative cost.
            </p>

            {/* Academic Review Reassurance Note */}
            <div className="flex items-start gap-3 text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3.5 rounded-xl mb-6">
              <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-900">Academic Review Note:</strong> Every partnership request is personally reviewed by the CNTS Academic Partnerships Team prior to institutional onboarding.
              </p>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <a
                href="#inquiry-form"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all min-h-[46px]"
              >
                Request a School Partnership <ArrowRight size={16} />
              </a>
              <a
                href="#official-documents"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition-all min-h-[46px]"
              >
                <Download size={16} className="text-slate-500" /> Access Official Documents
              </a>
            </div>

            {/* 3-Step Zero-Load Process Roadmap */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 md:p-5 mt-2">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Implementation Process</span>
                  <h3 className="text-xs md:text-sm font-display font-bold text-slate-900 mt-0.5">
                    Your School Partnership Journey
                  </h3>
                </div>
                <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                  Zero Staff Strain
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 shrink-0">
                    <FileText size={15} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">1. Prospectus</h4>
                  <p className="text-slate-500 text-[10px] leading-tight">Digital brochure download</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 shrink-0">
                    <PhoneCall size={15} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">2. Academic Briefing</h4>
                  <p className="text-slate-500 text-[10px] leading-tight">Call with Relationship Officer</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 shrink-0">
                    <Rocket size={15} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">3. Zero-Cost Setup</h4>
                  <p className="text-slate-500 text-[10px] leading-tight">Online lab hosting &amp; roll numbers</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (40% Desktop - lg:col-span-5) - Integrated Form Card */}
          <div className="lg:col-span-5 w-full relative z-10">
            <InquiryForm />
          </div>

        </div>
      </div>
    </section>
  );
}
