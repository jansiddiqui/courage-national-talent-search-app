/* eslint-disable react/no-unescaped-entities */
"use client";

import { CheckCircle2, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

export default function ParticipationFeeSection() {
  return (
    <section id="participation-fee" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200 px-6 scroll-mt-24">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 mb-3">
            <CreditCard size={14} className="text-blue-600" /> Transparent Fee Structure
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-1">
            Programme participation fee
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-2 leading-relaxed">
            Transparent, simple fee structure with zero financial load or administrative hidden costs for participating schools.
          </p>
        </div>

        {/* Institutional Fee Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm max-w-3xl mx-auto text-left relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-slate-100 pb-8">
            
            {/* Fee Amount Display */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Student Fee</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl md:text-5xl font-display font-extrabold text-slate-900">₹99</span>
                <span className="text-sm font-semibold text-slate-500">/ student</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-tight">
                One-time fee for the CNTS 2026 Academic Assessment
              </p>
            </div>

            {/* Value Deliverables Included */}
            <div className="md:col-span-7 space-y-2.5">
              <h3 className="font-display font-bold text-slate-900 text-sm md:text-base mb-2">
                What the fee includes:
              </h3>
              
              <ul className="space-y-2 text-xs md:text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span>National Online Assessment Access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span>Individual Student Diagnostic Dossier</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span>Verifiable Digital Certificate of Merit / Participation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span>Section-Level Classroom Diagnostic Heatmaps</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span>Dedicated Regional School Coordination Support</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span>Zero Administrative Fee to the Institution</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span>No Hidden Charges or Subscription Renewal</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Trust Footnote Element */}
          <div className="pt-6 flex items-start gap-3 text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 mt-2">
            <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-900">Institutional Governance Note:</strong> The participation fee supports the secure administration of the national assessment, individual performance reporting, digital certification, and regional school coordination.
            </p>
          </div>

          {/* Action CTA */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-500">
              Need custom invoicing for institutionally sponsored pools?
            </span>
            <a
              href="#inquiry-form"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm min-h-[40px]"
            >
              Request a School Partnership <ArrowRight size={14} />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
