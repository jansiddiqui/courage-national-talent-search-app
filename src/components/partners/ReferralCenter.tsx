'use client';

import React, { useState } from 'react';
import {
  Share2, Copy, Check, QrCode, MessageSquare,
  Printer, Download, ShieldCheck, Sparkles,
  ExternalLink, X, Send
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
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(0);

  const referralUrl = `https://thecouragelibrary.com/register?ref=${referralCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralUrl)}`;
  const qrHighRes = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(referralUrl)}`;

  const templates = [
    {
      label: '📚 Parent Groups',
      badge: 'High Conversion',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      text: `🎓 *100% Merit Scholarship Opportunity — Courage National Talent Search (CNTS) 2026*\n\nClass 5 to 8 students can register now for CNTS 2026 and qualify for national scholarships & cognitive profile reports!\n\n✨ What students get:\n• 100% Merit Scholarships for top scorers\n• National Rank Certificate\n• Personal Skill Diagnostic Report\n\n👉 Register via Official Courage Partner Link:\n${referralUrl}\n\n*Use Partner Referral Code:* ${referralCode}\n\nLast date: September 30, 2026.`,
    },
    {
      label: '🏫 School Teacher Groups',
      badge: 'Institutional',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      text: `Respected Sir/Ma'am 🙏\n\nI am sharing a national scholarship opportunity for your Class 5–8 students.\n\n📋 *Courage National Talent Search 2026 (CNTS)*\n• Nationally recognized talent assessment\n• Full fee waivers for merit students\n• School-level performance analytics provided\n\nYour school can register students in bulk through:\n🔗 ${referralUrl}\n\n*School Partner Code:* ${referralCode}\n\nFor institutional bulk registration support, please reply to this message. Thank you for your service to education! 🇮🇳`,
    },
    {
      label: '👥 Friends & Network',
      badge: 'Casual',
      badgeColor: 'bg-amber-100 text-amber-700',
      text: `Hey! 👋\n\nIf you have kids or know families with students in Class 5–8, this is huge!\n\nCourage Library is running CNTS 2026 — a national talent search where top scorers get *100% scholarship waivers* + a skill report.\n\nI'm officially partnered with them. Register through my link:\n👉 ${referralUrl}\n\nCode: ${referralCode}\n\nDeadline: Sep 30. Takes 5 mins to register 🙂`,
    },
  ];

  const copyTemplate = (idx: number) => {
    navigator.clipboard.writeText(templates[idx].text);
    setCopiedTemplate(idx);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}&summary=${encodeURIComponent(`I'm an official Courage Partner for CNTS 2026. Register for India's premier national talent search via my partner link!`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(`🎓 Register for CNTS 2026 via my partner link! Code: ${referralCode}`)}`;

  return (
    <div className="space-y-8 animate-fade-in">

      {/* HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              <Share2 className="w-3.5 h-3.5 text-indigo-600" /> Partner Referral & Growth Hub
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Referral Link & Sharing Media Kit
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Official referral code, multi-platform broadcast templates, and printable QR posters.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition-all shadow-xs cursor-pointer shrink-0"
          >
            <QrCode className="w-4 h-4 text-slate-950" /> Download Printable QR Poster
          </button>
        </div>
      </div>

      {/* REFERRAL CODE CARD */}
      <div className="bg-indigo-50/70 p-6 sm:p-8 rounded-3xl border border-indigo-100/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-indigo-100 pb-5">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 font-mono">
              Your Official Courage Partner Code
            </span>
            <div className="flex items-center gap-3">
              <div className="font-mono text-3xl sm:text-4xl font-black text-indigo-700 tracking-wider bg-white px-4 py-1.5 rounded-2xl border border-indigo-100 shadow-2xs">
                {referralCode}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Registered to: <strong className="text-slate-900 font-bold">{partnerName}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={copyLink}
              className="py-2.5 px-5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs border border-slate-200/90 shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
              {copied ? 'Link Copied!' : 'Copy Referral Link'}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(templates[0].text)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" /> Share on WhatsApp
            </a>
          </div>
        </div>

        {/* URL Preview */}
        <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <span className="text-xs text-slate-400 shrink-0 font-bold">Referral URL:</span>
            <code className="font-mono text-xs text-indigo-700 truncate font-semibold">{referralUrl}</code>
          </div>
          <a
            href={referralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0"
          >
            Test Link <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Social Sharing Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-bold mr-1">Also share on:</span>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-600" /> LinkedIn
          </a>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
          >
            <Send className="w-3.5 h-3.5 text-sky-600" /> Telegram
          </a>
          <a
            href={`https://www.instagram.com/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white hover:bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-600" /> Instagram Story
          </a>
        </div>
      </div>

      {/* BROADCAST TEMPLATES */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="border-b border-slate-100 pb-4 space-y-1">
          <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> High-Converting Broadcast Templates
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            3 purpose-built templates for different audiences. Click a tab to preview, then copy or share.
          </p>
        </div>

        {/* Template Tabs */}
        <div className="flex flex-wrap gap-2">
          {templates.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTemplate(idx)}
              className={`text-xs font-extrabold px-4 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                activeTemplate === idx
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{t.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTemplate === idx ? 'bg-white/20 text-white' : t.badgeColor
              }`}>{t.badge}</span>
            </button>
          ))}
        </div>

        {/* Active Template */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-4">
          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 leading-relaxed max-h-72 overflow-y-auto">{templates[activeTemplate].text}</pre>
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(templates[activeTemplate].text)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-white" /> Open in WhatsApp
            </a>
            <button
              type="button"
              onClick={() => copyTemplate(activeTemplate)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              {copiedTemplate === activeTemplate ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedTemplate === activeTemplate ? 'Copied!' : 'Copy Template'}
            </button>
          </div>
        </div>
      </div>

      {/* REFERRAL RULES (CLEAN RESPONSIVE GRID) */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-3">
        <div className="font-extrabold flex items-center gap-2 text-slate-900 text-sm">
          <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" /> Courage Partner Referral Code Rules:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium pt-1">
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
            <span>Minimum <strong>4 to 6 characters</strong> long.</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
            <span>MUST contain <strong>&quot;CNTS&quot;</strong> (e.g. CNTSJN).</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
            <span>Honorarium: <strong>₹25.00 per candidate</strong> (25% revenue share max).</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
            <span>Instant verification upon student fee payment.</span>
          </div>
        </div>
      </div>

      {/* QR POSTER MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-slide-up space-y-5 text-center">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                Official Courage Partner QR Poster
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900">Shareable QR Poster</h3>
              <p className="text-xs text-slate-500">
                Print or share in schools, coaching centers, and educational WhatsApp groups.
              </p>
            </div>

            {/* Poster Preview */}
            <div className="bg-gradient-to-b from-indigo-950 to-slate-900 text-white rounded-2xl p-6 border-4 border-amber-400 shadow-xl space-y-4 relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono uppercase">
                  Courage National Talent Search 2026
                </span>
                <h4 className="font-display font-black text-lg text-white">100% Merit Scholarship Exam</h4>
                <p className="text-[11px] text-slate-300">For Class 5 to 8 Students • Full Scholarship Waivers</p>
              </div>

              <div className="bg-white p-4 rounded-xl inline-block shadow-inner mx-auto border-2 border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt="Partner Referral QR Code"
                  className="w-36 h-36 mx-auto object-contain"
                />
                <span className="text-[10px] font-mono font-bold text-slate-900 block mt-2">SCAN TO REGISTER NOW</span>
              </div>

              <div className="pt-1 space-y-1 border-t border-slate-800">
                <span className="text-xs font-bold text-amber-300 block">Official Partner: {partnerName}</span>
                <span className="text-[11px] font-mono text-slate-300 block">
                  Partner Code: <strong className="text-white font-bold">{referralCode}</strong>
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 bg-slate-900 text-white font-bold text-xs rounded-xl shadow hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Poster
              </button>
              <a
                href={qrHighRes}
                target="_blank"
                download={`CNTS_Partner_QR_${referralCode}.png`}
                className="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Save High-Res
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
