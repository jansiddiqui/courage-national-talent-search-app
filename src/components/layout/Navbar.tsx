"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  theme?: "light" | "dark";
}

export default function Navbar({ theme = "light" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "About CNTS", href: "/about" },
    { label: "Exam", href: "/#exam" },
    { label: "Prizes", href: "/prizes" },
    { label: "Timeline", href: "/timeline" },
    { label: "For Schools", href: "/for-schools" },
    { label: "FAQs", href: "/faq" },
  ];

  const [tickerIndex, setTickerIndex] = useState(0);
  const announcements = [
    "🔥 Seats filling fast for CNTS 2026 Founding Edition — Register now for ₹99!",
    "📚 Official sample guides and logic practice papers are now live in the Parent Dashboard.",
    "🛡️ Designed by expert educators. Complete cognitive profile report + verifiable merit certificates included."
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
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white border-b border-slate-800 text-[10px] sm:text-xs font-semibold tracking-wide py-2.5 select-none animate-slide-in-ticker">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2 overflow-hidden h-4 sm:h-5">
            <span className="inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="relative w-full text-center flex items-center justify-center">
              {announcements.map((msg, idx) => (
                <span
                  key={idx}
                  className={`absolute transition-all duration-500 ease-in-out whitespace-nowrap truncate max-w-full ${
                    idx === tickerIndex
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                  }`}
                >
                  {msg}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "top-0 glass shadow-sm shadow-blue-900/5 py-3"
            : "top-[38px] bg-transparent py-5"
        }`}
      >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <Image
              src="/images/logo.png"
              alt="CNTS Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className={`font-display font-bold text-[15px] leading-tight tracking-tight transition-colors ${
              isDarkNavbar ? "text-white" : "text-slate-900"
            }`}>
              CNTS
            </div>
            <div className={`text-[10px] leading-tight font-medium tracking-wide uppercase transition-colors ${
              isDarkNavbar ? "text-slate-400" : "text-slate-500"
            }`}>
              Powered by Courage Library
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isDarkNavbar
                  ? "text-slate-300 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-blue-800 hover:bg-blue-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors ${
              isDarkNavbar
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-blue-800 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-800/25 hover:shadow-blue-700/30 hover:-translate-y-0.5"
          >
            Register Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isDarkNavbar
              ? "text-slate-300 hover:bg-white/10"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 mx-4 glass rounded-2xl p-4 shadow-xl">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-5 py-3 border border-slate-250/60 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-5 py-3 bg-blue-800 text-white text-sm font-semibold rounded-xl"
            >
              Register Now
            </Link>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
