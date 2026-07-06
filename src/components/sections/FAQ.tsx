"use client";

import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";

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
    a: "No. Most Olympiads rank students by memorizing facts from textbooks. CNTS is different — it tests your child's logic, reasoning, and thinking ability. It shows how they solve problems, not just what they remember.",
  },
  {
    q: "In which language is the exam conducted?",
    a: "CNTS is available in both Hindi and English. Students can select their preferred language at the time of registration. All questions are reviewed by bilingual educational experts.",
  },
  {
    q: "How are results communicated?",
    a: "Results are published online within 21 days. You will get a Detailed Brain Strength Report (PDF) directly in your email and Parent Dashboard, showing their national rank, subject-wise logic scores, strength areas, and learning tips.",
  },
  {
    q: "Can my child prepare for CNTS? Is there a syllabus?",
    a: "Yes. CNTS provides a detailed syllabus and an interactive Learning Academy — all free on the platform. The Academy includes bilingual lessons, flashcard drills, and solved examples across Reasoning, Mathematics, Language, and Critical Thinking. The best preparation is understanding reasoning concepts, not memorizing facts.",
  },
  {
    q: "How is this different from other talent searches?",
    a: "Unlike regular exams that only give marks, CNTS gives a Detailed Brain Strength Report. It tests thinking skills in 6 key areas, lets you choose English or Hindi, and gives you clear tips to help your child grow.",
  },
  {
    q: "What if my child's school doesn't participate?",
    a: "Students can register individually — school participation is not required. However, we encourage parents to share the School Partnership page with their principal so the whole school benefits.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-10 md:py-14 lg:py-16 mesh-bg border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/50">
            FAQs
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Questions? We&apos;ve got
            <br />
            <span className="gradient-text">clear answers.</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-md mx-auto">
            Everything parents and students ask before registering.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "border-blue-600 bg-gradient-to-b from-white to-blue-50/5 shadow-md shadow-blue-900/5" 
                    : "border-slate-200/70 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group cursor-pointer"
                >
                  <span
                    className={`font-semibold text-sm sm:text-base leading-snug transition-colors duration-200 ${
                      isOpen ? "text-blue-900" : "text-slate-800 group-hover:text-blue-700"
                    }`}
                  >
                    {faq.q}
                  </span>
                  
                  {/* Rotating Chevron Indicator */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen 
                        ? "bg-blue-600 text-white rotate-180" 
                        : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                    }`}
                  >
                    <ChevronDown size={16} className="stroke-[2.5]" />
                  </div>
                </button>

                {/* Collapsible Answer Pane */}
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="h-px bg-slate-100 mb-4" />
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Customer Success Callout Widget */}
        <div className="mt-12 p-6 md:p-8 bg-slate-50/50 border border-slate-200/80 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm md:text-base">
                Still have questions?
              </h4>
              <p className="text-xs md:text-sm text-slate-500">
                Email our parent support team and we will get back to you within 2 hours.
              </p>
            </div>
          </div>
          <a 
            href="mailto:support@thecouragelibrary.com" 
            className="w-full sm:w-auto text-center border border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 shrink-0"
          >
            support@thecouragelibrary.com
          </a>
        </div>

      </div>
    </section>
  );
}
