'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PartnersLanding } from './PartnersLanding';
import { CreatorApplicationPage } from './CreatorApplicationPage';
import { ApprovalMomentModal } from './ApprovalMomentModal';
import { PartnerLoginModal } from './PartnerLoginModal';

interface PartnersPlatformProps {
  initialView?: 'landing' | 'apply';
}

export const PartnersPlatform: React.FC<PartnersPlatformProps> = ({
  initialView = 'landing'
}) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'landing' | 'apply'>(initialView);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [applicantData, setApplicantData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');

      if (viewParam === 'apply') {
        setViewMode('apply');
        return;
      }

      if (viewParam === 'login') {
        setIsLoginModalOpen(true);
        return;
      }

      // Check real partner session from API — redirect if already logged in
      fetch('/api/partner/session')
        .then(res => res.json())
        .then(data => {
          if (data.isAuthenticated && data.partner) {
            const p = data.partner;
            const targetSlug = (p.customSlug || p.referralCode || 'partner').toLowerCase();
            router.replace(`/partners/${targetSlug}`);
          }
        })
        .catch(() => {
          // Session check failed — stay on landing
        });
    }
  }, [router]);

  // Called after partner successfully logs in via OTP
  const handleLoginSuccess = (partnerData: any) => {
    const slug = (partnerData.customSlug || partnerData.referralCode || 'partner').toLowerCase();
    setIsLoginModalOpen(false);
    // Save to localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem('cnts_partner_session', JSON.stringify(partnerData));
    }
    // Redirect to partner workspace
    router.push(`/partners/${slug}`);
  };

  // Called after partner completes registration form
  const handleApplicationSubmitted = (data: any) => {
    const slug = (data.customSlug || data.referralCode || 'partner').toLowerCase();
    const finalData = {
      ...data,
      fullName: data.fullName || 'Partner Account',
      customSlug: slug,
      referralCode: data.referralCode || 'CNTSJN'
    };
    setApplicantData(finalData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cnts_partner_session', JSON.stringify(finalData));
    }
    setIsApprovalModalOpen(true);
  };

  const handleEnterWorkspaceFromApproval = () => {
    setIsApprovalModalOpen(false);
    const slug = (applicantData?.customSlug || applicantData?.referralCode || 'partner').toLowerCase();
    router.push(`/partners/${slug}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFF] flex flex-col justify-between">

      {/* 1. PUBLIC LANDING PAGE VIEW */}
      {viewMode === 'landing' && (
        <>
          <Navbar />
          <PartnersLanding
            onOpenApply={() => setViewMode('apply')}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onExploreMissions={() => {
              const slug = (applicantData?.customSlug || 'cntsjn').toLowerCase();
              router.push(`/partners/${slug}`);
            }}
            onViewDemoWorkspace={() => {
              const slug = (applicantData?.customSlug || 'cntsjn').toLowerCase();
              router.push(`/partners/${slug}`);
            }}
          />
          <Footer />
        </>
      )}

      {/* 2. CREATOR REGISTRATION PAGE */}
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

      {/* PARTNER LOGIN MODAL */}
      <PartnerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToApply={() => {
          setIsLoginModalOpen(false);
          setViewMode('apply');
        }}
      />

      {/* APPROVAL MOMENT REVEAL MODAL */}
      <ApprovalMomentModal
        isOpen={isApprovalModalOpen}
        applicantName={applicantData?.fullName || 'Partner'}
        partnerId={applicantData?.partnerId || 'CP-2026-000384'}
        partnerSlug={applicantData?.customSlug || 'partner'}
        referralCode={applicantData?.referralCode}
        audienceScale={applicantData?.audienceScale}
        onEnterWorkspace={handleEnterWorkspaceFromApproval}
      />
    </div>
  );
};
