"use client";
import { useState, useEffect } from "react";
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
  ChevronDown,
  Zap,
  Folder,
  Search,
  Command,
  Activity,
  Circle
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
  id: string;
  title: string;
  icon: any;
  links: NavLink[];
}

const linkGroups: NavGroup[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    links: [
      { href: "/admin", label: "Overview", icon: Home, exact: true },
    ]
  },
  {
    id: "outreach",
    title: "School Outreach",
    icon: School,
    links: [
      { href: "/admin?tab=caller", label: "Tele-Calling Portal", icon: Phone },
      { href: "/admin?tab=prospects", label: "Discovery Engine", icon: Compass },
      { href: "/admin?tab=schools", label: "School Partners", icon: School },
      { href: "/admin?tab=reports", label: "Reports Center", icon: FileText },
      { href: "/admin?tab=settings", label: "Global Settings", icon: Settings },
    ]
  },
  {
    id: "exams",
    title: "Exams & CMS",
    icon: BookOpen,
    links: [
      { href: "/admin/questions", label: "Question Gov.", icon: BookOpen },
      { href: "/admin/exams", label: "Exam Builder", icon: Award },
      { href: "/admin/cms", label: "CMS Editor", icon: FileText },
      { href: "/admin/support", label: "Support Desk", icon: Inbox },
    ]
  },
  {
    id: "campaigns",
    title: "Campaigns & Marketing",
    icon: Sparkles,
    links: [
      { href: "/admin/partners", label: "Partners & Creators", icon: Users, badge: "NEW", badgeColor: "bg-emerald-500 text-white" },
      { href: "/admin/notifications", label: "Broadcasts", icon: MessageSquare },
      { href: "/admin?tab=whatsapp", label: "Notification Logs", icon: MessageSquare },
      { href: "/admin?tab=coupons", label: "Promo & Coupon Mgr", icon: Percent },
    ]
  },
  {
    id: "control",
    title: "Control Plane",
    icon: ShieldCheck,
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
  const [searchFilter, setSearchFilter] = useState("");
  const [openSupportCount, setOpenSupportCount] = useState<number>(0);

  // Accordion state for collapsible SaaS sidebar hierarchy
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    outreach: false,
    exams: false,
    campaigns: true,
    control: false,
  });

  // Fetch live count of open support tickets
  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const res = await fetch("/api/admin/support");
        if (res.ok) {
          const data = await res.json();
          const tickets = data.tickets || data.messages || [];
          const count = tickets.filter((t: any) => t.status === "OPEN" || t.status === "PENDING" || t.status === "IN_PROGRESS").length;
          setOpenSupportCount(count);
        }
      } catch {
        // quiet fallback
      }
    };

    fetchCounters();
    const interval = setInterval(fetchCounters, 15000);
    return () => clearInterval(interval);
  }, []);

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

  // Auto-expand accordion group containing the currently active route/tab
  useEffect(() => {
    linkGroups.forEach(group => {
      const hasActive = group.links.some(l => isActive(l.href, l.exact));
      if (hasActive) {
        setOpenGroups(prev => ({ ...prev, [group.id]: true }));
      }
    });
  }, [pathname, searchParams]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFF] font-sans antialiased">
      {/* Sidebar Navigation - Left Side (Supports 64px Collapsed Icon-Only Mode) */}
      <aside className={`w-full ${isSidebarCollapsed ? "md:w-16" : "md:w-64"} bg-white border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col shrink-0 md:sticky md:top-0 md:h-screen z-30 shadow-sm transition-all duration-300 ease-in-out`}>
        
        {/* Brand Section & Mobile Toggle Header — CLEAN ORIGINAL LOGO */}
        <div className={`p-3 md:p-4 border-b border-slate-100 flex items-center ${isSidebarCollapsed ? "md:flex-col md:justify-center" : "justify-between"} gap-2`}>
          <div className="flex items-center gap-2.5">
            {/* Courage Library Official Logo */}
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shadow-xs shrink-0" title="Courage Library CNTS Admin">
              <img src="/images/logo.png" alt="Courage Library Logo" className="w-7 h-7 object-contain" />
            </div>
            
            {!isSidebarCollapsed && (
              <div>
                <h2 className="font-extrabold text-sm text-slate-800 leading-tight">CNTS Admin</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">
                    V2.0 Console
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar"}
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

        {/* QUICK SEARCH INPUT (SAAS DESK STYLE) */}
        {!isSidebarCollapsed && (
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchFilter ? (
                <button onClick={() => setSearchFilter('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  <X size={12} />
                </button>
              ) : (
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>
        )}

        {/* ENTERPRISE ACCORDION NAVIGATION TREE */}
        <nav className={`flex-1 py-3 ${isSidebarCollapsed ? "px-1.5" : "px-3"} overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-2 pb-16 md:block ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}>
          {linkGroups.map((group) => {
            const GroupIcon = group.icon;
            const isGroupOpen = !!openGroups[group.id] || !!searchFilter;
            const hasActiveLink = group.links.some(l => isActive(l.href, l.exact));

            // Filter links if search query entered
            const visibleLinks = searchFilter
              ? group.links.filter(l => l.label.toLowerCase().includes(searchFilter.toLowerCase()))
              : group.links;

            if (searchFilter && visibleLinks.length === 0) return null;

            return (
              <div key={group.id} className="space-y-1">
                {/* Accordion Group Header Button with Icon */}
                {!isSidebarCollapsed ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-[10.5px] font-extrabold uppercase tracking-wider transition-all rounded-xl cursor-pointer group ${
                      hasActiveLink
                        ? "text-indigo-800 bg-indigo-50/70 font-mono"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-mono"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon size={14} className={hasActiveLink ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-700"} />
                      <span>{group.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {group.links.length > 1 && (
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {group.links.length}
                        </span>
                      )}
                      <span className="text-slate-400 group-hover:text-slate-700">
                        {isGroupOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                    </div>
                  </button>
                ) : null}

                {/* Group Nav Links (Tree View with Guide Line) */}
                {(isGroupOpen || isSidebarCollapsed) && (
                  <div className={`${!isSidebarCollapsed ? "border-l-2 border-slate-100 ml-3.5 pl-2 space-y-1" : "space-y-1"} transition-all animate-fade-in`}>
                    {visibleLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.href, link.exact);
                      const isSupportLink = link.href === "/admin/support";
                      const effectiveBadge = isSupportLink && openSupportCount > 0 
                        ? `${openSupportCount}` 
                        : link.badge;
                      const effectiveBadgeColor = isSupportLink && openSupportCount > 0
                        ? "bg-rose-500 text-white font-black"
                        : link.badgeColor;

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
                              ? `justify-center py-2.5 px-0 rounded-xl ${
                                  active
                                    ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                }`
                              : `py-2 px-3 rounded-xl ${
                                  active
                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-sm shadow-indigo-500/20 scale-[1.01]"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/90"
                                }`
                          }`}
                        >
                          <div className="relative flex items-center gap-2.5">
                            <Icon size={15} className={isSidebarCollapsed ? (active ? "text-white" : "text-slate-500 group-hover:text-indigo-600") : (active ? "text-white" : "text-slate-400 group-hover:text-indigo-600 transition-colors")} />
                            {isSidebarCollapsed && isSupportLink && openSupportCount > 0 && (
                              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
                            )}
                            {!isSidebarCollapsed && <span>{link.label}</span>}
                          </div>

                          {!isSidebarCollapsed && effectiveBadge && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md font-mono shadow-xs ${
                              active ? "bg-white/20 text-white" : (effectiveBadgeColor || "bg-indigo-100 text-indigo-800")
                            }`}>
                              {effectiveBadge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* SYSTEM STATUS FOOTER WIDGET */}
        {!isSidebarCollapsed && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-slate-600">DB Live & Connected</span>
            </div>
            <span className="text-[9.5px] font-mono text-slate-400">v2.4.0</span>
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
