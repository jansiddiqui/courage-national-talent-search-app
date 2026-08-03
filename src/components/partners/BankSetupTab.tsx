'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Building, 
  CheckCircle2, 
  Check, 
  ShieldCheck,
  Lock,
  Sparkles
} from 'lucide-react';

export const BankSetupTab: React.FC = () => {
  const [bankSubTab, setBankSubTab] = useState<'upi' | 'bank'>('upi');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-2 border border-indigo-100">
            <CreditCard className="w-3.5 h-3.5" /> Official Settlement Account
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Bank Account & Instant UPI Setup
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Register your UPI ID or Bank Account for weekly honorarium disbursements.
          </p>
        </div>

        {/* SUB TAB SELECTOR */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setBankSubTab('upi')}
            className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              bankSubTab === 'upi' ? 'bg-white text-indigo-950 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Instant UPI ID
          </button>
          
          <button
            type="button"
            onClick={() => setBankSubTab('bank')}
            className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              bankSubTab === 'bank' ? 'bg-white text-indigo-950 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-slate-700" /> Bank Account
          </button>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {bankSubTab === 'upi' ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Instant UPI ID * (GPay, PhonePe, Paytm, BHIM)
                </label>
                <input
                  type="text"
                  placeholder="e.g. yourname@okicici or 9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-mono font-bold text-indigo-950 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant UPI Settlement Enabled
                </span>
                <p className="text-[11.5px] text-emerald-800 leading-relaxed">
                  Weekly honorariums sent to this UPI ID will settle directly into your bank account on Monday batch disbursements.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jan Mohammad"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. State Bank of India"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Number *
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SBIN0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tax Verification: <strong className="text-slate-900">PAN Verified (5% TDS Compliant)</strong></span>
            </div>

            <button
              type="submit"
              disabled={isSaved}
              className="py-3.5 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Account Details Saved!
                </>
              ) : (
                'Save Account Details'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
