"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  MessageSquare, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  BellRing,
  ExternalLink
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function UpdatesPage() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const joinLink = "https://whatsapp.com/channel/0029Vb8NYaiEquiRSLwDD338";

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="light" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center w-full">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700">
            <BellRing size={12} className="text-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Updates Channel
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-tight">
            Parent <span className="text-blue-400">Community</span>.
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Connect directly to our official WhatsApp Updates Channel. Receive instant reminders about syllabus releases, practice test links, and admit card issuing.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-md mx-auto py-20 px-6 animate-slide-up w-full">
        
        {/* Action card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
          
          <div className="relative space-y-6 flex flex-col items-center">
            {/* Pulsing bell/whatsapp green icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25 scale-125" />
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-md">
                <BellRing size={28} className="stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                Join CNTS Parent Community
              </h2>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                Connect directly to our official WhatsApp Updates Channel. Receive instant reminders about syllabus releases, practice test links, and admit card issuing.
              </p>
            </div>

            {/* Bullet reasons */}
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2 text-[11px] text-slate-600 font-semibold">
              <div className="flex gap-2 items-center">
                <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                <span>Zero spam policy: Announcements only</span>
              </div>
              <div className="flex gap-2 items-center">
                <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                <span>Instant notifications about slot bookings</span>
              </div>
              <div className="flex gap-2 items-center">
                <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                <span>Direct downloads for test prep guides</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-3 pt-2">
              <a
                href={joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare size={14} />
                Join WhatsApp Updates Channel
                <ExternalLink size={12} />
              </a>
              <Link
                href="/dashboard"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer block"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
