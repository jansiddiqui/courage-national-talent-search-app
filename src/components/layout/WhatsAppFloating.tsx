"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

export default function WhatsAppFloating() {
  return (
    <div className="no-print">
      {/* Floating WhatsApp Button - Symmetrical to FAQ Bubble but on the Left */}
      <div 
        className="fixed bottom-[88px] md:bottom-8 left-6 z-40"
      >
        <a
          href="https://wa.me/918707884735?text=Hello%20CNTS%20Support%2C%20I%20have%20a%20query%20about%20the%20Talent%20Search."
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare size={22} className="fill-white/10" />
          
          {/* Animated pulse ring around button */}
          <span className="absolute inset-0 rounded-full border border-[#25D366]/40 animate-ping pointer-events-none scale-110" />
          
          {/* Hover Tooltip tooltip */}
          <span className="absolute left-16 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:inline-block">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
}
