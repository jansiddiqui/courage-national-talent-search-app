'use client';

import React, { useState, useEffect } from 'react';
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
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { PayoutAccountModal } from './PayoutAccountModal';

interface PartnerOverviewProps {
  partnerName?: string;
  referralCode?: string;
  onOpenChildModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const PartnerOverview: React.FC<PartnerOverviewProps> = ({
  partnerName = 'Partner',
  referralCode = 'CNTSJN',
  onOpenChildModal,
  onNavigateToTab
}) => {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [stats, setStats] = useState<{
    totalRegistrations: number;
    totalHonorariumEarned: string;
    honorariumRate: number;
    referralClicks: number;
    conversionRate: string;
    status: string;
    conversionsRoster: any[];
  }>({
    totalRegistrations: 0,
    totalHonorariumEarned: '₹0',
    honorariumRate: 25,
    referralClicks: 0,
    conversionRate: '0.0%',
    status: 'PENDING',
    conversionsRoster: []
  });

  useEffect(() => {
    if (referralCode) {
      fetch(`/api/partner/stats?referralCode=${encodeURIComponent(referralCode)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStats({
              totalRegistrations: data.totalRegistrations || 0,
              totalHonorariumEarned: data.totalHonorariumEarned || '₹0',
              honorariumRate: data.honorariumRate || 25,
              referralClicks: data.referralClicks || 0,
              conversionRate: data.conversionRate || '0.0%',
              status: data.status || 'PENDING',
              conversionsRoster: data.conversionsRoster || []
            });
          }
        })
        .catch(err => console.error('Failed to fetch partner stats:', err));
    }
  }, [referralCode]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* PENDING APPROVAL NOTICE BANNER (WHEN APPLICATION IS PENDING ADMIN REVIEW) */}
      {stats.status === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 shrink-0">
              <AlertTriangle className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-950 flex items-center gap-2">
                Application Under Verification & Review
              </h3>
              <p className="text-xs text-amber-900 mt-0.5">
                Your partner application (Code: <strong className="font-mono">{referralCode}</strong>) is under review by our Courage Admin Team. You can share your link and set up payouts while verification is in progress.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-200 text-amber-950 px-3.5 py-1.5 rounded-full shrink-0 border border-amber-400">
            Status: PENDING ADMIN APPROVAL
          </span>
        </div>
      )}

      {/* OVERVIEW METRICS HERO CARD */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-[10.5px] font-mono font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
              LIVE PARTNER REFERRAL ANALYTICS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white pt-2">
              Total Registrations via Code ({referralCode})
            </h2>
          </div>

          <button
            onClick={() => setShowPayoutModal(true)}
            className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" /> Setup Payout UPI / Upload QR
          </button>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Registrations</span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400 block">{stats.totalRegistrations}</span>
            <span className="text-[10px] text-slate-500 font-semibold block">Verified Candidate Enrolments</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Honorarium Earned</span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-400 block">{stats.totalHonorariumEarned}</span>
            <span className="text-[10px] text-emerald-500 font-semibold block">₹{stats.honorariumRate} per candidate (Admin Set)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Referral Link Clicks</span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-indigo-400 block">{stats.referralClicks.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-semibold block">Total link visitors</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Conversion Rate</span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-300 block">{stats.conversionRate}</span>
            <span className="text-[10px] text-emerald-400 font-semibold block">Verified referral performance</span>
          </div>
        </div>
      </div>

      {/* PARTNER CHILD FEE WAIVER CARD */}
      <div className="bg-amber-50/80 border border-amber-300/80 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-400 text-slate-950 shrink-0">
            <GraduationCap className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h3 className="font-bold text-base text-amber-950">
              Partner Child Fee Waiver (100% Waived)
            </h3>
            <p className="text-xs text-amber-900 mt-0.5">
              As an official Courage Partner, enroll your own Class 5–8 children with ₹0 registration fee.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenChildModal}
          className="w-full sm:w-auto py-3.5 px-6 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          Register My Child (₹0 Fee) <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* VERIFIED REFERRAL CONVERSIONS ROSTER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Verified Referral Conversions Roster
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Anonymized student registration log via your referral code ({referralCode}) for student privacy compliance.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
            {stats.totalRegistrations} Verified Enrolments
          </span>
        </div>

        {stats.conversionsRoster.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Candidate ID</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Exam Fee Status</th>
                  <th className="py-3 px-4">Honorarium Credit</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {stats.conversionsRoster.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors font-medium text-slate-800">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{item.refId}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.region}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{item.fee}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600">{item.amount}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{item.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" /> {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Users className="w-9 h-9 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-800">No Verified Candidate Registrations Yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Share your referral code <strong className="font-mono text-indigo-600">{referralCode}</strong> with parents, teachers, and students to start tracking live candidate mobilizations.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('referral')}
              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all inline-flex items-center gap-1.5 mt-2"
            >
              Get Referral Link & Media Kit <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* PAYOUT ACCOUNT MODAL */}
      <PayoutAccountModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        referralCode={referralCode}
      />
    </div>
  );
};
