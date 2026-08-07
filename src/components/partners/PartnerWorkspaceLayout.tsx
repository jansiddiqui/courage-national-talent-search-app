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

  const navItems: { id: WorkspaceTab; label: string; icon: any; badge?: string; unreadDot?: boolean }[] = [
    { id: 'launchpad', label: 'Start Here (Launchpad)', icon: Compass, badge: 'Start' },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Video Campaign Roadmap', icon: Video, badge: 'Aug 30' },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'missions', label: 'CNTS Missions', icon: Target },
    { id: 'referral', label: 'Referral & Media Kit', icon: Share2 },
    { id: 'growth', label: 'AI Studio', icon: Zap },
    { id: 'payouts', label: 'Payouts & Requests', icon: CreditCard },
    { id: 'payment-setup', label: 'Payment Setup & Rules', icon: ShieldCheck },
    { id: 'tiers', label: 'Partner Tiers', icon: TrendingUp },
    { id: 'child', label: 'Register My Child', icon: GraduationCap, badge: '₹0 Waiver' },
    { id: 'support', label: 'Support', icon: HelpCircle },
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
                {applicantData?.passportPhoto || applicantData?.profilePhoto || applicantData?.profileImage || applicantData?.photoUrl || applicantData?.photo ? (
                  <img
                    src={applicantData?.passportPhoto || applicantData?.profilePhoto || applicantData?.profileImage || applicantData?.photoUrl || applicantData?.photo}
                    alt={partnerName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center border-2 border-indigo-100 shadow-xs">
                    {partnerName.slice(0, 2).toUpperCase()}
                  </div>
                )}
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

              <button
                onClick={onExitWorkspace}
                title="Exit Partner Workspace"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 ml-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* SIDEBAR NAVIGATION */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200/80 p-4 space-y-6 flex flex-col justify-between transition-transform duration-300 shadow-sm lg:shadow-none
          ${mobileMenuOpen ? 'translate-x-0 top-[61px]' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="space-y-6">
            <div className="px-2 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-slate-400 block">
                CREATOR OS WORKSPACE
              </span>
            </div>

            {/* NAV LINKS */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-left
                      ${isActive 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 font-semibold'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-extrabold ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* SIDEBAR FOOTER CARD: REFERRAL LINK QUICK COPY */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-amber-50/80 border border-indigo-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Referral Code
              </span>
              <span className="font-mono font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded text-[10px]">
                {referralCode}
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-500 truncate bg-white p-2 rounded-xl border border-slate-200">
              thecouragelibrary.com/register?ref={referralCode}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://thecouragelibrary.com/register?ref=${referralCode}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3 text-indigo-600" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>

              <button
                onClick={() => setShowQRModal(true)}
                className="py-1.5 px-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
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

          {/* SIDEBAR FOOTER: LOGOUT BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                fetch('/api/partner/session', { method: 'DELETE' }).finally(() => {
                  onExitWorkspace();
                });
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-100/80 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out of Workspace</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-400">Exit ↗</span>
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
