'use client';

import React, { useState } from 'react';
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

  const partnerName = applicantData?.fullName || 'Jan Mohammad';
  const partnerCode = applicantData?.customSlug || 'cntsjn';
  const partnerId = applicantData?.partnerId || 'CP-2026-000412';
  const referralCode = applicantData?.referralCode || 'CNTSJN';

  const navItems: { id: WorkspaceTab; label: string; icon: any; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'child', label: 'Register My Child', icon: GraduationCap, badge: '₹0 Waiver' },
    { id: 'tiers', label: 'Partner Tiers', icon: TrendingUp, badge: 'Gold' },
    { id: 'payouts', label: 'Payouts & Requests', icon: CreditCard, badge: '₹3,100' },
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
              <span>Reputation: 98/100</span>
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
              onClick={() => onTabChange('support')}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                3
              </span>
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
            </div>

            {/* Exit Demo button */}
            <button
              onClick={onExitWorkspace}
              title="Return to Landing"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN WORKSPACE */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col lg:flex-row">
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <aside className="hidden lg:block w-64 border-r border-slate-200/80 bg-white p-4 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Creator OS Workspace
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    active ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-200/80 mt-4 space-y-2">
            <div className="bg-indigo-50/80 rounded-xl p-3.5 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-indigo-600" /> Referral Code</span>
                <span className="font-mono text-indigo-950 bg-amber-300 px-2 py-0.5 rounded font-extrabold">{referralCode}</span>
              </div>
              <div className="font-mono text-[10.5px] text-indigo-700 truncate bg-white p-1.5 rounded border border-indigo-200">
                thecouragelibrary.com/register?ref={referralCode}
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://thecouragelibrary.com/register?ref=${referralCode}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-center text-[11px] font-bold text-indigo-900 bg-white border border-indigo-200 hover:bg-indigo-100 py-1.5 rounded-lg cursor-pointer flex items-center justify-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3 text-indigo-600" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>

                <button
                  onClick={() => setShowQRModal(true)}
                  className="text-center text-[11px] font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 py-1.5 rounded-lg cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                >
                  <QrCode className="w-3 h-3 text-slate-900" /> QR Poster
                </button>
              </div>

              {/* 1-CLICK WHATSAPP BROADCAST BUTTON */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🎓 *100% Merit Scholarship Opportunity — Courage National Talent Search (CNTS) 2026*\n\nClass 5 to 8 students can register now for CNTS 2026 and qualify for national scholarships & cognitive profile reports!\n\n👉 Register via Official Courage Partner Link:\nhttps://thecouragelibrary.com/register?ref=${referralCode}\n\n*Use Partner Referral Code:* ${referralCode}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-2 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Share on WhatsApp
              </a>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 text-white p-4 border-b border-slate-800 space-y-2 animate-slide-up">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
                      active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* REGISTER MY CHILD MODAL */}
      <RegisterChildWidget
        isOpen={showChildModal}
        onClose={() => setShowChildModal(false)}
        partnerName={partnerName}
        partnerCode={referralCode}
      />

      {/* PRINTABLE QR CODE POSTER MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-slide-up space-y-5 text-center">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                Official Courage Partner QR Poster
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Shareable High-Res QR Poster
              </h3>
              <p className="text-xs text-slate-500">
                Print or share this poster in schools, coaching centers, and educational WhatsApp groups.
              </p>
            </div>

            {/* HIGH-RES POSTER CARD PREVIEW */}
            <div className="bg-gradient-to-b from-indigo-950 to-slate-900 text-white rounded-2xl p-6 border-4 border-amber-400 shadow-xl space-y-4 relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono uppercase">
                  Courage National Talent Search 2026
                </span>
                <h4 className="font-display font-black text-lg text-white">
                  100% Merit Scholarship Exam
                </h4>
                <p className="text-[11px] text-slate-300">
                  For Class 5 to 8 Students • Full Scholarship Waivers
                </p>
              </div>

              {/* QR CODE DISPLAY BOX */}
              <div className="bg-white p-4 rounded-xl inline-block shadow-inner mx-auto border-2 border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`https://thecouragelibrary.com/register?ref=${referralCode}`)}`}
                  alt="Partner Referral QR Code"
                  className="w-36 h-36 mx-auto object-contain"
                />
                <span className="text-[10px] font-mono font-bold text-slate-900 block mt-2">
                  SCAN TO REGISTER NOW
                </span>
              </div>

              <div className="pt-1 space-y-1 border-t border-slate-800">
                <span className="text-xs font-bold text-amber-300 block">
                  Official Partner: {partnerName}
                </span>
                <span className="text-[11px] font-mono text-slate-300 block">
                  Partner Code: <strong className="text-white font-bold">{referralCode}</strong>
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 bg-slate-900 text-white font-bold text-xs rounded-xl shadow hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Poster
              </button>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`https://thecouragelibrary.com/register?ref=${referralCode}`)}`}
                target="_blank"
                download={`CNTS_Partner_QR_${referralCode}.png`}
                className="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Save High-Res
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
