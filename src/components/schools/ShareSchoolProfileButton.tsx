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
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 hover:bg-blue-100 active:scale-95 text-blue-700 font-semibold text-xs transition-all border border-blue-200/90 cursor-pointer shadow-2xs"
    >
      {copied ? (
        <>
          <Check size={12} className="text-emerald-600 shrink-0" />
          <span className="text-emerald-700 font-bold">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={12} className="text-blue-600 shrink-0" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
