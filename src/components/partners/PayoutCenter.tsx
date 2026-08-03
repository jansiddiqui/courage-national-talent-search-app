'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Check
} from 'lucide-react';

export const PayoutCenter: React.FC = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('3100');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestsList, setRequestsList] = useState([
    { id: 'REQ-1042', amount: '₹3,100', date: 'Aug 3, 2026', batchDate: 'Monday, Aug 10, 2026', status: 'Pending Weekly Batch', method: 'Registered Payout Account' }
  ]);

  const transactions = [
    { id: 'TXN-9021', date: 'Aug 2, 2026', campaign: 'CNTS 2026 Referral Honorarium', amount: '₹1,500', status: 'Settled', method: 'UPI Instant' },
    { id: 'TXN-8840', date: 'Jul 28, 2026', campaign: 'Scholarship Drive Honorarium', amount: '₹1,000', status: 'Settled', method: 'Bank Transfer' },
    { id: 'TXN-8512', date: 'Jul 15, 2026', campaign: 'CNTS Mobilization Phase 1', amount: '₹600', status: 'Settled', method: 'UPI Instant' },
  ];

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: `₹${withdrawAmount}`,
      date: 'Aug 3, 2026',
      batchDate: 'Monday, Aug 10, 2026',
      status: 'Pending Weekly Batch',
      method: 'Registered Payout Account'
    };
    setRequestsList([newReq, ...requestsList]);
    setRequestSubmitted(true);
    setTimeout(() => setRequestSubmitted(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-200">
            <CreditCard className="w-3.5 h-3.5" /> Financial Settlement Portal
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Weekly Payout Requests & Balance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit weekly payout requests. All requested honorariums are processed every <strong>Monday</strong>.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">Next Weekly Disbursement</span>
          <span className="font-mono text-sm font-extrabold text-amber-950 flex items-center justify-end gap-1">
            <Clock className="w-4 h-4 text-amber-600" /> Monday, Aug 10, 2026
          </span>
        </div>
      </div>

      {/* BALANCE & STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-2">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Available Balance</span>
          <div className="font-mono text-3xl font-black text-emerald-400">₹3,100</div>
          <span className="text-[11px] text-emerald-300 block font-mono">124 Verified Registrations @ ₹25</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Pending Verifications</span>
          <div className="font-mono text-3xl font-black text-amber-600">₹500</div>
          <span className="text-[11px] text-slate-500 block">20 candidate registrations pending verification</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Lifetime Disbursed</span>
          <div className="font-mono text-3xl font-black text-indigo-950">₹3,100</div>
          <span className="text-[11px] text-slate-500 block">Total settled payouts to date</span>
        </div>
      </div>

      {/* SUBMIT WEEKLY PAYOUT WITHDRAWAL REQUEST CARD */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 border border-emerald-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Weekly Payout Request Portal
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Submit Payout Withdrawal Request
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Withdrawal requests submitted before Sunday 11:59 PM will be disbursed in the upcoming Monday batch.
            </p>
          </div>

          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
            Weekly Batch: Every Monday
          </span>
        </div>

        <form onSubmit={handleWithdrawalRequest} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Enter Amount to Withdraw (₹) *
              </label>
              <input
                type="number"
                min="100"
                max="3100"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-amber-300 text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <span className="text-[10.5px] text-slate-400 block mt-1">Min ₹100 | Max ₹3,100</span>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={requestSubmitted}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {requestSubmitted ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" /> Request Queued for Monday!
                  </>
                ) : (
                  <>
                    Submit Withdrawal Request <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* QUEUED WEEKLY PAYOUT REQUESTS TABLE */}
      {requestsList.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" /> Submitted Weekly Payout Requests Queue
            </h3>
            <span className="text-xs font-bold font-mono bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full">
              Disbursement Day: Monday
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-2">Request ID</th>
                  <th className="py-3 px-2">Requested Amount</th>
                  <th className="py-3 px-2">Request Date</th>
                  <th className="py-3 px-2">Scheduled Batch Date</th>
                  <th className="py-3 px-2">Target Account</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requestsList.map((req, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3.5 px-2 font-mono font-bold text-indigo-900">{req.id}</td>
                    <td className="py-3.5 px-2 font-mono font-bold text-emerald-700">{req.amount}</td>
                    <td className="py-3.5 px-2 text-slate-500">{req.date}</td>
                    <td className="py-3.5 px-2 font-semibold text-slate-900">{req.batchDate}</td>
                    <td className="py-3.5 px-2 text-slate-600">{req.method}</td>
                    <td className="py-3.5 px-2">
                      <span className="bg-amber-50 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-amber-200 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DISBURSEMENT TRANSACTION HISTORY */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Settled Disbursement History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-2">Txn ID</th>
                <th className="py-3 px-2">Disbursement Date</th>
                <th className="py-3 px-2">Campaign Source</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Payout Method</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {transactions.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-2 font-mono font-bold text-slate-900">{t.id}</td>
                  <td className="py-3.5 px-2 text-slate-500">{t.date}</td>
                  <td className="py-3.5 px-2 font-semibold text-slate-800">{t.campaign}</td>
                  <td className="py-3.5 px-2 font-mono font-bold text-emerald-700">{t.amount}</td>
                  <td className="py-3.5 px-2 text-slate-600">{t.method}</td>
                  <td className="py-3.5 px-2">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200 inline-flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
