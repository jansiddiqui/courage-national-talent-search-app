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
  Eye,
  FileText
} from 'lucide-react';

export const metadata = {
  title: 'Partner Code of Conduct & Integrity Pledge | Courage National Talent Search 2026',
  description: 'The official 6-Point Integrity Code & Code of Conduct governing all Courage Creators, Teachers, Schools, NGOs, and Partners.'
};

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
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 selection:bg-amber-400 selection:text-slate-950">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-900/20 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* TOP NAVIGATION BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link 
            href="/partners" 
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-400 hover:text-amber-300 transition-colors py-2 px-4 rounded-full bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" /> Back to Partner Network
          </Link>
          <span className="text-xs font-mono font-bold text-amber-400/90 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            OFFICIAL GOVERNANCE POLICY v2026.1
          </span>
        </div>

        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/10 via-amber-400/20 to-amber-400/10 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-lg">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Courage Partner Integrity Pledge
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Partner Code of Conduct & Ethical Guidelines
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-medium">
            The Courage Partner Network exists to connect genuine educators, creators, and institutions with students across India. All partners are bound by these 6 non-negotiable integrity standards.
          </p>
        </div>

        {/* INTEGRITY PLEDGE HERO BANNER */}
        <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-800/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 text-center sm:text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block">
              The Partner Integrity Pledge
            </span>
            <blockquote className="font-display text-lg sm:text-2xl font-extrabold text-white leading-snug italic">
              "I pledge to represent Courage National Talent Search with absolute honesty, dignity, and transparency. I will prioritize student educational benefit above commercial gain and maintain 100% compliance with data privacy and fair promotion."
            </blockquote>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Zero Tolerance for Fraud</span>
              <span className="flex items-center gap-1.5 text-indigo-400"><CheckCircle2 className="w-4 h-4" /> 100% Data Protection</span>
              <span className="flex items-center gap-1.5 text-amber-400"><CheckCircle2 className="w-4 h-4" /> Transparent Payouts</span>
            </div>
          </div>
        </div>

        {/* 6 CORE RULES GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-400" /> The 6 Non-Negotiable Partner Rules
            </h2>
            <span className="text-xs font-mono text-slate-400">Enforced by PartnerRiskEngine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rules.map((rule, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-600/50 rounded-3xl p-6 sm:p-7 transition-all duration-300 space-y-4 hover:shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    {rule.step} • {rule.category}
                  </span>
                  <div className="p-3 rounded-2xl bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <rule.icon className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                    {rule.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                    {rule.summary}
                  </p>
                </div>

                <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                  {rule.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ENFORCEMENT & VIOLATION CONSEQUENCES */}
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-900/80 text-rose-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-rose-200">
                Violation Penalties & Compliance Monitoring
              </h3>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Our automated governance systems continuously audit referral velocity and account compliance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-rose-900/40 space-y-1">
              <span className="font-extrabold text-amber-400 block">Level 1: Warning & Score Deduct</span>
              <span className="text-slate-400 font-medium">Minor promotional inaccuracies result in a 20-point reduction in Trust Score.</span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-rose-900/40 space-y-1">
              <span className="font-extrabold text-rose-400 block">Level 2: 14-Day Payout Hold</span>
              <span className="text-slate-400 font-medium">Suspicious referral spikes trigger a 14-day manual compliance review freeze.</span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-rose-900/40 space-y-1">
              <span className="font-extrabold text-rose-500 block">Level 3: Permanent Account Ban</span>
              <span className="text-slate-400 font-medium">Self-referral fraud or data harvesting results in permanent banning and balance forfeiture.</span>
            </div>
          </div>
        </div>

        {/* FOOTER CTA */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <h3 className="font-display text-2xl font-bold text-white">
            Ready to Join India's Most Ethical Partner Network?
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto">
            Apply today as a Creator, Educator, School, NGO, or Ambassador. Your application is reviewed within 24 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/partners/apply"
              className="py-3.5 px-8 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center gap-2"
            >
              Apply to Become a Partner <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login?tab=partner"
              className="py-3.5 px-6 bg-slate-950/80 hover:bg-slate-950 text-white font-bold text-xs sm:text-sm rounded-2xl border border-indigo-400/30 transition-all"
            >
              Partner Workspace Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
