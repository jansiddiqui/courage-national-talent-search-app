"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RegisterCTA } from "@/components/shared/RegisterCTA";

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    const handleScroll = () => {
      // Show CTA after user scrolls 300px down (past the hero main content)
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200/80 md:hidden flex items-center justify-between shadow-2xl transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col">
        <span className="text-[9px] text-blue-600 font-extrabold uppercase tracking-widest">CNTS 2026</span>
        <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
          ₹99
          <span className="text-[10px] font-medium text-slate-400 line-through">₹499</span>
        </span>
      </div>
      {isAuthenticated ? (
        <Link
          href="/dashboard"
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-800/10 active:scale-[0.98] transition-all"
        >
          Dashboard
          <ArrowRight size={12} />
        </Link>
      ) : (
        <RegisterCTA
          unauthenticatedText="Register Now"
          authenticatedText="Register Another"
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-800/10 active:scale-[0.98] transition-all font-bold"
          rightIcon={<ArrowRight size={12} />}
        />
      )}
    </div>
  );
}

