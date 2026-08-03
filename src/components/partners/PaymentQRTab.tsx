'use client';

import React, { useState } from 'react';
import { 
  QrCode, 
  Upload, 
  CheckCircle2, 
  Check, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const PaymentQRTab: React.FC = () => {
  const [qrFile, setQrFile] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

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
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full mb-2 border border-amber-200">
            <QrCode className="w-3.5 h-3.5" /> Personal Payment QR Screenshot
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Payment QR Code Image Upload
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload your personal GPay, PhonePe, or Paytm QR code screenshot for direct QR settlements.
          </p>
        </div>
      </div>

      {/* UPLOAD CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 text-center">
            <label className="block text-xs font-bold text-slate-700 text-left mb-1">
              Select Personal Payment QR Screenshot Image *
            </label>

            <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
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
              disabled={isSaved || !qrFile}
              className="py-3.5 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSaved ? (
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
    </div>
  );
};
