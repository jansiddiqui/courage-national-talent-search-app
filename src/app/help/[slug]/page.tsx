/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, use } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";

export default function HelpArticleDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params);
  const [article, setArticle] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Feedback states
  const [voted, setVoted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const fetchArticle = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/support/articles/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data.article);
        setRelated(data.related || []);
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
    fetchArticle();
  }, [slug]);

  const handleFeedback = async (helpful: boolean) => {
    setFeedbackLoading(true);
    try {
      const res = await fetch(`/api/support/articles/${slug}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ helpful })
      });
      if (res.ok) {
        setVoted(true);
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="light" />

      <section className="pt-32 pb-16 max-w-4xl mx-auto px-6 space-y-6 animate-slide-up">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/help" className="hover:text-blue-800 flex items-center gap-1">
            <ArrowLeft size={12} />
            <span>Help Center</span>
          </Link>
          <ChevronRight size={10} />
          <span className="uppercase">{article?.category || "Article"}</span>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 space-y-6 animate-pulse">
            <div className="h-6 bg-slate-150 rounded w-2/3"></div>
            <div className="h-4 bg-slate-100 rounded w-1/4"></div>
            <div className="space-y-3 pt-6 border-t border-slate-50">
              <div className="h-3 bg-slate-100 rounded w-full"></div>
              <div className="h-3 bg-slate-100 rounded w-5/6"></div>
              <div className="h-3 bg-slate-100 rounded w-full"></div>
            </div>
          </div>
        ) : error || !article ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Article not found</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't resolve the article you requested. It might have been draft archived or deleted.
            </p>
            <Link href="/help" className="inline-block px-4 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors">
              Return to Help Directory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Article Content Area */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded text-[9px] font-bold uppercase tracking-wide">
                  {article.category}
                </span>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 leading-tight mt-2">
                  {article.title}
                </h1>
                <p className="text-[10px] font-medium text-slate-400 mt-1.5">
                  Last Updated: {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Body rendering */}
              <div className="border-t border-slate-50 pt-6 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {article.content}
              </div>

              {/* Helpfulness Feedback card */}
              <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl">
                <span className="text-xs font-bold text-slate-600">Was this article helpful?</span>
                
                {voted ? (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 animate-slide-up">
                    <CheckCircle size={14} /> Thank you for your feedback!
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFeedback(true)}
                      disabled={feedbackLoading}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:border-emerald-300 text-xs font-semibold rounded-xl text-slate-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <ThumbsUp size={12} className="text-slate-400" />
                      Yes
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      disabled={feedbackLoading}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:border-rose-300 text-xs font-semibold rounded-xl text-slate-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <ThumbsDown size={12} className="text-slate-400" />
                      No
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar Related articles */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Related Articles</h3>
                
                <div className="space-y-3.5">
                  {related.length === 0 ? (
                    <p className="text-xs text-slate-400">No related articles in this folder category.</p>
                  ) : (
                    related.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={`/help/${rel.slug}`}
                        className="block group"
                      >
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-800 leading-snug transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase">{rel.category}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Direct Support Box */}
              <div className="bg-blue-800 text-white rounded-3xl p-6 shadow-md space-y-4">
                <h3 className="font-display font-bold text-base">Still need help?</h3>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Raise a ticket and one of our dedicated support agents will resolve your query in 24 hours.
                </p>
                <Link
                  href="/contact"
                  className="block text-center px-4 py-2 bg-white hover:bg-blue-50 text-blue-800 text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  Contact Support
                </Link>
              </div>
            </div>

          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
