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
  Users
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
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
      { href: "/admin/partners", label: "Partners & Creators", icon: Users },
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
      <aside className={`w-full ${isSidebarCollapsed ? "md:w-16" : "md:w-64"} bg-white border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col shrink-0 md:sticky md:top-0 md:h-screen z-30 shadow-sm transition-all duration-300 ease-in-out`}>
        {/* Brand Section & Mobile Toggle Header */}
        <div className={`p-3 md:p-4 border-b border-slate-100 flex items-center ${isSidebarCollapsed ? "md:flex-col md:justify-center" : "justify-between"} gap-2`}>
          <div className="flex items-center gap-2.5">
            {/* Courage Library Official Logo */}
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shadow-xs shrink-0" title="Courage Library CNTS Admin">
              <img src="/images/logo.png" alt="Courage Library Logo" className="w-7 h-7 object-contain" />
            </div>
            
            {!isSidebarCollapsed && (
              <div>
                <h2 className="font-extrabold text-sm text-slate-800 leading-tight">CNTS Admin</h2>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-0.5 inline-block uppercase tracking-wider">
                  V2.0 Console
                </span>
              </div>
            )}
          </div>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Icon-Only Mode)"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={16} className="text-indigo-600" /> : <PanelLeftClose size={16} />}
          </button>

          {/* Hamburger toggle button on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation list grouped by Section */}
        <nav className={`flex-1 py-3 ${isSidebarCollapsed ? "px-1.5" : "pr-3 pl-1"} overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-4 md:block ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}>
          {linkGroups.map((group, groupIdx) => (
            <div key={group.title + groupIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <h3 className="px-4 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {group.title}
                </h3>
              )}

              <div className="space-y-[2px]">
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
                      className={`w-full flex items-center gap-3 text-xs font-medium transition-all text-left cursor-pointer ${
                        isSidebarCollapsed
                          ? `justify-center py-2.5 px-0 rounded-xl ${
                              active
                                ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            }`
                          : `py-2 rounded-r-xl ${
                              active
                                ? "bg-indigo-50/80 text-indigo-700 font-bold border-l-4 border-indigo-600 pl-3 shadow-xs"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/80 pl-4"
                            }`
                      }`}
                    >
                      <Icon size={16} className={isSidebarCollapsed ? (active ? "text-white" : "text-slate-500") : (active ? "text-indigo-600" : "text-slate-400")} />
                      {!isSidebarCollapsed && <span>{link.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-4 md:p-4 max-w-[1700px] mx-auto w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
