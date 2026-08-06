'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check,
  Zap,
  Clock,
  ShieldCheck,
  TrendingUp,
  Download,
  Share2,
  Wallet,
  ChevronRight,
  UserCheck,
  Building2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { PartnerReferralEngine } from '@/domains/partner-referral/PartnerReferralEngine';

interface PartnerOverviewProps {
  partnerName?: string;
  referralCode?: string;
  applicantData?: any;
  onNavigateTab?: (tabId: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const PartnerOverview: React.FC<PartnerOverviewProps> = ({
  partnerName = 'Jan Mohammad',
  referralCode = 'CNTSJN',
  applicantData,
  onNavigateTab,
  onNavigateToTab
}) => {
  const navigate = (tabId: string) => {
    if (onNavigateTab) onNavigateTab(tabId);
    if (onNavigateToTab) onNavigateToTab(tabId);
  };
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [stats, setStats] = useState({
    totalRegistrations: 12,
    totalEarnings: 1480,
    maturedBalance: 420,
    effectiveRate: 25,
    ruleSource: 'Growth Tier (Bronze)',
    tierName: 'Bronze Mobilizer',
    nextTierName: 'Silver Mobilizer',
    nextTierTarget: 25,
    progressPercent: 48,
    recentEvents: [
      { id: '1', title: 'Verified Student Registration', desc: 'Candidate from Patna enrolled via your link', time: '5m ago', icon: 'user', type: 'success' },
      { id: '2', title: 'Honorarium Matured', desc: '₹420 moved to Available Payout Balance', time: '1h ago', icon: 'wallet', type: 'info' },
      { id: '3', title: 'Badge Unlocked', desc: 'Unlocked Bronze Mobilizer reputation badge', time: '1d ago', icon: 'award', type: 'warning' },
      { id: '4', title: 'Monday Batch Scheduled', desc: 'Next automated payout batch on Monday', time: '2d ago', icon: 'clock', type: 'neutral' }
    ]
  });

  useEffect(() => {
    if (referralCode) {
      fetch(`/api/partner/stats?referralCode=${encodeURIComponent(referralCode)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStats(prev => ({
              ...prev,
              totalRegistrations: data.totalRegistrations ?? prev.totalRegistrations,
              totalEarnings: data.totalEarnings ?? prev.totalEarnings,
              maturedBalance: data.maturedBalance ?? prev.maturedBalance,
              effectiveRate: data.effectiveRate ?? prev.effectiveRate,
              ruleSource: data.ruleSource ?? prev.ruleSource,
              tierName: data.tierName ?? prev.tierName,
              nextTierName: data.nextTierName ?? prev.nextTierName,
              nextTierTarget: data.nextTierTarget ?? prev.nextTierTarget,
              progressPercent: data.progressPercent ?? prev.progressPercent,
              recentEvents: data.timelineFeed?.slice(0, 4) || prev.recentEvents
            }));
          }
        })
        .catch(err => console.error('Failed to load partner stats:', err));
    }
  }, [referralCode]);

  const referralLink = `https://thecouragelibrary.com/register?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadQR = () => {
    if (onNavigateTab) onNavigateTab('referrals');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-fade-in pb-12 font-sans text-[#0F172A]">

      {/* 1. HERO — WELCOME & CORE METRICS */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-indigo-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Courage Partner Workspace
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {partnerName} 👋
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              Official Partner Code: <span className="font-mono text-amber-300 font-bold">{referralCode}</span>
            </p>
          </div>

          {/* Current Tier Badge & Progress Recap */}
          <div className="bg-slate-900/90 border border-slate-700/70 p-3.5 rounded-2xl shrink-0 space-y-1.5 text-right sm:text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{stats.tierName}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Rate: <strong className="text-emerald-400 font-mono">₹{stats.effectiveRate}/reg</strong> ({stats.ruleSource})
            </div>
          </div>
        </div>

        {/* Core Metric Cards Grid (Answers "How am I doing?" & "How much have I earned?") */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 relative z-10">
          {/* Card 1: Verified Registrations */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Verified Students
            </span>
            <div className="font-mono text-3xl font-black text-white mt-1">
              {stats.totalRegistrations}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              Candidates mobilized
            </span>
          </div>

          {/* Card 2: Total Earnings */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Earnings
            </span>
            <div className="font-mono text-3xl font-black text-amber-300 mt-1">
              ₹{stats.totalEarnings.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1">
              Cumulative honorarium
            </span>
          </div>

          {/* Card 3: Available Balance */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Available Balance
            </span>
            <div className="font-mono text-3xl font-black text-emerald-400 mt-1">
              ₹{stats.maturedBalance.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              Ready for Monday payout
            </span>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1.5 pt-1 relative z-10">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span>Progress toward <strong>{stats.nextTierName}</strong></span>
            <span className="font-mono text-amber-300">{stats.totalRegistrations} / {stats.nextTierTarget} Registrations</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(8, stats.progressPercent))}%` }} 
            />
          </div>
        </div>

      </div>

      {/* 2. NEXT BEST ACTION (Answers "What should I do next?" with ONE clear action card) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/60 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
            <Zap className="w-3.5 h-3.5 text-amber-600" /> Next Best Action
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            Share Today's Promotional WhatsApp Poster
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Generating promotional updates on WhatsApp increases conversion rates by +24%. Download your poster or generate custom AI captions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('growth')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 flex items-center gap-2"
        >
          <span>Open AI Studio</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>

      {/* 3. QUICK ACTIONS BAR (Only the 4 most essential partner actions) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Copy Link */}
          <button
            type="button"
            onClick={copyLink}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-28"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">{copiedLink ? 'Copied Link!' : 'Copy Referral Link'}</span>
              <span className="text-[11px] text-slate-400 block font-medium mt-0.5">Share with students</span>
            </div>
          </button>

          {/* Action 2: Download QR */}
          <button
            type="button"
            onClick={downloadQR}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-28"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">Download QR Poster</span>
              <span className="text-[11px] text-slate-400 block font-medium mt-0.5">Printable poster</span>
            </div>
          </button>

          {/* Action 3: Open AI Studio */}
          <button
            type="button"
            onClick={() => navigate('growth')}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-28"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">Open AI Studio</span>
              <span className="text-[11px] text-slate-400 block font-medium mt-0.5">Generate posts</span>
            </div>
          </button>

          {/* Action 4: View Payouts */}
          <button
            type="button"
            onClick={() => navigate('payouts')}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-28"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">View Payouts</span>
              <span className="text-[11px] text-slate-400 block font-medium mt-0.5">₹{stats.maturedBalance} available</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY (Answers "Is anything important waiting for me?" with max 4 clean items) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-display font-bold text-base text-slate-900">
            Recent Activity & Updates
          </h3>
          <button
            type="button"
            onClick={() => navigate('inbox')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View Inbox</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {stats.recentEvents.map(evt => (
            <div key={evt.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  evt.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                  evt.type === 'info' ? 'bg-indigo-50 text-indigo-600' :
                  evt.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{evt.desc}</p>
                </div>
              </div>
              <span className="font-mono text-[11px] text-slate-400 shrink-0">{evt.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PARTNER CHILD FEE WAIVER BANNER (Mission Welfare Feature) */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs text-indigo-950">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <span className="font-bold text-indigo-950 block">100% Fee Waiver for Partner's Own Children</span>
            <span className="text-[11px] text-indigo-900/80 font-medium">As a Courage Partner, your own children register for CNTS 2026 completely free (₹0).</span>
          </div>
        </div>
        <a
          href="/register"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline shrink-0 hidden sm:inline-block"
        >
          Claim Waiver →
        </a>
      </div>

    </div>
  );
};
