"use client";

import { useState } from "react";
import { HelpCircle, X, ChevronDown, MessageSquare, Sparkles } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: "Is the ₹99 fee refundable?",
    a: "Yes, we offer a 100% refund if requested within 24 hours of registration, no questions asked."
  },
  {
    q: "Does the exam require a webcam?",
    a: "No. A webcam is not required for the Founding Edition. Candidates are encouraged to attempt the assessment independently for an honest cognitive profile."
  },
  {
    q: "What is the duration of the exam?",
    a: "The exam is 90 minutes long. Candidates can take it from home during their scheduled slot."
  },
  {
    q: "Where can I find preparation guides?",
    a: "Official syllabus checkers, sample guidelines, and practice papers are unlocked instantly in the Parent Dashboard after sign up."
  },
  {
    q: "How can I receive regular updates?",
    a: "Join our official WhatsApp Channel for alerts, syllabus files, and daily quiz reminders."
  }
];

export default function FAQBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="no-print">
      {/* Floating Bubble Button */}
      <div 
        className="fixed bottom-[88px] md:bottom-8 right-6 z-40"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
          aria-label="Toggle FAQ Support"
        >
          {isOpen ? <X size={20} /> : <HelpCircle size={22} />}
          
          {/* Animated pulse ring around button */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full border border-slate-900/40 animate-ping pointer-events-none scale-110" />
          )}
        </button>
      </div>

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed bottom-[154px] md:bottom-24 right-6 z-40 bg-white rounded-3xl border border-slate-150 shadow-2xl p-5 w-[340px] max-w-[calc(100vw-48px)] transition-all duration-300 origin-bottom-right ${
          isOpen 
            ? "scale-100 opacity-100 translate-y-0" 
            : "scale-90 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-blue-800" />
            <span className="font-display font-bold text-xs text-slate-800">
              CNTS Assistant & FAQs
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* FAQs Accordion */}
        <div className="py-3 space-y-2 max-h-[260px] overflow-y-auto scrollbar-thin">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-100 rounded-xl overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-4 py-3 flex justify-between items-center text-left text-[11px] font-bold text-slate-755 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={12} 
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-185 text-blue-800" : ""
                    }`} 
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? "max-h-[100px] border-t border-slate-100" : "max-h-0"
                  }`}
                >
                  <p className="p-4 text-[10px] text-slate-500 leading-relaxed font-medium bg-white">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Channel Call to Action */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <p className="text-[10px] text-slate-400 font-semibold text-center leading-normal">
            Have more questions? Join our official community channel for direct updates.
          </p>
          <a
            href="https://whatsapp.com/channel/0029Vb8NYaiEquiRSLwDD338"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            <MessageSquare size={13} />
            Join Official WhatsApp Channel
          </a>
        </div>
      </div>
    </div>
  );
}
