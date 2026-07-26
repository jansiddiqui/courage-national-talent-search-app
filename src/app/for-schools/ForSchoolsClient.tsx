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
  FileText,
  PhoneCall,
  Rocket,
  Lock,
  Download,
  Brain,
  Sparkles,
  Phone,
  MessageSquare
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BlogPost } from "@/lib/blog";

// Modular Subcomponents
import InquiryForm from "@/components/for-schools/InquiryForm";
import NationalMapSection from "@/components/for-schools/NationalMapSection";
import DeliverablesShowcase from "@/components/for-schools/DeliverablesShowcase";
import OfficialDocumentsVault from "@/components/for-schools/OfficialDocumentsVault";
import AcademicTimeline from "@/components/for-schools/AcademicTimeline";
import InstitutionalFaq from "@/components/for-schools/InstitutionalFaq";

export default function ForSchoolsPage({ initialPosts = [] }: { initialPosts?: BlogPost[] }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16 md:pb-0">
      <Navbar theme="light" />

      {/* Institutional Partnership Helpline Top Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 mt-16 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider">Official Portal</span>
            <span className="text-slate-300 hidden sm:inline">Courage National Talent Search 2026 Partnership Intake</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <a href="tel:+918360603173" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={13} className="text-blue-400" />
              <span>Helpline: <strong>+91 83606 03173</strong></span>
            </a>
            <span className="text-slate-700">|</span>
            <a href="https://wa.me/918360603173?text=Hello%2C%20we%20want%20to%20partner%20with%20CNTS%202026" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
              <MessageSquare size={13} className="text-emerald-400" />
              <span className="hidden md:inline">WhatsApp Partner Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* Split-Screen Hero Section (Above Fold on Desktop) */}
      <section className="pt-8 md:pt-12 pb-16 px-6 border-b border-slate-200/80 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (60% Desktop - lg:col-span-7) */}
            <div className="lg:col-span-7 text-left">
              
              {/* Official Cohort Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-800 shadow-sm">
                  <Building size={14} className="text-blue-600" />
                  <span>Official Partner Cohort — 2026 Academic Session</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Discover Potential Beyond Marks: CNTS 2026 Founding Edition
              </h1>

              <p className="text-slate-700 text-base md:text-lg mb-3 font-medium leading-relaxed">
                An invitation to Indian school leaders to benchmark student cognitive intelligence beyond traditional academic marks in Classes 5–8.
              </p>

              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                CNTS evaluates core logical reasoning, spatial analysis, and conceptual understanding — delivering section-level diagnostic insights for your teaching faculty at zero setup cost to the school.
              </p>

              {/* Human Reassurance Banner */}
              <div className="flex items-start gap-3 text-xs text-slate-700 bg-slate-100/90 border border-slate-200 p-3.5 rounded-xl mb-6">
                <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-slate-900">Academic Review Note:</strong> Every partnership request is personally reviewed by the CNTS Academic Partnerships Team prior to institutional onboarding.
                </p>
              </div>

              {/* Dual Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <a
                  href="#inquiry-form"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all min-h-[48px]"
                >
                  Request Founding Partner Kit <ArrowRight size={16} />
                </a>
                <a
                  href="#official-documents"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition-all min-h-[48px]"
                >
                  <Download size={16} className="text-slate-600" /> Access Official Documents
                </a>
              </div>

              {/* 3-Step Zero-Load Evaluation Roadmap Timeline */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 mt-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700">Implementation Roadmap</span>
                    <h3 className="text-sm font-display font-bold text-slate-900 mt-0.5">
                      Simple 3-Step Zero-Load Process
                    </h3>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                    Zero Administrative Strain
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 shrink-0">
                      <FileText size={16} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">1. Instant Prospectus</h4>
                    <p className="text-slate-500 text-[10px] leading-tight">Download digital brochure</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 shrink-0">
                      <PhoneCall size={16} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">2. 15-Min Briefing</h4>
                    <p className="text-slate-500 text-[10px] leading-tight">Call with Academic Officer</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 shrink-0">
                      <Rocket size={16} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">3. Zero-Cost Setup</h4>
                    <p className="text-slate-500 text-[10px] leading-tight">Online lab hosting &amp; roll numbers</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (40% Desktop - lg:col-span-5) - Modular Form Component */}
            <div className="lg:col-span-5 w-full relative z-10">
              <InquiryForm />
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: Pedagogical & Compliance Credentials Strip */}
      <section className="bg-slate-100/90 border-b border-slate-200 py-4 px-6">
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
            <ShieldCheck size={16} className="text-blue-600 shrink-0" /> DPDP-Compliant Student Data Handling
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="flex items-center gap-2">
            <LaptopIcon size={16} className="text-blue-600 shrink-0" /> 100% Computer Lab Compatible
          </span>
        </div>
      </section>

      {/* Section 4: Philosophical Hook (Aspirational Section) */}
      <section className="py-16 bg-white border-b border-slate-200 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800 mb-4">
            <Sparkles size={14} className="text-amber-600" /> Pedagogical Philosophy
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-bold text-slate-900 leading-snug mb-6">
            "Every student deserves to be recognized for their potential—not only their marks."
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Traditional examinations primarily measure memory retention under strict time pressure. CNTS evaluates core cognitive reasoning, spatial logic, and conceptual problem-solving in Classes 5–8 — ensuring no student's true academic aptitude remains hidden.
          </p>
        </div>
      </section>

      {/* Section 5: Why Schools Choose CNTS (Outcome-Driven) */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Institutional Outcomes</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-2">
            Designed for Real Educational Impact
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Hosting the CNTS diagnostic provides actionable intelligence for school leadership, department heads, and parents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              Icon: Brain,
              color: "text-blue-600 bg-blue-50 border-blue-100",
              title: "Uncover Hidden Aptitude",
              desc: "Identify bright, analytical minds who may underperform in standard rote tests, unlocking early talent discovery."
            },
            {
              Icon: BarChart3,
              color: "text-emerald-600 bg-emerald-50 border-emerald-100",
              title: "Classroom Diagnostic Heatmaps",
              desc: "Provide teachers with section-wise data highlighting specific conceptual strengths and curriculum gaps."
            },
            {
              Icon: Award,
              color: "text-amber-600 bg-amber-50 border-amber-100",
              title: "Holistic Student Growth",
              desc: "Benchmark analytical reasoning early in Classes 5–8 to prepare candidates for future competitive examinations."
            },
            {
              Icon: ShieldCheck,
              color: "text-indigo-600 bg-indigo-50 border-indigo-100",
              title: "Parent Reassurance",
              desc: "Offer parents an objective, scientific evaluation of their child's core cognitive abilities beyond report cards."
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

      {/* Section 6: A National Initiative (Modular Component) */}
      <NationalMapSection />

      {/* Section 7: Deliverables Showcase (Modular Component) */}
      <DeliverablesShowcase />

      {/* Section 8: 9-Stage Academic Lifecycle Timeline (Modular Component) */}
      <AcademicTimeline />

      {/* Section 9: Official Partnership Documents Vault (Modular Component) */}
      <OfficialDocumentsVault />

      {/* Section 10: Why Schools Can Trust CNTS */}
      <section className="py-16 bg-white border-b border-slate-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Institutional Governance</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-2">
              Why Schools Can Trust CNTS
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-left">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <ShieldCheck size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">DPDP Act Compliant</h3>
              <p className="text-slate-600 text-xs leading-relaxed">No individual student mobile numbers required. Roll numbers are institutionally managed.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <Lock size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Encrypted Testing Labs</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Assessment executes in isolated browser sessions with full session encryption.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <PhoneCall size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Dedicated Support Officer</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Assigned Relationship Officer coordinates lab scheduling and reporting.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <Building size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Registered Entity</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Operated by Courage Library Educational Foundation under official governance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Institutional FAQ Accordion (Modular Component) */}
      <InstitutionalFaq />

      {/* Section 12: Final Briefing & Direct Human Contact */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
            Partner Your Institution with CNTS 2026
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Speak directly with our Academic Partnerships Director or submit an inquiry to receive your institutional kit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a
              href="#inquiry-form"
              className="bg-white text-blue-900 font-bold py-3.5 px-6 rounded-xl text-sm hover:bg-slate-100 transition-colors shadow-md min-h-[48px] flex items-center gap-2"
            >
              Submit Partnership Request <ArrowRight size={16} />
            </a>
            <a
              href="tel:+918360603173"
              className="bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-700 font-semibold py-3.5 px-6 rounded-xl text-sm transition-colors min-h-[48px] flex items-center gap-2"
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
            <h2 className="font-display font-black text-2xl text-slate-900 mb-8 text-center">
              School Insights &amp; Assessment Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initialPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-slate-50 border border-slate-200 rounded-3xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
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
          Request Founding Partner Kit →
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
