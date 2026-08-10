'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PartnerWorkspaceLayout, WorkspaceTab } from '@/components/partners/PartnerWorkspaceLayout';
import { PartnerOverview } from '@/components/partners/PartnerOverview';
import { RegisterChildTab } from '@/components/partners/RegisterChildTab';
import { PartnerReputationAndAnalytics } from '@/components/partners/PartnerReputationAndAnalytics';
import { MissionsMarketplace } from '@/components/partners/MissionsMarketplace';
import { ReferralCenter } from '@/components/partners/ReferralCenter';
import { PayoutCenter } from '@/components/partners/PayoutCenter';
import { PaymentSetupAndRulesTab } from '@/components/partners/PaymentSetupAndRulesTab';
import { GrowthCenter } from '@/components/partners/GrowthCenter';
import { PartnerSupportCenter } from '@/components/partners/PartnerSupportCenter';
import { PartnerInbox } from '@/components/partners/PartnerInbox';
import { ContentRoadmapTab } from '@/components/partners/ContentRoadmapTab';
import { PartnerLaunchpadTab } from '@/components/partners/PartnerLaunchpadTab';
import { PartnerSuspensionScreen } from '@/components/partners/PartnerSuspensionScreen';
import { PartnerPendingScreen } from '@/components/partners/PartnerPendingScreen';
import { 
  Lock, 
  Sparkles, 
  ArrowRight, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Award,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export default function DedicatedPartnerWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug as string;
  const slug = rawSlug ? rawSlug.toLowerCase() : '';

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('launchpad');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegisteredCode, setIsRegisteredCode] = useState(false);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [pendingPartnerData, setPendingPartnerData] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const verifyPartnerAccess = async () => {
    try {
      // 1. Check if user is authenticated as a partner via signed JWT session
      const res = await fetch('/api/partner/session');
      const data = await res.json();

      if (data.isAuthenticated && data.partner) {
        setPartnerData(data.partner);
        setIsAuthenticated(true);
        setIsRegisteredCode(true);
        setLoading(false);
        return;
      }

      // 2. Unauthenticated visitor — Check if this slug/code exists as a registered partner in system
      const cleanSlug = slug.trim().toLowerCase();
      const knownRegisteredSlugs = ['cntsjn', 'janmohammad', 'partner', 'demo'];

      if (knownRegisteredSlugs.includes(cleanSlug)) {
        setIsRegisteredCode(true);
      } else if (cleanSlug) {
        try {
          const statsRes = await fetch(`/api/partner/stats?referralCode=${encodeURIComponent(cleanSlug)}`);
          const statsData = await statsRes.json();
          if (statsData.success && statsData.status !== 'UNREGISTERED') {
            setIsRegisteredCode(true);
            if (statsData.status === 'PENDING') {
              setPendingPartnerData({
                partnerId: statsData.partnerId || `CP-2026-${cleanSlug}`,
                fullName: statsData.fullName || 'Partner Applicant',
                referralCode: cleanSlug.toUpperCase(),
                customSlug: cleanSlug,
                status: 'PENDING'
              });
            }
          } else {
            setIsRegisteredCode(false);
          }
        } catch (e) {
          setIsRegisteredCode(false);
        }
      }

      setIsAuthenticated(false);
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPartnerAccess();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/70 via-[#F8FAFF] to-[#F8FAFF] flex flex-col justify-center items-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Verifying Partner Handle Authentication...</p>
      </div>
    );
  }

  // PENDING PARTNER ACCOUNT INTERCEPTOR (AUTHENTICATED SESSION OR PUBLIC PENDING SLUG)
  if ((isAuthenticated && partnerData?.status === 'PENDING') || pendingPartnerData) {
    return (
      <PartnerPendingScreen 
        partnerData={partnerData || pendingPartnerData} 
        onRefresh={verifyPartnerAccess} 
      />
    );
  }

  // SUSPENDED PARTNER ACCOUNT INTERCEPTOR
  if (isAuthenticated && partnerData?.status === 'SUSPENDED') {
    return (
      <PartnerSuspensionScreen 
        partnerData={partnerData} 
        onRefresh={verifyPartnerAccess} 
      />
    );
  }

  // PREMIUM GLASSMORPHIC ACCESS LOCKED VIEW FOR UNAUTHENTICATED VISITORS
  if (!isAuthenticated) {
    const handleUrl = `thecouragelibrary.com/partners/${slug}`;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/80 via-[#F8FAFF] to-[#F8FAFF] flex flex-col justify-between font-sans">
        <Navbar />
        
        <main className="max-w-3xl mx-auto px-4 pt-[140px] pb-16 sm:pt-36 sm:pb-24 md:pt-40 text-center space-y-8 w-full">
          {/* GLASS CARD CONTAINER */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-3xl p-5 sm:p-8 md:p-12 space-y-6 sm:space-y-8 relative overflow-hidden">
            
            {/* BACKGROUND DECORATIVE GLOW */}
            <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-30 ${
              isRegisteredCode ? 'bg-indigo-500' : 'bg-emerald-500'
            }`} />

            {/* CASE A: REGISTERED PARTNER WORKSPACE -> PROMPT LOGIN */}
            {isRegisteredCode ? (
              <>
                {/* ICON EMBLEM */}
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-indigo-950 text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-indigo-800 ring-8 ring-indigo-50/80 transform hover:scale-105 transition-transform duration-300">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                </div>

                {/* BADGE & HEADLINE */}
                <div className="space-y-3 relative z-10">
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200/80 inline-flex items-center gap-1.5 shadow-xs">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> REGISTERED CREATOR OS WORKSPACE
                  </span>
                  
                  <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    Unlock Your Partner Workspace
                  </h1>

                  {/* URL CHIP */}
                  <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl font-mono text-xs shadow-md border border-slate-800 my-2">
                    <span className="text-slate-400">URL:</span>
                    <span className="font-bold text-amber-300 truncate max-w-[240px] sm:max-w-none">{handleUrl}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://${handleUrl}`);
                        setCopiedUrl(true);
                        setTimeout(() => setCopiedUrl(false), 2000);
                      }}
                      className="ml-1 p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                      title="Copy handle URL"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
                    This workspace belongs to verified Courage Partner <strong className="font-mono text-indigo-700 font-bold uppercase">{slug}</strong>. Log in via your registered account to manage referral counters, payout settlements, and AI media kits.
                  </p>
                </div>

                {/* FEATURE HIGHLIGHT PILLS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 relative z-10 text-left">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Real-Time Analytics</h4>
                      <p className="text-[10px] text-slate-500">Live referral conversions</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Monday Settlements</h4>
                      <p className="text-[10px] text-slate-500">Automated UPI payouts</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">AI Studio Copilot</h4>
                      <p className="text-[10px] text-slate-500">Automated copy & banners</p>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 relative z-10">
                  <button
                    onClick={() => router.push('/login?tab=partner')}
                    className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" /> Login to Partner Workspace <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push('/partners/apply')}
                    className="w-full sm:w-auto px-7 py-4 border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer shadow-xs"
                  >
                    Apply to Become a Partner
                  </button>
                </div>
              </>
            ) : (
              /* CASE B: UNREGISTERED PARTNER CODE -> SHOW REGISTRATION CLAIM */
              <>
                {/* ICON EMBLEM */}
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-emerald-400 ring-8 ring-emerald-50/80 transform hover:scale-105 transition-transform duration-300">
                    <UserPlus className="w-10 h-10" />
                  </div>
                </div>

                {/* BADGE & HEADLINE */}
                <div className="space-y-3 relative z-10">
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 inline-flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AVAILABLE CUSTOM PARTNER HANDLE
                  </span>

                  <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    Claim <span className="text-emerald-600 font-mono">/partners/{slug}</span> as Your Unique Partner Link!
                  </h1>

                  {/* URL CHIP */}
                  <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl font-mono text-xs shadow-md border border-slate-800 my-2">
                    <span className="text-slate-400">Available Link:</span>
                    <span className="font-bold text-emerald-400 truncate max-w-[240px] sm:max-w-none">{handleUrl}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://${handleUrl}`);
                        setCopiedUrl(true);
                        setTimeout(() => setCopiedUrl(false), 2000);
                      }}
                      className="ml-1 p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                      title="Copy handle URL"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
                    The partner handle <strong className="font-mono text-emerald-700 font-bold uppercase">{slug}</strong> is open for registration. Apply now to claim this handle, mobilize Class 5-8 students, and earn ₹25–₹100 honorarium per candidate.
                  </p>
                </div>

                {/* FEATURE HIGHLIGHT PILLS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 relative z-10 text-left">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">100% Merit Waiver</h4>
                      <p className="text-[10px] text-slate-500">Mobilize Class 5-8 students</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Award className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Honorarium Rewards</h4>
                      <p className="text-[10px] text-slate-500">₹25 - ₹100 per verification</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Official Certificate</h4>
                      <p className="text-[10px] text-slate-500">Institutional Mobilizer badge</p>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 relative z-10">
                  <button
                    onClick={() => router.push(`/partners/apply?slug=${encodeURIComponent(slug)}`)}
                    className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5"
                  >
                    <UserPlus className="w-4 h-4" /> Apply & Claim /partners/{slug} <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push('/login?tab=partner')}
                    className="w-full sm:w-auto px-7 py-4 border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer shadow-xs"
                  >
                    Partner Login
                  </button>
                </div>
              </>
            )}

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // AUTHENTICATED PARTNER WORKSPACE DASHBOARD
  const currentPartnerName = partnerData?.fullName || 'Partner Account';
  const currentReferralCode = partnerData?.referralCode || slug.toUpperCase() || 'CNTSJN';

  return (
    <PartnerWorkspaceLayout
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab)}
      onViewPublicProfile={() => router.push(`/partners/profile/${slug}`)}
      onExitWorkspace={() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cnts_partner_session');
        }
        router.push('/partners');
      }}
      applicantData={partnerData}
    >
      {activeTab === 'launchpad' && (
        <PartnerLaunchpadTab
          referralCode={currentReferralCode}
          partnerName={currentPartnerName}
          applicantData={partnerData}
          onNavigateTab={(tab: any) => setActiveTab(tab)}
        />
      )}
      {activeTab === 'overview' && (
        <PartnerOverview
          partnerName={currentPartnerName}
          referralCode={currentReferralCode}
          onNavigateToTab={(tab: any) => setActiveTab(tab)}
        />
      )}
      {activeTab === 'roadmap' && (
        <ContentRoadmapTab
          referralCode={currentReferralCode}
          partnerName={currentPartnerName}
        />
      )}
      {activeTab === 'child' && (
        <RegisterChildTab
          partnerName={currentPartnerName}
          partnerCode={currentReferralCode}
        />
      )}
      {activeTab === 'tiers' && (
        <PartnerReputationAndAnalytics
          partnerName={currentPartnerName}
          referralCode={currentReferralCode}
        />
      )}
      {activeTab === 'inbox' && (
        <PartnerInbox
          partnerName={currentPartnerName}
        />
      )}
      {activeTab === 'missions' && (
        <MissionsMarketplace
          partnerName={currentPartnerName}
          referralCode={currentReferralCode}
        />
      )}
      {activeTab === 'referral' && (
        <ReferralCenter
          partnerName={currentPartnerName}
          referralCode={currentReferralCode}
        />
      )}
      {activeTab === 'payouts' && (
        <PayoutCenter
          partnerName={currentPartnerName}
          referralCode={currentReferralCode}
          onNavigateToPaymentSetup={() => setActiveTab('payment-setup')}
        />
      )}
      {activeTab === 'payment-setup' && <PaymentSetupAndRulesTab />}
      {activeTab === 'growth' && (
        <GrowthCenter
          audienceScale={partnerData?.audienceScale}
          referralCode={currentReferralCode}
          partnerName={currentPartnerName}
        />
      )}
      {activeTab === 'support' && (
        <PartnerSupportCenter
          partnerName={currentPartnerName}
          referralCode={currentReferralCode}
        />
      )}
    </PartnerWorkspaceLayout>
  );
}
