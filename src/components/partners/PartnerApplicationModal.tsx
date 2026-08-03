'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Users, 
  Globe, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface PartnerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (applicantData: any) => void;
}

export const PartnerApplicationModal: React.FC<PartnerApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmitted
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    primaryRole: 'Educator / Teacher',
    communities: [] as string[],
    platforms: [] as string[],
    audienceScale: '1k - 10k',
    customSlug: '',
    referralCode: '',
    missionPledge: false
  });

  if (!isOpen) return null;

  const communityOptions = [
    'Students (Class 5 - 8)',
    'Parents & Guardians',
    'School Teachers & Principals',
    'School Coordinators',
    'College Students',
    'Career Aspirants',
    'Technology & Coding',
    'Competitive Exam Seekers',
    'Professional Network'
  ];

  const platformOptions = [
    'YouTube Channel',
    'Instagram Profile',
    'LinkedIn Network',
    'Facebook Group/Page',
    'X (Twitter)',
    'Threads',
    'Telegram Channel/Group',
    'WhatsApp Community',
    'Discord Server',
    'Website / Blog',
    'Newsletter',
    'Podcast',
    'School / Campus'
  ];

  const toggleCommunity = (item: string) => {
    setFormData(prev => ({
      ...prev,
      communities: prev.communities.includes(item)
        ? prev.communities.filter(c => c !== item)
        : [...prev.communities, item]
    }));
  };

  const togglePlatform = (item: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(item)
        ? prev.platforms.filter(p => p !== item)
        : [...prev.platforms, item]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRefCode = formData.referralCode || (formData.fullName ? `${formData.fullName.split(' ')[0].toUpperCase()}2026` : 'CREATOR2026');
    const finalSlug = formData.customSlug || (formData.fullName ? formData.fullName.toLowerCase().replace(/\s+/g, '') : 'partner');
    onSubmitted({
      ...formData,
      referralCode: finalRefCode,
      customSlug: finalSlug
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-slide-up">
        {/* Header Bar */}
        <div className="bg-[#0F172A] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Apply to Become a Courage Partner
                </h3>
                <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Founding Slot #385
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 inline" />
                Reviewed individually within 24 hours
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-amber-500 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  Step 1 of 4 • Identity
                </span>
                <h4 className="font-display text-2xl font-bold text-slate-900 mt-2">
                  Tell us about yourself
                </h4>
                <p className="text-slate-500 text-sm">
                  We welcome content creators, educators, Telegram admins, YouTubers, and community leaders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jan Mohammad"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jan@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Channel Handle</label>
                  <input
                    type="text"
                    placeholder="e.g. @janmohammad / EdTech Academy"
                    value={formData.organization}
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Role *</label>
                <select
                  value={formData.primaryRole}
                  onChange={e => setFormData({ ...formData, primaryRole: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option>YouTube / Video Content Creator</option>
                  <option>Instagram / Social Media Creator</option>
                  <option>LinkedIn Creator / Professional</option>
                  <option>Telegram / WhatsApp Community Leader</option>
                  <option>School Teacher / Educator</option>
                  <option>School Coordinator / Principal</option>
                  <option>Educational NGO Leader</option>
                  <option>College Student / Campus Ambassador</option>
                  <option>Career Coach / Mentor</option>
                  <option>Parent Community Organizer</option>
                  <option>Other Creator Partner</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.fullName || !formData.email || !formData.phone}
                  className="btn-primary px-6 py-3 disabled:opacity-50 cursor-pointer"
                >
                  Continue to Community <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TARGET COMMUNITY */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  Step 2 of 4 • Community Focus
                </span>
                <h4 className="font-display text-2xl font-bold text-slate-900 mt-2">
                  What community do you serve?
                </h4>
                <p className="text-slate-500 text-sm">
                  Select all that apply to your audience network.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
                {communityOptions.map((item, idx) => {
                  const selected = formData.communities.includes(item);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleCommunity(item)}
                      className={`p-3 rounded-xl border text-left text-sm flex items-center justify-between transition-all cursor-pointer ${
                        selected 
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-medium shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{item}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline px-5 py-2.5 text-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={formData.communities.length === 0}
                  className="btn-primary px-6 py-3 disabled:opacity-50 text-sm cursor-pointer"
                >
                  Continue to Platforms <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PLATFORMS & REACH */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  Step 3 of 4 • Channels & Platforms
                </span>
                <h4 className="font-display text-2xl font-bold text-slate-900 mt-2">
                  Where do you engage your audience?
                </h4>
                <p className="text-slate-500 text-sm">
                  Select your primary platforms (Multiple selections allowed).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                {platformOptions.map((item, idx) => {
                  const selected = formData.platforms.includes(item);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => togglePlatform(item)}
                      className={`p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                        selected 
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-semibold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {selected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Community Reach / Followers</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {['< 1k', '1k - 10k', '10k - 50k', '50k - 250k', '250k+'].map((scale, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, audienceScale: scale })}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        formData.audienceScale === scale
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {scale}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Your reach determines your assigned Creator Revenue Share Tier (10% to 30%).
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-outline px-5 py-2.5 text-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={formData.platforms.length === 0}
                  className="btn-primary px-6 py-3 disabled:opacity-50 text-sm cursor-pointer"
                >
                  Final Step: Referral Code <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REFERRAL CODE CUSTOMIZATION & SUBMIT */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  Step 4 of 4 • Referral Code & Link
                </span>
                <h4 className="font-display text-2xl font-bold text-slate-900 mt-2">
                  Customize Your Unique Referral Code
                </h4>
                <p className="text-slate-500 text-sm">
                  Your official Courage Partner referral link will use this domain & code.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Desired Referral Code / Handle *
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <span className="px-3.5 py-3 text-xs text-slate-500 font-mono border-r border-slate-200 bg-slate-100 font-semibold shrink-0">
                    thecouragelibrary.com/register?ref=
                  </span>
                  <input
                    type="text"
                    placeholder={formData.fullName ? `${formData.fullName.split(' ')[0].toUpperCase()}2026` : 'JANMOHAMMAD2026'}
                    value={formData.referralCode}
                    onChange={e => setFormData({ 
                      ...formData, 
                      referralCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                      customSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
                    })}
                    className="w-full px-3 py-2.5 text-sm bg-white focus:outline-none font-mono text-indigo-900 font-bold tracking-wider"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Domain: <strong className="text-slate-700 font-mono">thecouragelibrary.com</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Courage Creator Code of Conduct
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  "I commit to representing Courage Library with honesty, accuracy, and dignity. I will prioritize student benefit and educational access above commercial gains."
                </p>
                <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.missionPledge}
                    onChange={e => setFormData({ ...formData, missionPledge: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-amber-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-amber-900">
                    I accept the Courage Partner Integrity Pledge & Code of Conduct.
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-outline px-5 py-2.5 text-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </button>
                <button
                  type="submit"
                  disabled={!formData.missionPledge}
                  className="btn-primary px-8 py-3.5 shadow-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-sm cursor-pointer"
                >
                  Submit Application & Generate Code <Sparkles className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
