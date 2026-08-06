"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
  Home, 
  ShieldCheck, 
  CheckSquare, 
  BookOpen, 
  Briefcase, 
  FileText, 
  DollarSign, 
  Code, 
  Award, 
  MessageSquare, 
  Inbox, 
  Shield, 
  School, 
  Settings, 
  Percent, 
  Menu, 
  X,
  Compass,
  Phone,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Sparkles,
  ChevronRight,
  Zap
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

const linkGroups: NavGroup[] = [
  {
    title: "Dashboard",
    links: [
      { href: "/admin", label: "Overview", icon: Home, exact: true },
    ]
  },
  {
    title: "School Outreach",
    links: [
      { href: "/admin?tab=caller", label: "Tele-Calling Portal", icon: Phone },
      { href: "/admin?tab=prospects", label: "Discovery Engine", icon: Compass },
      { href: "/admin?tab=schools", label: "School Partners", icon: School },
      { href: "/admin?tab=reports", label: "Reports Center", icon: FileText },
      { href: "/admin?tab=settings", label: "Global Settings", icon: Settings },
    ]
  },
  {
    title: "Exams & CMS",
    links: [
      { href: "/admin/questions", label: "Question Gov.", icon: BookOpen },
      { href: "/admin/exams", label: "Exam Builder", icon: Award },
      { href: "/admin/cms", label: "CMS Editor", icon: FileText },
      { href: "/admin/support", label: "Support Desk", icon: Inbox },
    ]
  },
  {
    title: "Campaigns & Marketing",
    links: [
      { href: "/admin/partners", label: "Partners & Creators", icon: Users, badge: "LIVE", badgeColor: "bg-emerald-500 text-white" },
      { href: "/admin/notifications", label: "Broadcasts", icon: MessageSquare },
      { href: "/admin?tab=whatsapp", label: "Notification Logs", icon: MessageSquare },
      { href: "/admin?tab=coupons", label: "Promo & Coupon Mgr", icon: Percent },
    ]
  },
  {
    title: "Control Plane",
    links: [
      { href: "/admin/rbac", label: "RBAC Controls", icon: ShieldCheck },
      { href: "/admin/approvals", label: "Approvals Queue", icon: CheckSquare },
      { href: "/admin/jobs", label: "Job Queues", icon: Briefcase },
      { href: "/admin/audit", label: "Audit Trail", icon: FileText },
      { href: "/admin/finance", label: "Finance Board", icon: DollarSign },
      { href: "/admin/developer", label: "DevOps Console", icon: Code },
    ]
  }
];

export default function AdminV2Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    const url = new URL(href, "http://localhost");
    const hrefPath = url.pathname;
    const hrefTab = url.searchParams.get("tab");
    
    // Check if pathname matches
    const pathMatch = exact ? pathname === hrefPath : pathname.startsWith(hrefPath);
    if (!pathMatch) return false;
    
    // If href has a tab parameter, searchParams must match it
    if (hrefTab) {
      const currentTab = searchParams.get("tab");
      return currentTab === hrefTab;
    }
    
    // If href has no tab parameter, current tab must be empty or overview
    const currentTab = searchParams.get("tab");
    return !currentTab || currentTab === "overview";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFF] font-sans antialiased">
      {/* Sidebar Navigation - Left Side (Supports 64px Collapsed Icon-Only Mode) */}
      <aside className={`w-full ${isSidebarCollapsed ? "md:w-20" : "md:w-64"} bg-white border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col shrink-0 md:sticky md:top-0 md:h-screen z-30 shadow-md transition-all duration-300 ease-in-out`}>
        
        {/* Brand Section & Mobile Toggle Header */}
        <div className={`p-3.5 md:p-4 border-b border-slate-100 flex items-center ${isSidebarCollapsed ? "md:flex-col md:justify-center" : "justify-between"} gap-2`}>
          <div className="flex items-center gap-3">
            {/* Courage Library Official Logo */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 p-1.5 flex items-center justify-center shadow-md shrink-0" title="Courage Library CNTS Admin">
              <img src="/images/logo.png" alt="Courage Library Logo" className="w-7 h-7 object-contain" />
            </div>
            
            {!isSidebarCollapsed && (
              <div>
                <h2 className="font-extrabold text-sm text-slate-900 leading-tight">CNTS Admin</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9.5px] font-bold font-mono text-indigo-700 uppercase tracking-wider">
                    V2.0 CONSOLE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} className="text-indigo-600" /> : <PanelLeftClose size={18} />}
          </button>

          {/* Hamburger toggle button on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation list grouped by Section with Bottom Padding to prevent Floating Widget overlap */}
        <nav className={`flex-1 py-4 px-3 overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-5 pb-20 md:block ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}>
          {linkGroups.map((group, groupIdx) => (
            <div key={group.title + groupIdx} className="space-y-1.5">
              {!isSidebarCollapsed && (
                <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">
                  {group.title}
                </h3>
              )}

              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href, link.exact);
                  return (
                    <button
                      key={link.href}
                      title={link.label}
                      onClick={() => {
                        router.push(link.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-xs font-semibold transition-all text-left cursor-pointer group ${
                        isSidebarCollapsed
                          ? `justify-center py-3 px-0 rounded-2xl ${
                              active
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`
                          : `py-2.5 px-3.5 rounded-2xl ${
                              active
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold shadow-md shadow-indigo-500/25 scale-[1.01]"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/90"
                            }`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={17} className={isSidebarCollapsed ? (active ? "text-white" : "text-slate-500 group-hover:text-indigo-600") : (active ? "text-white" : "text-slate-400 group-hover:text-indigo-600 transition-colors")} />
                        {!isSidebarCollapsed && <span className="tracking-tight">{link.label}</span>}
                      </div>

                      {!isSidebarCollapsed && link.badge && (
                        <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full font-mono shadow-xs ${
                          active ? "bg-white/20 text-white" : (link.badgeColor || "bg-indigo-100 text-indigo-800")
                        }`}>
                          {link.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Badge */}
        {!isSidebarCollapsed && (
          <div className="p-3 m-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                AD
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-slate-800 block truncate">Admin Console</span>
                <span className="text-[10px] text-slate-400 block truncate">Super Admin</span>
              </div>
            </div>
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-4 md:p-4 max-w-[1700px] mx-auto w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
