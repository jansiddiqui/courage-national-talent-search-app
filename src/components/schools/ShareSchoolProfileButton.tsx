"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareProps {
  schoolName: string;
  schoolSlug: string;
}

export default function ShareSchoolProfileButton({ schoolName, schoolSlug }: ShareProps) {
  const [copied, setCopied] = useState(false);

  const profileUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/schools/${schoolSlug}`
    : `https://thecouragelibrary.com/schools/${schoolSlug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${schoolName} | CNTS Partner School`,
          text: `${schoolName} is an official Courage National Talent Search (CNTS) Partner School. View institutional profile:`,
          url: profileUrl,
        });
        return;
      } catch {
        // User dismissed native share sheet
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleShare}
        type="button"
        title={copied ? "Link copied to clipboard!" : "Share school profile"}
        aria-label="Share school profile"
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all shadow-xs shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {copied ? (
          <Check size={18} className="text-emerald-300" />
        ) : (
          <Share2 size={18} />
        )}
      </button>

      {/* Floating tooltip on desktop */}
      {copied && (
        <span className="absolute -top-8 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap animate-fade-in pointer-events-none">
          Link Copied!
        </span>
      )}
    </div>
  );
}
