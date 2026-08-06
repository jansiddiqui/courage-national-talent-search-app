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
  ExternalLink,
  Users
} from 'lucide-react';

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
  
  // REAL STATS STATE — DEFAULT ALL NUMBERS TO 0 (NO MOCK VALUES)
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalEarnings: 0,
    maturedBalance: 0,
    effectiveRate: 25,
    ruleSource: 'Growth Tier (Bronze)',
    tierName: 'Bronze Mobilizer',
    nextTierName: 'Silver Mobilizer',
    nextTierTarget: 25,
    progressPercent: 0,
    recentEvents: [] as any[]
  });

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (referralCode) {
      setLoadingStats(true);
      fetch(`/api/partner/stats?referralCode=${encodeURIComponent(referralCode)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const regs = Number(data.totalRegistrations || 0);
            const rate = Number(data.honorariumRate || data.effectiveRate || 25);
            const earnings = data.rawHonorariumEarned ?? (regs * rate);

            setStats({
              totalRegistrations: regs,
              totalEarnings: earnings,
              maturedBalance: earnings, // Matured balance matches earnings for verified candidates
              effectiveRate: rate,
              ruleSource: data.ruleResult?.winningRuleName || data.ruleSource || 'Growth Tier (Bronze)',
              tierName: data.achievements?.unlockedBadges?.[0]?.title || 'Bronze Mobilizer',
              nextTierName: regs >= 25 ? 'Gold Mobilizer' : 'Silver Mobilizer',
              nextTierTarget: regs >= 25 ? 50 : 25,
              progressPercent: Math.min(100, Math.round((regs / 25) * 100)),
              recentEvents: data.timelineFeed || []
            });
          }
        })
        .catch(err => console.error('Failed to load partner stats:', err))
        .finally(() => setLoadingStats(false));
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
    navigate('referral');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-fade-in pb-12 font-sans text-[#0F172A]">

      {/* 1. HERO — WELCOME & REAL LIVE STATS */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
        
        {/* Ambient Glow Accent */}
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

          {/* Current Tier Badge & Rate */}
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

        {/* Core Metrics Grid (Live Verified Data ONLY) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 relative z-10">
          {/* Card 1: Verified Students */}
          <div className="bg-slate-900/70 border border-slate-800 p-4.5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Verified Students
            </span>
            <div className="font-mono text-3.5xl font-black text-white mt-1">
              {stats.totalRegistrations}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              Candidates enrolled via code
            </span>
          </div>

          {/* Card 2: Total Earnings */}
          <div className="bg-slate-900/70 border border-slate-800 p-4.5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Earnings
            </span>
            <div className="font-mono text-3.5xl font-black text-amber-300 mt-1">
              ₹{stats.totalEarnings.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1">
              Honorarium earned (₹{stats.effectiveRate}/reg)
            </span>
          </div>

          {/* Card 3: Available Balance */}
          <div className="bg-slate-900/70 border border-slate-800 p-4.5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Available Balance
            </span>
            <div className="font-mono text-3.5xl font-black text-emerald-400 mt-1">
              ₹{stats.maturedBalance.toLocaleString('en-IN')}
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
              style={{ width: `${Math.min(100, Math.max(0, stats.progressPercent))}%` }} 
            />
          </div>
        </div>

      </div>

      {/* 2. NEXT BEST ACTION CARD */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/60 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
            <Zap className="w-3.5 h-3.5 text-amber-600" /> Next Best Action
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            Share Today's Promotional WhatsApp Poster
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Sharing promotional posters on WhatsApp groups increases candidate registration rates by +24%.
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

      {/* 3. QUICK ACTIONS BAR */}
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

      {/* 4. RECENT ACTIVITY STREAM */}
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

        {stats.recentEvents.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No activity logged yet</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Share your referral link <code className="font-mono text-indigo-600 font-bold">{referralCode}</code> to start receiving verified student enrolments.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.recentEvents.map((evt, idx) => (
              <div key={evt.id || idx} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{evt.event_type || evt.title || 'Partner Event'}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{evt.description || evt.desc || 'Activity logged in system'}</p>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-slate-400 shrink-0">
                  {evt.created_at ? new Date(evt.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : (evt.time || 'Today')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. PARTNER CHILD FEE WAIVER BANNER */}
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
