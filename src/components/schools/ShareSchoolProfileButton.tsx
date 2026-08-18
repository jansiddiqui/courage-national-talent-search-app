"use client";

import { useState } from "react";
import { Share2, Check, ExternalLink, Globe, FileDown } from "lucide-react";
import { openSchoolRecognitionCertificate, SchoolRecognitionData } from "@/lib/schoolRecognitionCertificate";

interface ShareProps {
  schoolName: string;
  schoolSlug: string;
  website?: string | null;
  schoolData?: SchoolRecognitionData;
}

export default function ShareSchoolProfileButton({ schoolName, schoolSlug, website, schoolData }: ShareProps) {
  const [copied, setCopied] = useState(false);

  const profileUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/schools/${schoolSlug}`
    : `https://thecouragelibrary.com/schools/${schoolSlug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${schoolName} | CNTS Partner School`,
          text: `${schoolName} is an official Courage National Talent Search (CNTS) Partner School. View official evaluation metrics & participation history:`,
          url: profileUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if share sheet was dismissed
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

  const handleDownloadCertificate = () => {
    if (schoolData) {
      openSchoolRecognitionCertificate(schoolData);
    } else {
      openSchoolRecognitionCertificate({
        name: schoolName,
        city: "",
        slug: schoolSlug,
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Primary Action: Share Profile */}
      <button
        onClick={handleShare}
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
      >
        {copied ? (
          <>
            <Check size={15} className="text-emerald-300" />
            Link Copied to Clipboard!
          </>
        ) : (
          <>
            <Share2 size={15} />
            Share Profile
          </>
        )}
      </button>

      {/* Secondary Action: Recognition Document */}
      {schoolData && (
        <button
          onClick={handleDownloadCertificate}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <FileDown size={15} className="text-amber-700 shrink-0" />
          Recognition Document
        </button>
      )}

      {/* Tertiary Action: Visit Official Website */}
      {website && (
        <a
          href={website.startsWith("http") ? website : `https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200 shadow-2xs"
        >
          <Globe size={14} className="text-blue-600 shrink-0" />
          Official Website
          <ExternalLink size={12} className="text-slate-400" />
        </a>
      )}
    </div>
  );
}
