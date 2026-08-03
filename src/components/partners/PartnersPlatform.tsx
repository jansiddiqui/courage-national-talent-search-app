'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PartnersLanding } from './PartnersLanding';
import { CreatorApplicationPage } from './CreatorApplicationPage';
import { PartnerLoginModal } from './PartnerLoginModal';
import { ApprovalMomentModal } from './ApprovalMomentModal';
import { PartnerWorkspaceLayout, WorkspaceTab } from './PartnerWorkspaceLayout';
import { PartnerOverview } from './PartnerOverview';
import { RegisterChildTab } from './RegisterChildTab';
import { PartnerReputationAndAnalytics } from './PartnerReputationAndAnalytics';
import { MissionsMarketplace } from './MissionsMarketplace';
import { ReferralCenter } from './ReferralCenter';
import { PayoutCenter } from './PayoutCenter';
import { PaymentSetupAndRulesTab } from './PaymentSetupAndRulesTab';
import { GrowthCenter } from './GrowthCenter';
import { PartnerSupportCenter } from './PartnerSupportCenter';
import { PublicPartnerProfileView } from './PublicPartnerProfileView';

interface PartnersPlatformProps {
  initialView?: 'landing' | 'apply' | 'workspace' | 'publicProfile';
}

export const PartnersPlatform: React.FC<PartnersPlatformProps> = ({
  initialView = 'landing'
}) => {
  const [viewMode, setViewMode] = useState<'landing' | 'apply' | 'workspace' | 'publicProfile'>(initialView);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'workspace' || viewParam === 'dashboard') {
        setViewMode('workspace');
      } else if (viewParam === 'apply') {
        setViewMode('apply');
      }
    }
  }, []);

  const [applicantData, setApplicantData] = useState<any>({
    fullName: 'Jan Mohammad',
    customSlug: 'cntsjn',
    partnerId: 'CP-2026-000412',
    referralCode: 'CNTSJN',
    audienceScale: '10k - 50k',
    primaryRole: 'Content Creator & Educator'
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'workspace' || viewParam === 'dashboard') {
        setViewMode('workspace');
      } else if (viewParam === 'apply') {
        setViewMode('apply');
      }

      const savedPartner = localStorage.getItem('cnts_partner_session');
      if (savedPartner) {
        try {
          const parsed = JSON.parse(savedPartner);
          if (parsed && parsed.fullName) {
            setApplicantData(parsed);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  const handleApplicationSubmitted = (data: any) => {
    const slug = data.customSlug || data.referralCode?.toLowerCase() || data.fullName.toLowerCase().replace(/\s+/g, '');
    const finalData = {
      ...data,
      fullName: data.fullName || 'Jan Mohammad',
      customSlug: slug,
      partnerId: `CP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      referralCode: data.referralCode || 'CNTSJN'
    };
    setApplicantData(finalData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cnts_partner_session', JSON.stringify(finalData));
    }
    setViewMode('workspace');
    setIsApprovalModalOpen(true);
  };

  const handleLoginSuccess = (partnerData: any) => {
    const finalData = {
      ...partnerData,
      fullName: partnerData.fullName || 'Jan Mohammad',
      referralCode: partnerData.referralCode || 'CNTSJN',
      customSlug: partnerData.customSlug || 'cntsjn'
    };
    setApplicantData(finalData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cnts_partner_session', JSON.stringify(finalData));
    }
    setViewMode('workspace');
    setActiveTab('overview');
  };

  const handleEnterWorkspaceFromApproval = () => {
    setIsApprovalModalOpen(false);
    setViewMode('workspace');
    setActiveTab('overview');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFF] flex flex-col justify-between">
      {/* 1. LANDING PAGE VIEW WITH GLOBAL SITE NAVBAR & FOOTER */}
      {viewMode === 'landing' && (
        <>
          <Navbar />
          <PartnersLanding
            onOpenApply={() => setViewMode('apply')}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onExploreMissions={() => {
              setViewMode('workspace');
              setActiveTab('overview');
            }}
            onViewDemoWorkspace={() => {
              setViewMode('workspace');
              setActiveTab('overview');
            }}
          />
          <Footer />
        </>
      )}

      {/* 2. DEDICATED FULL-PAGE CREATOR REGISTRATION PAGE */}
      {viewMode === 'apply' && (
        <>
          <Navbar />
          <CreatorApplicationPage
            onSubmitted={handleApplicationSubmitted}
            onCancel={() => setViewMode('landing')}
          />
          <Footer />
        </>
      )}

      {/* 3. PARTNER WORKSPACE OPERATING SYSTEM VIEW (6 STRUCTURED TABS) */}
      {viewMode === 'workspace' && (
        <PartnerWorkspaceLayout
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onViewPublicProfile={() => setViewMode('publicProfile')}
          onExitWorkspace={() => setViewMode('landing')}
          applicantData={applicantData}
        >
          {activeTab === 'overview' && (
            <PartnerOverview
              partnerName={applicantData?.fullName}
              referralCode={applicantData?.referralCode}
              onNavigateToTab={(tab: any) => setActiveTab(tab)}
            />
          )}
          {activeTab === 'child' && (
            <RegisterChildTab
              partnerName={applicantData?.fullName}
              partnerCode={applicantData?.referralCode}
            />
          )}
          {activeTab === 'tiers' && <PartnerReputationAndAnalytics />}
          {activeTab === 'missions' && <MissionsMarketplace />}
          {activeTab === 'referral' && (
            <ReferralCenter
              partnerName={applicantData?.fullName}
              referralCode={applicantData?.referralCode}
            />
          )}
          {activeTab === 'payouts' && <PayoutCenter />}
          {activeTab === 'payment-setup' && <PaymentSetupAndRulesTab />}
          {activeTab === 'growth' && <GrowthCenter audienceScale={applicantData?.audienceScale} />}
          {activeTab === 'support' && <PartnerSupportCenter />}
        </PartnerWorkspaceLayout>
      )}

      {/* 4. PUBLIC PARTNER PROFILE VIEW WITH GLOBAL NAVBAR & FOOTER */}
      {viewMode === 'publicProfile' && (
        <>
          <Navbar />
          <div className="pt-24 pb-12">
            <PublicPartnerProfileView
              slug={applicantData?.customSlug || 'rahul-sharma'}
              onBackToWorkspace={() => setViewMode('workspace')}
            />
          </div>
          <Footer />
        </>
      )}

      {/* PARTNER LOGIN MODAL */}
      <PartnerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToApply={() => setViewMode('apply')}
      />

      {/* APPROVAL MOMENT REVEAL MODAL */}
      <ApprovalMomentModal
        isOpen={isApprovalModalOpen}
        applicantName={applicantData?.fullName || 'Rahul'}
        partnerId={applicantData?.partnerId || 'CP-2026-000384'}
        partnerSlug={applicantData?.customSlug || 'rahuledu'}
        referralCode={applicantData?.referralCode}
        audienceScale={applicantData?.audienceScale}
        onEnterWorkspace={handleEnterWorkspaceFromApproval}
      />
    </div>
  );
};
