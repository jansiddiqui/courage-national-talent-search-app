'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CreditCard, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  Lock, 
  FileText, 
  Clock, 
  Loader2,
  AlertCircle,
  Zap,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

interface PaymentSetupAndRulesTabProps {
  partnerName?: string;
  referralCode?: string;
}

export const PaymentSetupAndRulesTab: React.FC<PaymentSetupAndRulesTabProps> = ({
  partnerName = 'Jan Mohammad',
  referralCode = 'CNTSJN'
}) => {
  // STEP 1: METHOD SELECTION (No tabs - modern cards)
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'BANK'>('UPI');
  
  // STEP 2A: UPI STATE
  const [upiIdInput, setUpiIdInput] = useState('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiResult, setUpiResult] = useState<{
    verified: boolean;
    receiverName?: string;
    bankName?: string;
    source?: string;
    verificationBadge?: string;
    error?: string;
  } | null>(null);

  // STEP 2B: BANK STATE
  const [accountNum, setAccountNum] = useState('');
  const [confirmAccountNum, setConfirmAccountNum] = useState('');
  const [ifscInput, setIfscInput] = useState('');
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [bankResult, setBankResult] = useState<{
    verified: boolean;
    accountHolderName?: string;
    bankName?: string;
    branch?: string;
    error?: string;
  } | null>(null);

  // STEP 3: CONFIRMED ACTIVE PAYOUT METHOD
  const [activeMethod, setActiveMethod] = useState<{
    methodType: 'UPI' | 'BANK';
    identifier: string;
    receiverName: string;
    bankName: string;
    verifiedAt: string;
    isCoolingActive?: boolean;
  } | null>(null);

  const [isChangingMethod, setIsChangingMethod] = useState(false);
  const [isSavingFinal, setIsSavingFinal] = useState(false);

  // FETCH EXISTING ACTIVE PAYOUT METHOD FROM BACKEND
  useEffect(() => {
    fetch('/api/partner/payout-account')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.account) {
          const acc = data.account;
          setActiveMethod({
            methodType: acc.accountType === 'BANK' ? 'BANK' : 'UPI',
            identifier: acc.accountType === 'BANK' ? `•••• ${acc.bankAccountNumber?.slice(-4)}` : (acc.upiId || 'jan@okicici'),
            receiverName: acc.bankHolderName || partnerName,
            bankName: acc.bankName || 'Registered Bank Account',
            verifiedAt: new Date().toISOString(),
            isCoolingActive: false
          });
        }
      })
      .catch(err => console.error('Failed to load active payout account:', err));
  }, [partnerName]);

  // REAL-TIME DEBOUNCED UPI VERIFICATION
  const verifyUpiApi = useCallback(async (vpa: string) => {
    if (!vpa.includes('@') || vpa.trim().length < 5) return;
    setIsVerifyingUpi(true);
    setUpiResult(null);

    try {
      const res = await fetch('/api/partner/verify-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId: vpa.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUpiResult({
          verified: true,
          receiverName: data.receiverName,
          bankName: data.bankName,
          source: data.source,
          verificationBadge: data.verificationBadge
        });
      } else {
        setUpiResult({
          verified: false,
          error: data.error || 'Could not verify UPI ID. Please check the address.'
        });
      }
    } catch (err) {
      setUpiResult({
        verified: false,
        error: 'Network error during UPI verification.'
      });
    } finally {
      setIsVerifyingUpi(false);
    }
  }, []);

  // DEBOUNCE EFFECT FOR UPI ID INPUT
  useEffect(() => {
    if (!upiIdInput.trim()) {
      setUpiResult(null);
      return;
    }
    const timer = setTimeout(() => {
      verifyUpiApi(upiIdInput);
    }, 450);
    return () => clearTimeout(timer);
  }, [upiIdInput, verifyUpiApi]);

  // BANK VERIFICATION HANDLER
  const handleBankVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNum || !confirmAccountNum || accountNum !== confirmAccountNum) {
      setBankResult({ verified: false, error: 'Account numbers do not match.' });
      return;
    }
    if (!ifscInput || ifscInput.trim().length < 11) {
      setBankResult({ verified: false, error: 'Please enter a valid 11-digit IFSC code.' });
      return;
    }

    setIsVerifyingBank(true);
    setBankResult(null);

    try {
      const res = await fetch('/api/partner/verify-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber: accountNum.trim(),
          confirmAccountNumber: confirmAccountNum.trim(),
          ifsc: ifscInput.trim().toUpperCase()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBankResult({
          verified: true,
          accountHolderName: data.accountHolderName,
          bankName: data.bankName,
          branch: data.branch
        });
      } else {
        setBankResult({
          verified: false,
          error: data.error || 'Bank account verification failed.'
        });
      }
    } catch (err) {
      setBankResult({
        verified: false,
        error: 'Network error during bank verification.'
      });
    } finally {
      setIsVerifyingBank(false);
    }
  };

  // FINAL SAVE HANDLER
  const handleFinalSave = async () => {
    setIsSavingFinal(true);
    try {
      const payload = selectedMethod === 'UPI' 
        ? { accountType: 'UPI', upiId: upiIdInput.trim(), bankHolderName: upiResult?.receiverName, bankName: upiResult?.bankName }
        : { accountType: 'BANK', bankAccountNumber: accountNum.trim(), bankIfsc: ifscInput.trim().toUpperCase(), bankHolderName: bankResult?.accountHolderName, bankName: bankResult?.bankName };

      const res = await fetch('/api/partner/payout-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setActiveMethod({
          methodType: selectedMethod,
          identifier: selectedMethod === 'UPI' ? upiIdInput.trim() : `•••• ${accountNum.slice(-4)}`,
          receiverName: (selectedMethod === 'UPI' ? upiResult?.receiverName : bankResult?.accountHolderName) || partnerName,
          bankName: (selectedMethod === 'UPI' ? upiResult?.bankName : bankResult?.bankName) || 'Verified Bank Account',
          verifiedAt: new Date().toISOString(),
          isCoolingActive: true
        });
        setIsChangingMethod(false);
      }
    } catch (err) {
      console.error('Save payout error:', err);
    } finally {
      setIsSavingFinal(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-7 animate-fade-in font-sans text-[#0F172A] pb-12">

      {/* HEADER BANNER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            RAZORPAYX SETTLEMENT ENGINE
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-400">TDS 5% Compliant</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Payment Setup & Payout Destination
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Set up your verified bank account or Instant UPI ID. Weekly honorarium disbursements settle automatically every Monday.
        </p>
      </div>

      {/* STEP 3 CONFIRMED STATE (IF ALREADY SET UP AND NOT CHANGING) */}
      {activeMethod && !isChangingMethod ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-black">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                  Payment Setup Complete
                </span>
                <h2 className="font-display font-black text-xl text-slate-900 mt-0.5">Active Payout Destination</h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChangingMethod(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              Change Destination
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Payout Method</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                  {activeMethod.methodType === 'UPI' ? <Zap className="w-4 h-4 text-indigo-600" /> : <Building className="w-4 h-4 text-emerald-600" />}
                  {activeMethod.methodType === 'UPI' ? 'Instant UPI ID' : 'Direct Bank Account'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Beneficiary Identifier</span>
                <span className="font-mono font-black text-indigo-700 text-sm mt-0.5 block">{activeMethod.identifier}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Receiver Name</span>
                <span className="font-extrabold text-slate-900 mt-0.5 block">{activeMethod.receiverName}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Bank Name</span>
                <span className="font-bold text-slate-700 mt-0.5 block">{activeMethod.bankName}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Beneficiary via RazorpayX
              </span>
              <span className="font-mono text-[10px]">Disburses Every Monday</span>
            </div>
          </div>

          {activeMethod.isCoolingActive && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block">24-Hour Security Cooling Period Active</span>
                <span className="text-[11px] text-amber-800">Your recent payout change is undergoing security validation. Payouts are protected against unauthorized edits.</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ONBOARDING FLOW: STEP 1 -> STEP 2 -> STEP 3 */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-7">
          
          {/* STEP 1: CHOOSE PAYOUT METHOD (MODERN CARDS - NO TABS) */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Step 1: Choose Payout Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('UPI');
                  setUpiResult(null);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 relative ${
                  selectedMethod === 'UPI'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/30 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-600" /> UPI (Recommended)
                  </span>
                  <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Instant
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Settle to GPay, PhonePe, Paytm or BHIM UPI ID.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('BANK');
                  setBankResult(null);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 relative ${
                  selectedMethod === 'BANK'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/30 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600" /> Bank Account
                  </span>
                  <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    NEFT / RTGS
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Direct transfer to your Savings/Current account.
                </p>
              </button>
            </div>
          </div>

          {/* STEP 2: SINGLE-FIELD VERIFICATION FORM */}
          {selectedMethod === 'UPI' ? (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Step 2: Enter UPI ID
              </label>

              <div className="space-y-2 relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. yourname@okicici or 9876543210@paytm"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                  />
                  {isVerifyingUpi && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs text-indigo-600 font-bold">
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                    </div>
                  )}
                </div>

                {/* INLINE VERIFICATION BADGE */}
                {upiResult && upiResult.verified && (
                  <div className={`p-4 rounded-2xl border space-y-1.5 animate-fade-in ${
                    upiResult.source === 'MOCK_DEV_SERVICE' || upiResult.verificationBadge === 'MOCK_DEVELOPMENT_MODE'
                      ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-4 h-4 ${upiResult.source === 'MOCK_DEV_SERVICE' ? 'text-amber-600' : 'text-emerald-600'}`} /> 
                        {upiResult.source === 'MOCK_DEV_SERVICE' ? '✓ Verified Syntax (Development Mode)' : '✓ Verified UPI Beneficiary'}
                      </span>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-black border ${
                        upiResult.source === 'MOCK_DEV_SERVICE'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {upiResult.source === 'MOCK_DEV_SERVICE' ? 'Mock Verification (Dev Mode)' : 'RazorpayX Live Verified'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-slate-500 text-[10px] block font-bold">Account Holder Name</span>
                        <span className="font-extrabold text-slate-900">{upiResult.receiverName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-bold">Bank Name</span>
                        <span className="font-bold text-slate-900">{upiResult.bankName}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* INLINE ERROR */}
                {upiResult && !upiResult.verified && upiResult.error && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{upiResult.error}</span>
                  </div>
                )}
              </div>

              {upiResult && upiResult.verified && (
                <button
                  type="button"
                  onClick={handleFinalSave}
                  disabled={isSavingFinal}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSavingFinal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Payout Destination</span>
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleBankVerify} className="space-y-4 pt-2 border-t border-slate-100">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Step 2: Enter Bank Account & IFSC
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Account Number *</label>
                  <input
                    type="password"
                    placeholder="Enter Account Number"
                    value={accountNum}
                    onChange={(e) => setAccountNum(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Confirm Account Number *</label>
                  <input
                    type="text"
                    placeholder="Re-enter Account Number"
                    value={confirmAccountNum}
                    onChange={(e) => setConfirmAccountNum(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">IFSC Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  value={ifscInput}
                  onChange={(e) => setIfscInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                  required
                />
              </div>

              {!bankResult?.verified && (
                <button
                  type="submit"
                  disabled={isVerifyingBank}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifyingBank ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Verify Bank Account</span>
                </button>
              )}

              {/* INLINE BANK VERIFICATION RESULT */}
              {bankResult && bankResult.verified && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-extrabold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ✓ Verified Bank Account
                    </span>
                    <span className="font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded">Penny-Drop Verified</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-emerald-700 text-[10px] block font-bold">Account Holder</span>
                      <span className="font-extrabold text-emerald-900">{bankResult.accountHolderName}</span>
                    </div>
                    <div>
                      <span className="text-emerald-700 text-[10px] block font-bold">Bank Name</span>
                      <span className="font-bold text-emerald-900">{bankResult.bankName}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinalSave}
                    disabled={isSavingFinal}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isSavingFinal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save Payout Account</span>
                  </button>
                </div>
              )}

              {bankResult && !bankResult.verified && bankResult.error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{bankResult.error}</span>
                </div>
              )}
            </form>
          )}
        </div>
      )}

      {/* POLICY & DEPRECATION NOTICE */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
          <Info className="w-4 h-4 text-indigo-600" /> Automated Disbursement Guidelines
        </div>
        <ul className="text-xs text-slate-600 font-medium space-y-1.5 leading-relaxed pl-1">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
            <span>Weekly payouts process automatically every <strong>Monday morning</strong> via RazorpayX.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
            <span>TDS at <strong>5%</strong> is deducted per Income Tax Section 194H rules and credited to your PAN.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
            <span>Manual QR screenshot uploads have been upgraded to <strong>Instant API Verification</strong> for 100% security against fraud.</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
