'use client';

import React from 'react';
import { 
  TrendingUp, 
  Star, 
  Users, 
  Building2, 
  GraduationCap, 
  Award, 
  BarChart3, 
  Share2, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface PartnerReputationAndAnalyticsProps {
  partnerName?: string;
  referralCode?: string;
}

export const PartnerReputationAndAnalytics: React.FC<PartnerReputationAndAnalyticsProps> = ({
  partnerName = 'Partner',
  referralCode = 'CNTSJN',
}) => {
  const [verifiedRegistrations, setVerifiedRegistrations] = React.useState<number>(0);

  React.useEffect(() => {
    if (referralCode) {
      fetch(`/api/partner/stats?referralCode=${encodeURIComponent(referralCode)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setVerifiedRegistrations(data.totalRegistrations || 0);
          }
        })
        .catch(err => console.error('Failed to fetch analytics:', err));
    }
  }, [referralCode]);

  const tiers = [
    { tier: 'Bronze',   min: 1,   max: 25,  rate: '₹25 / Student', bonus: 'Base Tier',        badge: '🥉 Bronze Mobilizer', color: 'border-slate-200 bg-slate-50 text-slate-800',               perks: ['Standard Referral Link', 'WhatsApp Templates', 'Digital Certificate'] },
    { tier: 'Silver',   min: 26,  max: 50,  rate: '₹25 / Student', bonus: '+ ₹500 Bonus',     badge: '🥈 Silver Mobilizer', color: 'border-slate-300 bg-slate-100 text-slate-900',              perks: ['Custom Referral Code', 'Printable QR Poster', 'Priority Payouts'] },
    { tier: 'Gold',     min: 51,  max: 100, rate: '₹25 / Student', bonus: '+ ₹1,500 Bonus',   badge: '🥇 Gold Mobilizer',   color: 'border-amber-300 bg-amber-50 text-amber-950',              perks: ['Verified Badge', 'Instant UPI Settlement', 'Featured Profile'] },
    { tier: 'Platinum', min: 101, max: 250, rate: '₹25 / Student', bonus: '+ ₹5,000 Bonus',   badge: '💎 Platinum Partner', color: 'border-indigo-200 bg-indigo-50 text-indigo-950',           perks: ['School Drive Grants', 'Account Manager', 'Child Fee Waiver'] },
    { tier: 'Founding', min: 251, max: Infinity, rate: '₹25 / Student', bonus: '+ ₹15,000 Bonus', badge: '🌟 Founding Partner', color: 'border-emerald-300 bg-emerald-50 text-emerald-950', perks: ['Hall of Fame Listing', 'Physical Trophy', 'Lifetime Revenue Share'] },
  ];

  const currentTierObj = tiers.find(t => verifiedRegistrations >= t.min && verifiedRegistrations <= t.max) || tiers[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER & REPUTATION BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Institutional Reputation Index
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              Partner Reputation & Impact Analytics
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              {partnerName} • Code: <span className="font-mono text-amber-300">{referralCode}</span> • Top 3% National Partners
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl flex items-center gap-4 shadow-inner">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold font-display text-2xl shadow-lg">
              98
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-300" />
                ))}
              </div>
              <span className="text-sm font-bold text-white block mt-0.5">Excellent Standing</span>
              <span className="text-[11px] text-slate-400 font-mono">Rank: Top 3% National Partners</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 REPUTATION SUB-SCORES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Communication</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">5.0 / 5.0</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-display">★★★★★</div>
          <p className="text-xs text-slate-500 mt-1">Prompt responses & accurate guidance</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authenticity</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">5.0 / 5.0</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-display">★★★★★</div>
          <p className="text-xs text-slate-500 mt-1">Zero misleading claims or spam</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mission Completion</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">4.9 / 5.0</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-display">★★★★★</div>
          <p className="text-xs text-slate-500 mt-1">High goal achievement rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Community Rating</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">4.8 / 5.0</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-display">★★★★★</div>
          <p className="text-xs text-slate-500 mt-1">Feedback from parents & teachers</p>
        </div>
      </div>

      {/* DETAILED IMPACT METRICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Mobilization Stats */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" /> Educational Reach & Mobilization
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-xs text-indigo-700 font-bold uppercase tracking-wider block">Students Mobilized</span>
              <span className="font-mono text-2xl font-bold text-indigo-900 mt-1 block">1,240</span>
              <span className="text-[11px] text-emerald-600 font-medium">+18% this month</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">Parents Reached</span>
              <span className="font-mono text-2xl font-bold text-emerald-900 mt-1 block">8,450</span>
              <span className="text-[11px] text-emerald-600 font-medium">+24% this month</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block">Schools Connected</span>
              <span className="font-mono text-2xl font-bold text-amber-900 mt-1 block">14</span>
              <span className="text-[11px] text-amber-700 font-medium">Bihar & UP Districts</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Link Clicks</span>
              <span className="font-mono text-2xl font-bold text-slate-900 mt-1 block">14,280</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Conversion Rate</span>
              <span className="font-mono text-2xl font-bold text-slate-900 mt-1 block">8.68%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Influence Score</span>
              <span className="font-mono text-2xl font-bold text-indigo-900 mt-1 block">89.4 / 100</span>
            </div>
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" /> Channel Performance
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { channel: 'WhatsApp Communities', share: 45, count: '558 Students' },
              { channel: 'YouTube Channel', share: 25, count: '310 Students' },
              { channel: 'LinkedIn Network', share: 18, count: '223 Students' },
              { channel: 'Instagram Reels', share: 12, count: '149 Students' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{item.channel}</span>
                  <span className="font-mono text-slate-900">{item.share}% ({item.count})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full" 
                    style={{ width: `${item.share}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* PARTNER MOBILIZATION TIERS BREAKDOWN & PROGRESSION */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-1 border border-indigo-100">
              <Award className="w-3.5 h-3.5" /> Official Partner Tier Matrix
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">
              Mobilization Tiers, Badges & Bonus Perks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unlock higher honorarium bonuses, verified badges, and institutional grants as your student registrations grow.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl shrink-0 text-right">
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">Your Current Tier</span>
            <span className="font-mono text-base font-extrabold text-amber-950 flex items-center justify-end gap-1">
              {currentTierObj.badge} ({verifiedRegistrations} Verified)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {tiers.map((item, idx) => {
            const isActive = item.tier === currentTierObj.tier;
            return (
              <div key={idx} className={`p-4 rounded-2xl border space-y-3 relative flex flex-col justify-between transition-all ${
                isActive
                  ? `${item.color} ring-2 ring-amber-400 shadow-lg`
                  : item.color
              }`}>
                {isActive && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    ✓ Your Tier
                  </span>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">{item.min}–{item.max === Infinity ? '251+' : item.max} Students</span>
                  <h4 className="font-display font-black text-lg">{item.tier}</h4>
                  <div className="font-mono text-xs font-bold text-emerald-700">{item.rate}</div>
                  <div className="text-[11px] font-extrabold text-indigo-700">{item.bonus}</div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] font-medium">
                  {item.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
