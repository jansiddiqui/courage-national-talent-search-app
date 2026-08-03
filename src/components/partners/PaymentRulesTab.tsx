'use client';

import React from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  FileText, 
  AlertCircle, 
  Award,
  CheckCircle2
} from 'lucide-react';

interface PaymentRulesTabProps {
  audienceScale?: string;
}

export const PaymentRulesTab: React.FC<PaymentRulesTabProps> = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3.5 border-b border-slate-800/80 pb-4">
          <div className="p-3.5 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Official Policy Guidelines
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              Partner Honorarium & Settlement Rules
            </h1>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Read all official rules governing partner revenue share rates, weekly payout requests, Monday batch SLA, and tax/TDS compliance.
        </p>
      </div>

      {/* POLICY RULES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <CreditCard className="w-5 h-5 text-indigo-600" /> Revenue Share Rate (25% Max)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Courage Partners receive <strong>₹25.00 per verified candidate registration</strong> (25% revenue share max of the ₹99 CNTS exam fee).
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Clock className="w-5 h-5 text-emerald-600" /> Weekly Monday Payout SLA
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All submitted withdrawal requests are queued and processed <strong>Weekly every Monday</strong>. Requests submitted before Sunday 11:59 PM are included in Monday's batch.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <FileText className="w-5 h-5 text-amber-600" /> 5% TDS Compliance (Section 194H)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            A standard <strong>5% TDS</strong> is deducted under Section 194H for PAN-verified partner accounts. Form 16A statements are issued quarterly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Fraud Prevention & Verification
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Candidate registrations undergo automated duplicate & IP verification. Honorarium credits trigger upon verified ₹99 fee settlement.
          </p>
        </div>
      </div>
    </div>
  );
};
