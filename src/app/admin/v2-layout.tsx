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
  Compass
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
    title: "Operations",
    links: [
      { href: "/admin?tab=schools", label: "School Partners", icon: School },
      { href: "/admin?tab=prospects", label: "Discovery Engine", icon: Compass },
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
      {/* Sidebar Navigation - Left Side */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col shrink-0 md:sticky md:top-0 md:h-screen z-30 shadow-sm shadow-slate-100/50">
        {/* Brand Section & Mobile Toggle Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl shadow-md shadow-indigo-200/50">
              <Shield size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-800 leading-tight">CNTS Admin</h2>
              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block uppercase tracking-wider">
                V2.0 Console
              </span>
            </div>
          </div>

          {/* Hamburger toggle button on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-855 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation list grouped by Section - Collapsed on mobile, visible on desktop */}
        <nav className={`flex-1 py-4 pr-3 overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-5 md:block style={{ scrollbarWidth: "none" }} ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}>
          {linkGroups.map((group, groupIdx) => (
            <div key={group.title + groupIdx} className="space-y-1">
              <h3 className="px-4 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </h3>
              <div className="space-y-[2px]">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href, link.exact);
                  return (
                    <button
                      key={link.href}
                      onClick={() => {
                        router.push(link.href);
                        setIsMobileMenuOpen(false); // Auto close menu on nav on mobile
                      }}
                      className={`w-full flex items-center gap-3 py-2 rounded-r-xl text-xs font-medium transition-all text-left cursor-pointer ${
                        active
                          ? "bg-indigo-50/80 text-indigo-700 font-bold border-l-4 border-indigo-600 pl-3 shadow-sm shadow-indigo-100/10"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/80 pl-4"
                      }`}
                    >
                      <Icon size={14} className={active ? "text-indigo-600" : "text-slate-400"} />
                      {link.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
