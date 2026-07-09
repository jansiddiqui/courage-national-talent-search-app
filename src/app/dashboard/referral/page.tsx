"use client";

import { useState } from "react";
import { usePortal } from "@/contexts/PortalContext";
import { Share2, Copy, Check, Award, Gift, Users, Trophy } from "lucide-react";

export default function ReferralPage() {
  const { activeCandidate } = usePortal();
  const [copied, setCopied] = useState(false);

  if (!activeCandidate) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">No candidate selected</div>
  );

  const referralCode = activeCandidate.referral_code || activeCandidate.registration_id || "CNTS26-DEMO";
  const shareUrl = `https://thecouragelibrary.com/register?ref=${referralCode}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=Hi!%20I'm%20inviting%20you%20to%20register%20your%20child%20for%20the%20Courage%20National%20Talent%20Search%20(CNTS)%202026.%20Use%20my%20referral%20code%20*${referralCode}*%20when%20registering.%20Register%20here%3A%20${encodeURIComponent(shareUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralCount = activeCandidate.total_referrals || 0;

  const rewardTiers = [
    { referrals: 1, reward: "Founding Family Badge", description: "Special digital badge added to your child's profile card." },
    { referrals: 3, reward: "Resource Pack Access", description: "Unlock 3 premium worksheets and resource guides." },
    { referrals: 5, reward: "Leaderboard Recognition", description: "Your family will be featured on the national CNTS referral honor roll." },
    { referrals: 10, reward: "Exclusive Webinar Invitation", description: "Live interactive parent webinar with cognitive child development experts." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Referral Center</h1>
        <p className="text-slate-500 text-sm mt-1">Invite other families and unlock rewards for {activeCandidate.student_name}</p>
      </div>

      {/* Refer & Earn Hero */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative space-y-4 max-w-lg">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Gift size={20} className="text-amber-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl">Share the Courage Library</h2>
            <p className="text-blue-200 text-xs mt-1 leading-relaxed">
              Help other parents discover their children's unique cognitive strengths. Introduce them to CNTS 2026 Founding Edition.
            </p>
          </div>
        </div>
      </div>

      {/* Referral Info / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Referral Code Box */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide text-slate-600">Your Referral Code</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Share this code with other parents</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-bold text-blue-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex-1 text-center">
              {referralCode}
            </span>
            <button
              onClick={handleCopy}
              className="px-4 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-xl text-xs font-bold text-center transition-colors block"
          >
            Invite via WhatsApp
          </a>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide text-slate-600">Referral Stats</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Your success tracking</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-2">
            <span className="font-display font-black text-4xl text-slate-900">{referralCount}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Successful Invites</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1.5 rounded-lg justify-center font-semibold">
            <Trophy size={12} /> Leaderboard Active
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-xs font-black uppercase tracking-wide text-slate-700 mb-4 flex items-center gap-1.5">
          <Award size={14} className="text-amber-500" /> Reward Tiers
        </h3>
        <div className="space-y-4">
          {rewardTiers.map((tier, idx) => {
            const isUnlocked = referralCount >= tier.referrals;
            return (
              <div key={idx} className="flex gap-4 items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${isUnlocked ? "bg-amber-100 border-amber-300 text-amber-700" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                  <Users size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold ${isUnlocked ? "text-slate-800" : "text-slate-500"}`}>
                      {tier.reward}
                    </p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${isUnlocked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {isUnlocked ? "Unlocked" : `${tier.referrals} Invite${tier.referrals > 1 ? "s" : ""}`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tier.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
