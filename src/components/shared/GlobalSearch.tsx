"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X, HelpCircle, GraduationCap, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cntsKnowledgeBase } from "@/lib/cntsKnowledgeBase";

interface SearchItem {
  title: string;
  category: string;
  href: string;
  desc?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compile static search routes list
  const searchScope: SearchItem[] = [
    { title: "Home Page", category: "Pages", href: "/", icon: GraduationCap, desc: "National Talent Search program landing page." },
    { title: "Why CNTS?", category: "Pages", href: "/why-cnts", icon: HelpCircle, desc: "Cognitive diagnostics vs. rote memorization." },
    { title: "About CNTS", category: "Pages", href: "/about", icon: FileText, desc: "Philosophical mission and founders letter." },
    { title: "Timeline & Dates", category: "Pages", href: "/timeline", icon: FileText, desc: "Key pre-exam dates and results calendar." },
    { title: "Prizes & Recognition", category: "Pages", href: "/prizes", icon: TrophyIcon, desc: "Gold medals, trophies, and scholarship certificates." },
    { title: "For Schools", category: "Pages", href: "/for-schools", icon: SchoolIcon, desc: "School partnership registrations and coordinator dashboard." },
    { title: "Parent's Guide", category: "Pages", href: "/parent-guide", icon: ShieldCheck, desc: "Price transparency pledge and onboarding roadmap." },
    { title: "Frequently Asked Questions", category: "Pages", href: "/faq", icon: HelpCircle, desc: "Support Help Center questions directory." },
    { title: "Contact Us", category: "Pages", href: "/contact", icon: FileText, desc: "Support ticket submissions desk." },
    { title: "Register Candidate", category: "Pages", href: "/register", icon: GraduationCap, desc: "Student enrollment wizard form." },
    { title: "Download Admit Card", category: "Pages", href: "/admit-card-portal", icon: FileText, desc: "Candidate test day admit cards portal." },
    { title: "Results Portal", category: "Pages", href: "/results", icon: FileText, desc: "Score reports and cognitive diagnostic mappings." },
    // Academy Pathways
    { title: "Reasoning Pathway", category: "Academy", href: "/academy/reasoning", icon: GraduationCap, desc: "Logic chapter guides, flashcards, and quizzes." },
    { title: "Mathematics Pathway", category: "Academy", href: "/academy/mathematics", icon: GraduationCap, desc: "Applied math logic and equation balancing puzzles." },
    { title: "Language Pathway", category: "Academy", href: "/academy/language", icon: GraduationCap, desc: "Word analogies, syntax logic, and reading comprehensions." },
    { title: "Critical Thinking Pathway", category: "Academy", href: "/academy/critical", icon: GraduationCap, desc: "Syllogisms, cause-effect, and analytical grid matrices." },
    // Policies
    { title: "Privacy Policy", category: "Policies", href: "/privacy", icon: ShieldCheck, desc: "Student data safety commitments." },
    { title: "Terms of Use", category: "Policies", href: "/terms", icon: ShieldCheck, desc: "Candidate rules and portal behavior parameters." },
    { title: "Refund Policy", category: "Policies", href: "/refund", icon: ShieldCheck, desc: "24-hour refund pledge parameters." },
    { title: "Data Deletion Request", category: "Policies", href: "/data-deletion", icon: ShieldCheck, desc: "Request cleanup of registration records." },
  ];

  // Map Lucide icons locally to satisfy compile checks
  function TrophyIcon(props: any) { return <span className="font-bold text-xs select-none">🏆</span>; }
  function SchoolIcon(props: any) { return <span className="font-bold text-xs select-none">🏫</span>; }

  // Append all FAQ items from local FAQ knowledge base dynamically
  const parsedFaqs: SearchItem[] = cntsKnowledgeBase.map(faq => ({
    title: faq.question,
    category: "FAQs",
    href: `/faq?search=${encodeURIComponent(faq.question)}`,
    desc: faq.answer.slice(0, 100) + "...",
    icon: HelpCircle
  }));

  const allItems = [...searchScope, ...parsedFaqs];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Click outside to close helper
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("mousedown", clickOutside);
    }
    return () => window.removeEventListener("mousedown", clickOutside);
  }, [isOpen, onClose]);

  // Escape key to close helper
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const filteredItems = query.trim().length === 0
    ? searchScope.slice(0, 5) // Suggest default links
    : allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        (item.desc && item.desc.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 7);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4 select-none">
      <div 
        ref={containerRef}
        className="w-full max-w-xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col"
      >
        {/* Search header input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, FAQs, Academy pathways..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-medium border-0 focus:outline-none focus:ring-0"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-650 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Results layout */}
        <div className="max-h-[360px] overflow-y-auto p-2 space-y-0.5">
          <div className="px-2 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {query.trim().length === 0 ? "Suggested Searches" : `Results (${filteredItems.length})`}
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-semibold">
              No matching results found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left w-full"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-100/50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                      <Icon size={14} className="stroke-[2.2]" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="font-bold text-slate-800 text-[13px] group-hover:text-blue-750 transition-colors truncate">
                        {item.title}
                      </div>
                      {item.desc && (
                        <p className="text-[10.5px] text-slate-400 font-medium truncate max-w-sm sm:max-w-md">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-800 px-2 py-0.5 rounded-md border border-slate-200/40 shrink-0 mt-1">
                    {item.category}
                  </span>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex justify-between text-[10px] text-slate-400 font-medium">
          <span>esc to close</span>
          <span className="flex items-center gap-1 font-bold text-blue-700">
            Search faq directory <ArrowRight size={10} />
          </span>
        </div>
      </div>
    </div>
  );
}
