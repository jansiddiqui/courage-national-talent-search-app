'use client';

import React from 'react';
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
  ArrowLeft
} from 'lucide-react';

interface PublicPartnerProfileViewProps {
  slug?: string;
  onBackToWorkspace?: () => void;
}

export const PublicPartnerProfileView: React.FC<PublicPartnerProfileViewProps> = ({
  slug = 'rahul-sharma',
  onBackToWorkspace
}) => {
  const profileData = {
    name: slug === 'ananya-sharma' ? 'Ananya Sharma' : 'Rahul Sharma',
    role: slug === 'ananya-sharma' ? 'LinkedIn Creator & Educator' : 'School Coordinator & Teacher',
    location: slug === 'ananya-sharma' ? 'Patna, Bihar' : 'Lucknow, Uttar Pradesh',
    partnerId: slug === 'ananya-sharma' ? 'CP-2026-000084' : 'CP-2026-000384',
    joinedDate: 'August 2026',
    reputationScore: slug === 'ananya-sharma' ? 99 : 98,
    isFounding: true,
    bio: 'Dedicated to expanding 100% merit scholarship awareness across secondary schools and coaching communities in North India.',
    studentsMobilized: slug === 'ananya-sharma' ? 1420 : 1240,
    schoolsConnected: 14,
    communitiesReached: 18450,
    badges: [
      { name: 'Founding Partner 🏅', desc: 'First 1,000 National Partners' },
      { name: '1,000+ Students Impacted 🎓', desc: 'Mobilized over 1,000 candidates' },
      { name: '10+ Schools Connected 🏫', desc: 'Institutional school partnership lead' },
      { name: 'Creator Excellence ✨', desc: 'High authentic engagement rating' },
    ],
    missionHistory: [
      { name: 'CNTS 2026 Founding Edition', status: 'Completed (100%)', impact: '1,240 Students' },
      { name: 'Scholarship Awareness Drive 2026', status: 'Active', impact: '14 Schools' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#0F172A] p-4 sm:p-6 lg:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        {/* TOP NAV BAR */}
        <div className="flex items-center justify-between">
          {onBackToWorkspace ? (
            <button
              onClick={onBackToWorkspace}
              className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Partner Workspace
            </button>
          ) : (
            <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Official Courage Library Partner Profile
            </span>
          )}

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Profile URL copied to clipboard!');
            }}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Profile
          </button>
        </div>

        {/* HERO CARD */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 p-1 flex-shrink-0 shadow-md">
                <div className="w-full h-full rounded-2xl bg-[#0F172A] flex items-center justify-center font-bold text-2xl text-amber-300">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                    {profileData.name}
                  </h1>
                  {profileData.isFounding && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      🏅 Founding Partner
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-indigo-700 mb-2">{profileData.role}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profileData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined {profileData.joinedDate}
                  </span>
                  <span className="font-mono text-indigo-900 font-bold">
                    {profileData.partnerId}
                  </span>
                </div>
              </div>
            </div>

            {/* Reputation Badge */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex items-center gap-3 shadow-inner flex-shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Reputation</span>
                <span className="font-mono text-2xl font-bold text-amber-300">{profileData.reputationScore}/100</span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <div className="flex items-center text-amber-300 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Verified Excellent</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 mt-6 pt-6 border-t border-slate-100 leading-relaxed">
            "{profileData.bio}"
          </p>
        </div>

        {/* IMPACT METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Students Impacted</span>
            <span className="font-mono text-3xl font-bold text-indigo-900 mt-1 block">{profileData.studentsMobilized}</span>
            <span className="text-[11px] text-emerald-600 font-medium">CNTS Scholarship Candidates</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Schools Connected</span>
            <span className="font-mono text-3xl font-bold text-emerald-900 mt-1 block">{profileData.schoolsConnected}</span>
            <span className="text-[11px] text-slate-500 font-medium">Institutional Outreach</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Communities Reached</span>
            <span className="font-mono text-3xl font-bold text-amber-600 mt-1 block">{profileData.communitiesReached.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500 font-medium">Parents, Teachers & Aspirants</span>
          </div>
        </div>

        {/* BADGES VAULT */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Earned Recognition Badges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileData.badges.map((b, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold flex-shrink-0">
                  🏅
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{b.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MISSION HISTORY TIMELINE */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900">Completed Missions History</h3>

          <div className="space-y-3">
            {profileData.missionHistory.map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{m.name}</h4>
                  <span className="text-slate-500">Impact Generated: {m.impact}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
