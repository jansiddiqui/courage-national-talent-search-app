'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  GraduationCap, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Scale,
  FileText,
  Zap
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PartnerCodeOfConductPage() {
  const rules = [
    {
      step: 'Rule 01',
      title: 'Student-First Educational Mission',
      category: 'ETHICAL MANDATE',
      icon: GraduationCap,
      summary: 'Partners must prioritize genuine student access and academic growth over commercial gains.',
      details: [
        'Always accurately represent CNTS 2026 as a national talent search and merit examination for Classes 5–8.',
        'Never make false promises regarding guaranteed scholarships, rank placements, or school admissions.',
        'Encourage students to participate based on merit, curiosity, and learning evaluation.'
      ]
    },
    {
      step: 'Rule 02',
      title: 'Transparent Registration Fee Disclosure',
      category: 'FINANCIAL ACCURACY',
      icon: Scale,
      summary: 'Full transparency regarding the nominal ₹99–₹100 exam fee is strictly required.',
      details: [
        'Clearly mention that the student registration fee is ₹99–₹100 for paper processing, syllabus access, and performance analytics.',
        'Prohibit charging students or parents any additional hidden charges or manual handling fees.',
        'Highlight the 100% Fee Waiver available for underprivileged and Partner Child schemes where eligible.'
      ]
    },
    {
      step: 'Rule 03',
      title: 'Strict Anti-Fraud & Zero Self-Referral Policy',
      category: 'SYSTEM INTEGRITY',
      icon: ShieldCheck,
      summary: 'Self-referrals, automated script registrations, and fake candidate entries trigger immediate account suspension.',
      details: [
        'Partners are prohibited from using their own referral code for self-registration or creating dummy candidate accounts.',
        'Each registration is audited by our PartnerRiskEngine for IP, device fingerprint, and payment identity matches.',
        'Any attempt to manipulate referral metrics result in instant forfeiture of pending payouts and permanent ban.'
      ]
    },
    {
      step: 'Rule 04',
      title: 'Student Data Protection & Privacy Guarantee',
      category: 'DATA GOVERNANCE',
      icon: Lock,
      summary: 'Candidate data belongs strictly to the student and parent. Unauthorized sharing is strictly illegal.',
      details: [
        'Partners must respect candidate privacy. Student personal contact details are never exposed or shared with third parties.',
        'Partners must never harvest, sell, or reuse candidate phone numbers or emails for external marketing.',
        'All partner operations strictly comply with national child digital privacy regulations.'
      ]
    },
    {
      step: 'Rule 05',
      title: 'Professional Representation & Brand Honor',
      category: 'COMMUNITY STANDARDS',
      icon: Award,
      summary: 'Partners represent Courage Library and must uphold the highest standards of dignity and respect.',
      details: [
        'Do not impersonate official government education boards, school principals, or examination authorities.',
        'Avoid aggressive spamming in WhatsApp groups, Telegram channels, or social media comments.',
        'Maintain constructive, respectful, and encouraging communication with parents and educators.'
      ]
    },
    {
      step: 'Rule 06',
      title: 'Transparent Payouts & 7-Day Maturity Hold',
      category: 'PAYOUT GOVERNANCE',
      icon: Sparkles,
      summary: 'All partner honorariums are subject to automated verification before maturity.',
      details: [
        'Honorarium credits enter a 7-day maturity hold to allow payment verification and refund processing.',
        'Payouts require valid PAN/UPI identity verification to ensure financial compliance.',
        'Minimum payout threshold is ₹100, processed directly to your verified bank account or UPI.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/70 via-[#F8FAFF] to-[#F8FAFF] text-[#0F172A] flex flex-col justify-between">
      
      {/* GLOBAL SITE NAVBAR */}
      <Navbar />

      <main className="pt-[130px] sm:pt-36 md:pt-40 pb-20 flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
          
          {/* TOP NAVIGATION BREADCRUMB & GOVERNANCE BADGE */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Link 
              href="/partners" 
              className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-indigo-600 transition-colors py-2 px-4 rounded-full bg-white border border-slate-200/90 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" /> Back to Partner Network
            </Link>

            <span className="text-[11px] font-mono font-extrabold text-amber-900 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200 shadow-2xs">
              OFFICIAL GOVERNANCE POLICY v2026.1
            </span>
          </div>

          {/* HERO TITLE SECTION */}
          <div className="text-center space-y-3.5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-1 rounded-full text-xs font-extrabold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Courage Partner Integrity Pledge
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Partner Code of Conduct & Ethical Guidelines
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-medium">
              The Courage Partner Network exists to connect genuine educators, creators, and institutions with students across India. All partners are bound by these 6 non-negotiable integrity standards.
            </p>
          </div>

          {/* INTEGRITY PLEDGE HERO BANNER (DARK LUXURY CARD) */}
          <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-3.5 text-center sm:text-left">
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400 block">
                The Partner Integrity Pledge
              </span>
              <blockquote className="font-display text-base sm:text-2xl font-extrabold text-white leading-snug italic">
                "I pledge to represent Courage National Talent Search with absolute honesty, dignity, and transparency. I will prioritize student educational benefit above commercial gain and maintain 100% compliance with data privacy and fair promotion."
              </blockquote>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                  <CheckCircle2 className="w-4 h-4" /> Zero Tolerance for Fraud
                </span>
                <span className="flex items-center gap-1.5 text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/40">
                  <CheckCircle2 className="w-4 h-4" /> 100% Data Protection
                </span>
                <span className="flex items-center gap-1.5 text-amber-300 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40">
                  <CheckCircle2 className="w-4 h-4" /> Transparent Payouts
                </span>
              </div>
            </div>
          </div>

          {/* 6 CORE RULES GRID */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" /> The 6 Non-Negotiable Partner Rules
              </h2>
              <span className="text-xs font-mono font-bold text-slate-500 hidden sm:inline-block">Enforced by PartnerRiskEngine</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rules.map((rule, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/90 hover:border-indigo-500/50 rounded-3xl p-6 sm:p-7 transition-all duration-300 space-y-4 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                      {rule.step} • {rule.category}
                    </span>
                    <div className="p-3 rounded-2xl bg-slate-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <rule.icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {rule.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                      {rule.summary}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700 font-medium">
                    {rule.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ENFORCEMENT & VIOLATION CONSEQUENCES */}
          <div className="bg-rose-50/80 border border-rose-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500 text-white shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-rose-950">
                  Violation Penalties & Automated Monitoring
                </h3>
                <p className="text-xs text-rose-900 mt-0.5 font-medium">
                  Our automated governance systems continuously audit referral velocity, device fingerprints, and code compliance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-rose-200/70 space-y-1">
                <span className="font-extrabold text-amber-700 block">Level 1: Warning & Score Deduct</span>
                <span className="text-slate-600 font-medium">Minor promotional inaccuracies result in a 20-point reduction in Trust Score.</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-rose-200/70 space-y-1">
                <span className="font-extrabold text-rose-700 block">Level 2: 14-Day Payout Hold</span>
                <span className="text-slate-600 font-medium">Suspicious referral spikes trigger a 14-day manual compliance review freeze.</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-rose-200/70 space-y-1">
                <span className="font-extrabold text-rose-800 block">Level 3: Permanent Account Ban</span>
                <span className="text-slate-600 font-medium">Self-referral fraud or data harvesting results in permanent banning and balance forfeiture.</span>
              </div>
            </div>
          </div>

          {/* FOOTER CTA CALLOUT CARD */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-xl border border-slate-800">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-extrabold">
              <Zap className="w-4 h-4 text-amber-400" /> Transparent Growth Platform
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
              Ready to Join India's Most Ethical Partner Network?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
              Apply today as a Creator, Educator, School, NGO, or Ambassador. Your application is reviewed within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/partners/apply"
                className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:scale-[1.02] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Apply to Become a Partner <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
              <Link
                href="/login?tab=partner"
                className="w-full sm:w-auto py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 transition-all text-center"
              >
                Partner Workspace Login
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* GLOBAL SITE FOOTER */}
      <Footer />
    </div>
  );
}
