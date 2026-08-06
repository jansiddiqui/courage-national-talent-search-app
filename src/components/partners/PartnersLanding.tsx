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
  Target
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

  useEffect(() => {
    const checkPartnerAuth = async () => {
      try {
        const { authService } = await import('@/services/authService');
        const session = await authService.checkSession();
        if (session.isAuthenticated) {
          setIsRegisteredPartner(true);
        }
      } catch (e) {
        // ignore
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
    <div className="w-full bg-[#F8FAFF] min-h-screen text-[#0F172A] pb-24">
      
      {/* LIGHT MESH HERO SECTION */}
      <section className="relative px-4 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/60 via-[#F8FAFF] to-[#F8FAFF] text-slate-900">
        
        {/* Glow Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* FOUNDING PARTNER PROGRAM URGENCY BADGE */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg border border-slate-800 mb-8 max-w-3xl mx-auto text-xs md:text-sm">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full font-extrabold text-xs">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> Founding Partner Cohort
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              First 1,000 partners receive lifetime profile recognition & priority payouts.
            </span>
            <span className="font-mono text-emerald-400 font-extrabold bg-emerald-950 px-2.5 py-0.5 rounded-full text-xs border border-emerald-800">
              384 / 1,000 Claimed
            </span>
            <button 
              onClick={onOpenApply}
              aria-label="Claim Founding Partner status"
              className="text-amber-300 hover:text-white underline font-bold flex items-center gap-1 ml-1 cursor-pointer"
            >
              Claim Status <ArrowRight className="w-3.5 h-3.5 inline" />
            </button>
          </div>

          {/* Institutional Sub-Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm px-4 py-1.5 rounded-full text-slate-700 text-xs md:text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Official Creator & Partner Ecosystem of Courage Library
            </div>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
            Mobilize Students for <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-indigo-600 to-amber-600">
              Courage Talent Search 2026.
            </span>
          </h1>

          {/* Subtitle / Mission Statement */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed mb-10">
            The central ecosystem where creators, teachers, school leads, NGOs, and community leaders collaborate with Courage Library to identify, benchmark, and empower 100,000+ Class 5–8 young talents through national recognition in CNTS 2026.
          </p>

          {/* Primary Action Buttons */}
          {isRegisteredPartner ? (
            <div className="flex items-center justify-center pt-2 mb-16">
              <button
                onClick={onViewDemoWorkspace}
                className="text-base sm:text-lg px-10 py-4 shadow-2xl flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white cursor-pointer font-extrabold rounded-2xl transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5 text-amber-300" /> Go to Partner Workspace <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 mb-16">
              <button
                onClick={onOpenApply}
                className="text-base px-8 py-4 shadow-xl hover:shadow-2xl flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all hover:scale-105 cursor-pointer"
              >
                Apply to Become a Partner <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => router.push('/login?tab=partner')}
                className="text-base px-7 py-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl flex items-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                Login to Partner Portal <Sparkles className="w-4 h-4 text-amber-500" />
              </button>
              
              <button
                onClick={onExploreMissions}
                className="w-full sm:w-auto text-base px-8 py-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <Compass className="w-5 h-5 text-indigo-600" />
                Explore Active Missions
              </button>
            </div>
          )}

          {/* Value Pillars Line */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left pt-6 border-t border-slate-200">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Mission First</h4>
                <p className="text-xs text-slate-500">Educational impact priority</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Community</h4>
                <p className="text-xs text-slate-500">Trusted educator network</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Growth & Reach</h4>
                <p className="text-xs text-slate-500">Skills & certifications</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Honorarium</h4>
                <p className="text-xs text-slate-500">Weekly Monday settlements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE HONORARIUM & EARNINGS CALCULATOR WIDGET */}
      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 mb-8">
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

          <div className="space-y-6 max-w-2xl mx-auto bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobilized Students:</span>
              <span className="font-mono text-2xl font-black text-amber-300">{calcStudents} Candidates</span>
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

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold">
              <span>10 Candidates</span>
              <span>100 Candidates</span>
              <span>250 Candidates</span>
              <span>500+ Candidates</span>
            </div>

            {/* Calculator Result Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Tier</span>
                <span className={`text-xs font-black font-mono px-2 py-0.5 rounded border inline-block ${currentTierInfo.color}`}>
                  {currentTierInfo.tier}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Honorarium Rate</span>
                <span className="font-mono text-xl font-black text-emerald-400 block">₹{currentTierInfo.rate} / Student</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-center space-y-1 bg-emerald-950/20">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Est. Payout</span>
                <span className="font-mono text-2xl font-black text-emerald-300 block">₹{estimatedEarnings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onOpenApply}
                className="py-3 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                Claim Your Referral Code <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PHILOSOPHY */}
      <section className="py-20 px-4 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-indigo-700 font-semibold text-xs uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Our Selection Philosophy
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4">
              Why Courage Chooses Partners
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              We do not measure partners by follower counts alone. Whether you run a 50-teacher WhatsApp group in Patna or a 200,000-subscriber YouTube channel, we respect genuine educational intent above vanity metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Authenticity</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Genuine care for student welfare. No deceptive claims or clickbait tactics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Consistency</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Long-term commitment to guiding parents, students, and schools in your network.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Educational Impact</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct contribution toward identifying and benchmarking young talents on a national stage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Community Trust</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The highest standard of trust built with parents, educators, and young scholars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CNTS 2026 EDITION 1 MISSION TARGET & COMMITMENT */}
      <section className="py-16 px-4 bg-[#0F172A] text-white">
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
              🎯 Inaugural Edition 1 Mission
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-white">
              CNTS 2026 National Talent Identification Goals
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto font-medium">
              Our inaugural edition mission to identify, benchmark, and empower Class 5–8 young talents across India.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-emerald-400 font-mono">
                100,000+
              </div>
              <span className="text-xs text-slate-300 font-bold block">Target Student Aspirants</span>
              <span className="text-[10px] text-slate-500 font-semibold block">Class 5–8 PAN-India</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-amber-400 font-mono">
                1,000
              </div>
              <span className="text-xs text-slate-300 font-bold block">Founding Partner Cap</span>
              <span className="text-[10px] text-slate-500 font-semibold block">Inaugural Creator Cohort</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-blue-400 font-mono">
                100%
              </div>
              <span className="text-xs text-slate-300 font-bold block">Merit & Aptitude Reports</span>
              <span className="text-[10px] text-slate-500 font-semibold block">National Percentile Benchmarks</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-indigo-400 font-mono">
                500+
              </div>
              <span className="text-xs text-slate-300 font-bold block">Target School Outreaches</span>
              <span className="text-[10px] text-slate-500 font-semibold block">Institutional Alliance Goal</span>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-indigo-700 font-bold text-xs uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Partner FAQs
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900">
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
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/80 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION FOOTER */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-8 sm:p-12 rounded-3xl text-white shadow-2xl border border-slate-800">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the National Educational Movement?
          </h2>
          <p className="text-slate-300 text-base md:text-lg mb-8">
            Applications are reviewed individually within 24 hours. Join our Founding Partner Cohort and shape the inaugural edition of CNTS 2026.
          </p>
          {isRegisteredPartner ? (
            <button
              onClick={onViewDemoWorkspace}
              className="text-base px-9 py-4 shadow-xl flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-bold rounded-2xl mx-auto"
            >
              <Sparkles className="w-5 h-5 text-amber-300" /> Go to Partner Workspace <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenApply}
                className="w-full sm:w-auto text-base px-8 py-4 shadow-lg hover:shadow-xl cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-5 h-5" />
                Apply to Become a Courage Partner
              </button>
              <button
                onClick={() => router.push('/login?tab=partner')}
                className="w-full sm:w-auto text-base px-8 py-4 cursor-pointer font-bold text-white border border-white/20 bg-white/10 hover:bg-white/20 rounded-2xl"
              >
                Login to Account
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
