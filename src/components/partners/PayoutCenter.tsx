'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Check,
  AlertTriangle,
  X
} from 'lucide-react';

interface PayoutCenterProps {
  partnerName?: string;
  referralCode?: string;
  onNavigateToPaymentSetup?: () => void;
}

export const PayoutCenter: React.FC<PayoutCenterProps> = ({
  partnerName = 'Partner',
  referralCode = 'CNTSJN',
  onNavigateToPaymentSetup,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [partnerStats, setPartnerStats] = useState({
    totalHonorariumEarned: '₹0',
    totalRegistrations: 0
  });

  useEffect(() => {
    if (referralCode) {
      fetch(`/api/partner/stats?referralCode=${encodeURIComponent(referralCode)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPartnerStats({
              totalHonorariumEarned: data.totalHonorariumEarned || '₹0',
              totalRegistrations: data.totalRegistrations || 0
            });
          }
        })
        .catch(err => console.error('Failed to load partner stats:', err));
    }
  }, [referralCode]);

  useEffect(() => {
    fetch('/api/partner/payouts')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.requests) {
          setRequestsList(data.requests);
        }
      })
      .catch(err => console.error('Failed to load payouts:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    try {
      const res = await fetch('/api/partner/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: withdrawAmount })
      });
      const data = await res.json();
      if (data.success) {
        setRequestSubmitted(true);
        setWithdrawAmount('');
        if (data.request) {
          setRequestsList(prev => [data.request, ...prev]);
        }
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-block">
              MONDAY SETTLEMENT SYSTEM
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Payouts & Settlement Center
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Weekly honorarium settlements are dispatched every Monday directly to your registered UPI / Bank account.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToPaymentSetup}
            className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <CreditCard className="w-4 h-4 fill-white" /> Manage Payment Details & Rules
          </button>
        </div>
      </div>

      {/* PAYOUT METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Accumulated Honorarium
          </span>
          <div className="font-mono text-3xl font-black text-emerald-600">
            {partnerStats.totalHonorariumEarned}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Based on {partnerStats.totalRegistrations} verified student enrolments
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Settlement Frequency
          </span>
          <div className="font-mono text-2xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" /> Every Monday
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Automatic batch settlements for verified balances
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Minimum Withdrawal Threshold
          </span>
          <div className="font-mono text-3xl font-black text-indigo-600">
            ₹500
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Instant manual withdrawal requests enabled above ₹500
          </p>
        </div>
      </div>

      {/* WITHDRAWAL REQUEST FORM */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-indigo-600" /> Request Manual Honorarium Withdrawal
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manual withdrawal requests are processed within 24 hours to your verified UPI ID.
          </p>
        </div>

        {requestSubmitted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Withdrawal request submitted successfully! Our finance team will process it within 24 hours.
          </div>
        )}

        <form onSubmit={handleWithdrawalRequest} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Enter Amount to Withdraw (₹)
            </label>
            <input
              type="number"
              min="500"
              required
              placeholder="e.g. 1000"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Submit Withdrawal Request <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </button>
        </form>
      </div>

      {/* SETTLEMENT LOG TABLE */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" /> Settlement & Payout Log
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete record of your honorarium disbursements and withdrawal requests.
          </p>
        </div>

        {requestsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                {requestsList.map((req, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{req.id || `REQ-${idx + 1}`}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{new Date(req.created_at || Date.now()).toLocaleDateString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600">₹{req.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${
                        req.status === 'APPROVED' || req.status === 'SETTLED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {req.status || 'PENDING'}
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
              Once you start mobilizing student candidate registrations, your weekly honorarium payouts will be logged here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
