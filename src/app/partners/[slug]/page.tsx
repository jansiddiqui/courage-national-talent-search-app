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
import { Lock, Sparkles, ArrowRight, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DedicatedPartnerWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug as string;
  const slug = rawSlug ? rawSlug.toLowerCase() : '';

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegisteredCode, setIsRegisteredCode] = useState(false);
  const [partnerData, setPartnerData] = useState<any>(null);

  useEffect(() => {
    const verifyPartnerAccess = async () => {
      try {
        // 1. Check if user is authenticated as a partner
        const res = await fetch('/api/partner/session');
        const data = await res.json();

        if (data.isAuthenticated && data.partner) {
          setPartnerData(data.partner);
          setIsAuthenticated(true);
          setIsRegisteredCode(true);
          setLoading(false);
          return;
        }

        // 2. Check local session storage fallback
        const savedPartner = localStorage.getItem('cnts_partner_session');
        if (savedPartner) {
          try {
            const parsed = JSON.parse(savedPartner);
            if (parsed && (parsed.customSlug || parsed.referralCode || parsed.fullName)) {
              setPartnerData(parsed);
              setIsAuthenticated(true);
              setIsRegisteredCode(true);
              setLoading(false);
              return;
            }
          } catch (e) {
            // ignore
          }
        }

        // 3. Unauthenticated visitor — Check if this slug/code exists as a registered partner in system
        if (slug) {
          const statsRes = await fetch(`/api/partner/stats?referralCode=${encodeURIComponent(slug)}`);
          const statsData = await statsRes.json();
          if (statsData.success && statsData.status !== 'UNREGISTERED') {
            setIsRegisteredCode(true);
          } else {
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

    verifyPartnerAccess();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col justify-center items-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono font-bold text-slate-500">Checking Partner Registration Status...</p>
      </div>
    );
  }

  // ACCESS LOCKED VIEW FOR UNAUTHENTICATED VISITORS
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col justify-between">
        <Navbar />
        
        <main className="max-w-2xl mx-auto px-4 py-36 text-center space-y-6">
          {/* CASE A: REGISTERED PARTNER CODE -> SHOW LOGIN */}
          {isRegisteredCode ? (
            <>
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-amber-200">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
                  Registered Partner Workspace
                </span>
                <h1 className="font-display text-3xl font-black text-slate-900">
                  Login to Access /partners/{slug || 'workspace'}
                </h1>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  This workspace belongs to registered Courage Partner <strong className="font-mono text-indigo-600 uppercase">{slug}</strong>. Please log in with your credentials to access your dashboard.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => router.push('/login?tab=partner')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> Login to Partner Workspace <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/partners/apply')}
                  className="w-full sm:w-auto px-7 py-3.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl transition-all cursor-pointer"
                >
                  Apply to Become a Partner
                </button>
              </div>
            </>
          ) : (
            /* CASE B: UNREGISTERED PARTNER CODE -> SHOW REGISTRATION CLAIM */
            <>
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
                <UserPlus className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                  Available Partner Handle
                </span>
                <h1 className="font-display text-3xl font-black text-slate-900">
                  Claim /partners/{slug} as Your Partner Handle!
                </h1>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  The partner code <strong className="font-mono text-emerald-600 uppercase">{slug}</strong> is not registered yet. Apply to become an official Courage Partner and claim this referral link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => router.push(`/partners/apply?slug=${encodeURIComponent(slug)}`)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Apply & Claim /partners/{slug} <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/login?tab=partner')}
                  className="w-full sm:w-auto px-7 py-3.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl transition-all cursor-pointer"
                >
                  Partner Login
                </button>
              </div>
            </>
          )}
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
      {activeTab === 'overview' && (
        <PartnerOverview
          partnerName={currentPartnerName}
          referralCode={currentReferralCode}
          onNavigateToTab={(tab: any) => setActiveTab(tab)}
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
