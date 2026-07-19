"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PortalProvider, usePortal } from "@/contexts/PortalContext";
import SpotlightSearch from "@/components/dashboard/SpotlightSearch";
import {
  LayoutDashboard, Users, ClipboardList, CreditCard, BarChart2,
  FolderOpen, Bell, HelpCircle, UserCircle, GitBranch, Share2,
  Shield, Sparkles, LogOut, ChevronLeft, ChevronRight, Menu, X,
  Search, Award
} from "lucide-react";

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", label: "Workspace", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/children", label: "Children", icon: Users },
  { href: "/dashboard/exams", label: "Exams", icon: Award },
  { href: "/dashboard/timeline", label: "Timeline", icon: GitBranch },
  { href: "/dashboard/registration", label: "Registration", icon: ClipboardList },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart2 },
  { href: "/dashboard/documents", label: "Resources", icon: FolderOpen },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: true },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
  { href: "/dashboard/referral", label: "Referral", icon: Share2 },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/security", label: "Security", icon: Shield },
  { href: "/dashboard/ai", label: "AI Assistant", icon: Sparkles },
];

const MOBILE_TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/children", label: "Children", icon: Users },
  { href: "/dashboard/timeline", label: "Timeline", icon: GitBranch },
  { href: "/dashboard/notifications", label: "Alerts", icon: Bell, badge: true },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

// ─── Portal Shell (inner — has access to context) ─────────────────────────────

function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { parentSession, isHydrated, loading, activeCandidate, candidates,
    setActiveChild, unreadCount, handleLogout, preferences, updatePreference,
    isDemoMode, trackModuleVisit } = usePortal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const sidebarCollapsed = preferences.sidebarCollapsed;

  const setSidebarCollapsed = (v: boolean) => updatePreference("sidebarCollapsed", v);

  // Track module visits
  useEffect(() => {
    const segment = pathname.split("/").pop() || "workspace";
    trackModuleVisit(segment);
  }, [pathname, trackModuleVisit]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href) && href !== "/dashboard";

  // Loading skeleton
  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex">

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-slate-100 z-40 transition-all duration-300 shadow-sm ${
          sidebarCollapsed ? "w-[68px]" : "w-[220px]"
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-slate-100 ${sidebarCollapsed ? "justify-center" : ""}`}>
          <div className="relative w-8 h-8 shrink-0">
            <Image src="/images/logo.png" alt="CNTS" fill className="object-contain" priority />
          </div>
          {!sidebarCollapsed && (
            <div>
              <span className="font-display font-bold text-slate-900 text-sm leading-tight block">Parent Workspace</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wide">CNTS 2026</span>
            </div>
          )}
        </div>

        {/* Child Switcher */}
        {!sidebarCollapsed && candidates.length > 0 && (
          <div className="px-3 pt-3 pb-2 border-b border-slate-100">
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2 px-1">Active Child</p>
            <div className="space-y-1">
              {candidates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChild(c)}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all text-xs font-semibold cursor-pointer ${
                    activeCandidate?.id === c.id
                      ? "bg-blue-50 text-blue-800 border border-blue-100"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                    activeCandidate?.id === c.id ? "bg-blue-800 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {c.student_name.charAt(0)}
                  </div>
                  <span className="truncate">{c.student_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact, badge }) => {
            const active = exact ? pathname === href : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={sidebarCollapsed ? label : undefined}
                className={`flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  active
                    ? "bg-blue-50 text-blue-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <Icon size={16} className="shrink-0" />
                {!sidebarCollapsed && <span>{label}</span>}
                {badge && unreadCount > 0 && (
                  <span className={`${sidebarCollapsed ? "absolute top-1 right-1" : "ml-auto"} bg-red-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-1`}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`px-2 py-3 border-t border-slate-100 space-y-1`}>
          {!sidebarCollapsed && parentSession && (
            <div className="px-2.5 py-2 mb-1">
              <p className="text-[10px] text-slate-400 truncate">{parentSession.phoneNumber || parentSession.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer ${sidebarCollapsed ? "justify-center" : ""}`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut size={15} className="shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-50 transition-all cursor-pointer ${sidebarCollapsed ? "justify-center" : "justify-end"}`}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <><span className="text-[10px]">Collapse</span><ChevronLeft size={14} /></>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? "md:ml-[68px]" : "md:ml-[220px]"}`}>

        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 sticky top-0 z-30 px-4 md:px-6 py-3 flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} className="text-slate-700" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates, pages..."
                readOnly
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-pointer focus:outline-none hover:bg-slate-100 transition-colors"
                onClick={() => setSearchOpen(true)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Demo mode badge */}
            {isDemoMode && (
              <span className="hidden sm:flex items-center gap-1 text-[9px] font-black uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">
                Demo
              </span>
            )}

            {/* Active child chip */}
            {activeCandidate && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center text-[9px] font-black">
                  {activeCandidate.student_name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-700">{activeCandidate.student_name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{activeCandidate.registration_id}</span>
              </div>
            )}

            {/* Notification bell */}
            <Link href="/dashboard/notifications" className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <Bell size={18} className="text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* ── Mobile Slide-Out Menu ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7">
                  <Image src="/images/logo.png" alt="CNTS" fill className="object-contain" />
                </div>
                <span className="font-display font-bold text-slate-900 text-sm">Parent Workspace</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X size={18} className="text-slate-600" />
              </button>
            </div>

            {/* Child switcher (mobile) */}
            {candidates.length > 0 && (
              <div className="px-4 pt-3 pb-2 border-b border-slate-100">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">Active Child</p>
                <div className="space-y-1">
                  {candidates.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setActiveChild(c); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                        activeCandidate?.id === c.id ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black ${
                        activeCandidate?.id === c.id ? "bg-blue-800 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {c.student_name.charAt(0)}
                      </div>
                      {c.student_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
              {NAV_ITEMS.map(({ href, label, icon: Icon, exact, badge }) => {
                const active = exact ? pathname === href : pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                    {badge && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Tab Bar ─────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 flex items-stretch">
        {MOBILE_TABS.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = exact ? pathname === href : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center pt-2 pb-3 gap-0.5 text-[10px] font-bold transition-colors relative ${
                active ? "text-blue-800" : "text-slate-400"
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {badge && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-black rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span>{label}</span>
              {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-800 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Spotlight Search Overlay */}
      <SpotlightSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        candidates={candidates}
        setActiveCandidate={setActiveChild}
        activeCandidateId={activeCandidate?.id}
      />
    </div>
  );
}

// ─── Layout export (wraps everything in PortalProvider) ────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <PortalShell>{children}</PortalShell>
    </PortalProvider>
  );
}
