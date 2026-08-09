'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertTriangle,
  RefreshCw,
  LogOut
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface PartnerSuspensionScreenProps {
  partnerData: {
    partnerId?: string;
    fullName?: string;
    email?: string;
    referralCode?: string;
    status?: string;
    suspensionReason?: string;
    suspensionNote?: string;
    suspendedAt?: string;
    appealStatus?: string;
    appealMessage?: string;
    appealRequestedAt?: string;
  };
  onRefresh?: () => void;
}

export function PartnerSuspensionScreen({ partnerData, onRefresh }: PartnerSuspensionScreenProps) {
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [appealMessage, setAppealMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const reasonTitle = partnerData.suspensionReason || 'Policy & Compliance Verification Review';
  const reasonDetails = partnerData.suspensionNote || 'Our compliance operations desk identified activity requiring administrative review.';
  const suspendedDateStr = partnerData.suspendedAt 
    ? new Date(partnerData.suspendedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'August 10, 2026';

  const appealStatus = partnerData.appealStatus || 'NONE';

  const handleLogout = async () => {
    try {
      await fetch('/api/partner/session', { method: 'DELETE' });
      localStorage.removeItem('cnts_partner_session');
      window.location.href = '/partners/apply';
    } catch (e) {
      window.location.href = '/partners/apply';
    }
  };

  const handleAppealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(null);

    if (appealMessage.trim().length < 20) {
      setFeedbackError('Please provide a detailed appeal explanation (at least 20 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/partner/suspension/appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appealMessage: appealMessage.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review request.');
      }

      setFeedbackSuccess('Your review request has been submitted to the compliance team!');
      setTimeout(() => {
        setIsAppealModalOpen(false);
        if (onRefresh) onRefresh();
      }, 1500);
    } catch (err: any) {
      setFeedbackError(err.message || 'Error submitting appeal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/80 via-[#F8FAFF] to-[#F8FAFF] text-slate-900 flex flex-col justify-between font-sans relative overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-[130px] pb-16 relative z-10 my-auto w-full">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-2xl relative space-y-8">
          
          {/* Header Bar Actions */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold font-mono text-xs">
                CP
              </div>
              <div>
                <span className="font-mono font-bold text-xs text-slate-800 tracking-wide uppercase">Courage Partner Desk</span>
                <span className="text-[11px] text-slate-500 block font-mono">ID: {partnerData.partnerId || partnerData.referralCode || 'PARTNER'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              {onRefresh && (
                <button 
                  onClick={onRefresh}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Status</span>
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Status Header Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Account Under Review / Suspended</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight pt-1">
                Partner Workspace Restricted
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your Courage Partner account access has been restricted by our compliance desk. Your historical referral data and earned honoraria remain safe and preserved.
              </p>
            </div>
          </div>

          {/* Reason Details Box */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Primary Review Reason</span>
                <h3 className="text-sm sm:text-base font-bold text-amber-900 mt-0.5">{reasonTitle}</h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {suspendedDateStr}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">Administrative Explanation</span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-slate-200/80">
                "{reasonDetails}"
              </p>
            </div>
          </div>

          {/* Appeal Status Section */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            {appealStatus === 'PENDING' ? (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 flex items-start space-x-4">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-700 shrink-0">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-bold text-indigo-950">Review Request Under Active Evaluation</h4>
                  <p className="text-xs text-indigo-900/80 leading-relaxed">
                    Your appeal message has been submitted to the Courage Operations Desk. Reinstatement evaluations are usually processed within 24–48 business hours.
                  </p>
                  {partnerData.appealRequestedAt && (
                    <span className="text-[11px] font-mono font-bold text-indigo-700 block pt-1">
                      Submitted: {new Date(partnerData.appealRequestedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ) : appealStatus === 'REJECTED' ? (
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 flex items-start space-x-4">
                <div className="p-2 bg-rose-100 rounded-xl text-rose-700 shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-sm font-bold text-rose-950">Appeal Reviewed & Maintained</h4>
                  <p className="text-xs text-rose-900/80 leading-relaxed">
                    Our compliance desk reviewed your previous submission and determined the suspension will remain active. You may contact partner support for direct inquiry.
                  </p>
                  <button
                    onClick={() => setIsAppealModalOpen(true)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-4 pt-1 inline-block cursor-pointer"
                  >
                    Submit additional clarification note
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Believe this was an error?</h4>
                  <p className="text-xs text-slate-600">
                    If you believe your account was flagged by mistake, you can submit an official review request to our compliance desk.
                  </p>
                </div>
                <button
                  onClick={() => setIsAppealModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-md shadow-amber-500/20 flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Review</span>
                </button>
              </div>
            )}
          </div>

          {/* Support Helpline Footer */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 flex items-center justify-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Questions? Contact Partner Operations at <a href="mailto:partners@thecouragelibrary.com" className="text-indigo-600 font-bold hover:underline">partners@thecouragelibrary.com</a></span>
            </p>
          </div>

        </div>
      </main>

      <Footer />

      {/* APPEAL SUBMISSION MODAL */}
      {isAppealModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-fade-in relative text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Request Account Review</h3>
                  <p className="text-xs text-slate-500">Submit clarification to the CNTS Compliance Desk</p>
                </div>
              </div>
              <button
                onClick={() => setIsAppealModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAppealSubmit} className="space-y-4">
              {feedbackError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 font-medium">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{feedbackError}</span>
                </div>
              )}

              {feedbackSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feedbackSuccess}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block">
                  Appeal Explanation & Context <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={appealMessage}
                  onChange={(e) => setAppealMessage(e.target.value)}
                  rows={5}
                  placeholder="Please explain why you believe the suspension should be removed, including any relevant verification details or context..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  required
                />
                <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono pt-1">
                  <span>Minimum 20 characters</span>
                  <span className={appealMessage.length < 20 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {appealMessage.length} characters
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-0.5">Note on Review Process:</span>
                Submissions are logged directly into the admin compliance review queue. You will receive an inbox update once reviewed by an operational lead.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAppealModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || appealMessage.trim().length < 20}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs transition shadow-md shadow-amber-500/20 flex items-center space-x-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
