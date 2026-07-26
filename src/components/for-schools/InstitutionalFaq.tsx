"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function InstitutionalFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the financial commitment for hosting CNTS at our school?",
      a: "There is zero cost to the school for institutional registration, computer lab setup, coordinator guidelines, and class diagnostic reports."
    },
    {
      q: "What computer lab specifications are required?",
      a: "Any standard desktop or laptop connected to internet with a modern web browser (Chrome, Firefox, Edge, Safari) is compatible."
    },
    {
      q: "How are student privacy and data protected under the DPDP Act 2023?",
      a: "CNTS does not collect individual student phone numbers or personal address data. Roll numbers and candidate profiles are managed through official school authorization."
    },
    {
      q: "When and how are the diagnostic reports delivered?",
      a: "Digital Class Summaries and Student Talent Profiles are delivered within 10 business days following assessment completion."
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Principal Queries</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 text-left font-display font-bold text-slate-900 text-sm md:text-base focus:outline-none"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} className="text-blue-600 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
              </button>
              {openFaq === idx && (
                <p className="text-slate-600 text-xs md:text-sm mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
