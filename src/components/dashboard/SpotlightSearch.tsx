"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, User, ArrowRight, FileText, HelpCircle, LifeBuoy } from "lucide-react";
import { useRouter } from "next/navigation";

interface Candidate {
  id: string;
  student_name: string;
  registration_id: string;
  student_class: string;
}

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  setActiveCandidate: (candidate: any) => void;
  activeCandidateId?: string;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "pages" | "candidates" | "help";
  action: () => void;
  icon: React.ComponentType<any>;
}

export default function SpotlightSearch({
  isOpen,
  onClose,
  candidates,
  setActiveCandidate,
  activeCandidateId,
}: SpotlightSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle Escape key, arrows, and Enter selection
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, query, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build the search space list
  const pages: Omit<SearchItem, "action">[] = [
    { id: "p-home", title: "Home Dashboard", subtitle: "Go to your parent account overview", category: "pages", icon: FileText },
    { id: "p-children", title: "My Children / Candidates", subtitle: "Manage registered student details", category: "pages", icon: FileText },
    { id: "p-register", title: "Register New Student", subtitle: "Enroll another child in CNTS 2026", category: "pages", icon: FileText },
    { id: "p-timeline", title: "Exam Timeline", subtitle: "Track key dates, schedules, and reminders", category: "pages", icon: FileText },
    { id: "p-payments", title: "Payment History", subtitle: "View transactions and download fee receipts", category: "pages", icon: FileText },
    { id: "p-support", title: "Help & Support Tickets", subtitle: "Submit tickets or check response status", category: "pages", icon: FileText },
    { id: "p-profile", title: "Parent Profile", subtitle: "Edit your name, phone, and contact details", category: "pages", icon: FileText },
    { id: "p-security", title: "Security Settings", subtitle: "Manage 2FA authentication and credentials", category: "pages", icon: FileText },
  ];

  const helpArticles: Omit<SearchItem, "action">[] = [
    { id: "h-admit", title: "How to download Admit Card?", subtitle: "Admit cards are available in Documents tab", category: "help", icon: HelpCircle },
    { id: "h-syllabus", title: "Exam Syllabus & Mock Papers", subtitle: "Browse practice modules inside Learning Academy", category: "help", icon: HelpCircle },
    { id: "h-timeline", title: "Founding Edition Schedule", subtitle: "View complete activity milestones", category: "help", icon: HelpCircle },
    { id: "h-faq", title: "Frequently Asked Questions", subtitle: "Answers about test guidelines and rules", category: "help", icon: HelpCircle },
  ];

  // Map candidates to search items
  const candidateItems: SearchItem[] = candidates.map((c) => ({
    id: `c-${c.id}`,
    title: c.student_name,
    subtitle: `Class ${c.student_class} • ID: ${c.registration_id}${activeCandidateId === c.id ? " (Currently Active)" : ""}`,
    category: "candidates",
    icon: User,
    action: () => {
      setActiveCandidate(c);
      onClose();
    },
  }));

  // Map pages with route actions
  const pageItems: SearchItem[] = pages.map((p) => {
    let path = "/dashboard";
    if (p.id === "p-children") path = "/dashboard/children";
    if (p.id === "p-register") path = "/register?action=new";
    if (p.id === "p-timeline") path = "/dashboard/timeline";
    if (p.id === "p-payments") path = "/dashboard/payments";
    if (p.id === "p-support") path = "/dashboard/support";
    if (p.id === "p-profile") path = "/dashboard/profile";
    if (p.id === "p-security") path = "/dashboard/security";

    return {
      ...p,
      action: () => {
        router.push(path);
        onClose();
      },
    };
  });

  // Map help articles with appropriate routes
  const helpItems: SearchItem[] = helpArticles.map((h) => {
    let path = "/dashboard";
    if (h.id === "h-admit") path = "/admit-card-portal";
    if (h.id === "h-syllabus") path = "/academy";
    if (h.id === "h-timeline") path = "/timeline";
    if (h.id === "h-faq") path = "/faq";

    return {
      ...h,
      action: () => {
        router.push(path);
        onClose();
      },
    };
  });

  // Combine items
  const allItems = [...candidateItems, ...pageItems, ...helpItems];

  // Filter based on search input query
  const filteredItems = allItems.filter((item) => {
    const term = query.toLowerCase().trim();
    if (!term) return item.category !== "help"; // Show candidates and pages by default
    return (
      item.title.toLowerCase().includes(term) ||
      item.subtitle.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  });

  // Highlight matches text helper
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-100 text-yellow-900 rounded px-0.5 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Group filtered items by category
  const grouped: Record<string, SearchItem[]> = {
    candidates: [],
    pages: [],
    help: [],
  };

  filteredItems.forEach((item) => {
    grouped[item.category].push(item);
  });

  // Linear index helper to map selection to grouped items
  let itemCounter = 0;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-start justify-center pt-20 px-4">
      <div
        ref={containerRef}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-slideUp flex flex-col max-h-[70vh]"
      >
        {/* Search header input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
          <Search size={18} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search candidate name, CNTS ID, or page..."
            className="flex-1 outline-none text-sm text-slate-800 placeholder-slate-400 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search body list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <LifeBuoy className="text-slate-300 animate-spin duration-[4000ms]" size={36} />
              <p className="text-sm font-semibold text-slate-700">No results found</p>
              <p className="text-xs text-slate-400 max-w-[250px]">
                We couldn't find anything matching "{query}". Try checking your spelling.
              </p>
            </div>
          ) : (
            <>
              {Object.entries(grouped).map(([category, items]) => {
                if (items.length === 0) return null;

                const categoryLabel =
                  category === "candidates"
                    ? "Active Candidates"
                    : category === "pages"
                    ? "Navigation Pages"
                    : "Help Resources";

                return (
                  <div key={category} className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                      {categoryLabel}
                    </h4>
                    <div className="space-y-0.5">
                      {items.map((item) => {
                        const currentIndex = itemCounter;
                        itemCounter++;

                        const ItemIcon = item.icon;
                        const isSelected = selectedIndex === currentIndex;

                        return (
                          <button
                            key={item.id}
                            onClick={item.action}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                              isSelected
                                ? "bg-blue-50/80 text-blue-900 border-l-4 border-blue-800 pl-2 shadow-sm"
                                : "text-slate-700 hover:bg-slate-50 border-l-4 border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? "bg-blue-800 text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                <ItemIcon size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate">
                                  {highlightMatch(item.title, query)}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {highlightMatch(item.subtitle, query)}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <ArrowRight size={14} className="text-blue-800 shrink-0 animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Search footer */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-[10px] font-medium text-slate-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="bg-white border border-slate-200 rounded px-1 text-[9px] shadow-sm">↑</kbd>{" "}
              <kbd className="bg-white border border-slate-200 rounded px-1 text-[9px] shadow-sm">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="bg-white border border-slate-200 rounded px-1 text-[9px] shadow-sm">Enter</kbd> to select
            </span>
          </div>
          <span>
            <kbd className="bg-white border border-slate-200 rounded px-1 text-[9px] shadow-sm">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
