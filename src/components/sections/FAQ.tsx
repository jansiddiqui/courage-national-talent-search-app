"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Who can appear for CNTS?",
    a: "Students currently enrolled in Classes 5, 6, 7, or 8 from any recognized school board in India — CBSE, ICSE, or State Board — are eligible to register.",
  },
  {
    q: "What is the registration fee?",
    a: "The registration fee is ₹99 per student. The fee includes the exam, full Talent Profile report, and a participation certificate.",
  },
  {
    q: "Is CNTS an Olympiad?",
    a: "No. CNTS is a Talent Discovery Platform, not an Olympiad. Olympiads rank students by marks in a subject. CNTS builds a multi-dimensional profile of cognitive strengths, reasoning ability, and intellectual aptitude — revealing who the student is, not just what they memorized.",
  },
  {
    q: "In which language is the exam conducted?",
    a: "CNTS is available in both Hindi and English. Students can select their preferred language at the time of registration. All questions are reviewed by bilingual educational experts.",
  },
  {
    q: "How are results communicated?",
    a: "Results are published within 21 days of the exam. Parents receive a detailed PDF Talent Profile report via email, including national rank, percentile, domain-wise scores, strength areas, and a counselor-written guidance note.",
  },
  {
    q: "Can my child prepare for CNTS? Is there a syllabus?",
    a: "Yes. CNTS releases a detailed syllabus, 5 sample papers, and video guidance — all free on the platform. The best preparation is understanding reasoning concepts, not memorizing facts.",
  },
  {
    q: "How is this different from other talent searches?",
    a: "CNTS is the only talent search in India that produces a verified, shareable Talent Profile — not just a score or rank. It covers cognitive ability across 6 domains, offers bilingual testing, and provides a counseling report that parents can actually act on.",
  },
  {
    q: "What if my child's school doesn't participate?",
    a: "Students can register individually — school participation is not required. However, we encourage parents to share the School Partnership page with their principal so the whole school benefits.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 mesh-bg">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full">
            FAQs
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            Questions? We&apos;ve got
            <br />
            <span className="gradient-text">clear answers.</span>
          </h2>
          <p className="text-lg text-slate-500">
            Everything parents and students ask before registering.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-blue-200 shadow-md shadow-blue-50" : "border-slate-100 hover:border-blue-100"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-7 py-5 flex items-center justify-between gap-4 group"
                >
                  <span
                    className={`font-semibold text-base leading-snug transition-colors ${
                      isOpen ? "text-blue-800" : "text-slate-800 group-hover:text-blue-800"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isOpen ? "bg-blue-100 text-blue-700 rotate-0" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-7 pb-6">
                    <div className="h-px bg-blue-50 mb-4" />
                    <p className="text-slate-500 leading-relaxed text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact */}
        <div className="mt-10 text-center p-6 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-600 text-sm">
            Still have questions?{" "}
            <a href="mailto:support@thecouragelibrary.com" className="text-blue-700 font-semibold hover:underline">
              support@thecouragelibrary.com
            </a>{" "}
            ·{" "}
            <a href="tel:+911800000000" className="text-blue-700 font-semibold hover:underline">
              1800-XXX-XXXX
            </a>{" "}
            (Toll Free)
          </p>
        </div>
      </div>
    </section>
  );
}
