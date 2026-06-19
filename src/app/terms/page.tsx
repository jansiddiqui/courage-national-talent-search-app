/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, FileText, ArrowLeft, AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState("eligibility");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    const handleScroll = () => {
      const sections = [
        "eligibility",
        "registration-fee",
        "exam-schedule",
        "cancellation-fraud",
        "ranking-scoring",
        "user-conduct",
        "limitations",
        "contact-terms"
      ];

      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tocItems = [
    { id: "eligibility", label: "1. Class Eligibility" },
    { id: "registration-fee", label: "2. Registration Fee Policy" },
    { id: "exam-schedule", label: "3. Exam Schedule Changes" },
    { id: "cancellation-fraud", label: "4. Fraudulent Registrations" },
    { id: "ranking-scoring", label: "5. Rankings & Scoring" },
    { id: "user-conduct", label: "6. Platform Code of Conduct" },
    { id: "limitations", label: "7. Liability Limitations" },
    { id: "contact-terms", label: "8. Terms Operations Desk" },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero section */}
      <div className="bg-slate-900 text-white pt-36 pb-16 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_60%)] opacity-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Scale size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Operating Terms</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-3">
            Terms of Use
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Last Updated: June 10, 2026. General terms governing student registration, test participation, scoring guidelines, and platform conduct.
          </p>
        </div>
      </div>

      {/* Main Document Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sticky Table of Contents Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit hidden lg:block">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText size={14} className="text-slate-400" /> Document Outline
              </h3>
              <nav className="space-y-1.5">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left text-xs py-2 px-3 rounded-lg transition-all font-medium flex items-center justify-between ${
                      isHydrated && activeSection === item.id
                        ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600 pl-3"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="mt-5 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/5" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-blue-300 mb-2">Legal Queries?</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Have concerns regarding exam guidelines or partner school clauses?
              </p>
              <a
                href="mailto:support@thecouragelibrary.com"
                className="inline-flex items-center gap-2 text-xs bg-white text-slate-950 font-semibold py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors w-full justify-center shadow-sm"
              >
                <Scale size={13} /> Terms Desk
              </a>
            </div>
          </div>

          {/* Main Document Content */}
          <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm text-slate-600 text-sm leading-relaxed space-y-10">
            
            {/* 1. Class Eligibility */}
            <section id="eligibility" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">1.</span> Student Eligibility
              </h2>
              <p>
                The Courage National Talent Search (CNTS) 2026 Founding Edition is designed specifically for academic evaluations of school-going students. 
              </p>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 my-3 text-xs">
                <strong className="text-blue-900 block font-semibold mb-1">Permissible Grades</strong>
                <p>
                  To register and participate, students must be currently enrolled in school levels matching **Class 5, Class 6, Class 7, or Class 8** for the academic calendar year 2026. Registrations submitted for students outside these grade bounds (e.g., secondary classes or primary preschools) will be flagged and disqualified.
                </p>
              </div>
              <p>
                Candidates must be citizens or residents of India, as our diagnostic comparative ranking system is built around regional, state, and school curriculum structures.
              </p>
            </section>

            {/* 2. Registration Fee Policy */}
            <section id="registration-fee" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">2.</span> Registration Fee Policy
              </h2>
              <p>
                Participation in the CNTS 2026 assessment requires a nominal entry token fee of **₹99 (Ninety-Nine Rupees only)** inclusive of all standard transaction surcharges, unless a validated school sponsorship coupon is applied:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Immediate Resources:</strong> The fee covers immediate access to study mock papers, preparation packs, diagnostic syllabus breakdowns, and administrative database setup.
                </li>
                <li>
                  <strong>Payment Sourcing:</strong> All checkouts must be routed through our secure Razorpay gateway. Cash payments or direct transfers outside the website controls are not permitted.
                </li>
                <li>
                  <strong>Valid Pricing:</strong> We reserve the right to modify prices for promotional campaigns, but once checkout is complete, no additional price adjustments will apply to that registration ID.
                </li>
              </ul>
            </section>

            {/* 3. Exam Schedule Changes */}
            <section id="exam-schedule" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">3.</span> Exam Schedule Adjustments
              </h2>
              <p>
                While the official calendar is set (e.g., Exam Date scheduled for <strong>July 19, 2026</strong>), Courage National Talent Search reserves the absolute right to reschedule, postpone, or adjust the assessment timeline due to:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid gap-3 my-2 text-xs">
                <p><strong>Operational Reasons:</strong> Logistical modifications in physical OMR center distribution, school calendar conflicts, or state mandates.</p>
                <p><strong>Technical Requirements:</strong> Server upgrades, online testing platform maintenance, or unexpected server load handling adjustments.</p>
                <p><strong>Force Majeure:</strong> Natural events, public restrictions, or connectivity issues that impact large candidate groups.</p>
              </div>
              <p>
                Any calendar changes will be published immediately on the public `/announcements` board, and registered parents will receive instant notifications on their registered WhatsApp numbers.
              </p>
            </section>

            {/* 4. Fraudulent Registrations */}
            <section id="cancellation-fraud" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">4.</span> Invalidation of Fraudulent Activities
              </h2>
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex gap-3 text-amber-900">
                <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-2">
                  <strong className="block font-semibold">Strict Verification Clauses</strong>
                  <p>
                    CNTS reserves the absolute right to invalidate, cancel, or suspend any candidate registration, login token, or assessment result if we detect fraudulent activity.
                  </p>
                </div>
              </div>
              <p>
                Fraudulent activity includes, but is not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Providing false date-of-birth records to bypass eligibility grade criteria.</li>
                <li>Exploiting referral links by creating dummy parent contact entries to farm referral milestone badges/certificates.</li>
                <li>Cheating, accessing unauthorized help during online assessments, or impersonation.</li>
                <li>Initiating fraudulent payment chargebacks through payment processors on completed registrations.</li>
              </ul>
            </section>

            {/* 5. Rankings & Scoring */}
            <section id="ranking-scoring" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">5.</span> Rankings, Scoring & Diagnostics
              </h2>
              <p>
                The rankings, percentiles, and diagnostic results generated by the CNTS system are final:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Performance-Based Metrics:</strong> Student rankings, diagnostic profile maps, and school-topper awards are computed strictly from performance on the 80 assessment questions.
                </li>
                <li>
                  <strong>No Bias:</strong> Our evaluation is automated and verified algorithmically. There is no manual grading variation, bias, or subjective marking.
                </li>
                <li>
                  <strong>Diagnostic Intent:</strong> CNTS is designed to highlight cognitive strengths and diagnostic study pathways. Results do not constitute a statement on a child's future academic performance, and should be used constructively.
                </li>
              </ul>
            </section>

            {/* 6. Platform Code of Conduct */}
            <section id="user-conduct" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">6.</span> Platform Code of Conduct
              </h2>
              <p>
                Users of the platform (parents, educators, and candidates) agree to use CNTS assets responsibly:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You may not scrape, frame, or reverse engineer the testing portal, dashboards, or admin gateways.</li>
                <li>You may not share or copy CNTS mock test papers, study resources, or proprietary assessment algorithms without written permission.</li>
                <li>You may not submit offensive, spam, or threatening messages through the support portal or to administrators.</li>
              </ul>
            </section>

            {/* 7. Liability Limitations */}
            <section id="limitations" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">7.</span> Liability Limitations
              </h2>
              <p>
                Under no circumstances shall Courage Education Pvt. Ltd., its directors, employees, or school partners be liable for any indirect, consequential, or incidental damages resulting from:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The student's performance or scores in the talent assessment.</li>
                <li>Technical network dropouts, internet failures, or power issues at the user's side during online test delivery.</li>
                <li>Delays or modifications in declaring rankings or dispatching physical topper kits.</li>
              </ul>
            </section>

            {/* 8. Terms Operations Desk */}
            <section id="contact-terms" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">8.</span> Operations Contact Desk
              </h2>
              <p>
                If you have queries regarding these terms, eligibility verification parameters, or academic partnership guidelines, contact our compliance team:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between mt-4">
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-900 text-sm">Courage National Talent Search</div>
                  <div className="text-slate-500">Registered Office: Kanpur, Uttar Pradesh, India</div>
                  <div className="text-slate-500">Compliance Desk: support@thecouragelibrary.com</div>
                </div>
                <a
                  href="mailto:support@thecouragelibrary.com"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm shrink-0 text-xs"
                >
                  <Scale size={15} /> Email: support@thecouragelibrary.com
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
