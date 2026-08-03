'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  MessageSquare, 
  Printer, 
  Download, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

interface ReferralCenterProps {
  partnerName?: string;
  referralCode?: string;
}

export const ReferralCenter: React.FC<ReferralCenterProps> = ({
  partnerName = 'Jan Mohammad',
  referralCode = 'CNTSJN'
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCopy, setCopiedCopy] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const referralUrl = `https://thecouragelibrary.com/register?ref=${referralCode}`;

  const broadcastText = `🎓 *100% Merit Scholarship Opportunity — Courage National Talent Search (CNTS) 2026*\n\nClass 5 to 8 students can register now for CNTS 2026 and qualify for national scholarships & cognitive profile reports!\n\n👉 Register via Official Courage Partner Link:\n${referralUrl}\n\n*Use Partner Referral Code:* ${referralCode}`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-2 border border-indigo-100">
            <Share2 className="w-3.5 h-3.5" /> Partner Referral & Growth Hub
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Referral Link & Sharing Media Kit
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your official referral code, 1-click WhatsApp broadcasts, and printable QR posters.
          </p>
        </div>

        <button
          onClick={() => setShowQRModal(true)}
          className="btn-primary text-xs py-3.5 px-6 bg-amber-400 hover:bg-amber-500 font-bold text-slate-950 flex items-center justify-center gap-2 shadow-md cursor-pointer rounded-2xl transition-all"
        >
          <QrCode className="w-4 h-4 text-slate-950" /> Download Printable QR Poster
        </button>
      </div>

      {/* PRIMARY REFERRAL CODE CARD */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Your Official Courage Partner Code
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-black text-amber-300 tracking-wider mt-1">
              {referralCode}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Registered to: <strong className="text-white">{partnerName}</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="py-3 px-6 rounded-2xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:bg-slate-100 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
              {copied ? 'Link Copied!' : 'Copy Referral Link'}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(broadcastText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Share on WhatsApp
            </a>
          </div>
        </div>

        {/* LINK PREVIEW */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-xs text-slate-400 shrink-0 font-bold">Referral URL:</span>
            <code className="font-mono text-xs text-indigo-300 truncate">{referralUrl}</code>
          </div>
          <a
            href={referralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0"
          >
            Test Link <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 1-CLICK CAMPAIGN BROADCAST COPIES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> High-Converting WhatsApp Broadcast Templates
          </h3>
          <p className="text-xs text-slate-500">
            Copy and paste these pre-formatted messages into your school, parent, or educator WhatsApp groups.
          </p>
        </div>

        <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl font-mono text-xs leading-relaxed relative border border-slate-800">
          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200">{broadcastText}</pre>
          
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(broadcastText);
                setCopiedCopy(true);
                setTimeout(() => setCopiedCopy(false), 2000);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer shadow"
            >
              {copiedCopy ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedCopy ? 'Broadcast Copy Taken!' : 'Copy WhatsApp Template'}
            </button>
          </div>
        </div>
      </div>

      {/* REFERRAL RULES BOX */}
      <div className="p-5 rounded-3xl bg-indigo-50/80 border border-indigo-200 space-y-2 text-xs text-indigo-950">
        <div className="font-bold flex items-center gap-2 text-indigo-900 text-sm">
          <ShieldCheck className="w-4 h-4 text-indigo-600" /> Courage Partner Referral Code Rules:
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium text-slate-700 text-xs pt-1">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" /> Minimum <strong>4 to 6 characters</strong> long.</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" /> MUST contain <strong>"CNTS"</strong> (e.g. CNTSJN).</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" /> Honorarium: <strong>₹25.00 per candidate</strong> (25% revenue share max).</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" /> Instant verification upon student fee payment.</li>
        </ul>
      </div>
    </div>
  );
};
