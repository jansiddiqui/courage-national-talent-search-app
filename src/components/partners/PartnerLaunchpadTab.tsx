'use client';

import React, { useState } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Video, 
  CreditCard, 
  Sparkles,
  HelpCircle,
  Award,
  Globe,
  Lock,
  Play
} from 'lucide-react';

interface PartnerLaunchpadTabProps {
  referralCode?: string;
  partnerName?: string;
  applicantData?: any;
  onNavigateTab?: (tabId: string) => void;
}

export const PartnerLaunchpadTab: React.FC<PartnerLaunchpadTabProps> = ({
  referralCode = 'CNTSJN',
  partnerName = 'Partner',
  applicantData,
  onNavigateTab
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const referralLink = `https://thecouragelibrary.com/register?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const steps = [
    {
      stepNumber: 1,
      title: 'Step 1: Save & Share Your Referral Link',
      desc: 'Your unique referral code is baked into this link. Share it on WhatsApp, Instagram Bio, and YouTube descriptions.',
      actionLabel: copiedLink ? 'Copied Link!' : 'Copy Referral Link',
      actionIcon: copiedLink ? Check : Copy,
      onClick: copyLink,
      completed: true,
      badge: 'Completed'
    },
    {
      stepNumber: 2,
      title: 'Step 2: Set Up Payout Bank Account or UPI ID',
      desc: 'Verify your UPI ID or Bank Account to receive automatic Monday honorarium payouts.',
      actionLabel: 'Setup Payouts',
      actionIcon: CreditCard,
      onClick: () => onNavigateTab && onNavigateTab('payment-setup'),
      completed: false,
      badge: 'Action Required'
    },
    {
      stepNumber: 3,
      title: 'Step 3: Review Video Campaign Roadmap (Aug 30 Exam)',
      desc: 'Follow our 5-phase video roadmap and copy ready-to-paste AI prompts in Hinglish or Hindi.',
      actionLabel: 'Open Video Roadmap',
      actionIcon: Video,
      onClick: () => onNavigateTab && onNavigateTab('roadmap'),
      completed: false,
      badge: 'Recommended'
    },
    {
      stepNumber: 4,
      title: 'Step 4: Register Your Own Children (100% Fee Waiver)',
      desc: 'As an official Courage Partner, your own children of Class 5–8 register for CNTS 2026 for free (₹0).',
      actionLabel: 'Claim Waiver',
      actionIcon: Rocket,
      onClick: () => onNavigateTab && onNavigateTab('child'),
      completed: false,
      badge: 'Partner Welfare'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-fade-in pb-12 font-sans text-[#0F172A]">

      {/* 1. HERO WELCOME LAUNCHPAD BANNER */}
      <div className="bg-gradient-to-br from-indigo-900 via-[#1E1B4B] to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-800 shadow-xl relative overflow-hidden space-y-5">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full border border-amber-400/30 mb-2">
              <Rocket className="w-3.5 h-3.5 text-amber-300" /> Start Here • Partner Launchpad
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome to Courage Partner Platform, {partnerName}! 🚀
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
              This is your step-by-step launchpad to start mobilizing students, earning honorarium, and expanding your educational reach.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl shrink-0 text-right space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Official Partner Code</span>
            <span className="font-mono text-xl font-black text-amber-300 block">{referralCode}</span>
          </div>
        </div>

        {/* QUICK LINK BAR */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-200">
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="w-4 h-4 text-indigo-300 shrink-0" />
            <span className="font-mono truncate font-semibold">{referralLink}</span>
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-md"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Referral Link'}</span>
          </button>
        </div>

      </div>

      {/* 2. STEP-BY-STEP ONBOARDING FLOW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Your 4-Step Orientation Checklist
          </h2>
          <span className="text-xs font-mono font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Step 1 of 4 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {steps.map(step => {
            const IconComp = step.actionIcon;
            return (
              <div 
                key={step.stepNumber}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                    step.completed 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : step.stepNumber}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-slate-900">{step.title}</h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${
                        step.completed 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={step.onClick}
                  className="bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2 self-end sm:self-center"
                >
                  <IconComp className="w-4 h-4 text-amber-300" />
                  <span>{step.actionLabel}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PARTNER BENEFITS RECAP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <Award className="w-6 h-6 text-amber-500" />
          <h4 className="font-bold text-sm text-slate-900">Honorarium Growth Tiers</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Earn ₹25 to ₹60 per student enrolment + tier bonuses up to ₹15,000.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <CreditCard className="w-6 h-6 text-emerald-500" />
          <h4 className="font-bold text-sm text-slate-900">Weekly Monday Settlement</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            All matured earnings are paid out directly to your registered Bank/UPI account every Monday.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <Zap className="w-6 h-6 text-indigo-500" />
          <h4 className="font-bold text-sm text-slate-900">AI Creator Studio</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Generate custom Hinglish video scripts & WhatsApp promo posters in 1 click.
          </p>
        </div>
      </div>

    </div>
  );
};
