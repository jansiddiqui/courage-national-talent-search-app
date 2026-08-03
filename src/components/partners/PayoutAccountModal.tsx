'use client';

import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  QrCode, 
  Building, 
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';

interface PayoutAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName?: string;
  referralCode?: string;
}

export const PayoutAccountModal: React.FC<PayoutAccountModalProps> = ({
  isOpen,
  onClose,
  partnerName = 'Jan Mohammad',
  referralCode = 'CNTSJN'
}) => {
  const [payoutTab, setPayoutTab] = useState<'upi' | 'bank' | 'qr'>('upi');
  const [upiId, setUpiId] = useState('jan@okicici');
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('38920194821');
  const [holderName, setHolderName] = useState(partnerName);
  const [ifscCode, setIfscCode] = useState('SBIN0001234');
  
  const [qrFile, setQrFile] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative animate-slide-up space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Honorarium Payout Settings
          </span>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-2">
            Configure Payout Method & Upload Payment QR
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Specify how you want to receive your 25% revenue share honorarium (₹25 per verified student candidate).
          </p>
        </div>

        {/* TAB SELECTOR: UPI ID | BANK DETAILS | UPLOAD PAYMENT QR */}
        <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setPayoutTab('upi')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              payoutTab === 'upi' ? 'bg-white text-indigo-950 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> UPI ID
          </button>
          
          <button
            type="button"
            onClick={() => setPayoutTab('bank')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              payoutTab === 'bank' ? 'bg-white text-indigo-950 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" /> Bank Acc
          </button>

          <button
            type="button"
            onClick={() => setPayoutTab('qr')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              payoutTab === 'qr' ? 'bg-white text-indigo-950 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-600" /> Upload QR
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* TAB 1: UPI ID */}
          {payoutTab === 'upi' && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Instant UPI ID * (GPay, PhonePe, Paytm)
                </label>
                <input
                  type="text"
                  placeholder="e.g. jan@okicici or 9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-indigo-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Settlement Enabled
                </span>
                <p className="text-[11px] text-emerald-800">
                  Honorarium payouts requested to this UPI ID will be settled instantly with zero processing fee.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: BANK DETAILS */}
          {payoutTab === 'bank' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Number *
                  </label>
                  <input
                    type="password"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold uppercase"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT QR IMAGE UPLOAD */}
          {payoutTab === 'qr' && (
            <div className="space-y-3 animate-fade-in text-center">
              <label className="block text-xs font-bold text-slate-700 text-left mb-1">
                Upload Personal Payment QR Screenshot (PhonePe / GPay / Paytm)
              </label>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                {qrFile ? (
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrFile} alt="Payment QR Code" className="w-32 h-32 mx-auto object-contain rounded-xl border border-slate-200 shadow-sm" />
                    <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> QR Image Verified & Loaded
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2 py-2">
                    <QrCode className="w-10 h-10 text-amber-500 mx-auto" />
                    <div>
                      <span className="text-xs font-bold text-indigo-900 block">
                        Click to Upload Payment QR Image
                      </span>
                      <span className="text-[10.5px] text-slate-400">
                        Upload PNG, JPG or WEBP screenshot (Max 5MB)
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
            </div>
          )}

          {/* TAX COMPLIANCE CHECK */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-semibold">TDS Verification Status:</span>
            </div>
            <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
              PAN Verified (5% TDS)
            </span>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className="flex-[2] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" /> Payout Settings Saved!
                </>
              ) : (
                'Save Payout Configuration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
