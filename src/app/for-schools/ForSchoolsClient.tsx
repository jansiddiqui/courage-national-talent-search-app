/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { 
  Building, 
  Award, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Brain, 
  Sparkles, 
  Phone, 
  PhoneCall 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BlogPost } from "@/lib/blog";

// Subcomponents
import HeroPortalSection from "@/components/for-schools/HeroPortalSection";
import NationalMapSection from "@/components/for-schools/NationalMapSection";
import TalentGalaxySection from "@/components/for-schools/TalentGalaxySection";
import AcademicJourneyStepper from "@/components/for-schools/AcademicJourneyStepper";
import DeliverablesShowcase from "@/components/for-schools/DeliverablesShowcase";
import ParticipationFeeSection from "@/components/for-schools/ParticipationFeeSection";
import OfficialDocumentsVault from "@/components/for-schools/OfficialDocumentsVault";
import InstitutionalFaq from "@/components/for-schools/InstitutionalFaq";

export default function ForSchoolsPage({ initialPosts = [] }: { initialPosts?: BlogPost[] }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16 md:pb-0">
      <Navbar theme="light" />

      {/* Hero Portal Section (Integrated 60/40 Light Split Layout) */}
      <HeroPortalSection />

      {/* Credentials & Pedagogical Compliance Strip */}
      <section className="bg-slate-100/90 border-b border-slate-200 py-4 px-6 text-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-10 text-xs md:text-sm font-semibold text-slate-700 text-center">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" /> NEP 2020 Pedagogical Framework
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="flex items-center gap-2">
            <Brain size={16} className="text-blue-600 shrink-0" /> Cognitive Science Skill Mapping
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600 shrink-0" /> DPDP-Compliant Student Data Safety
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="flex items-center gap-2">
            <LaptopIcon size={16} className="text-blue-600 shrink-0" /> 100% Computer Lab Compatible
          </span>
        </div>
      </section>

      {/* Philosophical Hook (Aspirational Section) */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200 px-6 text-center text-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800 mb-4">
            <Sparkles size={14} className="text-amber-600" /> Pedagogical Philosophy
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 leading-snug mb-4">
            "Every student deserves to be recognized for their potential—not only their marks."
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            Traditional examinations primarily measure memory retention under strict time pressure. CNTS evaluates core cognitive reasoning, spatial logic, and conceptual problem-solving in Classes 5–8 — ensuring no child's true academic aptitude remains hidden.
          </p>
        </div>
      </section>

      {/* Outcome Section (Why Schools Across India Partner With CNTS) */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Institutional Value</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-2">
            Why schools across India partner with CNTS
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Hosting the CNTS assessment provides actionable intelligence for school leadership, faculty, and parents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              Icon: Brain,
              color: "text-blue-600 bg-blue-50 border-blue-100",
              title: "Uncover hidden aptitude",
              desc: "Identify bright, analytical minds who may underperform in standard rote tests, unlocking early talent discovery."
            },
            {
              Icon: BarChart3,
              color: "text-emerald-600 bg-emerald-50 border-emerald-100",
              title: "Classroom diagnostic heatmaps",
              desc: "Provide teachers with section-wise data highlighting specific conceptual strengths and curriculum gaps."
            },
            {
              Icon: Award,
              color: "text-amber-600 bg-amber-50 border-amber-100",
              title: "Future-ready student development",
              desc: "Benchmark analytical reasoning early in Classes 5–8 to prepare candidates for future academic challenges."
            },
            {
              Icon: ShieldCheck,
              color: "text-indigo-600 bg-indigo-50 border-indigo-100",
              title: "Meaningful parent reassurance",
              desc: "Offer parents an objective, scientific profile of their child's core cognitive abilities beyond report cards."
            }
          ].map((feat) => (
            <div 
              key={feat.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${feat.color}`}>
                <feat.Icon size={22} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base mb-2">{feat.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signature Section: A National Initiative (Geographic Scope) */}
      <NationalMapSection />

      {/* Aptitude Constellation Section */}
      <TalentGalaxySection />

      {/* Deliverables Showcase (Apple Product Stage Switcher) */}
      <DeliverablesShowcase />

      {/* Operational Timeline Progress Stepper */}
      <AcademicJourneyStepper />

      {/* Dedicated Programme Participation Fee Section */}
      <ParticipationFeeSection />

      {/* Official Partnership Documents Vault */}
      <OfficialDocumentsVault />

      {/* Institutional Reassurance Section */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Institutional Governance</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-2">
              Why your school can trust CNTS
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-left">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <ShieldCheck size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">DPDP Act data safety</h3>
              <p className="text-slate-600 text-xs leading-relaxed">No individual student mobile numbers required. Roll numbers are institutionally managed.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <Lock size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Encrypted testing environment</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Assessment executes in isolated, secure browser sessions with full encryption.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <PhoneCall size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Dedicated relationship officer</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Assigned Relationship Officer coordinates lab scheduling and reporting.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <Building size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Registered educational entity</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Operated by Courage Library Educational Foundation under official governance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional FAQ Accordion */}
      <InstitutionalFaq />

      {/* Final Action Callout (Deep Navy Surface Reserved for Final CTA) */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white py-16 px-6 text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
            Let's build this academic partnership together
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
            Schedule a 15-minute briefing with our Academic Partnerships Director or submit a request to receive your school prospectus kit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a
              href="#inquiry-form"
              className="bg-white text-blue-900 font-bold py-3.5 px-6 rounded-xl text-sm hover:bg-slate-100 transition-colors shadow-md min-h-[46px] flex items-center gap-2"
            >
              Request a School Partnership <ArrowRight size={16} />
            </a>
            <a
              href="tel:+918360603173"
              className="bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-700 font-semibold py-3.5 px-6 rounded-xl text-sm transition-colors min-h-[46px] flex items-center gap-2"
            >
              <Phone size={16} className="text-blue-300" /> Call Helpline: +91 83606 03173
            </a>
          </div>

          <p className="text-slate-400 text-xs">
            Email: <strong className="text-white">partners@thecouragelibrary.com</strong> · Courage Library Educational Foundation
          </p>
        </div>
      </section>

      {/* School Insights & Resources */}
      {initialPosts && initialPosts.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-display font-bold text-xl md:text-2xl text-slate-900 mb-8 text-center">
              School insights &amp; assessment resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initialPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-snug line-clamp-3">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                  <span className="text-blue-600 text-xs font-semibold group-hover:underline inline-flex items-center gap-1 mt-4">
                    Read Article &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-50 md:hidden shadow-lg">
        <a
          href="#inquiry-form"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold min-h-[44px] rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          Request a School Partnership →
        </a>
      </div>

      <Footer />
    </div>
  );
}

function LaptopIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}
