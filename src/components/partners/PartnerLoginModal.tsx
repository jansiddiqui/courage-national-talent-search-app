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
  RefreshCw,
  AlertTriangle
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
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'code'>('email');
  const [phoneOrEmailOrCode, setPhoneOrEmailOrCode] = useState('');
  const [resolvedEmail, setResolvedEmail] = useState(''); // actual email returned by send-otp
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmailOrCode) return;
    setLoading(true);
    setError(null);

    try {
      // Build correct payload based on login method
      let payload: Record<string, string> = {};
      if (loginMethod === 'email') {
        payload = { email: phoneOrEmailOrCode.trim() };
      } else if (loginMethod === 'phone') {
        payload = { phone: phoneOrEmailOrCode.trim() };
      } else {
        payload = { referralCode: phoneOrEmailOrCode.trim().toUpperCase() };
      }

      const res = await fetch('/api/partner/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // Store the resolved email for OTP verification
      setResolvedEmail(data.email || phoneOrEmailOrCode.trim());
      setOtpSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/partner/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resolvedEmail, otp })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Invalid OTP');
      }

      if (!data.isRegistered) {
        onClose();
        onSwitchToApply();
        return;
      }

      onLoginSuccess(data.partner);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
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
            Sign in via Email OTP to access your AI Studio, referral analytics, and payout center.
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Method Switch Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
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
                  onClick={() => setLoginMethod('phone')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    loginMethod === 'phone' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Phone
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
                  {loginMethod === 'email' && 'Registered Email Address *'}
                  {loginMethod === 'phone' && 'Registered Mobile / WhatsApp Number *'}
                  {loginMethod === 'code' && 'Your Referral Code (e.g. CNTSJN) *'}
                </label>
                <input
                  type={loginMethod === 'email' ? 'email' : 'text'}
                  required
                  placeholder={
                    loginMethod === 'email' ? 'jan@example.com' :
                    loginMethod === 'phone' ? '+91 83606 03173' :
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
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send Email Verification OTP'} <ArrowRight className="w-4 h-4" />
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
                ← Change Email / Method
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
