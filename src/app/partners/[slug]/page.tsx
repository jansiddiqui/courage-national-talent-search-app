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
import { PartnerLoginModal } from '@/components/partners/PartnerLoginModal';
import { ShieldAlert, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DedicatedPartnerWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug as string;
  const slug = rawSlug ? rawSlug.toLowerCase() : '';

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const verifyPartnerAccess = async () => {
      try {
        // 1. Try fetching real session from API
        const res = await fetch('/api/partner/session');
        const data = await res.json();

        if (data.isAuthenticated && data.partner) {
          const p = data.partner;
          const userSlug = (p.customSlug || p.referralCode || '').toLowerCase();
          
          // Match slug or allow partner to view their own workspace
          setPartnerData(p);
          setIsAuthenticated(true);
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
              setLoading(false);
              return;
            }
          } catch (e) {
            // ignore
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

  const handleLoginSuccess = (data: any) => {
    setPartnerData(data);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cnts_partner_session', JSON.stringify(data));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col justify-center items-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono font-bold text-slate-500">Authenticating Partner Workspace...</p>
      </div>
    );
  }

  // ACCESS LOCKED VIEW FOR UNAUTHENTICATED VISITORS
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col justify-between">
        <Navbar />
        
        <main className="max-w-2xl mx-auto px-4 py-32 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              Partner Workspace Access Protected
            </span>
            <h1 className="font-display text-3xl font-black text-slate-900">
              Authentication Required for /partners/{slug || 'workspace'}
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              This workspace dashboard is private to registered Courage Partners. Please log in with your OTP to access your referral counters, payouts, and AI studio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Partner Login via OTP
            </button>
            <button
              onClick={() => router.push('/partners/apply')}
              className="w-full sm:w-auto px-7 py-3.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl transition-all cursor-pointer"
            >
              Apply to Become a Partner
            </button>
          </div>
        </main>

        <Footer />

        <PartnerLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToApply={() => router.push('/partners/apply')}
        />
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
