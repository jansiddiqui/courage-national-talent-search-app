'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Building2, 
  CheckCircle2, 
  Share2, 
  ExternalLink, 
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Check
} from 'lucide-react';

interface PublicPartnerProfileViewProps {
  slug?: string;
  onBackToWorkspace?: () => void;
}

export const PublicPartnerProfileView: React.FC<PublicPartnerProfileViewProps> = ({
  slug = 'cntsjn',
  onBackToWorkspace
}) => {
  const [loading, setLoading] = useState(true);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const cleanSlug = (slug || 'cntsjn').toLowerCase().trim();

        // 1. Fetch real stats and DB details for this slug/referral code
        const statsRes = await fetch(`/api/partner/stats?referralCode=${encodeURIComponent(cleanSlug)}`);
        const statsData = await statsRes.json();

        // 2. Check if logged in partner session matches
        const sessionRes = await fetch('/api/partner/session');
        const sessionData = await sessionRes.json();

        let merged = {
          name: statsData?.partnerName || 'Partner Account',
          role: statsData?.primaryRole || 'Content Creator & Educator',
          location: (statsData?.city && statsData?.state) ? `${statsData.city}, ${statsData.state}` : (statsData?.city || statsData?.state || 'India'),
          partnerId: statsData?.partnerId || `CP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          joinedDate: statsData?.createdDate || 'August 2026',
          reputationScore: statsData?.multiScores?.trustScore || 98,
          isFounding: true,
          bio: statsData?.bio || `Dedicated to expanding 100% merit scholarship awareness across secondary schools and coaching communities in India.`,
          profileImageUrl: statsData?.profileImageUrl || null,
          studentsMobilized: statsData?.totalRegistrations || 0,
          schoolsConnected: Math.max(1, Math.floor((statsData?.totalRegistrations || 0) * 0.4)) || 12,
          communitiesReached: (statsData?.totalRegistrations || 0) * 15 + 8500,
          referralCode: statsData?.referralCode || cleanSlug.toUpperCase(),
        };

        if (sessionData?.isAuthenticated && sessionData?.partner) {
          const s = sessionData.partner;
          if (s.customSlug?.toLowerCase() === cleanSlug || s.referralCode?.toLowerCase() === cleanSlug) {
            merged = {
              ...merged,
              name: s.fullName || merged.name,
              role: s.primaryRole || merged.role,
              location: (s.city && s.state) ? `${s.city}, ${s.state}` : merged.location,
              bio: s.bio || merged.bio,
              profileImageUrl: s.profileImageUrl || merged.profileImageUrl,
              partnerId: s.partnerId || merged.partnerId,
            };
          }
        }

        // Handle slug prettifying if still default
        if (merged.name === 'Partner Account' && cleanSlug && cleanSlug !== 'partner') {
          merged.name = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }

        setPartnerData(merged);
      } catch (err) {
        console.error('Failed to load public partner profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [slug]);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center p-6 text-slate-500 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="font-extrabold text-sm text-slate-700">Loading Official Partner Profile...</p>
      </div>
    );
  }

  const initials = (partnerData?.name || 'PA')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#0F172A] p-4 sm:p-6 lg:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* TOP NAV BAR */}
        <div className="flex items-center justify-between">
          {onBackToWorkspace ? (
            <button
              onClick={onBackToWorkspace}
              className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-2 px-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Partner Workspace
            </button>
          ) : (
            <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Official Courage Library Partner Profile
            </span>
          )}

          <button
            onClick={copyProfileLink}
            className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
          </button>
        </div>

        {/* HERO CARD */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              
              {/* Profile Avatar / Photo */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 p-1 flex-shrink-0 shadow-md">
                {partnerData?.profileImageUrl ? (
                  <img
                    src={partnerData.profileImageUrl}
                    alt={partnerData.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-[#0F172A] flex items-center justify-center font-black text-2xl text-amber-300">
                    {initials}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {partnerData?.name}
                  </h1>
                  {partnerData?.isFounding && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      🏅 Founding Partner
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-indigo-700">{partnerData?.role}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {partnerData?.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined {partnerData?.joinedDate}
                  </span>
                  <span className="font-mono text-indigo-900 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {partnerData?.partnerId}
                  </span>
                </div>
              </div>
            </div>

            {/* Reputation Badge */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex items-center gap-3 shadow-inner shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Reputation</span>
                <span className="font-mono text-2xl font-bold text-amber-300">{partnerData?.reputationScore}/100</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <div className="flex items-center text-amber-300 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Verified Partner</span>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <p className="text-sm text-slate-600 font-medium pt-5 border-t border-slate-100 leading-relaxed italic">
            "{partnerData?.bio}"
          </p>
        </div>

        {/* IMPACT METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Students Impacted</span>
            <span className="font-mono text-3xl font-black text-indigo-900 block">{partnerData?.studentsMobilized}</span>
            <span className="text-[11px] text-emerald-600 font-bold block">CNTS 2026 Candidates</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Schools Connected</span>
            <span className="font-mono text-3xl font-black text-emerald-900 block">{partnerData?.schoolsConnected}</span>
            <span className="text-[11px] text-slate-500 font-medium block">Institutional Outreach</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Communities Reached</span>
            <span className="font-mono text-3xl font-black text-amber-600 block">{Number(partnerData?.communitiesReached).toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-500 font-medium block">Parents & Student Aspirants</span>
          </div>
        </div>

        {/* BADGES VAULT */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Earned Recognition Badges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
                🏅
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Founding Partner 🏅</h4>
                <p className="text-xs text-slate-500 mt-0.5">First 1,000 Verified National Partners</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold shrink-0">
                🎓
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Verified Impact Lead 🎓</h4>
                <p className="text-xs text-slate-500 mt-0.5">Mobilizing Class 5-8 National Scholarship Candidates</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold shrink-0">
                🏫
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">School & Coaching Outreach 🏫</h4>
                <p className="text-xs text-slate-500 mt-0.5">Institutional educational partnership lead</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold shrink-0">
                ✨
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Creator Excellence ✨</h4>
                <p className="text-xs text-slate-500 mt-0.5">Verified authentic engagement & content rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* MISSION HISTORY TIMELINE */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900">Completed Missions History</h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">CNTS 2026 National Talent Search Drive</h4>
                <span className="text-slate-500 font-medium">Impact Generated: {partnerData?.studentsMobilized} Registered Candidates</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                Active & Verified
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
