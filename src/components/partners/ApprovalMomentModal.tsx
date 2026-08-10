'use client';

import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface ApprovalMomentModalProps {
  isOpen: boolean;
  applicantName: string;
  partnerId: string;
  partnerSlug?: string;
  referralCode?: string;
  audienceScale?: string;
  onEnterWorkspace: () => void;
}

export const ApprovalMomentModal: React.FC<ApprovalMomentModalProps> = ({
  isOpen,
  applicantName,
  partnerId,
  partnerSlug,
  referralCode,
  onEnterWorkspace
}) => {
  if (!isOpen) return null;

  const appReference = partnerId || (referralCode ? `CP-2026-${referralCode}` : 'CP-2026-RECEIVED');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-9 relative space-y-6">
        
        {/* ICON BADGE */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
          <FileCheck className="w-8 h-8" />
        </div>

        {/* STATUS BADGE */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 text-xs font-mono font-bold px-3.5 py-1 rounded-full border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Application Received • Under Review</span>
        </div>

        {/* TITLE & DESCRIPTION */}
        <div className="space-y-1.5">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Application Received
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Thank you for applying to become a <strong>Courage Partner</strong>, {applicantName || 'Applicant'}. Your application has been logged and is now under review.
          </p>
        </div>

        {/* APPLICATION REFERENCE DETAILS */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left text-xs space-y-2">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
            <span className="font-mono text-slate-500 font-bold uppercase text-[10.5px]">Application ID</span>
            <span className="font-mono font-extrabold text-indigo-900">{appReference}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-slate-500 font-bold uppercase text-[10.5px]">Current Status</span>
            <span className="font-mono font-bold text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded border border-amber-300">
              Under Review
            </span>
          </div>
        </div>

        {/* WHAT HAPPENS NEXT STEPS */}
        <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-4 text-left space-y-2.5">
          <h4 className="text-[11px] font-mono font-bold text-indigo-900 uppercase tracking-wider block">
            What Happens Next
          </h4>

          <div className="space-y-2 text-xs text-indigo-950">
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-indigo-700">01</span>
              <span><strong>Application Review:</strong> Our team will review the information you submitted.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-indigo-700">02</span>
              <span><strong>Approval Decision:</strong> If approved, we'll send a confirmation email to your address.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-indigo-700">03</span>
              <span><strong>Partner Access:</strong> After approval, you can sign in to access your Partner Dashboard.</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          No action is required from you right now. We'll contact you by email when there is an update.
        </p>

        {/* RETURN TO COURAGE LIBRARY CTA */}
        <button
          type="button"
          onClick={onEnterWorkspace}
          className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Courage Library</span>
        </button>

      </div>
    </div>
  );
};
