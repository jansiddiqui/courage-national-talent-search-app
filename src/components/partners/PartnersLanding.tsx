'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  GraduationCap, 
  Building2, 
  Award, 
  Share2, 
  Compass, 
  HeartHandshake, 
  Zap, 
  TrendingUp, 
  Video, 
  MessageSquare, 
  FileText, 
  Globe, 
  BookOpen,
  Calendar,
  Star,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Flame,
  Check,
  Target,
  Copy,
  BarChart3,
  CreditCard,
  Layers,
  Wand2,
  Bot
} from 'lucide-react';

interface PartnersLandingProps {
  onOpenApply: () => void;
  onOpenLogin?: () => void;
  onExploreMissions: () => void;
  onViewDemoWorkspace: () => void;
}

export const PartnersLanding: React.FC<PartnersLandingProps> = ({
  onOpenApply,
  onOpenLogin,
  onExploreMissions,
  onViewDemoWorkspace
}) => {
  const router = useRouter();
  const [isRegisteredPartner, setIsRegisteredPartner] = useState(false);
  
  // Interactive Calculator State
  const [calcStudents, setCalcStudents] = useState<number>(100);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive SaaS Tooling Preview Tab State
  const [previewTab, setPreviewTab] = useState<'copilot' | 'marketplace' | 'analytics' | 'settlements'>('copilot');

  // AI Generator Demo State
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const checkPartnerAuth = async () => {
      try {
        const res = await fetch('/api/partner/session');
        const data = await res.json();
        if (data.isAuthenticated && data.partner) {
          setIsRegisteredPartner(true);
          return;
        }

        const savedPartner = localStorage.getItem('cnts_partner_session');
        if (savedPartner) {
          const parsed = JSON.parse(savedPartner);
          if (parsed && (parsed.customSlug || parsed.referralCode || parsed.fullName)) {
            setIsRegisteredPartner(true);
            return;
          }
        }

        setIsRegisteredPartner(false);
      } catch (e) {
        setIsRegisteredPartner(false);
      }
    };
    checkPartnerAuth();
  }, []);

  // Dynamic Rate & Tier Calculator Logic
  const getTierAndRate = (count: number) => {
    if (count >= 251) return { tier: 'FOUNDING PARTNER', rate: 65, color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
    if (count >= 101) return { tier: 'PLATINUM MOBILIZER', rate: 50, color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' };
    if (count >= 51) return { tier: 'GOLD MOBILIZER', rate: 40, color: 'text-amber-300 bg-amber-300/10 border-amber-300/30' };
    if (count >= 26) return { tier: 'SILVER MOBILIZER', rate: 30, color: 'text-slate-300 bg-slate-300/10 border-slate-300/30' };
    return { tier: 'BRONZE MOBILIZER', rate: 25, color: 'text-amber-600 bg-amber-600/10 border-amber-600/30' };
  };

  const currentTierInfo = getTierAndRate(calcStudents);
  const estimatedEarnings = calcStudents * currentTierInfo.rate;

  const faqs = [
    {
      q: 'How does the Partner Honorarium payout work?',
      a: 'Partners earn a direct honorarium rate per verified candidate registration (from ₹25 up to ₹65+ depending on tier and scale). Payouts are batched weekly every Monday directly into your linked UPI ID or Bank account.'
    },
    {
      q: 'Who can apply to become a Courage Partner?',
      a: 'Any content creator, YouTube educator, school teacher, coordinator, Telegram admin, WhatsApp community lead, educational NGO, or career mentor can join.'
    },
    {
      q: 'How fast is partner application approval?',
      a: 'Applications are reviewed individually within 24 hours. Once approved, your referral link, custom QR codes, and AI content copilot are activated immediately.'
    },
    {
      q: 'Are candidate registrations tracked live?',
      a: 'Yes! Your partner workspace includes live real-time candidate registration counters, conversion graphs, revenue projections, and weekly settlement statuses.'
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFF] min-h-screen text-[#0F172A] pb-24 font-sans antialiased overflow-x-hidden">
      
      {/* 1. LIGHT MESH HERO SECTION - MOBILE PERFECT */}
      <section className="relative px-4 pt-[140px] sm:pt-36 md:pt-40 pb-16 md:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/70 via-[#F8FAFF] to-[#F8FAFF] text-slate-900">
        
        {/* Glow Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-5 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* FOUNDING PARTNER PILL - SLEEK LIGHT THEME & MOBILE RESPONSIVE */}
          <div className="inline-flex items-center justify-between sm:justify-center gap-2 bg-white/90 backdrop-blur-md border border-amber-300/80 shadow-sm px-3.5 py-1.5 rounded-full text-slate-800 text-xs sm:text-sm font-semibold max-w-full overflow-hidden mx-auto">
            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100/90 font-mono font-extrabold px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs shrink-0">
              <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Founding Partner
            </span>
            <span className="text-slate-600 font-medium truncate hidden md:inline text-xs">
              First 1,000 partners receive lifetime profile recognition
            </span>
            <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] sm:text-xs border border-emerald-200 shrink-0">
              384 / 1,000 Claimed
            </span>
            <button 
              onClick={onOpenApply}
              aria-label="Claim Founding Partner status"
              className="text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-0.5 shrink-0 text-xs cursor-pointer ml-1"
            >
              Claim <ArrowRight className="w-3.5 h-3.5 inline" />
            </button>
          </div>

          {/* Institutional Sub-Badge */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs px-3.5 py-1.5 rounded-full text-slate-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Official Creator & Partner Ecosystem of Courage Library
            </div>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Mobilize Students for <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-indigo-600 to-amber-600">
              Courage Talent Search 2026.
            </span>
          </h1>

          {/* Subtitle / Mission Statement */}
          <p className="max-w-3xl mx-auto text-sm sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed px-2">
            The central ecosystem where creators, teachers, school leads, NGOs, and community leaders collaborate with Courage Library to identify, benchmark, and empower 100,000+ Class 5–8 young talents through national recognition in CNTS 2026.
          </p>

          {/* Primary Action Buttons - Full Width on Mobile */}
          {isRegisteredPartner ? (
            <div className="flex items-center justify-center pt-2 pb-6">
              <button
                onClick={onViewDemoWorkspace}
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-4 shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white cursor-pointer font-extrabold rounded-2xl transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5 text-amber-300" /> Go to Partner Workspace <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 pb-6">
              <button
                onClick={onOpenApply}
                className="w-full sm:w-auto text-base px-7 py-3.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold rounded-2xl transition-all hover:scale-105 cursor-pointer"
              >
                Apply to Become a Partner <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => router.push('/login?tab=partner')}
                className="w-full sm:w-auto text-base px-6 py-3.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                Partner Login <Sparkles className="w-4 h-4 text-amber-500" />
              </button>
              
              <button
                onClick={onExploreMissions}
                className="w-full sm:w-auto text-base px-6 py-3.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <Compass className="w-5 h-5 text-indigo-600" />
                Explore Missions
              </button>
            </div>
          )}

          {/* Value Pillars Grid - Responsive 2x2 on Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left pt-6 border-t border-slate-200">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Mission First</h4>
                <p className="text-[10.5px] sm:text-xs text-slate-500">Educational impact priority</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Community</h4>
                <p className="text-[10.5px] sm:text-xs text-slate-500">Trusted educator network</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Growth & Reach</h4>
                <p className="text-[10.5px] sm:text-xs text-slate-500">Skills & certifications</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Honorarium</h4>
                <p className="text-[10.5px] sm:text-xs text-slate-500">Weekly Monday settlements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SAAS TOOLING PREVIEW SHOWCASE */}
      <section className="py-16 sm:py-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <span className="text-indigo-700 font-extrabold text-xs uppercase tracking-widest bg-indigo-50 px-3.5 py-1 rounded-full font-mono">
              Full SaaS Platform Infrastructure
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900">
              Everything You Need to Scale Educational Reach
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg">
              Courage Partner provides dedicated enterprise tooling designed for educators, creators, and leaders.
            </p>
          </div>

          {/* Interactive SaaS Tooling Tabs */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-3xl mx-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {[
              { id: 'copilot', label: 'AI Content Copilot', icon: Wand2 },
              { id: 'marketplace', label: 'Active Missions', icon: Compass },
              { id: 'analytics', label: 'Real-Time Tracking', icon: BarChart3 },
              { id: 'settlements', label: 'Monday Payouts', icon: CreditCard },
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPreviewTab(tab.id as any)}
                  className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewTab === tab.id
                      ? 'bg-white text-indigo-700 shadow-md font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* SaaS Interface Live Interactive Mockup Card */}
          <div className="max-w-4xl mx-auto bg-slate-950 rounded-3xl p-5 sm:p-8 text-white shadow-2xl border border-slate-800 space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono font-bold text-slate-400 ml-1 hidden sm:inline">courage-partner-os.app / {previewTab}</span>
              </div>
              <span className="text-[10px] font-mono font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                LIVE DEMO WORKSPACE
              </span>
            </div>

            {/* TAB 1 DEMO: AI COPILOT */}
            {previewTab === 'copilot' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-bold text-xs sm:text-sm text-slate-200">AI Broadcast Copilot</h3>
                  </div>
                  <span className="text-[10px] sm:text-xs text-indigo-400 font-mono font-semibold">Generating Post...</span>
                </div>
                <div className="bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-3 font-sans text-xs">
                  <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                    "📢 <strong className="text-white">Attention Class 5 to 8 Parents & Teachers!</strong> Courage National Talent Search (CNTS) 2026 registrations are now open. Empower your child with national percentile benchmarking & merit certificates."
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[10px] sm:text-[11px] font-mono text-slate-400">
                    <span className="truncate max-w-[180px] sm:max-w-none">Ref: cnts.in/r/CNTSJN</span>
                    <button
                      onClick={() => {
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                      {copiedLink ? 'Copied' : 'Copy Broadcast'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2 DEMO: MISSIONS MARKETPLACE */}
            {previewTab === 'marketplace' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400" /> Active Campaign Missions
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">2 Active Missions</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="text-[9.5px] uppercase font-mono font-bold text-amber-400 block">Mission #1 • CNTS 2026</span>
                    <h4 className="font-bold text-xs text-white">Class 5–8 Mobilization Drive</h4>
                    <p className="text-[10.5px] text-slate-400">Earn ₹25–₹65 per verified student registration.</p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="text-[9.5px] uppercase font-mono font-bold text-indigo-400 block">Mission #2 • School Alliances</span>
                    <h4 className="font-bold text-xs text-white">School Partnership Campaign</h4>
                    <p className="text-[10.5px] text-slate-400">Connect schools for school-wide assessment drives.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3 DEMO: REAL-TIME TRACKING */}
            {previewTab === 'analytics' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" /> Real-Time Analytics Dashboard
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[9.5px] text-slate-400 uppercase font-bold block">Referral Code</span>
                    <span className="font-mono text-sm sm:text-lg font-black text-indigo-400 block">CNTSJN</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[9.5px] text-slate-400 uppercase font-bold block">Mobilized</span>
                    <span className="font-mono text-sm sm:text-lg font-black text-emerald-400 block">124</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[9.5px] text-slate-400 uppercase font-bold block">Honorarium</span>
                    <span className="font-mono text-sm sm:text-lg font-black text-amber-400 block">₹4,960</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4 DEMO: MONDAY SETTLEMENTS */}
            {previewTab === 'settlements' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" /> Weekly Settlement Log
                  </h3>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">UPI Settlement • rahul@upi</span>
                    <span className="text-[10px] text-slate-400 font-mono">UTR: UTR-9876543210</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-400 text-xs sm:text-sm block">₹4,960 SETTLED</span>
                    <span className="text-[9.5px] text-slate-500 font-semibold">Monday Batch</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE HONORARIUM & EARNINGS CALCULATOR WIDGET */}
      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-5 sm:p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2.5 mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Interactive Partner Calculator
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black">
              Calculate Your Candidate Mobilization Honorarium
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
              Move the slider below to project your weekly potential earnings and unlock partner tier achievements.
            </p>
          </div>

          <div className="space-y-5 max-w-2xl mx-auto bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobilized Students:</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-300">{calcStudents} Candidates</span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={10}
              max={500}
              step={5}
              value={calcStudents}
              onChange={e => setCalcStudents(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 font-bold">
              <span>10 Candidates</span>
              <span>100 Candidates</span>
              <span>250 Candidates</span>
              <span>500+ Candidates</span>
            </div>

            {/* Calculator Result Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[9.5px] text-slate-400 uppercase font-bold block">Current Tier</span>
                <span className={`text-xs font-black font-mono px-2 py-0.5 rounded border inline-block ${currentTierInfo.color}`}>
                  {currentTierInfo.tier}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[9.5px] text-slate-400 uppercase font-bold block">Honorarium Rate</span>
                <span className="font-mono text-lg sm:text-xl font-black text-emerald-400 block">₹{currentTierInfo.rate} / Student</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-center space-y-1 bg-emerald-950/20">
                <span className="text-[9.5px] text-emerald-400 uppercase font-bold block">Est. Payout</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-emerald-300 block">₹{estimatedEarnings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onOpenApply}
                className="w-full sm:w-auto py-3 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Claim Your Referral Code <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHO IS A COURAGE PARTNER (PERSONA GRID) */}
      <section className="py-16 sm:py-20 px-4 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full font-mono">
              Universal Ecosystem
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900">
              Who is a Courage Partner?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg">
              Designed for every educator, creator, or leader dedicated to empowering young talent across India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { title: 'YouTube Creators', icon: Video, color: 'text-red-600 bg-red-50' },
              { title: 'LinkedIn Voices', icon: Share2, color: 'text-blue-600 bg-blue-50' },
              { title: 'School Teachers', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50' },
              { title: 'School Leads', icon: Building2, color: 'text-purple-600 bg-purple-50' },
              { title: 'Telegram Admins', icon: MessageSquare, color: 'text-sky-600 bg-sky-50' },
              { title: 'WhatsApp Leads', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50' },
              { title: 'Educational NGOs', icon: HeartHandshake, color: 'text-pink-600 bg-pink-50' },
              { title: 'Campus Leads', icon: Users, color: 'text-amber-600 bg-amber-50' },
              { title: 'Instagram Creators', icon: Video, color: 'text-fuchsia-600 bg-fuchsia-50' },
              { title: 'Bloggers & Editors', icon: FileText, color: 'text-slate-600 bg-slate-100' },
              { title: 'Discord Leaders', icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50' },
              { title: 'Coaching Leads', icon: BookOpen, color: 'text-teal-600 bg-teal-50' },
              { title: 'Career Mentors', icon: Award, color: 'text-amber-600 bg-amber-50' },
              { title: 'Parent Communities', icon: Users, color: 'text-rose-600 bg-rose-50' },
              { title: 'Public Speakers', icon: Globe, color: 'text-violet-600 bg-violet-50' },
            ].map((persona, idx) => {
              const IconComp = persona.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center text-center group"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${persona.color} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-bold text-[11px] sm:text-xs text-slate-800">
                    {persona.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CNTS 2026 EDITION 1 MISSION TARGET & COMMITMENT */}
      <section className="py-16 px-4 bg-[#0F172A] text-white">
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-amber-400" /> Inaugural Edition 1 Mission
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-white">
              CNTS 2026 National Talent Identification Goals
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto font-medium">
              Our inaugural edition mission to identify, benchmark, and empower Class 5–8 young talents across India.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-400 font-mono">
                100,000+
              </div>
              <span className="text-[11px] sm:text-xs text-slate-300 font-bold block">Target Student Aspirants</span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-semibold block">Class 5–8 PAN-India</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-amber-400 font-mono">
                1,000
              </div>
              <span className="text-[11px] sm:text-xs text-slate-300 font-bold block">Founding Partner Cap</span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-semibold block">Inaugural Creator Cohort</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-blue-400 font-mono">
                100%
              </div>
              <span className="text-[11px] sm:text-xs text-slate-300 font-bold block">Merit & Aptitude Reports</span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-semibold block">National Percentile Benchmarks</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-indigo-400 font-mono">
                500+
              </div>
              <span className="text-[11px] sm:text-xs text-slate-300 font-bold block">Target School Outreaches</span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-semibold block">Institutional Alliance Goal</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-indigo-700 font-bold text-xs uppercase tracking-widest bg-indigo-50 px-3.5 py-1 rounded-full font-mono">
              Partner FAQs
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/80 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION FOOTER */}
      <section className="py-16 sm:py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-12 rounded-3xl text-white shadow-2xl border border-slate-800">
          <h2 className="font-display text-2xl sm:text-4xl font-black mb-3">
            Ready to Join the National Educational Movement?
          </h2>
          <p className="text-slate-300 text-xs sm:text-base md:text-lg mb-6">
            Applications are reviewed individually within 24 hours. Join our Founding Partner Cohort and shape the inaugural edition of CNTS 2026.
          </p>
          {isRegisteredPartner ? (
            <button
              onClick={onViewDemoWorkspace}
              className="text-sm sm:text-base px-8 py-3.5 shadow-xl flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-extrabold rounded-2xl mx-auto"
            >
              <Sparkles className="w-5 h-5 text-amber-300" /> Go to Partner Workspace <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenApply}
                className="w-full sm:w-auto text-sm sm:text-base px-7 py-3.5 shadow-lg hover:shadow-xl cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-5 h-5" />
                Apply to Become a Courage Partner
              </button>
              <button
                onClick={() => router.push('/login?tab=partner')}
                className="w-full sm:w-auto text-sm sm:text-base px-7 py-3.5 cursor-pointer font-bold text-white border border-white/20 bg-white/10 hover:bg-white/20 rounded-2xl"
              >
                Partner Login
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
