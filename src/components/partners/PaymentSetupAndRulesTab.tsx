'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Building, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  Lock, 
  FileText, 
  Clock, 
  Upload 
} from 'lucide-react';

export const PaymentSetupAndRulesTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'account' | 'qr' | 'rules'>('account');
  const [bankSubTab, setBankSubTab] = useState<'upi' | 'bank'>('upi');
  
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const [qrFile, setQrFile] = useState<string | null>(null);
  const [qrSaved, setQrSaved] = useState(false);

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleQrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQrSaved(true);
    setTimeout(() => setQrSaved(false), 2500);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-2 border border-indigo-100">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Settlement Account & Guidelines
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Payment Setup, QR Code & Policy Rules
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Register your UPI/Bank details, upload your Payment QR screenshot, and review settlement rules.
          </p>
        </div>

        {/* SUB TAB SELECTOR */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('account')}
            className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'account' ? 'bg-white text-indigo-950 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Bank & UPI
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('qr')}
            className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'qr' ? 'bg-white text-indigo-950 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-600" /> Payment QR
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rules')}
            className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'rules' ? 'bg-white text-indigo-950 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Settlement Rules
          </button>
        </div>
      </div>

      {/* SUB TAB 1: BANK & INSTANT UPI SETUP */}
      {activeSubTab === 'account' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" /> Register Payout Account
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify your UPI ID or Bank Account where weekly honorariums should be sent.
              </p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setBankSubTab('upi')}
                className={`py-2 px-3 rounded-lg transition-all ${
                  bankSubTab === 'upi' ? 'bg-white text-indigo-950 shadow-sm font-bold' : 'text-slate-500'
                }`}
              >
                Instant UPI ID
              </button>
              <button
                type="button"
                onClick={() => setBankSubTab('bank')}
                className={`py-2 px-3 rounded-lg transition-all ${
                  bankSubTab === 'bank' ? 'bg-white text-indigo-950 shadow-sm font-bold' : 'text-slate-500'
                }`}
              >
                Bank Account
              </button>
            </div>
          </div>

          <form onSubmit={handleAccountSubmit} className="space-y-6">
            {bankSubTab === 'upi' ? (
              <div className="space-y-4 max-w-xl">
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
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Settlement Active
                  </span>
                  <p className="text-[11.5px] text-emerald-800 leading-relaxed">
                    Honorarium payouts sent to this UPI ID will settle directly into your bank account on Monday batch disbursements.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
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
                <span>Tax Status: <strong className="text-slate-900">PAN Verified (5% TDS Compliant)</strong></span>
              </div>

              <button
                type="submit"
                disabled={isSaved}
                className="py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
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
      )}

      {/* SUB TAB 2: PAYMENT QR IMAGE UPLOAD */}
      {activeSubTab === 'qr' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-600" /> Personal Payment QR Screenshot Upload
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your personal PhonePe, Paytm, or GPay QR code screenshot for direct QR settlements.
            </p>
          </div>

          <form onSubmit={handleQrSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative text-center">
              {qrFile ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrFile} alt="Payment QR Code" className="w-44 h-44 mx-auto object-contain rounded-2xl border border-slate-200 shadow-md bg-white p-2" />
                  <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Personal Payment QR Screenshot Uploaded & Verified
                  </span>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <QrCode className="w-16 h-16 text-amber-500 mx-auto" />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Click to Select Payment QR Image File
                    </span>
                    <span className="text-xs text-slate-400">
                      Upload PhonePe, Paytm or GPay QR code screenshot (PNG, JPG, WEBP - Max 5MB)
                    </span>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleQrUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> Fraud Prevention Rules
              </div>
              <p className="text-[11.5px] text-amber-900 leading-relaxed">
                Uploaded Payment QR screenshot must belong to the partner's registered PhonePe, GPay, or Paytm account name.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={qrSaved || !qrFile}
                className="py-3.5 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {qrSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> QR Screenshot Saved!
                  </>
                ) : (
                  'Save Payment QR Screenshot'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB TAB 3: OFFICIAL PAYMENT & SETTLEMENT RULES */}
      {activeSubTab === 'rules' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3.5 border-b border-slate-800/80 pb-4">
              <div className="p-3.5 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Official Policy Guidelines
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Partner Honorarium Settlement & Payout Rules
                </h2>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Read all official rules governing partner revenue share rates, weekly payout requests, Monday batch SLA, and tax/TDS compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <CreditCard className="w-5 h-5 text-indigo-600" /> Revenue Share Rate (25% Max)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Partners receive <strong>₹25.00 per verified candidate registration</strong> (25% revenue share max of the ₹99 CNTS exam fee).
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
      )}
    </div>
  );
};
