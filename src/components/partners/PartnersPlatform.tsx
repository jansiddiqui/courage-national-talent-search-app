'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PartnersLanding } from './PartnersLanding';
import { CreatorApplicationPage } from './CreatorApplicationPage';
import { ApprovalMomentModal } from './ApprovalMomentModal';

interface PartnersPlatformProps {
  initialView?: 'landing' | 'apply';
}

export const PartnersPlatform: React.FC<PartnersPlatformProps> = ({
  initialView = 'landing'
}) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'landing' | 'apply'>(initialView);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [applicantData, setApplicantData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'apply') {
        setViewMode('apply');
        return;
      }

      // Check real partner session from API
      fetch('/api/partner/session')
        .then(res => res.json())
        .then(data => {
          if (data.isAuthenticated && data.partner) {
            const p = data.partner;
            const targetSlug = (p.customSlug || p.referralCode || 'partner').toLowerCase();
            // Automatically redirect authenticated partners directly to their dedicated workspace route!
            router.replace(`/partners/${targetSlug}`);
          } else {
            const savedPartner = localStorage.getItem('cnts_partner_session');
            if (savedPartner) {
              try {
                const parsed = JSON.parse(savedPartner);
                if (parsed && (parsed.customSlug || parsed.referralCode)) {
                  const targetSlug = (parsed.customSlug || parsed.referralCode).toLowerCase();
                  router.replace(`/partners/${targetSlug}`);
                }
              } catch (e) {
                // ignore
              }
            }
          }
        })
        .catch(() => {
          const savedPartner = localStorage.getItem('cnts_partner_session');
          if (savedPartner) {
            try {
              const parsed = JSON.parse(savedPartner);
              if (parsed && (parsed.customSlug || parsed.referralCode)) {
                const targetSlug = (parsed.customSlug || parsed.referralCode).toLowerCase();
                router.replace(`/partners/${targetSlug}`);
              }
            } catch (e) {
              // ignore
            }
          }
        });
    }
  }, [router]);

  const handleApplicationSubmitted = (data: any) => {
    const slug = (data.customSlug || data.referralCode || 'partner').toLowerCase();
    const finalData = {
      ...data,
      fullName: data.fullName || 'Partner Account',
      customSlug: slug,
      partnerId: `CP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
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
      {/* 1. PUBLIC LANDING PAGE VIEW WITH GLOBAL SITE NAVBAR & FOOTER */}
      {viewMode === 'landing' && (
        <>
          <Navbar />
          <PartnersLanding
            onOpenApply={() => setViewMode('apply')}
            onOpenLogin={() => router.push('/login?tab=partner')}
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
