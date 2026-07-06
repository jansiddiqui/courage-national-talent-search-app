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
  Bell
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
        label: "Language Pathway", 
        href: "/academy/language", 
        icon: Languages,
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
        label: "Test Guidelines", 
        href: "/exam-instructions", 
        icon: Info,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Download Admit Card", 
        href: "/admit-card-portal", 
        icon: CreditCard,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Sample Brain Report", 
        href: "/sample-report", 
        icon: BarChart3,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
      { 
        label: "Results Portal", 
        href: "/results", 
        icon: Award,
        iconBg: "bg-blue-50/85",
        iconColor: "text-blue-600"
      },
    ]
  },
  {
    label: "Resources",
    links: [
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
  const [mobileOpenCategory, setMobileOpenCategory] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authService } = await import("@/services/authService");
        const session = await authService.checkSession();
        setIsAuthenticated(session.isAuthenticated);
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

  const isDarkNavbar = !scrolled && theme === "dark";

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
              ? "top-0 bg-slate-950/95 border-b border-slate-850/60 shadow-sm py-3 backdrop-blur-md"
              : "top-0 bg-white/95 border-b border-slate-200/80 shadow-sm py-3 backdrop-blur-md"
            : "top-[38px] bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="CNTS Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className={`font-display font-black text-base leading-none tracking-tight transition-colors ${
                isDarkNavbar ? "text-white" : "text-slate-900"
              }`}>
                CNTS
              </div>
              <span className={`text-[9px] leading-tight font-extrabold tracking-widest uppercase block mt-1 transition-colors ${
                isDarkNavbar ? "text-blue-400" : "text-blue-700"
              }`}>
                Powered by Courage Library
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with SaaS Dropdowns */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/40 relative">
            
            {/* Direct Home Link */}
            <Link
              href="/"
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                isDarkNavbar
                  ? "text-slate-300 hover:text-white hover:bg-white/5"
                  : "text-slate-655 hover:text-blue-700 hover:bg-white hover:shadow-sm"
              }`}
            >
              Home
            </Link>

            {navCategories.map((category, catIdx) => {
              const isDropdownOpen = activeDropdown === catIdx;
              return (
                <div
                  key={category.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(catIdx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1 cursor-pointer select-none ${
                      isDropdownOpen
                        ? "bg-white text-blue-700 shadow-sm"
                        : isDarkNavbar
                        ? "text-slate-300 hover:text-white hover:bg-white/5"
                        : "text-slate-655 hover:text-blue-700 hover:bg-white/40"
                    }`}
                  >
                    <span>{category.label}</span>
                    <ChevronDown 
                      size={12} 
                      className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} 
                    />
                  </button>

                  {/* Premium SaaS Dropdown Floating Card - Smooth Apple-Style Popover with Triangle */}
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[240px] bg-white border border-slate-200/70 shadow-2xl rounded-2xl p-2 z-50 transition-all duration-250 ease-out origin-top ${
                      isDropdownOpen 
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                        : "opacity-0 -translate-y-2.5 scale-95 pointer-events-none"
                    }`}
                  >
                    {/* Small Connector Pointer Arrow */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200/70 rotate-45 z-40" />

                    <div className="space-y-0.5 relative z-10 bg-white rounded-xl">
                      {category.links.map((subLink) => {
                        const SubIcon = subLink.icon;
                        return (
                          <Link
                            key={subLink.href}
                            href={subLink.href}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-55/60 transition-all group/item text-left"
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-50/80 text-blue-650 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:scale-105 transition-all duration-300">
                              <SubIcon size={14} className="stroke-[2.2]" />
                            </div>
                            <span className="font-bold text-slate-800 text-xs sm:text-[13px] group-hover/item:text-blue-700 group-hover/item:translate-x-0.5 transition-all duration-200">
                              {subLink.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl transition-all duration-200 shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-xs font-bold transition-colors ${
                    isDarkNavbar
                      ? "text-slate-350 hover:text-white"
                      : "text-slate-655 hover:text-blue-700"
                  }`}
                >
                  Login
                </Link>
                <RegisterCTA
                  unauthenticatedText="Register Now"
                  authenticatedText="Register Another Child"
                  className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-600/10 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDarkNavbar
                ? "text-slate-300 hover:bg-white/10"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            aria-label="Toggle mobile menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile popover panel drawer */}
        {menuOpen && (
          <div className={`md:hidden mt-3 mx-4 rounded-2xl p-4 shadow-xl border backdrop-blur-xl transition-all duration-300 ${
            theme === "dark"
              ? "bg-slate-950/98 border-slate-800 text-white"
              : "bg-white/98 border-slate-200/80 text-slate-950"
          }`}>
            <div className="space-y-2">
              
              {/* Direct Mobile Home Link */}
              <div className="border-b border-slate-100 pb-2">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-xs font-bold text-slate-700 hover:text-blue-700"
                >
                  Home
                </Link>
              </div>

              {navCategories.map((category, catIdx) => {
                const isMobileCatOpen = mobileOpenCategory === catIdx;
                return (
                  <div key={category.label} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <button
                      onClick={() => setMobileOpenCategory(isMobileCatOpen ? null : catIdx)}
                      className={`w-full flex items-center justify-between py-2 text-xs font-bold text-slate-700 hover:text-blue-700 cursor-pointer`}
                    >
                      <span>{category.label}</span>
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${isMobileCatOpen ? "rotate-180 text-blue-700" : "rotate-0 text-slate-400"}`} 
                      />
                    </button>
                    
                    {/* Collapsible Mobile Sub-links */}
                    {isMobileCatOpen && (
                      <div className="pl-3 mt-1.5 space-y-1.5 animate-fade-in">
                        {category.links.map((subLink) => (
                          <Link
                            key={subLink.href}
                            href={subLink.href}
                            onClick={() => setMenuOpen(false)}
                            className="block py-1.5 text-[11px] font-bold text-slate-500 hover:text-blue-750"
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={`mt-4 pt-3 border-t flex flex-col gap-2.5 ${
              theme === "dark" ? "border-white/10" : "border-slate-100"
            }`}>
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={`block w-full text-center px-5 py-3 text-xs font-bold rounded-xl ${
                    theme === "dark"
                      ? "bg-white/10 text-white hover:bg-white/15"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className={`block w-full text-center px-5 py-3 text-xs font-bold rounded-xl ${
                      theme === "dark"
                        ? "bg-white/10 text-white hover:bg-white/15"
                        : "bg-slate-100 text-slate-855 hover:bg-slate-200"
                    }`}
                  >
                    Login
                  </Link>
                  <RegisterCTA
                    unauthenticatedText="Register Now"
                    authenticatedText="Register Another Child"
                    className="block w-full text-center px-5 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/10 cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
