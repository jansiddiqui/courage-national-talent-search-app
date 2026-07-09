"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if consent already given
    const consent = localStorage.getItem("cnts_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2500); // delay show for premium feel
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cnts_cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cnts_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100] animate-slide-up select-none">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col gap-4">
        {/* Top glow border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />
        
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100/50 shrink-0">
            <ShieldCheck size={18} className="stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">Cookie & Privacy Consent</h4>
            <p className="text-[11.5px] text-slate-500 leading-relaxed font-medium">
              We use cookies to secure session profiles, authenticate registrations, and optimize diagnostic reports. We never sell your data. Read our{" "}
              <Link href="/privacy" className="text-blue-750 underline font-bold hover:text-blue-800">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <button 
            onClick={() => setVisible(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 p-1 hover:bg-slate-50 rounded-lg"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 text-xs">
          <button
            onClick={handleDecline}
            className="px-3.5 py-2 hover:bg-slate-50 border border-slate-100 rounded-lg font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors cursor-pointer shadow-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
