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
    <button
      onClick={handleShare}
      type="button"
      title={copied ? "Link copied to clipboard!" : "Share school profile"}
      aria-label="Share school profile"
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 hover:bg-slate-200/90 active:scale-95 text-slate-700 text-xs font-semibold transition-all border border-slate-200/80 cursor-pointer focus:outline-none"
    >
      {copied ? (
        <>
          <Check size={13} className="text-emerald-600 shrink-0" />
          <span className="text-emerald-700 font-bold">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={13} className="text-slate-500 shrink-0" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
