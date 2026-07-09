"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HelpCircle, Home, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8FAFF] flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 antialiased overflow-x-hidden">
      {/* Header bar */}
      <header className="py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-105">
              <Image src="/images/logo.png" alt="CNTS Logo" fill className="object-contain" priority />
            </div>
            <div>
              <div className="font-display font-black text-sm leading-none tracking-tight text-slate-900">CNTS</div>
              <span className="text-[8px] leading-tight font-extrabold tracking-widest uppercase block mt-0.5 text-blue-700">
                Powered by Courage Library
              </span>
            </div>
          </Link>
          <Link href="/faq" className="text-xs font-bold text-slate-500 hover:text-blue-750 flex items-center gap-1">
            <HelpCircle size={14} /> Help Center
          </Link>
        </div>
      </header>

      {/* Main content */}
      <section className="flex-grow flex items-center justify-center py-20 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-500/[0.02] rounded-full blur-3xl" />
        </div>

        <div className="max-w-lg w-full text-center space-y-8 relative z-10 animate-slide-up">
          {/* Visual card */}
          <div className="relative inline-block group">
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-3xl opacity-10 blur-md group-hover:opacity-20 transition-all duration-500" />
            <div className="relative w-40 h-40 bg-white border border-slate-200/60 rounded-3xl flex flex-col items-center justify-center shadow-lg">
              <span className="font-display font-black text-6xl text-slate-800 tracking-tighter leading-none">404</span>
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest mt-2">Page Not Found</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              Lost in transit.
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto font-medium">
              We couldn't locate the page you were looking for. It might have been relocated, or the URL might be entered incorrectly.
            </p>
          </div>

          {/* Action triggers */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Home size={14} /> Back to Home
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Mail size={14} /> Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="py-6 border-t border-slate-100 bg-white text-center text-[10.5px] text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 Courage National Talent Search. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-blue-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-700">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
