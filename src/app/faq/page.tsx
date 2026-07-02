"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, ChevronRight, HelpCircle, Phone, Mail, MessageSquare, Sparkles } from "lucide-react";
import { TIMELINE_LABELS } from "@/config/timeline";

interface FAQItem {
  q: string;
  a: string;
  category: "eligibility" | "exam" | "registration" | "results" | "support";
}

const faqCategories = [
  { id: "all", label: "All Questions" },
  { id: "eligibility", label: "Eligibility & Basics" },
  { id: "exam", label: "Exam Format & Mode" },
  { id: "registration", label: "Registration & Fees" },
  { id: "results", label: "Results & Credentials" },
  { id: "support", label: "Support & Preparation" },
];

const faqs: FAQItem[] = [
  // Eligibility & Basics
  {
    category: "eligibility",
    q: "Who can appear for CNTS?",
    a: "Students currently enrolled in Classes 5, 6, 7, or 8 from any recognized school board in India (CBSE, ICSE, State Boards, or International Boards) are eligible to register.",
  },
  {
    category: "eligibility",
    q: "Can home-schooled or private candidates register?",
    a: "Yes. Home-schooled students and private candidates in Classes 5-8 are welcome to participate. Select 'Home School' or 'Private' in the school field during registration.",
  },
  {
    category: "eligibility",
    q: "What are the age limits for participation?",
    a: "The exam is designed for students between ages 8 and 16. To match Classes 5-8, the eligible student birth years must fall between 2010 and 2018.",
  },
  {
    category: "eligibility",
    q: "Does my child's school have to be registered for them to participate?",
    a: "No. Individual registrations are fully supported. Students can register directly with their parents' consent, and their results, mock tests, and talent profiles will be issued directly to their parent contact.",
  },
  {
    category: "eligibility",
    q: "Can Class 4 or Class 9 students participate?",
    a: "No. The Founding Edition of CNTS 2026 is strictly designed and standardized for Classes 5, 6, 7, and 8. The cognitive logic benchmarks are mapped only to these age groups.",
  },
  {
    category: "eligibility",
    q: "Is there any geographical restriction within India?",
    a: "No. Students from all Indian States and Union Territories are eligible. The online exam can be attempted from any city, town, or village with internet access.",
  },
  // Exam Format & Mode
  {
    category: "exam",
    q: "In which languages is the exam conducted?",
    a: "CNTS is available in both English and Hindi. Parents can select the preferred language during the registration process. All questions are reviewed for vocabulary compatibility by bilingual educational experts.",
  },
  {
    category: "exam",
    q: "Can we change the preferred exam language after registration?",
    a: "Yes. You can change your preferred language up to 5 days before the exam date by contacting our support team at support@thecouragelibrary.com with your CNTS Registration ID.",
  },
  {
    category: "exam",
    q: "What is the mode of the exam? Is it online or offline?",
    a: "Both modes are supported. Students can take the online exam from home using any computer, tablet, or smartphone (no webcam required), or partner schools can organize on-campus assessments.",
  },
  {
    category: "exam",
    q: "What are the system requirements for the online exam?",
    a: "A stable internet connection (minimum 2 Mbps), any laptop, desktop, tablet, or smartphone, and a modern web browser like Google Chrome, Safari, or Firefox (no webcam or microphone permission is required).",
  },
  {
    category: "exam",
    q: "What are the integrity guidelines for the online exam?",
    a: "Candidates are encouraged to attempt the assessment independently without external assistance. The assessment is designed primarily for honest self-evaluation, cognitive diagnostics, and identifying growth areas.",
  },
  {
    category: "exam",
    q: "How many questions are in the exam, and what is the duration?",
    a: "The exam consists of 60 multiple-choice questions (MCQs) to be answered in 120 minutes (2 hours). The questions are divided into Reasoning, Math Logic, Language, and Science Application.",
  },
  {
    category: "exam",
    q: "Is there any negative marking in CNTS 2026?",
    a: "No. There is no negative marking for incorrect answers. We encourage students to attempt all questions and apply logical estimation where unsure.",
  },
  {
    category: "exam",
    q: "What happens if the internet disconnects during the online exam?",
    a: "Our testing engine auto-saves answers locally every 15 seconds. If disconnected, log back in within 15 minutes on the same device to resume the exam exactly where you left off.",
  },
  // Registration & Fees
  {
    category: "registration",
    q: "What is the registration fee, and what does it cover?",
    a: "The CNTS registration fee is ₹99 per student. The fee includes the mock diagnostic exam, the final CNTS assessment, the full multi-dimensional Talent Profile report, and a verifiable digital certificate.",
  },
  {
    category: "registration",
    q: "Are there any group discounts for bulk registrations?",
    a: "Yes. Partner schools registering 50+ students receive custom packages and teacher coordinator credits. Schools can contact support to get a bulk upload excel format.",
  },
  {
    category: "registration",
    q: "Can I refund the registration fee if my child cannot attend?",
    a: "The registration fee is non-refundable. However, if a child misses the live exam, they can still access the practice materials and mock assessments on the portal for study.",
  },
  {
    category: "registration",
    q: "How do I verify if our registration was successful?",
    a: "After successful registration, a unique CNTS Registration ID (e.g., CNTS26-XXXXX) is generated. A confirmation message and receipt are immediately sent to your registered WhatsApp number and email.",
  },
  {
    category: "registration",
    q: "Can I register multiple children under a single parent account?",
    a: "Yes. Parents can register up to 3 children under the same mobile number. A separate registration must be submitted for each child to generate unique roll numbers.",
  },
  {
    category: "registration",
    q: "Does the ₹99 fee include GST and taxes?",
    a: "Yes, the ₹99 fee is all-inclusive of GST, transaction gateway fees, and access to all printable prep materials.",
  },
  {
    category: "registration",
    q: "What payment methods are supported on checkout?",
    a: "We support secure payments via UPI (GPay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards, and Net Banking through our RBI-compliant payment gateway.",
  },
  // Results & Credentials
  {
    category: "results",
    q: "When and how will the results be announced?",
    a: `The national rankings will be published on ${TIMELINE_LABELS.RESULTS_DATE}. Detailed Talent Profile reports and digital certificates will be released in the parent portal on ${TIMELINE_LABELS.TALENT_PROFILE_DATE} and ${TIMELINE_LABELS.CERTIFICATE_DATE} respectively.`,
  },
  {
    category: "results",
    q: "What is the Talent Profile Report, and how is it different from a school scorecard?",
    a: "A school report card shows what was memorized in a subject. The CNTS Talent Profile maps cognitive strengths across 6 core domains (logical, spatial, mathematical, verbal reasoning, etc.) and profiles the student's unique learning style.",
  },
  {
    category: "results",
    q: "How are national rankings calculated?",
    a: "Students are evaluated within their specific classes. Ranks are determined by class percentile scores. Separate rankings (podiums) are maintained for the Junior (Classes 5-6) and Senior (Classes 7-8) divisions.",
  },
  {
    category: "results",
    q: "Are the certificates verifiable?",
    a: "Yes. Every certificate features a secure cryptographic QR code. Scanning the QR code displays the student's verified name, class, percentile standing, and validity status on the CNTS official registry.",
  },
  {
    category: "results",
    q: "Will my child receive a physical certificate and medal?",
    a: "Yes, all national toppers and high percentile achievers (top 10% in each class) receive physical gold/silver/bronze medals, printed certificates of excellence, and study scholarships via post.",
  },
  {
    category: "results",
    q: "How long will the certificates remain verifiable online?",
    a: "The verification gateway for CNTS 2026 credentials is permanent and will remain hosted on the registry server for future admissions audits.",
  },
  // Support & Preparation
  {
    category: "support",
    q: "Is there a syllabus or study material provided?",
    a: "Yes. After registering, parents can download sample question papers configured for their child's class directly from the success screen. Full study syllabus outlines are available on the portal.",
  },
  {
    category: "support",
    q: "How do we access mock tests before the actual assessment?",
    a: "A mock practice portal link will be sent to the parent's registered WhatsApp number and email 7 days before the exam date. It helps students familiarize themselves with the testing environment.",
  },
  {
    category: "support",
    q: "How do I contact CNTS support for registration or technical issues?",
    a: "You can reach our support team via email at support@thecouragelibrary.com or call our support line. All queries are resolved within 24 hours.",
  },
  {
    category: "support",
    q: "What should I do if my child's name is misspelled on the admit card?",
    a: "Log in to your Parent Dashboard, open the registration details drawer, and submit a correction request, or email us at support@thecouragelibrary.com. Corrections take 24-48 hours to update.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Filter FAQs based on active category and search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="dark" />

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <Sparkles size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Information Hub
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Frequently Asked <span className="text-blue-400">Questions</span>.
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Everything you need to know about the CNTS 2026 registration, exam format, syllabus, results process, and support.
          </p>

          {/* Instant Search Bar */}
          <div className="max-w-md mx-auto pt-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs (e.g., fee, language, OMR)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-800 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-800/15 focus:border-blue-850 shadow-lg text-sm"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left: Category Navigation (Desktop Sidebar / Mobile Tabs) */}
          <div className="w-full lg:w-64 shrink-0 space-y-2">
            {/* Desktop vertical sidebar */}
            <div className="hidden lg:block space-y-1 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
              <span className="block px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Categories
              </span>
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setExpandedIndex(null);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-blue-800 text-white shadow-md shadow-blue-800/10"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {cat.label}
                  <ChevronRight size={12} className={activeCategory === cat.id ? "text-white" : "text-slate-400"} />
                </button>
              ))}
            </div>

            {/* Mobile horizontal pill scroll */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 scrollbar-none max-w-full">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setExpandedIndex(null);
                  }}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                    activeCategory === cat.id
                      ? "bg-blue-800 text-white border-blue-850"
                      : "bg-white text-slate-600 border-slate-100 hover:border-slate-250"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Interactive Accordion List */}
          <div className="flex-1 w-full space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = expandedIndex === index;
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-blue-200 shadow-md shadow-blue-50"
                        : "border-slate-100 hover:border-blue-100"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedIndex(isOpen ? null : index)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group cursor-pointer"
                    >
                      <span
                        className={`font-semibold text-sm md:text-base leading-snug transition-colors ${
                          isOpen ? "text-blue-800" : "text-slate-800 group-hover:text-blue-800"
                        }`}
                      >
                        {faq.q}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                          isOpen ? "bg-blue-100 text-blue-750 rotate-90" : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        <ChevronRight size={14} className="stroke-[2.5]" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <div className="h-px bg-slate-100 mb-4" />
                        <p className="text-slate-500 leading-relaxed text-xs md:text-sm">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
                <HelpCircle size={40} className="text-slate-300 mx-auto" />
                <h3 className="font-display font-bold text-slate-800 text-base">No matching questions found</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Try adjusting your keywords or search for general terms like &quot;fee&quot;, &quot;OMR&quot;, or &quot;results&quot;.
                </p>
              </div>
            )}

            {/* Support Hotline card */}
            <div className="mt-8 bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <h4 className="font-display font-bold text-slate-900 text-base flex items-center justify-center md:justify-start gap-1.5">
                  <MessageSquare size={16} className="text-blue-800" />
                  Still have questions?
                </h4>
                <p className="text-xs text-slate-500">
                  Our parent helpline is operational from 9:00 AM to 6:00 PM, Monday to Saturday.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="mailto:support@thecouragelibrary.com"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-800 border border-blue-800 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-800/10"
                >
                  <Mail size={12} />
                  support@thecouragelibrary.com
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
