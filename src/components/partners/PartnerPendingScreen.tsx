'use client';

import React from 'react';
import { 
  Clock, 
  HelpCircle, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  FileText, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface PartnerPendingScreenProps {
  partnerData: {
    partnerId?: string;
    fullName?: string;
    email?: string;
    referralCode?: string;
    customSlug?: string;
    createdAt?: string;
  };
  onRefresh?: () => void;
}

export function PartnerPendingScreen({ partnerData, onRefresh }: PartnerPendingScreenProps) {
  const handleLogout = async () => {
    try {
      await fetch('/api/partner/session', { method: 'DELETE' });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cnts_partner_session');
      }
      window.location.href = '/';
    } catch (e) {
      window.location.href = '/';
    }
  };

  const appReference = partnerData.partnerId || (partnerData.referralCode ? `CP-2026-${partnerData.referralCode}` : 'CP-2026-PENDING');

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/80 via-[#F8FAFF] to-[#F8FAFF] text-slate-900 flex flex-col justify-between font-sans relative overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-[130px] pb-16 relative z-10 my-auto w-full">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-2xl relative space-y-8">
          
          {/* Header Bar Actions */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold font-mono text-xs">
                CP
              </div>
              <div>
                <span className="font-mono font-bold text-xs text-slate-800 tracking-wide uppercase">Courage Partner Desk</span>
                <span className="text-[11px] text-slate-500 block font-mono">Reference: {appReference}</span>
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
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Status Header Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shadow-sm">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Application Under Review</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight pt-1">
                Application Under Review
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for applying to become a Courage Partner. Your application has been logged and is currently being reviewed by our compliance desk.
              </p>
            </div>
          </div>

          {/* Application Details Summary */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
              <span className="font-mono text-slate-500 font-bold uppercase text-[10.5px]">Applicant Name</span>
              <span className="font-bold text-slate-900">{partnerData.fullName || 'Partner Applicant'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
              <span className="font-mono text-slate-500 font-bold uppercase text-[10.5px]">Application Reference</span>
              <span className="font-mono font-bold text-indigo-900">{appReference}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-slate-500 font-bold uppercase text-[10.5px]">Current Status</span>
              <span className="font-mono font-bold text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-300">
                PENDING ADMIN REVIEW
              </span>
            </div>
          </div>

          {/* WHAT HAPPENS NEXT STEPS */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-center">
              What Happens Next
            </h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Application Review</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Our compliance team reviews the information and channel details you submitted.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Approval Decision & Email</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    If your application is approved, we'll send an official confirmation email to <strong>{partnerData.email || 'your email'}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Partner Workspace Access</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    After approval, you can sign in to access your Courage Partner Dashboard and referral tools.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NOTICE & CTA */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 text-center space-y-3">
            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
              No further action is required from you right now. We'll contact you by email when there is an update.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Courage Library</span>
            </a>
          </div>

          {/* Support Footer */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-500 flex items-center justify-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Questions? Contact Partner Operations at <a href="mailto:support@thecouragelibrary.com" className="text-indigo-600 font-bold hover:underline">support@thecouragelibrary.com</a></span>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
