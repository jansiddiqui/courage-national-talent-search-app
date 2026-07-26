/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function InstitutionalFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the financial investment required from our school?",
      a: "There is zero cost for schools to partner with CNTS. We provide test hosting, digital infrastructure, student roll numbers, section heatmaps, and certificates at zero cost to your institution."
    },
    {
      q: "What administrative burden does CNTS place on our faculty?",
      a: "None. CNTS assigns a dedicated Relationship Officer who handles computer lab scheduling, roll number generation, and candidate onboarding. Your teachers do not need to grade or invigilate."
    },
    {
      q: "Which student classes are eligible to participate?",
      a: "Students currently enrolled in Classes 5, 6, 7, and 8 across CBSE, ICSE, State, IB, and Cambridge affiliated schools."
    },
    {
      q: "How is student data privacy protected under DPDP Act 2023?",
      a: "Student data is strictly protected. We do not collect individual student mobile numbers or personal contact details. All candidate accounts are linked institutionally through school roll numbers."
    },
    {
      q: "How are the diagnostic reports delivered to our school?",
      a: "School Principals and Department Heads receive secure digital dashboard access to view section heatmaps. Individual student dossiers and merit certificates are generated in printable PDF format."
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 mb-3">
            <HelpCircle size={14} className="text-blue-600" /> Academic Leadership FAQs
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-1">
            Questions school leaders frequently ask
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={faq.q}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 md:p-5 flex items-center justify-between text-left font-display font-bold text-slate-900 text-sm md:text-base cursor-pointer gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 md:px-5 md:pb-5 text-slate-600 text-xs md:text-sm leading-relaxed border-t border-slate-100 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
