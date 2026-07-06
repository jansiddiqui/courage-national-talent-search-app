/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HelpCircle, FileText, ArrowLeft, Mail, AlertCircle, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RefundPolicyPage() {
  const [activeSection, setActiveSection] = useState("core-policy");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    const handleScroll = () => {
      const sections = [
        "core-policy",
        "refund-exceptions",
        "technical-issues",
        "processing-timeline",
        "disputes",
        "contact-refund"
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
    { id: "core-policy", label: "1. Core Refund Policy" },
    { id: "refund-exceptions", label: "2. Approved Exceptions" },
    { id: "technical-issues", label: "3. Technical Issues" },
    { id: "processing-timeline", label: "4. Processing Timelines" },
    { id: "disputes", label: "5. Chargebacks & Disputes" },
    { id: "contact-refund", label: "6. Refund Requests Desk" },
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
      <Navbar theme="light" />

      {/* Hero section */}
      <div className="bg-white border-b border-slate-100 text-slate-800 pt-36 pb-16 ">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <RefreshCw size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Transactional Guidelines</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 mb-3">
            Refund & Cancellation Policy
          </h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Last Updated: June 10, 2026. Review rules concerning registration fee cancellations, refund approvals, and transaction resolution.
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
              <h4 className="font-semibold text-xs uppercase tracking-wider text-blue-300 mb-2">Billing Issue?</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Did you experience a double debit or a checkout transaction drop?
              </p>
              <a
                href="mailto:support@thecouragelibrary.com"
                className="inline-flex items-center gap-2 text-xs bg-white text-slate-950 font-semibold py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors w-full justify-center shadow-sm"
              >
                <HelpCircle size={13} /> Support Desk
              </a>
            </div>
          </div>

          {/* Main Document Content */}
          <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm text-slate-600 text-sm leading-relaxed space-y-10">
            
            {/* 1. Core Refund Policy */}
            <section id="core-policy" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">1.</span> Core Refund Policy
              </h2>
              <p>
                At Courage National Talent Search (CNTS), we strive to maintain complete transparency in our billing operations.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-2 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Standard Non-Refundability Clause</strong>
                Registration fees are generally non-refundable because preparation resources, mock assessment papers, diagnostic syllabus guides, and candidate dashboard credentials are made available immediately after the payment checkout process is completed. 
              </div>
              <p>
                By completing a registration for a student, parents acknowledge that the token fee of ₹99 goes directly toward setting up database spaces, allocating secure login tokens, licensing mock practice questionnaires, and handling admin oversight.
              </p>
            </section>

            {/* 2. Approved Exceptions */}
            <section id="refund-exceptions" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">2.</span> Approved Refund Exceptions
              </h2>
              <p>
                While fees are generally non-refundable, CNTS understands that mistakes can happen. We will approve and issue a full refund of the fee under the following specific circumstances:
              </p>
              <div className="grid gap-4 my-2">
                <div className="border border-slate-200 rounded-xl p-4 flex gap-3 bg-white">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <span className="text-xs font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">Duplicate Payments</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      If a parent is accidentally charged twice for the same student registration due to browser lags, repeated checkout clicks, or gateway latency issues. In such cases, one payment will be completely refunded.
                    </p>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 flex gap-3 bg-white">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <span className="text-xs font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">Technical Debit Failure</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      If a technical payment failure occurs where funds are successfully debited from the parent's bank account or UPI application, but the transaction fails to register on our servers, resulting in a cancellation response.
                    </p>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 flex gap-3 bg-white">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <span className="text-xs font-bold">03</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">Missing Registration Entry</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      If the transaction was successfully processed and verified by the merchant gate, but the application failed to generate a CNTS Student Registration ID and candidate profile within 24 hours of payment.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Technical Issues */}
            <section id="technical-issues" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">3.</span> Technical Payment Issues & Double Debits
              </h2>
              <p>
                If your account has been debited but you receive a checkout error screen on the platform:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Wait for Sync:</strong> Banking networks sometimes take up to 30–60 minutes to complete settlement handshakes. In many instances, the system will resolve the sync and issue the registration confirmation details automatically.
                </li>
                <li>
                  <strong>Check Dashboard:</strong> Log in via the `/login` gate with your WhatsApp number to check if your child's profile card has been created.
                </li>
                <li>
                  <strong>Automated Bank Refunds:</strong> If the transaction is declined by Razorpay, the banking system will auto-reverse the debit. These funds usually return to the source account within 2–5 business days.
                </li>
              </ul>
            </section>

            {/* 4. Processing Timelines */}
            <section id="processing-timeline" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">4.</span> Refund Processing Timelines
              </h2>
              <p>
                Once a refund is approved by our billing desk:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Source Account:</strong> Refund transfers are initiated back to the original payment source (e.g., the specific UPI ID, net-banking account, or credit card used during registration).
                </li>
                <li>
                  <strong>Settlement Window:</strong> Settlement timelines depend on the processing speeds of Razorpay and your bank, usually completed within **5 to 7 business days**.
                </li>
                <li>
                  <strong>Receipt logs:</strong> You will receive a transactional confirmation notice via your registered email once the refund transaction has been executed.
                </li>
              </ul>
            </section>

            {/* 5. Disputes */}
            <section id="disputes" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">5.</span> Chargebacks & Disputes
              </h2>
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex gap-3 text-amber-900">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-2">
                  <strong className="block font-semibold">Avoid Immediate Bank Disputes</strong>
                  <p>
                    We encourage parents to contact our support desk at `support@thecouragelibrary.com` before filing chargeback disputes with credit card companies or banks. Resolving billing issues directly with our support desk is faster and avoids account blocks.
                  </p>
                </div>
              </div>
              <p>
                In the event of a disputed chargeback claim on a valid registration, CNTS reserves the right to lock the candidate profile, suspend admit card generation, and invalidate any results.
              </p>
            </section>

            {/* 6. Refund Requests Desk */}
            <section id="contact-refund" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                <span className="text-blue-600">6.</span> Refund Request Submission
              </h2>
              <p>
                To request a refund for double charges or sync issues, email our billing desk. Please write **&quot;Refund Request&quot;** in the subject line and include:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between mt-4">
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-900 text-sm">Required Information:</div>
                  <ul className="list-disc pl-4 text-slate-500">
                    <li>Parent Name & Registered WhatsApp Number</li>
                    <li>Student Name & Class</li>
                    <li>Razorpay Payment ID / Bank Transaction ID</li>
                    <li>Screenshot of transaction debit confirmation</li>
                  </ul>
                </div>
                <a
                  href="mailto:support@thecouragelibrary.com"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm shrink-0 text-xs"
                >
                  <Mail size={15} /> support@thecouragelibrary.com
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
