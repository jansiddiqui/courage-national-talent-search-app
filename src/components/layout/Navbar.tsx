"use client";
import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  Flame, 
  BookOpen, 
  ShieldCheck, 
  ChevronDown,
  HelpCircle,
  Compass,
  Trophy,
  Calendar,
  GraduationCap,
  Sparkles,
  Calculator,
  Languages,
  Lightbulb,
  ClipboardList,
  Info,
  CreditCard,
  BarChart3,
  Award,
  Building,
  Heart,
  Bell,
  User,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RegisterCTA } from "@/components/shared/RegisterCTA";

interface SubLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
}

interface NavCategory {
  label: string;
  links: SubLink[];
}

const navCategories: NavCategory[] = [
  {
    label: "Why CNTS",
    links: [
      { 
        label: "Why CNTS?", 
        href: "/why-cnts", 
        icon: HelpCircle,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "About the Mission", 
        href: "/about", 
        icon: Compass,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Prizes & Honors", 
        href: "/prizes", 
        icon: Trophy,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Timeline & Dates", 
        href: "/timeline", 
        icon: Calendar,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
    ]
  },
  {
    label: "Learning Academy",
    links: [
      { 
        label: "Academy Home", 
        href: "/academy", 
        icon: GraduationCap,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Reasoning Pathway", 
        href: "/academy/reasoning", 
        icon: Lightbulb,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Mathematics Pathway", 
        href: "/academy/mathematics", 
        icon: Calculator,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Critical Thinking", 
        href: "/academy/critical", 
        icon: Sparkles,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Language Mastery", 
        href: "/academy/language", 
        icon: Languages,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
    ]
  },
  {
    label: "Exam & Results",
    links: [
      { 
        label: "Exam Pattern", 
        href: "/exam-pattern", 
        icon: ClipboardList,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Exam Instructions", 
        href: "/exam-instructions", 
        icon: Info,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Mock Test", 
        href: "/mock-exam", 
        icon: Award,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "System Check", 
        href: "/system-check", 
        icon: ShieldCheck,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Search Results", 
        href: "/results", 
        icon: BarChart3,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Admit Card Portal", 
        href: "/admit-card-portal", 
        icon: CreditCard,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
    ]
  },
  {
    label: "Resources",
    links: [
      { 
        label: "Courage Partner", 
        href: "/partners", 
        icon: Heart,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "For Schools", 
        href: "/for-schools", 
        icon: Building,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Parent Guide", 
        href: "/parent-guide", 
        icon: Heart,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Notice Board", 
        href: "/announcements", 
        icon: Bell,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Help Center (FAQ)", 
        href: "/faq", 
        icon: HelpCircle,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
    ]
  }
];

interface NavbarProps {
  theme?: "light" | "dark";
}

export default function Navbar({ theme = "light" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileOpenCategory, setMobileOpenCategory] = useState<number | null>(0);
  
  // Single vs Multi-Role State
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>(['PARENT', 'PARTNER']); // Default multi-role for demo

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authService } = await import("@/services/authService");
        const session = await authService.checkSession();
        setIsAuthenticated(session.isAuthenticated);
        if (session.isAuthenticated) {
          if (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN') {
            setUserRoles(['ADMIN', 'PARENT', 'PARTNER']);
          } else if (session.role === 'PARTNER') {
            setUserRoles(['PARTNER']);
          } else if (session.role === 'PARENT') {
            setUserRoles(['PARENT']);
          }
        }
      } catch (e) {
        // ignore
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const [tickerIndex, setTickerIndex] = useState(0);
  const announcements = [
    { icon: <Flame size={13} className="text-orange-400 shrink-0" />, text: "Seats filling fast for CNTS 2026 Founding Edition — Register now for ₹99!" },
    { icon: <BookOpen size={13} className="text-blue-400 shrink-0" />, text: "Official sample guides and logic practice papers are now live in the Parent Dashboard." },
    { icon: <ShieldCheck size={13} className="text-emerald-400 shrink-0" />, text: "Designed by expert educators. Complete cognitive profile report + verifiable merit certificates included." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const isDarkNavbar = theme === "dark";

  return (
    <>
      {/* Announcement top ticker bar */}
      {!scrolled && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#091125] text-slate-200 border-b border-blue-950/80 text-[10px] sm:text-xs font-semibold tracking-wide py-2.5 select-none">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2 overflow-hidden h-4 sm:h-5">
            <span className="inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="relative w-full text-center flex items-center justify-center">
              {announcements.map((msg, idx) => (
                <span
                  key={idx}
                  className={`absolute transition-all duration-500 ease-in-out whitespace-nowrap truncate max-w-full flex items-center justify-center gap-1.5 ${
                    idx === tickerIndex
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                  }`}
                >
                  {msg.icon}
                  <span>{msg.text}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? theme === "dark"
              ? "top-0 bg-slate-950/95 border-b border-slate-800/60 shadow-sm py-3 backdrop-blur-md"
              : "top-0 bg-white/95 border-b border-slate-200/80 shadow-sm py-3 backdrop-blur-md"
            : "top-[38px] bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-1.5 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-400 group-hover:shadow-md">
              <Image
                src="/images/logo.png"
                alt="CNTS Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className={`font-display font-black text-lg leading-none tracking-tight transition-colors ${
                  isDarkNavbar ? "text-white" : "text-slate-900"
                }`}>
                  CNTS
                </span>
                <span className="font-mono text-[10px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  2026
                </span>
              </div>
              <span className={`text-[9.5px] font-mono font-extrabold tracking-wider uppercase block mt-1 transition-colors ${
                isDarkNavbar ? "text-indigo-400" : "text-indigo-700"
              }`}>
                POWERED BY COURAGE LIBRARY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/70 shadow-xs">
            <Link
              href="/"
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80 rounded-xl transition-all"
            >
              Home
            </Link>

            {navCategories.map((cat, catIdx) => (
              <div
                key={cat.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(catIdx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                    activeDropdown === catIdx
                      ? "text-indigo-600 bg-indigo-50/80 font-extrabold"
                      : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80"
                  }`}
                >
                  {cat.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      activeDropdown === catIdx ? "rotate-180 text-indigo-600" : "text-slate-400"
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === catIdx && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xl space-y-1">
                      {cat.links.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50/60 transition-colors group/item"
                          >
                            <div className={`p-2 rounded-lg ${link.iconBg} ${link.iconColor} shrink-0 group-hover/item:scale-110 transition-transform`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-800 group-hover/item:text-indigo-700 block">
                                {link.label}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Right Area */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Dashboard</span>
                  <ChevronDown size={13} className={dashboardDropdownOpen ? "rotate-180" : ""} />
                </button>

                {/* Single vs Multi-role Dropdown */}
                {dashboardDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl p-2 border border-slate-200 shadow-2xl z-50 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 px-3 py-1 block">Switch Workspace</span>
                    {userRoles.includes('PARENT') && (
                      <Link
                        href="/dashboard"
                        onClick={() => setDashboardDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-indigo-50 text-xs font-bold text-slate-800"
                      >
                        <GraduationCap size={16} className="text-indigo-600" /> Parent Dashboard
                      </Link>
                    )}
                    {userRoles.includes('PARTNER') && (
                      <Link
                        href="/partners?view=workspace"
                        onClick={() => setDashboardDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-indigo-50 text-xs font-bold text-slate-800"
                      >
                        <Heart size={16} className="text-pink-600" /> Partner Workspace
                      </Link>
                    )}
                    {userRoles.includes('ADMIN') && (
                      <Link
                        href="/admin"
                        onClick={() => setDashboardDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-indigo-50 text-xs font-bold text-slate-800"
                      >
                        <ShieldCheck size={16} className="text-amber-600" /> Admin Console
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Login
                </Link>
                <RegisterCTA />
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors border border-slate-200/80 bg-white/90 shadow-xs"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X size={22} className="text-slate-900" /> : <Menu size={22} className="text-slate-900" />}
          </button>
        </div>
      </nav>

      {/* MOBILE FULL-SCREEN SLIDE-OVER OVERLAY DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fade-in" onClick={() => setMenuOpen(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            className={`fixed inset-x-0 ${scrolled ? 'top-[60px]' : 'top-[78px]'} bg-white border-b border-slate-200 shadow-2xl p-5 z-50 space-y-5 max-h-[82vh] overflow-y-auto rounded-b-3xl animate-slide-down`}
          >
            {/* Quick Mobile Action Buttons */}
            <div className="flex items-center gap-2 pt-1 pb-3 border-b border-slate-100">
              <RegisterCTA />
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 py-3 text-center bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800 rounded-xl"
              >
                Login
              </Link>
            </div>

            {/* Mobile Categories Accordion Navigation */}
            <div className="space-y-3">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="font-extrabold text-xs text-slate-900 flex items-center justify-between p-2 rounded-xl hover:bg-slate-50"
              >
                <span>Home Overview</span>
                <ChevronRight size={15} className="text-slate-400" />
              </Link>

              {navCategories.map((cat, idx) => {
                const isOpen = mobileOpenCategory === idx;
                return (
                  <div key={cat.label} className="space-y-1.5 border-t border-slate-100 pt-2.5">
                    <button
                      onClick={() => setMobileOpenCategory(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-[11px] font-mono uppercase font-extrabold text-slate-400 tracking-wider cursor-pointer p-1"
                    >
                      <span className={isOpen ? "text-indigo-600 font-black" : ""}>{cat.label}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-600" : "text-slate-400"}`} />
                    </button>

                    {isOpen && (
                      <div className="grid grid-cols-1 gap-1 pl-1 pt-1 animate-fade-in">
                        {cat.links.map(link => {
                          const IconComp = link.icon;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-50 text-xs font-semibold text-slate-800 transition-colors"
                            >
                              <div className={`p-1.5 rounded-lg ${link.iconBg} ${link.iconColor} shrink-0`}>
                                <IconComp size={15} />
                              </div>
                              <span>{link.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Footer Partner Workspace Link */}
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/partners"
                onClick={() => setMenuOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
              >
                <Heart size={15} /> Courage Partner Platform <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
