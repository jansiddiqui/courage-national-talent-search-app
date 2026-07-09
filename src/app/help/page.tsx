/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Search, ChevronRight, HelpCircle, BookOpen, AlertCircle, RefreshCw } from "lucide-react";

const helpCategories = [
  { id: "FAQ", label: "Frequently Asked Questions", desc: "Common questions about registration, exams, and results." },
  { id: "GETTING_STARTED", label: "Getting Started", desc: "New candidate orientation, portal setup, and instructions." },
  { id: "REGISTRATION", label: "Registration & Fees", desc: "Eligibility rules, fees, timelines, and confirmations." },
  { id: "PAYMENT", label: "Payments & Invoices", desc: "Payment modes, UPI details, refunds, and failures." },
  { id: "EXAM", label: "Exam Format & mode", desc: "Exam day rules, test modes, and class syllabi." },
  { id: "RESULTS", label: "Results & Percentiles", desc: "Talent profiles, rank metrics, and certificates." }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(false);
    try {
      let url = "/api/support/articles?limit=50";
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="light" />

      {/* Hero Header */}
      <section className="pt-36 pb-12 px-6 text-center bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700 uppercase tracking-wider">
            Help Center
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight">
            How can we <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">help you</span>?
          </h1>
          
          <div className="max-w-md mx-auto pt-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search knowledge base articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-800 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-800/15 focus:border-blue-800 shadow-md text-sm"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar categories */}
        <div className="space-y-2 lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Help Categories</h3>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              selectedCategory === null ? "bg-blue-800 text-white shadow-md shadow-blue-800/10" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
            }`}
          >
            <span>All Categories</span>
            <ChevronRight size={12} />
          </button>
          
          {helpCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                selectedCategory === cat.id ? "bg-blue-800 text-white shadow-md shadow-blue-800/10" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              <span>{cat.label}</span>
              <ChevronRight size={12} />
            </button>
          ))}
        </div>

        {/* Right Articles Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-slate-800 text-lg">
              {selectedCategory ? `${helpCategories.find(c => c.id === selectedCategory)?.label}` : "Latest Knowledge Articles"}
            </h2>
            <button
              onClick={fetchArticles}
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-blue-800 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-150 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-3">
              <AlertCircle size={24} className="text-red-600 mx-auto" />
              <p className="text-red-700 text-sm font-semibold">Failed to retrieve articles.</p>
              <button
                onClick={fetchArticles}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4">
              <BookOpen size={40} className="text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No articles found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No matching articles could be resolved in this folder category. Try searching another keyword.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/help/${art.slug}`}
                  className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded text-[9px] font-bold uppercase tracking-wide">
                      {art.category}
                    </span>
                    <h3 className="font-display font-bold text-slate-800 text-base leading-snug group-hover:text-blue-800 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {art.content.replace(/<[^>]*>/g, "").slice(0, 150)}...
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1.5 text-xs text-blue-800 font-bold group-hover:gap-2.5 transition-all">
                    <span>Read Article</span>
                    <ChevronRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-8 bg-slate-800 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h4 className="font-display font-bold text-base flex items-center justify-center md:justify-start gap-1.5">
                <HelpCircle size={16} className="text-blue-400" />
                Still need support?
              </h4>
              <p className="text-xs text-slate-400 max-w-md">
                If our help center articles could not answer your question, raise a direct support request.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer"
            >
              Raise a Ticket
            </Link>
          </div>

        </div>

      </section>

      <Footer />
    </main>
  );
}
