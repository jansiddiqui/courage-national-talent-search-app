'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Check,
  AlertTriangle,
  X,
  Lock,
  Sparkles,
  Share2,
  Copy,
  Zap,
  Video,
  QrCode,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

import { WorkspaceTab } from './PartnerWorkspaceLayout';

interface PayoutCenterProps {
  partnerName?: string;
  referralCode?: string;
  onNavigateToPaymentSetup?: () => void;
  onNavigateTab?: (tabId: WorkspaceTab) => void;
  onNavigateToGrowth?: () => void;
  onNavigateToMissions?: () => void;
  onNavigateToReferral?: () => void;
}

export const PayoutCenter: React.FC<PayoutCenterProps> = ({
  partnerName = 'Partner',
  referralCode = 'CNTSJN',
  onNavigateToPaymentSetup,
  onNavigateTab,
  onNavigateToGrowth,
  onNavigateToMissions,
  onNavigateToReferral,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Content Creation Modal state when balance < ₹500
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Real Honorarium & Payout metrics
  const [payoutStats, setPayoutStats] = useState({
    totalEarned: 0,
    totalEarnedFormatted: '₹0',
    totalWithdrawn: 0,
    totalWithdrawnFormatted: '₹0',
    availableBalance: 0,
    availableBalanceFormatted: '₹0',
    canWithdraw: false,
    minThreshold: 500,
    shortfall: 500,
    verifiedRegistrations: 0,
    honorariumRate: 25,
  });

  const activeRefCode = referralCode || 'CNTSJN';
  const referralLink = `https://thecouragelibrary.com/register?ref=${activeRefCode}`;

  const navigateTo = (tabId: WorkspaceTab) => {
    setIsContentModalOpen(false);
    if (onNavigateTab) {
      onNavigateTab(tabId);
    } else if (tabId === 'growth' && onNavigateToGrowth) {
      onNavigateToGrowth();
    } else if (tabId === 'missions' && onNavigateToMissions) {
      onNavigateToMissions();
    } else if (tabId === 'referral' && onNavigateToReferral) {
      onNavigateToReferral();
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(activeRefCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const message = `🌟 Discover your child's academic potential with the Courage National Talent Search (CNTS 2026)! India's premier scholarship & talent discovery exam for Class 5–10 students with awards up to ₹51,000.\n\n👉 Register now using my official referral link:\n${referralLink}\nOr enter Referral Code: ${activeRefCode}\n\n100% online exam with detailed national performance diagnosis & merit certificates!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const loadPayoutData = () => {
    setLoading(true);
    fetch('/api/partner/payouts')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.requests) {
            setRequestsList(data.requests);
          }
          const avail = Number(data.availableBalance || 0);
          const earned = Number(data.totalEarned || 0);
          const withdrawn = Number(data.totalWithdrawn || 0);
          const minT = Number(data.minThreshold || 500);
          const shortfall = Math.max(0, minT - avail);
          const canW = Boolean(data.canWithdraw ?? (avail >= minT));

          setPayoutStats({
            totalEarned: earned,
            totalEarnedFormatted: data.totalEarnedFormatted || `₹${earned.toLocaleString('en-IN')}`,
            totalWithdrawn: withdrawn,
            totalWithdrawnFormatted: data.totalWithdrawnFormatted || `₹${withdrawn.toLocaleString('en-IN')}`,
            availableBalance: avail,
            availableBalanceFormatted: data.availableBalanceFormatted || `₹${avail.toLocaleString('en-IN')}`,
            canWithdraw: canW,
            minThreshold: minT,
            shortfall,
            verifiedRegistrations: Number(data.verifiedRegistrations || 0),
            honorariumRate: Number(data.honorariumRate || 25),
          });
        }
      })
      .catch(err => console.error('Failed to load payouts data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPayoutData();
  }, [referralCode]);

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRequestSubmitted(false);

    const numericAmount = Number(withdrawAmount);

    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Please enter a valid withdrawal amount.');
      return;
    }

    // Check if available balance is below ₹500 threshold
    if (payoutStats.availableBalance < 500 || !payoutStats.canWithdraw) {
      setIsContentModalOpen(true);
      setErrorMessage(`Minimum available balance of ₹500 required to withdraw. Your current balance is ${payoutStats.availableBalanceFormatted}.`);
      return;
    }

    if (numericAmount < 500) {
      setErrorMessage('Minimum withdrawal amount is ₹500.');
      return;
    }

    if (numericAmount > payoutStats.availableBalance) {
      setErrorMessage(`Withdrawal amount (₹${numericAmount.toLocaleString('en-IN')}) cannot exceed your available balance of ${payoutStats.availableBalanceFormatted}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/partner/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numericAmount })
      });
      const data = await res.json();
      if (data.success) {
        setRequestSubmitted(true);
        setWithdrawAmount('');
        if (data.request) {
          setRequestsList(prev => [data.request, ...prev]);
        }
        // Update local available balance
        if (typeof data.newAvailableBalance === 'number') {
          const newAvail = data.newAvailableBalance;
          setPayoutStats(prev => ({
            ...prev,
            availableBalance: newAvail,
            availableBalanceFormatted: `₹${newAvail.toLocaleString('en-IN')}`,
            totalWithdrawn: prev.totalWithdrawn + numericAmount,
            totalWithdrawnFormatted: `₹${(prev.totalWithdrawn + numericAmount).toLocaleString('en-IN')}`,
            canWithdraw: newAvail >= prev.minThreshold,
            shortfall: Math.max(0, prev.minThreshold - newAvail),
          }));
        } else {
          loadPayoutData();
        }
      } else {
        if (data.code === 'INSUFFICIENT_BALANCE' || payoutStats.availableBalance < 500) {
          setIsContentModalOpen(true);
        }
        setErrorMessage(data.error || 'Failed to submit withdrawal request.');
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      setErrorMessage('Network error while submitting withdrawal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setQuickAmount = (amount: number) => {
    setWithdrawAmount(String(amount));
    setErrorMessage(null);
  };

  const progressPercent = Math.min(100, Math.round((payoutStats.availableBalance / payoutStats.minThreshold) * 100));
  const estimatedStudentsNeeded = Math.ceil(payoutStats.shortfall / (payoutStats.honorariumRate || 25));

  return (
    <div className="space-y-8 animate-fade-in font-sans text-slate-900">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-block">
              WEEKLY MONDAY SETTLEMENT SYSTEM
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Payouts & Settlement Center
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Honorarium is credited according to candidate registrations mobilized via referral code <span className="font-mono font-bold text-indigo-600">{activeRefCode}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToPaymentSetup}
            className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" /> Manage Payout UPI & Rules
          </button>
        </div>
      </div>

      {/* 2. PAYOUT METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Available Balance to Withdraw */}
        <div className={`p-6 rounded-3xl border shadow-xs space-y-3 relative overflow-hidden ${
          payoutStats.canWithdraw 
            ? 'bg-gradient-to-br from-emerald-50/70 via-white to-white border-emerald-200' 
            : 'bg-gradient-to-br from-amber-50/70 via-white to-white border-amber-200/90'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono font-extrabold text-slate-500 uppercase tracking-wider block">
              Available to Withdraw
            </span>
            {payoutStats.canWithdraw ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Ready
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-700" /> Locked (&lt; ₹500)
              </span>
            )}
          </div>

          <div className={`font-mono text-3.5xl font-black ${
            payoutStats.canWithdraw ? 'text-emerald-600' : 'text-slate-900'
          }`}>
            {payoutStats.availableBalanceFormatted}
          </div>

          {/* Progress bar towards ₹500 */}
          {!payoutStats.canWithdraw && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>₹500 Threshold</span>
                <span className="font-mono text-amber-700 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-amber-800 font-medium">
                ₹{payoutStats.shortfall.toLocaleString('en-IN')} more needed to unlock withdrawal
              </p>
            </div>
          )}

          {payoutStats.canWithdraw && (
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant manual or weekly batch payout ready
            </p>
          )}
        </div>

        {/* Card 2: Total Accumulated Honorarium */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[10.5px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">
            Accumulated Honorarium
          </span>
          <div className="font-mono text-3xl font-black text-slate-900">
            {payoutStats.totalEarnedFormatted}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Earned from <strong className="text-slate-800">{payoutStats.verifiedRegistrations}</strong> verified candidate referrals (₹{payoutStats.honorariumRate}/reg)
          </p>
          {payoutStats.totalWithdrawn > 0 && (
            <div className="text-[11px] text-slate-400 font-mono pt-1">
              Withdrawn / Queued: <span className="font-bold text-slate-600">{payoutStats.totalWithdrawnFormatted}</span>
            </div>
          )}
        </div>

        {/* Card 3: Settlement Schedule & Minimum Threshold */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[10.5px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">
            Minimum Threshold & Schedule
          </span>
          <div className="font-mono text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-indigo-600">₹500</span> / <Clock className="w-5 h-5 text-slate-400" /> Weekly
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Requests ≥ ₹500 are queued and settled every Monday to verified UPI/Bank.
          </p>
        </div>
      </div>

      {/* 3. WITHDRAWAL REQUEST OR INCENTIVE LOCKED SECTION */}
      {payoutStats.canWithdraw ? (
        /* CASE A: Partner HAS >= ₹500 available — ACTIVE WITHDRAWAL FORM */
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-200/90 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" /> Request Honorarium Withdrawal
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Available balance to withdraw: <strong className="font-mono text-emerald-600 text-sm font-bold">{payoutStats.availableBalanceFormatted}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl font-bold">
                Eligible for Immediate Request
              </span>
            </div>
          </div>

          {requestSubmitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Withdrawal request submitted successfully! It will be settled in the upcoming Monday batch.
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleWithdrawalRequest} className="space-y-5 max-w-lg">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Enter Withdrawal Amount (₹500 – {payoutStats.availableBalanceFormatted})
              </label>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-base">
                  ₹
                </span>
                <input
                  type="number"
                  min="500"
                  max={payoutStats.availableBalance}
                  required
                  placeholder="e.g. 500"
                  value={withdrawAmount}
                  onChange={e => {
                    setWithdrawAmount(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-9 pr-4 py-3.5 rounded-2xl border border-slate-200 text-base font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="text-[11px] font-bold text-slate-400 self-center">Quick Select:</span>
                <button
                  type="button"
                  onClick={() => setQuickAmount(500)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  ₹500
                </button>
                {payoutStats.availableBalance >= 1000 && (
                  <button
                    type="button"
                    onClick={() => setQuickAmount(1000)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    ₹1,000
                  </button>
                )}
                {payoutStats.availableBalance >= 2500 && (
                  <button
                    type="button"
                    onClick={() => setQuickAmount(2500)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    ₹2,500
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setQuickAmount(payoutStats.availableBalance)}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Max ({payoutStats.availableBalanceFormatted})
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <span>Submit Withdrawal Request</span>
                  {withdrawAmount ? <span className="font-mono">(₹{Number(withdrawAmount).toLocaleString('en-IN')})</span> : null}
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* CASE B: Partner HAS < ₹500 available — LOCKED INCENTIVE CARD WITH POPUP TRIGGER */
        <div className="bg-gradient-to-br from-amber-50/90 via-white to-indigo-50/40 rounded-3xl p-6 md:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-amber-100 pb-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                <Lock className="w-3.5 h-3.5 text-amber-700" /> Minimum Withdrawal Threshold: ₹500
              </div>
              <h3 className="font-display font-black text-xl text-slate-900">
                Withdrawal Locked — Minimum ₹500 Required
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                You currently have <strong className="font-mono text-slate-900 font-bold">{payoutStats.availableBalanceFormatted}</strong> in available honorarium. Mobilize student candidate enrolments using your referral code <span className="font-mono text-indigo-600 font-bold">{activeRefCode}</span> to reach ₹500 and unlock payouts!
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs shrink-0 sm:text-right space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Shortfall to Unlock
              </span>
              <div className="font-mono text-2xl font-black text-amber-700">
                ₹{payoutStats.shortfall.toLocaleString('en-IN')}
              </div>
              <span className="text-[10.5px] text-slate-500 block font-medium">
                ≈ {estimatedStudentsNeeded} more student registration{estimatedStudentsNeeded > 1 ? 's' : ''} (at ₹{payoutStats.honorariumRate}/reg)
              </span>
            </div>
          </div>

          {/* Progress Bar & CTA Row */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Progress toward withdrawal unlock
              </span>
              <span className="font-mono text-slate-900 font-extrabold">{payoutStats.availableBalanceFormatted} / ₹500 ({progressPercent}%)</span>
            </div>
            
            <div className="w-full bg-white h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div 
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons to Create Content / Request Withdrawal */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
            {/* Primary Action Button: Unlock Withdrawal */}
            <button
              type="button"
              onClick={() => setIsContentModalOpen(true)}
              className="w-full lg:w-auto p-3.5 sm:px-6 sm:py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between sm:justify-center gap-3 group text-left sm:text-center shrink-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 min-w-0">
                  <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white block">
                    Unlock Withdrawal
                  </span>
                  <span className="hidden sm:inline text-indigo-200/80 font-medium text-xs">—</span>
                  <span className="text-[11px] sm:text-xs text-indigo-200 font-medium block truncate">
                    Create Content with Code
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors sm:bg-transparent sm:w-auto sm:h-auto">
                <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
              </div>
            </button>

            {/* Quick Share Secondary Actions */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full lg:w-auto">
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="py-3 px-3.5 sm:px-4 bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] text-emerald-800 border border-emerald-200/90 font-extrabold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={copyReferralCode}
                className="py-3 px-3.5 sm:px-4 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 border border-slate-200/90 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <Copy className="w-4 h-4 text-slate-500 shrink-0" />}
                <span className="truncate font-mono">{copiedCode ? 'Copied!' : activeRefCode}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SETTLEMENT & PAYOUT LOG TABLE */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" /> Settlement & Payout Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete historical record of your honorarium withdrawals and batch disbursements.
            </p>
          </div>
          {requestsList.length > 0 && (
            <span className="text-xs font-mono font-bold text-slate-500">
              {requestsList.length} Request{requestsList.length > 1 ? 's' : ''} Logged
            </span>
          )}
        </div>

        {requestsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Batch Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                {requestsList.map((req, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{req.reqId || req.id || `REQ-${idx + 1}`}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{req.date || new Date().toLocaleDateString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600">{req.amount || `₹${req.rawAmount}`}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{req.batchDate || 'Upcoming Monday'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${
                        req.status === 'APPROVED' || req.status === 'SETTLED' || req.status === 'Disbursed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : req.status === 'REJECTED'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {req.status || 'Pending Weekly Batch'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-xs text-slate-700">No Settlement Transactions Logged Yet</h4>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Once you mobilize student registrations and submit a withdrawal request, your payout history will be logged here.
            </p>
          </div>
        )}
      </div>

      {/* 5. POPUP MODAL: CREATE CONTENT WITH REFERRAL CODE TO UNLOCK WITHDRAWAL */}
      {isContentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full p-5 sm:p-7 space-y-5 relative max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsContentModalOpen(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all flex items-center justify-center active:scale-95 cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 pr-10">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Unlock Honorarium Withdrawal
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                Earn Honorarium with Your Referral Code
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                To request a withdrawal, you need a minimum available balance of <strong className="text-slate-900">₹500</strong>. You earn <strong className="text-emerald-600 font-mono font-bold">₹{payoutStats.honorariumRate}</strong> for every verified student who registers using your code!
              </p>
            </div>

            {/* Premium Dual-Tone Balance & Progress Meter Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm relative overflow-hidden space-y-3">
              {/* Subtle Glow Accent */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between gap-2 relative z-10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block">
                    Current Available Balance
                  </span>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">
                    {payoutStats.availableBalanceFormatted}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block">
                    Target Threshold
                  </span>
                  <div className="font-mono text-lg sm:text-xl font-bold text-amber-300 mt-0.5">
                    ₹500
                  </div>
                </div>
              </div>

              {/* Progress Bar with Glow */}
              <div className="space-y-1.5 relative z-10">
                <div className="w-full bg-slate-800/90 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-300 h-full rounded-full transition-all duration-500 shadow-xs" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                  <span>Shortfall: <strong className="text-amber-300 font-mono">₹{payoutStats.shortfall.toLocaleString('en-IN')}</strong></span>
                  <span className="font-mono text-slate-300">≈ {estimatedStudentsNeeded} registration{estimatedStudentsNeeded > 1 ? 's' : ''} needed</span>
                </div>
              </div>
            </div>

            {/* Referral Assets Container (Responsive 2-Col on Desktop, Stack on Mobile) */}
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3.5">
              <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Your Official Referral Assets
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Code Card */}
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Referral Code</span>
                    <span className="font-mono font-black text-sm sm:text-base text-indigo-700 tracking-wider truncate block">
                      {activeRefCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyReferralCode}
                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                {/* Link Card */}
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Direct Link</span>
                    <span className="font-mono text-xs text-slate-600 truncate block">
                      {referralLink}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyReferralLink}
                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Standout WhatsApp Share CTA */}
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Share Referral Invitation on WhatsApp (1-Click)</span>
              </button>
            </div>

            {/* 3 Action Cards (3-Column Grid on Windows / Desktop, Smooth Stack on Mobile) */}
            <div className="space-y-2.5">
              <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Quick Ways to Mobilize Registrations
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Option 1: AI Studio */}
                <div 
                  onClick={() => navigateTo('growth')}
                  className="bg-white hover:bg-indigo-50/50 border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-3.5 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Zap className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        AI Content Studio
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Generate reels, hooks & WhatsApp posts in seconds.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2.5 flex items-center gap-1 text-[11px] font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Option 2: Video Missions */}
                <div 
                  onClick={() => navigateTo('missions')}
                  className="bg-white hover:bg-amber-50/50 border border-slate-200/90 hover:border-amber-300 rounded-2xl p-3.5 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Video className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        Video Missions
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        High-converting video scripts for Class 5–10 students.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2.5 flex items-center gap-1 text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Topics</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Option 3: Download QR */}
                <div 
                  onClick={() => navigateTo('referral')}
                  className="bg-white hover:bg-emerald-50/50 border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-3.5 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <QrCode className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        Printable QR Poster
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Custom QR poster for tuition centers & school batches.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2.5 flex items-center gap-1 text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                    <span>Get Poster</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Close / Action Footer */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsContentModalOpen(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl active:scale-[0.99] transition cursor-pointer"
              >
                I'll Start Mobilizing Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

