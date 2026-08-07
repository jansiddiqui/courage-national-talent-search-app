'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Compass, 
  Zap, 
  TrendingUp, 
  Award, 
  Users, 
  Calendar, 
  CreditCard, 
  Inbox, 
  HelpCircle, 
  User, 
  LogOut, 
  Bell, 
  Star, 
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  GraduationCap,
  QrCode,
  MessageSquare,
  Share2,
  Printer,
  Download,
  Check,
  LayoutDashboard,
  Target,
  Building,
  Video
} from 'lucide-react';
import { RegisterChildWidget } from './RegisterChildWidget';

export type WorkspaceTab = 
  | 'launchpad'
  | 'overview'
  | 'roadmap'
  | 'child'
  | 'tiers'
  | 'payouts'
  | 'payment-setup'
  | 'missions'
  | 'referral'
  | 'growth'
  | 'inbox'
  | 'support';

interface PartnerWorkspaceLayoutProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onViewPublicProfile: () => void;
  onExitWorkspace: () => void;
  applicantData?: any;
  children: React.ReactNode;
}

export const PartnerWorkspaceLayout: React.FC<PartnerWorkspaceLayoutProps> = ({
  activeTab,
  onTabChange,
  onViewPublicProfile,
  onExitWorkspace,
  applicantData,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liveHonorarium, setLiveHonorarium] = useState('₹0');
  const [liveRegistrations, setLiveRegistrations] = useState(0);

  const partnerName = applicantData?.fullName || 'Partner Account';
  const partnerCode = applicantData?.customSlug || 'partner';
  const partnerId = applicantData?.partnerId || '';
  const referralCode = applicantData?.referralCode || 'CNTSJN';

  useEffect(() => {
    if (referralCode) {
      fetch(`/api/partner/stats?referralCode=${encodeURIComponent(referralCode)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLiveHonorarium(data.totalHonorariumEarned || '₹0');
            setLiveRegistrations(data.totalRegistrations || 0);
          }
        })
        .catch(err => console.error('Failed to load live workspace header stats:', err));
    }
  }, [referralCode]);

  const navItems: { id: WorkspaceTab; label: string; icon: any; badge?: string; tooltip?: string }[] = [
    { id: 'launchpad', label: 'Start Here (Launchpad)', icon: Compass, badge: 'Start', tooltip: 'Complete 4-step partner onboarding flow' },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, tooltip: 'Live registrations & performance metrics' },
    { id: 'roadmap', label: 'Video Campaign Roadmap', icon: Video, badge: 'Aug 30', tooltip: '8 ready-to-post video blueprints & AI prompts' },
    { id: 'inbox', label: 'Inbox', icon: Inbox, tooltip: 'Official announcements & campaign notices' },
    { id: 'missions', label: 'CNTS Missions', icon: Target, tooltip: 'Bonus reward challenges & milestones' },
    { id: 'referral', label: 'Referral & Media Kit', icon: Share2, tooltip: 'Banners, posters & official referral link' },
    { id: 'growth', label: 'AI Studio', icon: Zap, tooltip: 'Script & promotional poster generator' },
    { id: 'payouts', label: 'Payouts & Requests', icon: CreditCard, tooltip: 'Weekly Monday honorarium settlement queue' },
    { id: 'payment-setup', label: 'Payment Setup & Rules', icon: ShieldCheck, tooltip: 'UPI ID & Bank Account settings' },
    { id: 'tiers', label: 'Partner Tiers', icon: TrendingUp, tooltip: 'Volume progression rates (₹25 - ₹60/student)' },
    { id: 'child', label: 'Register My Child', icon: GraduationCap, badge: '₹0 Waiver', tooltip: 'Free CNTS 2026 registration for your children' },
    { id: 'support', label: 'Support', icon: HelpCircle, tooltip: '24/7 partner support desk' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#0F172A] flex flex-col font-sans">
      {/* 1. WORKSPACE TOP BAR (LIGHT THEME) */}
      <header className="bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="CNTS Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className="font-display font-black text-base tracking-tight text-slate-900 block leading-none">
                  CNTS Partner Workspace
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-medium">
                  Courage Library • Code: <strong className="text-indigo-600 font-bold">{referralCode}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Partner Profile & Verification Status */}
          <div className="flex items-center gap-3">
            
            {/* Public Profile Link Button */}
            <button
              onClick={onViewPublicProfile}
              className="hidden lg:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Public Profile</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            {/* Profile Section with Real Avatar & Inline Twitter/Instagram Style Verified Badge */}
            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
              <div className="relative shrink-0">
                <img
                  src={
                    applicantData?.passportPhoto || 
                    applicantData?.profilePhoto || 
                    applicantData?.profileImage || 
                    applicantData?.photoUrl || 
                    applicantData?.photo || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=4F46E5&color=fff&bold=true`
                  }
                  alt={partnerName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
                />
              </div>

              <div className="hidden sm:block text-left leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-slate-900 truncate max-w-[130px]">
                    {partnerName}
                  </span>
                  
                  {/* MODERN VERIFIED BADGE (ONLY AFTER ADMIN APPROVAL) */}
                  {(applicantData?.status === 'APPROVED' || applicantData?.status === 'ACTIVE' || applicantData?.verificationStatus === 'APPROVED' || referralCode === 'CNTSJN') && (
                    <span title="Verified Courage Partner (Admin Approved)">
                      <svg className="w-4 h-4 text-sky-500 fill-sky-500 shrink-0" viewBox="0 0 24 24">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.38-1.93-4.31-4.31-4.31-.495 0-.965.084-1.4.238C14.23 2.144 12.86 1.27 11.28 1.27c-1.58 0-2.95.874-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.38 0-4.31 1.93-4.31 4.31 0 .495.084.965.238 1.4C.874 9.55 0 10.92 0 12.5c0 1.58.874 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.38 1.93 4.31 4.31 4.31.495 0 .965-.084 1.4-.238.65 1.274 2.02 2.148 3.6 2.148 1.58 0 2.95-.874 3.6-2.148.435.154.905.238 1.4.238 2.38 0 4.31-1.93 4.31-4.31 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.72 4.15l-4.24-4.24 1.41-1.41 2.83 2.83 6.72-6.72 1.41 1.41-8.13 8.13z"/>
                      </svg>
                    </span>
                  )}
                </div>
                
                <span className="text-[10px] text-indigo-600 font-mono font-bold block">
                  {referralCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* SIDEBAR NAVIGATION */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200/80 p-4 space-y-5 flex flex-col overflow-y-auto shrink-0 transition-transform duration-300 shadow-sm lg:shadow-none
          ${mobileMenuOpen ? 'translate-x-0 top-[61px]' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* NAVIGATION SECTIONS */}
          <div className="space-y-4">
            {/* 1. SECTION 1: CORE WORKSPACE */}
            <div className="space-y-0.5">
              <span className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pb-1">
                Core Workspace
              </span>
              {navItems.slice(0, 3).map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    title={item.tooltip}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left border-l-3
                      ${isActive 
                        ? 'bg-indigo-50/90 text-indigo-700 font-extrabold border-indigo-600 shadow-xs' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border-transparent font-semibold'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                        isActive 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 2. SECTION 2: CREATOR & MISSIONS */}
            <div className="space-y-0.5 pt-1">
              <span className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pb-1">
                Creator & Missions
              </span>
              {navItems.slice(3, 7).map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    title={item.tooltip}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left border-l-3
                      ${isActive 
                        ? 'bg-indigo-50/90 text-indigo-700 font-extrabold border-indigo-600 shadow-xs' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border-transparent font-semibold'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                        isActive 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 3. SECTION 3: FINANCE & WELFARE */}
            <div className="space-y-0.5 pt-1">
              <span className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pb-1">
                Finance & Welfare
              </span>
              {navItems.slice(7).map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    title={item.tooltip}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left border-l-3
                      ${isActive 
                        ? 'bg-indigo-50/90 text-indigo-700 font-extrabold border-indigo-600 shadow-xs' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border-transparent font-semibold'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                        isActive 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* INTEGRATED REFERRAL & ACTION CARD (PLACED DIRECTLY BELOW NAV) */}
          <div className="pt-2 space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Referral Code
                </span>
                <span className="font-mono font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded text-[10px]">
                  {referralCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://thecouragelibrary.com/register?ref=${referralCode}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3 text-indigo-600" />}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>

                <button
                  onClick={() => setShowQRModal(true)}
                  className="py-1.5 px-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[11px] font-black flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <QrCode className="w-3 h-3" /> QR Poster
                </button>
              </div>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`📢 Register your Class 5-8 student for Courage National Talent Search (CNTS 2026)! Merit Scholarships & National Percentile Benchmark included. Register via official link: https://thecouragelibrary.com/register?ref=${referralCode}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" /> Share on WhatsApp
              </a>
            </div>

            {/* LOGOUT BUTTON INTEGRATED IN CARD */}
            <button
              type="button"
              onClick={() => {
                fetch('/api/partner/session', { method: 'DELETE' }).finally(() => {
                  onExitWorkspace();
                });
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out of Workspace</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold">Exit ↗</span>
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <RegisterChildWidget
        isOpen={showChildModal}
        onClose={() => setShowChildModal(false)}
        partnerName={partnerName}
        partnerCode={referralCode}
      />
    </div>
  );
};
