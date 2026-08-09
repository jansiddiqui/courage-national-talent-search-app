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
  ArrowRight,
  RefreshCw,
  LogOut
} from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-mono text-sm">
              CP
            </div>
            <div>
              <span className="font-mono font-bold text-sm text-slate-200 tracking-wide uppercase">Courage Partner Desk</span>
              <span className="text-xs text-slate-500 block font-mono">ID: {partnerData.partnerId || partnerData.referralCode || 'PARTNER'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onRefresh && (
              <button 
                onClick={onRefresh}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check Status</span>
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-slate-700/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12 relative z-10 my-auto w-full">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative space-y-8">
          
          {/* Status Header Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Account Under Review / Suspended</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight pt-2">
                Partner Workspace Restricted
              </h1>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Your Courage Partner account access has been restricted by our compliance desk. Your historical referral data and payouts remain safe and preserved.
              </p>
            </div>
          </div>

          {/* Reason Details Box */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800/60 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Primary Review Reason</span>
                <h3 className="text-base font-semibold text-amber-300 mt-0.5">{reasonTitle}</h3>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                {suspendedDateStr}
              </span>
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">Administrative Note</span>
              <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
                "{reasonDetails}"
              </p>
            </div>
          </div>

          {/* Appeal Status Section */}
          <div className="border-t border-slate-800/80 pt-6 space-y-4">
            {appealStatus === 'PENDING' ? (
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 flex items-start space-x-4">
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-semibold text-indigo-200">Review Request Under Active Evaluation</h4>
                  <p className="text-xs text-indigo-300/80 leading-relaxed">
                    Your appeal message has been submitted to the Courage Operations Desk. Reinstatement evaluations are usually processed within 24–48 business hours.
                  </p>
                  {partnerData.appealRequestedAt && (
                    <span className="text-[11px] font-mono text-indigo-400/80 block pt-1">
                      Submitted: {new Date(partnerData.appealRequestedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ) : appealStatus === 'REJECTED' ? (
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-5 flex items-start space-x-4">
                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
                  <XCircle className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-sm font-semibold text-rose-200">Appeal Reviewed & Maintained</h4>
                  <p className="text-xs text-rose-300/80 leading-relaxed">
                    Our compliance desk reviewed your previous submission and determined the suspension will remain active. You may contact partner support for direct inquiry.
                  </p>
                  <button
                    onClick={() => setIsAppealModalOpen(true)}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4 pt-1 inline-block"
                  >
                    Submit additional clarification note
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-semibold text-slate-200">Believe this was an error?</h4>
                  <p className="text-xs text-slate-400">
                    If you believe your account was flagged by mistake, you can submit an official review request to our compliance desk.
                  </p>
                </div>
                <button
                  onClick={() => setIsAppealModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/10 flex items-center space-x-1.5 whitespace-nowrap"
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
              <span>Questions? Contact Partner Operations at <a href="mailto:partners@thecouragelibrary.com" className="text-indigo-400 hover:underline">partners@thecouragelibrary.com</a></span>
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-600 relative z-10">
        © 2026 Courage National Talent Search (CNTS). All rights reserved.
      </footer>

      {/* APPEAL SUBMISSION MODAL */}
      {isAppealModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-fade-in relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Request Account Review</h3>
                  <p className="text-xs text-slate-400">Submit clarification to the CNTS Compliance Desk</p>
                </div>
              </div>
              <button
                onClick={() => setIsAppealModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAppealSubmit} className="space-y-4">
              {feedbackError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{feedbackError}</span>
                </div>
              )}

              {feedbackSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feedbackSuccess}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  Appeal Explanation & Context <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={appealMessage}
                  onChange={(e) => setAppealMessage(e.target.value)}
                  rows={5}
                  placeholder="Please explain why you believe the suspension should be removed, including any relevant verification details or context..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
                  required
                />
                <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono pt-1">
                  <span>Minimum 20 characters</span>
                  <span className={appealMessage.length < 20 ? 'text-amber-400' : 'text-emerald-400'}>
                    {appealMessage.length} characters
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-300 block mb-0.5">Note on Review Process:</span>
                Submissions are logged directly into the admin compliance review queue. You will receive an inbox update once reviewed by an operational lead.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAppealModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || appealMessage.trim().length < 20}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/10 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
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
