'use client';

import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Share2, 
  TrendingUp, 
  CheckCircle2, 
  Check, 
  Sparkles, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { PayoutAccountModal } from './PayoutAccountModal';

interface PartnerOverviewProps {
  partnerName?: string;
  referralCode?: string;
  onOpenChildModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const PartnerOverview: React.FC<PartnerOverviewProps> = ({
  partnerName = 'Jan Mohammad',
  referralCode = 'CNTSJN',
  onOpenChildModal,
  onNavigateToTab
}) => {
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* EXECUTIVE PERFORMANCE ANALYTICS BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                Live Partner Referral Analytics
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                Total Registrations via Code ({referralCode})
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab?.('payouts')}
            className="btn-primary text-xs py-3 px-5 bg-emerald-500 hover:bg-emerald-600 font-bold text-slate-950 flex items-center justify-center gap-2 shadow-lg cursor-pointer rounded-2xl transition-all hover:scale-105"
          >
            <CreditCard className="w-4 h-4" /> Setup Payout UPI / Upload QR
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-4.5 rounded-2xl border border-slate-800 shadow-inner">
            <span className="text-slate-400 text-xs font-semibold block mb-1">Total Registrations</span>
            <div className="font-mono text-3xl font-black text-amber-300">124</div>
            <span className="text-[10.5px] text-slate-400 font-mono block mt-1">Verified Candidate Enrolments</span>
          </div>

          <div className="bg-slate-900/80 p-4.5 rounded-2xl border border-slate-800 shadow-inner">
            <span className="text-slate-400 text-xs font-semibold block mb-1">Total Honorarium Earned</span>
            <div className="font-mono text-3xl font-black text-emerald-400">₹3,100</div>
            <span className="text-[10.5px] text-emerald-400 block mt-1">₹25 per candidate (Max Capped)</span>
          </div>

          <div className="bg-slate-900/80 p-4.5 rounded-2xl border border-slate-800 shadow-inner">
            <span className="text-slate-400 text-xs font-semibold block mb-1">Referral Link Clicks</span>
            <div className="font-mono text-3xl font-black text-indigo-300">1,845</div>
            <span className="text-[10.5px] text-indigo-300 block mt-1">Total link visitors</span>
          </div>

          <div className="bg-slate-900/80 p-4.5 rounded-2xl border border-slate-800 shadow-inner">
            <span className="text-slate-400 text-xs font-semibold block mb-1">Conversion Rate</span>
            <div className="font-mono text-3xl font-black text-white">6.7%</div>
            <span className="text-[10.5px] text-emerald-400 block mt-1">High conversion partner</span>
          </div>
        </div>
      </div>

      {/* DUAL ROLE: REGISTER MY CHILD (₹0 WAIVER) QUICK BANNER */}
      <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-950 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-amber-950">
              Partner Child Fee Waiver (100% Waived)
            </h3>
            <p className="text-xs text-amber-900">
              As an official Courage Partner, enroll your own Class 5–8 children with ₹0 registration fee.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenChildModal}
          className="btn-primary text-xs py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shrink-0 cursor-pointer shadow"
        >
          Register My Child (₹0 Fee) <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* PRIVACY-PROTECTED REFERRAL CONVERSIONS ROSTER TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Verified Referral Conversions Roster
            </h3>
            <p className="text-xs text-slate-500">
              Anonymized student registration log via your referral code ({referralCode}) for student privacy compliance.
            </p>
          </div>
          <span className="text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full w-fit">
            124 Verified Enrolments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-2">Registration Ref ID</th>
                <th className="py-3 px-2">Region / District</th>
                <th className="py-3 px-2">Fee Status</th>
                <th className="py-3 px-2">Honorarium</th>
                <th className="py-3 px-2">Registered Date</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {[
                { refId: "CNTS-2026-8901", region: "Lucknow Region, UP", fee: "₹99 Paid", amount: "+₹25.00", date: "Aug 3, 2026", status: "Verified & Credited" },
                { refId: "CNTS-2026-7452", region: "Kanpur Region, UP", fee: "₹99 Paid", amount: "+₹25.00", date: "Aug 2, 2026", status: "Verified & Credited" },
                { refId: "CNTS-2026-6120", region: "Lucknow Region, UP", fee: "₹99 Paid", amount: "+₹25.00", date: "Aug 2, 2026", status: "Verified & Credited" },
                { refId: "CNTS-2026-4431", region: "Varanasi Region, UP", fee: "₹99 Paid", amount: "+₹25.00", date: "Aug 1, 2026", status: "Verified & Credited" },
                { refId: "CNTS-2026-3198", region: "Prayagraj Region, UP", fee: "₹99 Paid", amount: "+₹25.00", date: "Jul 31, 2026", status: "Verified & Credited" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3.5 px-2 font-mono font-bold text-indigo-900">{row.refId}</td>
                  <td className="py-3.5 px-2 font-semibold text-slate-700">{row.region}</td>
                  <td className="py-3.5 px-2 font-mono font-semibold text-slate-800">{row.fee}</td>
                  <td className="py-3.5 px-2 font-mono font-bold text-emerald-700">{row.amount}</td>
                  <td className="py-3.5 px-2 text-slate-500">{row.date}</td>
                  <td className="py-3.5 px-2">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-200 inline-flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYOUT ACCOUNT SETUP MODAL */}
      <PayoutAccountModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        partnerName={partnerName}
        referralCode={referralCode}
      />
    </div>
  );
};
