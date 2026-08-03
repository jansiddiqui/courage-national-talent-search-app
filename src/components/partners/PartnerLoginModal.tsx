'use client';

import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Smartphone, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Lock,
  RefreshCw
} from 'lucide-react';

interface PartnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (partnerData: any) => void;
  onSwitchToApply: () => void;
}

export const PartnerLoginModal: React.FC<PartnerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToApply
}) => {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email' | 'code'>('phone');
  const [phoneOrEmailOrCode, setPhoneOrEmailOrCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmailOrCode) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        fullName: 'Jan Mohammad',
        customSlug: 'cntsjn',
        partnerId: 'CP-2026-000384',
        referralCode: phoneOrEmailOrCode.toUpperCase().includes('CNTS') ? phoneOrEmailOrCode.toUpperCase() : 'CNTSJN',
        audienceScale: '50k - 250k',
        primaryRole: 'Infotainment & Knowledge Content'
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-slide-up my-8">
        
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-sm shadow">
              CP
            </div>
            <span className="font-display font-bold text-lg text-white">Courage Partner Login</span>
          </div>
          <p className="text-xs text-slate-400">
            Sign in to access your AI Studio, referral analytics, and payout center.
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 md:p-8 space-y-6">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Method Switch Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    loginMethod === 'phone' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    loginMethod === 'email' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('code')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    loginMethod === 'code' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" /> Code
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {loginMethod === 'phone' && 'Registered WhatsApp Mobile Number *'}
                  {loginMethod === 'email' && 'Registered Email Address *'}
                  {loginMethod === 'code' && 'Your Referral Code (e.g. CNTSJN) *'}
                </label>
                <input
                  type={loginMethod === 'phone' ? 'tel' : loginMethod === 'email' ? 'email' : 'text'}
                  required
                  placeholder={
                    loginMethod === 'phone' ? '+91 98765 43210' :
                    loginMethod === 'email' ? 'jan@example.com' :
                    'CNTSJN'
                  }
                  value={phoneOrEmailOrCode}
                  onChange={e => setPhoneOrEmailOrCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !phoneOrEmailOrCode}
                className="w-full btn-primary text-xs py-3.5 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send Verification OTP'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Not a partner yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToApply();
                  }}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Apply to Register Here
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>OTP sent to <strong>{phoneOrEmailOrCode}</strong></span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit OTP *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="1 2 3 4 5 6"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center font-mono text-xl font-bold tracking-widest focus:ring-2 focus:ring-indigo-600"
                />
                <span className="text-[11px] text-slate-400 block text-right mt-1">Demo OTP: Enter any 6 digits</span>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full btn-primary text-xs py-3.5 bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify OTP & Enter Workspace'} <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1 cursor-pointer"
              >
                ← Change Number / Method
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
