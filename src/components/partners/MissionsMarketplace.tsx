'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  Award, 
  Clock, 
  Users, 
  Download, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  FileText,
  Building2,
  Check,
  CreditCard,
  TrendingUp,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { PayoutAccountModal } from './PayoutAccountModal';

interface MissionsMarketplaceProps {
  partnerName?: string;
  referralCode?: string;
}

interface MissionItem {
  id: string;
  title: string;
  category: 'CNTS' | 'Merit Drive' | 'School Drive';
  missionText: string;
  targetAudience: string;
  duration: string;
  progressPercent: number;
  studentsTargeted: number;
  studentsAchieved: number;
  rewardText: string;
  badgeUnlocked: string;
  status: 'Active' | 'Featured' | 'Upcoming';
  sampleCopy: string;
}

export const MissionsMarketplace: React.FC<MissionsMarketplaceProps> = ({
  partnerName = 'Partner',
  referralCode = 'CNTSJN',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedMission, setSelectedMission] = useState<MissionItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [realRegistrations, setRealRegistrations] = useState<number>(0);

  React.useEffect(() => {
    if (referralCode) {
      fetch(`/api/partner/stats?referralCode=${encodeURIComponent(referralCode)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRealRegistrations(data.totalRegistrations || 0);
          }
        })
        .catch(err => console.error('Failed to fetch mission stats:', err));
    }
  }, [referralCode]);

  const missions: MissionItem[] = [
    {
      id: 'mission-cnts-2026-founding',
      title: 'CNTS 2026 Founding Edition Flagship Mission',
      category: 'CNTS',
      missionText: 'Mobilize Class 5-8 students in your region to register for Courage National Talent Search 2026 and qualify for national merit recognition & certificates.',
      targetAudience: 'Class 5-8 Students, Parents, Educators & School Networks',
      duration: 'Aug 1, 2026 - Sep 30, 2026',
      progressPercent: Math.min(100, Math.round((realRegistrations / 100) * 100)),
      studentsTargeted: 100,
      studentsAchieved: realRegistrations,
      rewardText: '₹50 honorarium per verified CNTS registration + Founding Partner Badge',
      badgeUnlocked: '🥈 CNTS Founding Mobilizer',
      status: 'Featured',
      sampleCopy: `📢 Official Announcement! Courage Library has launched the Courage National Talent Search (CNTS) 2026. Top performers win National Merit Recognition & verified cognitive profile reports. Register via my referral code: https://thecouragelibrary.com/register?ref=${referralCode}`
    },
    {
      id: 'mission-cnts-scholarship-awareness',
      title: 'CNTS National Merit & Talent Discovery Drive',
      category: 'Merit Drive',
      missionText: 'Identify & guide students from rural and semi-urban districts to register for CNTS 2026 national talent diagnostic assessment.',
      targetAudience: 'Rural Schools, NGO Students, Tier-2 & Tier-3 Communities',
      duration: 'Aug 10, 2026 - Sep 15, 2026',
      progressPercent: Math.min(100, Math.round((realRegistrations / 250) * 100)),
      studentsTargeted: 250,
      studentsAchieved: realRegistrations,
      rewardText: '₹75 per rural candidate + Community Champion Badge',
      badgeUnlocked: '🌟 CNTS Community Champion',
      status: 'Active',
      sampleCopy: `🎓 Unlocking Talent in Every District! Courage National Talent Search (CNTS) 2026 evaluates Critical Thinking, Science & Logic. Share this message with parents & teachers in your region: https://thecouragelibrary.com/register?ref=${referralCode}`
    },
    {
      id: 'mission-cnts-school-partnership',
      title: 'CNTS School-Wide Talent Identification Drive',
      category: 'School Drive',
      missionText: 'Connect school principals or academic coordinators to register their entire Class 5-8 student body for CNTS 2026 institutional diagnostic assessment.',
      targetAudience: 'School Principals, Vice-Principals, Academic Coordinators',
      duration: 'Ongoing 2026',
      progressPercent: Math.min(100, Math.round((realRegistrations / 10) * 100)),
      studentsTargeted: 10,
      studentsAchieved: Math.min(10, Math.floor(realRegistrations / 20)),
      rewardText: '₹5,000 institutional grant per connected school + Verified School Partner Badge',
      badgeUnlocked: '🏫 Verified School Partner',
      status: 'Active',
      sampleCopy: `Respected Principal, Courage Library offers the Courage National Talent Search (CNTS 2026) for your school students. Access institutional registration details here: https://thecouragelibrary.com/for-schools?ref=${referralCode}`
    }
  ];

  const filteredMissions = activeCategory === 'All' 
    ? missions 
    : missions.filter(m => m.category === activeCategory);

  const copyMissionLink = (refCode: string) => {
    navigator.clipboard.writeText(`https://thecouragelibrary.com/register?ref=${refCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* CLEAN MISSIONS HEADER */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-3 py-1.5 rounded-full">
          <Compass className="w-3.5 h-3.5 text-amber-400" /> Flagship Mission Hub
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
          Courage Partner Missions & Bounties
        </h1>
        <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
          Participate in active mobilization drives to unlock milestone bonuses, institutional grants, and verified reputation badges.
        </p>
      </div>

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
            <Compass className="w-3.5 h-3.5" /> Flagship Mission Hub
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Courage National Talent Search (CNTS) 2026
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Our primary mission is mobilizing students for CNTS 2026 to unlock national merit recognition & certificates across India.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
            <span className="block text-emerald-600 text-[10px] uppercase tracking-wider font-bold">Active Mission</span>
            <span className="font-mono text-lg font-bold">CNTS 2026 Founding Edition</span>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'CNTS', 'Merit Drive', 'School Drive'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat === 'All' ? 'All CNTS Drives' : `${cat} Drives`}
          </button>
        ))}
      </div>

      {/* MISSIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMissions.map(mission => (
          <div 
            key={mission.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Status Ribbon */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                mission.status === 'Featured' 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : mission.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {mission.status} CNTS Drive
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {mission.duration}
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                {mission.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {mission.missionText}
              </p>

              {/* Progress Bar */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">CNTS Registrations Mobilized</span>
                  <span className="font-mono font-bold text-slate-900">
                    {mission.studentsAchieved} / {mission.studentsTargeted} ({mission.progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${mission.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Reward & Badge Preview */}
              <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
                <span className="bg-indigo-50 text-indigo-900 font-semibold px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-600" /> {mission.rewardText}
                </span>
                <span className="bg-amber-50 text-amber-900 font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
                  {mission.badgeUnlocked}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedMission(mission)}
                className="flex-1 btn-primary text-xs py-2.5 h-auto cursor-pointer"
              >
                View CNTS Media Kit & Link
              </button>
              <button
                onClick={() => copyMissionLink(referralCode)}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Copy CNTS Referral Link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MISSION DETAIL MODAL */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-0.5 rounded">
                  CNTS 2026 Mission Kit
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                  {selectedMission.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedMission(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-sm text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Target Audience</h4>
                <p className="text-slate-600">{selectedMission.targetAudience}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Honorarium & Recognition</h4>
                <p className="text-slate-600">{selectedMission.rewardText}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Sample High-Converting CNTS Broadcast Copy</h4>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs leading-relaxed relative">
                  {selectedMission.sampleCopy}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMission.sampleCopy);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="mt-3 bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-sans font-semibold text-xs flex items-center gap-1.5 hover:bg-indigo-700 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? 'Copied to Clipboard' : 'Copy CNTS Post Text'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">CNTS Referral Link: <code className="text-indigo-700 font-bold">thecouragelibrary.com/register?ref={referralCode}</code></span>
                <button
                  onClick={() => setSelectedMission(null)}
                  className="btn-primary text-xs py-2 px-6 cursor-pointer"
                >
                  Close & Start Sharing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYOUT ACCOUNT & PAYMENT QR CODE UPLOAD MODAL */}
      <PayoutAccountModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
      />
    </div>
  );
};
