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
  Star
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
  return (
    <div className="w-full bg-[#F8FAFF] min-h-screen text-[#0F172A] pb-24">
      {/* HERO SECTION */}
      <section className="relative px-4 pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden mesh-bg">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* 1. FOUNDING PARTNER PROGRAM URGENCY CARD (Clean, no overlap with fixed Navbar) */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 bg-[#0F172A] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-800 mb-8 max-w-3xl mx-auto text-xs md:text-sm">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold text-xs">
              🏅 Founding Partner Program
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              First 1,000 partners receive lifetime profile recognition.
            </span>
            <span className="font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded text-xs border border-emerald-800">
              384 / 1,000 Claimed
            </span>
            <button 
              onClick={onOpenApply}
              aria-label="Claim Founding Partner status"
              className="text-amber-400 hover:text-amber-300 underline font-bold flex items-center gap-1 ml-1 cursor-pointer"
            >
              Claim Status <ArrowRight className="w-3.5 h-3.5 inline" />
            </button>
          </div>

          {/* Institutional Sub-Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm px-4 py-1.5 rounded-full text-slate-700 text-xs md:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Official Partnership Platform of Courage Library
            </div>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08] mb-6">
            Mobilize Students for <br className="hidden sm:block" />
            <span className="gradient-text">Courage National Talent Search</span> 2026.
          </h1>

          {/* Subtitle / Mission Statement */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 font-normal leading-relaxed mb-10">
            This is not an affiliate network. This is the central ecosystem where creators, teachers, school coordinators, NGOs, Telegram admins, WhatsApp leaders, and educators collaborate with Courage Library to connect 100,000+ Class 5-8 students to 100% Merit Scholarships through CNTS 2026.
          </p>

          {/* Primary Action Buttons */}
          {isRegisteredPartner ? (
            <div className="flex items-center justify-center pt-2 mb-16">
              <button
                onClick={onViewDemoWorkspace}
                className="btn-primary text-lg px-10 py-4.5 shadow-2xl flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-bold rounded-2xl transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5 text-amber-300" /> Go to Partner Workspace <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 mb-16">
              <button
                onClick={onOpenApply}
                className="btn-primary text-base px-8 py-4 shadow-xl hover:shadow-2xl flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                Apply to Become a Courage Partner <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => router.push('/login?tab=partner')}
                className="btn-outline text-base px-7 py-4 border-slate-300 hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-bold text-slate-800"
              >
                Login <Sparkles className="w-4 h-4 text-amber-500" />
              </button>
              
              <button
                onClick={onExploreMissions}
                className="w-full sm:w-auto btn-outline text-base px-8 py-4 h-auto hover:bg-slate-100 cursor-pointer"
              >
                <Compass className="w-5 h-5 text-indigo-700" />
                Explore Active Missions
              </button>
            </div>
          )}

          {/* Value Pillars Line */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left pt-6 border-t border-slate-200/80">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Mission First</h4>
                <p className="text-xs text-slate-500">Educational impact before everything</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Community Second</h4>
                <p className="text-xs text-slate-500">Trusted peer educator network</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Growth Third</h4>
                <p className="text-xs text-slate-500">Skills, reach & certifications</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Earnings Fourth</h4>
                <p className="text-xs text-slate-500">Transparent & honorific payouts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PHILOSOPHY / WHY COURAGE CHOOSES YOU */}
      <section className="py-20 px-4 bg-white border-y border-slate-200/80">
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
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Authenticity</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Genuine care for student welfare. No deceptive claims or clickbait tactics.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Consistency</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Long-term commitment to guiding parents, students, and schools in your network.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Educational Impact</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct contribution toward connecting deserving students with national scholarships.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all">
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

      {/* WHO CAN BECOME A COURAGE PARTNER */}
      <section className="py-20 px-4 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-700 font-semibold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Universal Ecosystem
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4">
              Who is a Courage Partner?
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              Courage Partner is designed for every individual or organization dedicated to unlocking student talent across India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'YouTube Creators', icon: Video, color: 'text-red-600 bg-red-50' },
              { title: 'LinkedIn Voices', icon: Share2, color: 'text-blue-600 bg-blue-50' },
              { title: 'School Teachers', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50' },
              { title: 'School Coordinators', icon: Building2, color: 'text-purple-600 bg-purple-50' },
              { title: 'Telegram Admins', icon: MessageSquare, color: 'text-sky-600 bg-sky-50' },
              { title: 'WhatsApp Admins', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50' },
              { title: 'Educational NGOs', icon: HeartHandshake, color: 'text-pink-600 bg-pink-50' },
              { title: 'Campus Ambassadors', icon: Users, color: 'text-amber-600 bg-amber-50' },
              { title: 'Instagram Creators', icon: Video, color: 'text-fuchsia-600 bg-fuchsia-50' },
              { title: 'Bloggers & Newsletters', icon: FileText, color: 'text-slate-600 bg-slate-100' },
              { title: 'Discord Leaders', icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50' },
              { title: 'Coaching Institutes', icon: BookOpen, color: 'text-teal-600 bg-teal-50' },
              { title: 'Career Mentors', icon: Award, color: 'text-amber-600 bg-amber-50' },
              { title: 'Parent Communities', icon: Users, color: 'text-rose-600 bg-rose-50' },
              { title: 'Public Speakers', icon: Globe, color: 'text-violet-600 bg-violet-50' },
            ].map((persona, idx) => {
              const IconComp = persona.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
                >
                  <div className={`w-10 h-10 rounded-lg ${persona.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-slate-800">
                    {persona.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM CAPABILITIES */}
      <section className="py-20 px-4 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-700 font-semibold text-xs uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
              Full Platform Infrastructure
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4">
              Everything You Need to Drive Impact
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              Courage Partner provides world-class SaaS tooling designed to help you create content, track reach, earn recognition, and grow professionally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#F8FAFF] border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-3">AI Copilot Studio</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Instant AI generators for WhatsApp broadcasts, Telegram posts, LinkedIn articles, Instagram Reel scripts, and carousel graphics tailored to Indian students.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-platform format switching</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> High-converting educational copy</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-[#F8FAFF] border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-3">Opportunity Marketplace</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Access active national missions—from CNTS Talent Search enrollment to Teacher Excellence drives and Scholarship Awareness weeks.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real-time mission progress tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Official downloadable media kits</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-[#F8FAFF] border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-6 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-3">Certified Credentials</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Earn institutional certifications, physical certificates of honor, and LinkedIn credentials as your impact score grows.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Courage Partner Badges</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Public GitHub-style partner profile</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NATIONAL IMPACT COUNTER */}
      <section className="py-16 px-4 bg-[#0F172A] text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-400 mb-2">
              250,000+
            </div>
            <p className="text-xs md:text-sm text-slate-400 font-medium">Students Impacted</p>
          </div>
          <div className="p-4">
            <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400 mb-2">
              1,400+
            </div>
            <p className="text-xs md:text-sm text-slate-400 font-medium">Schools Connected</p>
          </div>
          <div className="p-4">
            <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-blue-400 mb-2">
              ₹1.2 Cr+
            </div>
            <p className="text-xs md:text-sm text-slate-400 font-medium">Scholarships Disbursed</p>
          </div>
          <div className="p-4">
            <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-400 mb-2">
              3,840+
            </div>
            <p className="text-xs md:text-sm text-slate-400 font-medium">Active Courage Partners</p>
          </div>
        </div>
      </section>

      {/* FEATURED PARTNER SPOTLIGHT */}
      <section className="py-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-amber-400 p-1 flex-shrink-0 shadow-lg">
              <div className="w-full h-full rounded-xl bg-slate-800 flex items-center justify-center text-3xl font-bold text-amber-300">
                AS
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-amber-400/30">
                <Star className="w-3.5 h-3.5 fill-amber-300" /> Featured Partner Spotlight
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Ananya Sharma
              </h3>
              <p className="text-sm text-indigo-200 mb-4 font-medium">
                LinkedIn Creator & Educator • 32,000+ Professional Network • Bihar School Outreach Lead
              </p>
              <blockquote className="text-sm md:text-base text-slate-300 italic mb-6 leading-relaxed">
                "Courage Partner allowed me to connect 14 rural schools in Bihar with CNTS scholarship exams. The institutional support, brand kit, and clear mission made it feel like I was building a legacy for my state."
              </blockquote>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
                <span className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-emerald-400 font-mono">
                  Impact: 1,420 Students Mobilized
                </span>
                <span className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-amber-300 font-mono">
                  Founding Partner #0084
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION FOOTER */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Join the National Educational Movement?
          </h2>
          <p className="text-slate-600 text-base md:text-lg mb-8">
            Applications are reviewed individually within 24 hours. Join 3,800+ educators, creators, and leaders creating real opportunities.
          </p>
          {isRegisteredPartner ? (
            <button
              onClick={onViewDemoWorkspace}
              className="btn-primary text-base px-9 py-4 shadow-xl flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-bold rounded-2xl mx-auto"
            >
              <Sparkles className="w-5 h-5 text-amber-300" /> Go to Partner Workspace <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenApply}
                className="w-full sm:w-auto btn-primary text-base px-8 py-4 h-auto shadow-lg hover:shadow-xl cursor-pointer"
              >
                <HeartHandshake className="w-5 h-5" />
                Apply to Become a Courage Partner
              </button>
              <button
                onClick={() => router.push('/login?tab=partner')}
                className="w-full sm:w-auto btn-outline text-base px-8 py-4 h-auto cursor-pointer font-bold text-slate-800"
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
