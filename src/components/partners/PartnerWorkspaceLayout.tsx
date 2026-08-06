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
  Building
} from 'lucide-react';
import { RegisterChildWidget } from './RegisterChildWidget';

export type WorkspaceTab = 
  | 'overview'
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
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'child', label: 'Register My Child', icon: GraduationCap, badge: '₹0 Waiver' },
    { id: 'tiers', label: 'Partner Tiers', icon: TrendingUp, badge: 'Bronze' },
    { id: 'payouts', label: 'Payouts & Requests', icon: CreditCard, badge: liveHonorarium },
    { id: 'payment-setup', label: 'Payment Setup & Rules', icon: ShieldCheck },
    { id: 'missions', label: 'CNTS Missions', icon: Target, badge: 'Active' },
    { id: 'referral', label: 'Referral & Media Kit', icon: Share2, badge: referralCode },
    { id: 'growth', label: 'AI Studio', icon: Zap, badge: 'AI' },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#0F172A] flex flex-col font-sans">
      {/* 1. WORKSPACE TOP BAR */}
      <header className="bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
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
                <span className="font-display font-extrabold text-base tracking-tight text-white block leading-none">
                  CNTS Partner
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Powered by Courage Library • {referralCode}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Partner Info & Quick Stats */}
          <div className="flex items-center gap-3">
            {/* Reputation Score Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Verified Partner</span>
            </div>

            {/* Public Profile Link Button */}
            <button
              onClick={onViewPublicProfile}
              className="hidden lg:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Public Profile <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            {/* Notifications Trigger */}
            <button
              onClick={() => onTabChange('inbox')}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-indigo-400 shadow-sm">
                {partnerName.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-xs font-bold text-white block truncate max-w-[120px]">
                  {partnerName}
                </span>
                <span className="text-[10px] text-indigo-300 font-mono block">
                  {referralCode}
                </span>
              </div>

              <button
                onClick={onExitWorkspace}
                title="Exit Partner Workspace"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 ml-1 transition-colors cursor-pointer"
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
            <nav className="space-y-1">
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
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-left
                      ${isActive 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                        isActive 
                          ? 'bg-slate-800 text-amber-300 border border-slate-700' 
                          : 'bg-slate-100 text-slate-600'
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
