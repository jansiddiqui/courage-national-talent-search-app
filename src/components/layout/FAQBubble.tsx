"use client";

import { useState } from "react";
import { HelpCircle, X, ChevronDown, MessageSquare } from "lucide-react";

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
    a: "No. A webcam is not required. Candidates attempt the assessment independently from home under self-evaluation rules."
  },
  {
    q: "What is the duration of the exam?",
    a: "The exam is 75 or 90 minutes long (depending on Class category). Candidates can take it from home during their scheduled slot."
  },
  {
    q: "Where can I find preparation guides?",
    a: "Official syllabus checkers, sample guidelines, and practice worksheets are unlocked instantly in the Parent Dashboard after signup."
  },
  {
    q: "How can I receive regular updates?",
    a: "Check the 'Updates' page in your Parent Dashboard regularly for alerts, slot bookings, and preparation materials."
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
      {/* Floating Bubble Button - Premium Brand Blue Glow */}
      <div className="fixed bottom-[88px] md:bottom-8 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
          aria-label="Toggle FAQ Support"
        >
          {isOpen ? <X size={20} className="stroke-[2.5]" /> : <HelpCircle size={22} className="stroke-[2.2]" />}
          
          {/* Animated pulse ring around button */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping pointer-events-none scale-105" />
          )}
        </button>
      </div>

      {/* Slide-out Drawer Panel - Premium SaaS Widget Card */}
      <div
        className={`fixed bottom-[154px] md:bottom-24 right-6 z-40 bg-white rounded-[24px] border border-slate-200 shadow-2xl p-5 w-[340px] max-w-[calc(100vw-48px)] transition-all duration-300 origin-bottom-right ${
          isOpen 
            ? "scale-100 opacity-100 translate-y-0" 
            : "scale-90 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header with Live Status indicator */}
        <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="relative flex w-2 h-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="font-display font-bold text-sm text-slate-800">
              CNTS Assistant & FAQs
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
            aria-label="Close Assistant panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Welcome Greeting Banner (SaaS Chatbot Style) */}
        <div className="mt-3.5 bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
          <p className="text-[11px] text-slate-650 leading-relaxed font-medium">
            👋 <span className="font-bold text-slate-800">Welcome to CNTS!</span> Select a quick question below or reach out to our active helpdesk for support.
          </p>
        </div>

        {/* FAQs Accordion list with synchronized typography sizes */}
        <div className="py-3.5 space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  isExpanded 
                    ? "border-blue-600 bg-blue-50/5 shadow-sm shadow-blue-900/5" 
                    : "border-slate-200 hover:border-blue-100 bg-slate-50/30"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-4 py-3 flex justify-between items-center text-left text-xs font-semibold leading-relaxed transition-all cursor-pointer group"
                >
                  <span className={isExpanded ? "text-blue-900 font-bold" : "text-slate-700 group-hover:text-blue-700"}>
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={14} 
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-blue-600 stroke-[2.5]" : "stroke-[2]"
                    }`} 
                  />
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-[140px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="px-4 pb-4">
                    <div className="h-px bg-slate-100 mb-3" />
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Website Contact Call to Action */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <p className="text-[11px] text-slate-400 font-bold text-center leading-normal">
            Have more questions?
          </p>
          <a
            href="/contact"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10 cursor-pointer"
          >
            <MessageSquare size={14} className="stroke-[2.2]" />
            Write to Support Desk
          </a>
        </div>
      </div>
    </div>
  );
}
