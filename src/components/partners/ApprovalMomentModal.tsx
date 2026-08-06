'use client';

import React from 'react';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check,
  Zap,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { PartnerReferralEngine } from '@/domains/partner-referral/PartnerReferralEngine';

interface ApprovalMomentModalProps {
  isOpen: boolean;
  applicantName: string;
  partnerId: string;
  partnerSlug: string;
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
  audienceScale = '10k - 50k',
  onEnterWorkspace
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const assignedTier = PartnerReferralEngine.calculateCreatorTier(audienceScale);
  const activeRefCode = referralCode || PartnerReferralEngine.generateReferralCode(applicantName);
  const link = `https://thecouragelibrary.com/register?ref=${activeRefCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-9 animate-scale-up relative space-y-5">
        
        {/* CONFETTI DECORATIVE GLOW */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-indigo-500/5 to-transparent pointer-events-none" />

        {/* CELEBRATION ICON BADGE */}
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 p-1 mx-auto shadow-lg animate-bounce">
            <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center text-amber-300">
              <Award className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* CELEBRATION STATUS BADGE */}
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3.5 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Application Received & Referral Link Generated
        </div>

        {/* MAIN CONGRATULATIONS TITLE */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Congratulations, {applicantName || 'Partner'}! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
            Welcome to the official Courage Partner Platform! Your application has been received and your unique referral link is ready.
          </p>
        </div>

        {/* REFERRAL LINK CARD */}
        <div className="bg-[#0F172A] text-white rounded-2xl p-4 sm:p-5 text-left border border-slate-800 shadow-inner space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
              Official Referral Code
            </span>
            <span className="text-xs font-mono font-black text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
              {activeRefCode}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="font-mono text-xs text-indigo-300 truncate flex-1 font-semibold">
              {link}
            </span>
            <button
              type="button"
              onClick={copyLink}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* VERIFICATION NOTICE & TIER RECAP */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-950 flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold block text-amber-950">Under Review • Reviewed within 24 Hours</span>
            <span className="text-amber-900/80 font-medium text-[11px] block">
              Starting Rate: <strong>₹{assignedTier.perRegistrationAmount} per verified student</strong> ({assignedTier.tierName}). Our Partner Desk is reviewing your application.
            </span>
          </div>
        </div>

        {/* ENTER WORKSPACE BUTTON */}
        <button
          type="button"
          onClick={onEnterWorkspace}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Enter Partner Workspace</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>

      </div>
    </div>
  );
};
