'use client';

import React from 'react';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Share2, 
  ShieldCheck,
  Check,
  Zap
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
  audienceScale = '1k - 10k',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-8 md:p-10 animate-slide-up relative">
        {/* Confetti Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

        {/* Badge Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 p-1 mx-auto mb-6 shadow-xl relative z-10 animate-bounce">
          <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center text-amber-300">
            <Award className="w-10 h-10" />
          </div>
        </div>

        {/* Celebration Title */}
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Application Approved & Referral Code Active
        </div>

        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Congratulations {applicantName || 'Jan'} 🎉
        </h2>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Welcome to the official Courage Partner Network! Your assigned referral code and rate tier have been generated.
        </p>

        {/* Official Credentials & Referral Code Box */}
        <div className="bg-[#0F172A] text-white rounded-2xl p-6 mb-6 text-left border border-slate-800 shadow-inner space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Official Referral Code
              </span>
              <div className="font-mono text-2xl font-bold text-amber-300">
                {activeRefCode}
              </div>
            </div>

            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
              ⚡ {assignedTier.sharePercent}% Share ({assignedTier.perRegistrationAmount}/reg)
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1">
              Your Official Courage Referral Link
            </span>
            <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-700">
              <span className="font-mono text-xs text-indigo-300 truncate flex-1">
                {link}
              </span>
              <button
                onClick={copyLink}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        {/* Assigned Tier Highlights */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left mb-6 text-xs text-amber-900">
          <div className="font-bold flex items-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-amber-600" /> Assigned Creator Tier: {assignedTier.tierName}
          </div>
          <p className="text-amber-900/80">
            Based on your reach scale, you earn {assignedTier.sharePercent}% revenue share (₹{assignedTier.perRegistrationAmount} per verified student) + ₹{assignedTier.milestoneBonus.toLocaleString()} milestone bonus.
          </p>
        </div>

        {/* Primary Enter Action */}
        <button
          onClick={onEnterWorkspace}
          className="w-full btn-primary text-base py-4 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
        >
          Enter Creator Partner Workspace <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
