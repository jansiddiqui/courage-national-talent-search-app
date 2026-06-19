/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, FileText, ArrowLeft, Mail } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    const handleScroll = () => {
      const sections = [
        "introduction",
        "data-we-collect",
        "parent-consent",
        "how-we-use-data",
        "data-security",
        "communication",
        "your-rights",
        "contact-us"
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
    { id: "introduction", label: "1. Introduction" },
    { id: "data-we-collect", label: "2. Data We Collect" },
    { id: "parent-consent", label: "3. Parent/Guardian Consent" },
    { id: "how-we-use-data", label: "4. How We Use Data" },
    { id: "data-security", label: "5. Data Security & Storage" },
    { id: "communication", label: "6. WhatsApp & Email Alerts" },
    { id: "your-rights", label: "7. Your Rights & Access" },
    { id: "contact-us", label: "8. Contact Information" },
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
              <Shield size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Legal Framework</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Last Updated: June 10, 2026. Review how we protect and manage student and parent data for the CNTS 2026 Founding Edition.
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
              <h4 className="font-semibold text-xs uppercase tracking-wider text-blue-300 mb-2">Need Clarification?</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Have questions about our data safety or children protection guidelines?
              </p>
              <a
                href="mailto:support@thecouragelibrary.com"
                className="inline-flex items-center gap-2 text-xs bg-white text-slate-950 font-semibold py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors w-full justify-center shadow-sm"
              >
                <Mail size={13} /> Contact Privacy Desk
              </a>
            </div>
          </div>

          {/* Main Document Content */}
          <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm text-slate-600 text-sm leading-relaxed space-y-10">
            
            {/* 1. Introduction */}
            <section id="introduction" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">1.</span> Introduction
              </h2>
              <p>
                Welcome to the <strong>Courage National Talent Search (CNTS)</strong> ("we", "us", or "our"). We are committed to safeguarding the privacy and security of our users, particularly because our talent discovery assessment serves minor school students in <strong>Classes 5, 6, 7, and 8</strong>.
              </p>
              <p>
                This Privacy Policy outlines how we collect, store, verify, and secure the personal information provided to us by parents or legal guardians during the registration process for the CNTS 2026 Founding Edition. By accessing the platform, submitting a registration, or verifying results, you explicitly consent to the practices described in this document.
              </p>
            </section>

            {/* 2. Data We Collect */}
            <section id="data-we-collect" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">2.</span> Personal Data We Collect
              </h2>
              <p>
                To conduct a national-level diagnostic cognitive assessment and deliver comprehensive talent profile reports, we collect specific, minimal data points necessary for execution.
              </p>
              <div className="grid md:grid-cols-2 gap-4 my-2">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2 text-blue-800">Student Profile Information</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                    <li>Full Name</li>
                    <li>Date of Birth (DOB)</li>
                    <li>Class/Grade level (restricted strictly to Classes 5–8)</li>
                    <li>School Name and City</li>
                    <li>Preferred Exam Language (English/Hindi)</li>
                  </ul>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2 text-emerald-800">Parent/Guardian Contact Details</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                    <li>Parent or Guardian Name</li>
                    <li>Primary WhatsApp Number (used as the primary login and communication channel)</li>
                    <li>Email Address</li>
                    <li>State and District of Residence</li>
                  </ul>
                </div>
              </div>
              <p>
                <strong>Payment Information:</strong> Online registration fees (₹99) are processed securely through our payment partner, Razorpay. CNTS does not store or process card numbers, bank credentials, or UPI PINs on our servers. Razorpay shares transaction IDs, billing status, and basic customer logs to verify checkout completion.
              </p>
            </section>

            {/* 3. Parent/Guardian Consent */}
            <section id="parent-consent" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">3.</span> Parent/Guardian Consent Requirement
              </h2>
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex gap-3 text-amber-900">
                <Shield size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-2">
                  <strong className="block font-semibold">Strict Child Privacy Compliance</strong>
                  <p>
                    Because the participants in the CNTS are minor school children (typically aged 9–14 in Classes 5–8), <strong>we do not permit direct registration by children.</strong> All registration forms must be filled out, approved, and submitted by a parent or legal guardian.
                  </p>
                </div>
              </div>
              <p>
                During registration, the parent or guardian must verify their identity, provide their own contact details (WhatsApp and Email), and actively check the parent consent checkbox. We verify parent consent and authority by requiring secure credentials (CNTS ID and Student Date of Birth, or an Email Magic Link) to access the student's dashboard and download admit cards, practice materials, and talent profile results.
              </p>
            </section>

            {/* 4. How We Use Data */}
            <section id="how-we-use-data" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">4.</span> How We Use Your Information
              </h2>
              <p>
                We process collected data exclusively to support assessment operations and academic metrics:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Enrollment & Verification:</strong> To allocate unique CNTS Registration IDs, assign specific exam modes (Online or physical OMR sheets), and check candidate eligibility.
                </li>
                <li>
                  <strong>Admit Cards & Practice Packs:</strong> To compile and deliver personalized study syllabi, generate student admit cards, and host model mock test questionnaires in parent dashboards.
                </li>
                <li>
                  <strong>Diagnostic Reporting:</strong> To score assessments, compare local achievements, calculate percentiles, and generate detailed student cognitive strength profiles.
                </li>
                <li>
                  <strong>Certificate Issuance:</strong> To issue verifiable achievement and participation certificates displaying student name, school, class, and percentile rankings.
                </li>
              </ul>
            </section>

            {/* 5. Data Security & Storage */}
            <section id="data-security" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">5.</span> Data Security & Storage Architecture
              </h2>
              <p>
                We prioritize secure storage infrastructures to protect sensitive educational records:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Database Infrastructure:</strong> All candidate registrations, exam logs, and payment states are stored in securely configured databases managed by <strong>Supabase</strong>.
                </li>
                <li>
                  <strong>Encryption:</strong> Data transmitted between the user's browser and our servers is encrypted in transit using standard Secure Socket Layer (SSL) certificates. Crucial contact columns are strictly protected.
                </li>
                <li>
                  <strong>Access Controls:</strong> Row-Level Security (RLS) policies are active at the database layer. This ensures that unauthorized public queries cannot pull candidate tables. A parent can only pull data that matches their verified WhatsApp login session.
                </li>
                <li>
                  <strong>Retention Policy & Pledge:</strong> Student data is used solely for assessment administration, result generation, certificate issuance, and communication. CNTS does not sell student data. Student cognitive diagnostic reports, scores, and parent details are retained securely to allow parents to download certificates in the future. Parents may request permanent profile erasure at any time.
                </li>
              </ul>
            </section>

            {/* 6. WhatsApp & Email Alerts */}
            <section id="communication" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">6.</span> WhatsApp and Email Communications
              </h2>
              <p>
                By providing a primary contact number and email address, parents authorize CNTS and Courage Education Pvt. Ltd. to send transaction notifications and academic alerts:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Transaction Alerts:</strong> Immediate billing confirmations, receipt links, and registration successful notifications.
                </li>
                <li>
                  <strong>Operations Alerts:</strong> Notifications when mock study papers are ready, instructions for the assessment day, admit card download warnings, and result announcements.
                </li>
                <li>
                  <strong>Security Verification Links:</strong> Secure login links sent via email to access the parent/candidate dashboard.
                </li>
              </ul>
              <p>
                We do not sell, rent, or lease contact databases to third-party advertisers. You can manage your notification preferences or opt-out of optional newsletters by contacting our support desk.
              </p>
            </section>

            {/* 7. Your Rights & Access */}
            <section id="your-rights" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">7.</span> Your Rights & Access Controls
              </h2>
              <p>
                As a parent or guardian, you maintain full control over your child&apos;s educational records:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Access & Review:</strong> You can log into the secure dashboard at any time to review your child&apos;s registration details, payment receipts, and download talent profiles.
                </li>
                <li>
                  <strong>Rectification:</strong> If you spot a typo in the student's name, school details, class, or language, you can request corrections via our contact dashboard or email.
                </li>
                <li>
                  <strong>Data Erasure:</strong> You have the right to request the permanent deletion of your child&apos;s profile, diagnostic assessment results, and registration records. Please email your request from the parent email address registered on file.
                </li>
              </ul>
            </section>

            {/* 8. Contact Information */}
            <section id="contact-us" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">8.</span> Contact Privacy Desk
              </h2>
              <p>
                For any privacy questions, data correction requests, or consent inquiries, you can contact our dedicated data safety team:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between mt-4">
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-900 text-sm">Courage National Talent Search</div>
                  <div className="text-slate-500">Registered Office: Kanpur, Uttar Pradesh, India</div>
                  <div className="text-slate-500">Contact Desk: support@thecouragelibrary.com</div>
                </div>
                <a
                  href="mailto:support@thecouragelibrary.com"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm shrink-0 text-xs"
                >
                  <Mail size={15} /> Email: support@thecouragelibrary.com
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
