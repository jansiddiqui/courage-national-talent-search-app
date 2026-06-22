"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Clock, BookOpen, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/blog";

interface BlogIndexClientProps {
  initialPosts: BlogPost[];
}

export default function BlogIndexClient({ initialPosts }: BlogIndexClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dynamically compute list of categories present in the articles
  const categories = useMemo(() => {
    const cats = new Set(initialPosts.map((post) => post.category));
    return ["All", ...Array.from(cats)];
  }, [initialPosts]);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700 uppercase tracking-widest">
          <BookOpen size={12} />
          Courage Library Hub
        </div>
        <h1 className="font-display font-black text-3xl md:text-5xl text-slate-900 tracking-tight leading-tight">
          Academic Insights &amp; Talent Discovery
        </h1>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Unlock resource guides, Olympiad strategies, parent assessments, and official Courage National Talent Search (CNTS) updates.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 md:p-6 shadow-sm mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <Image
                  src={post.featuredImage || "/images/logo.png"}
                  alt={post.title}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold text-white bg-blue-600 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-slate-400 text-[10px] font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(post.publishDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readingTime}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base md:text-lg leading-snug line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors pt-2 cursor-pointer"
                >
                  Read Full Article
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl max-w-xl mx-auto space-y-4">
          <BookOpen className="mx-auto text-slate-300 w-12 h-12" />
          <h3 className="font-display font-bold text-slate-900 text-lg">No articles found</h3>
          <p className="text-slate-500 text-xs px-6">
            We couldn&apos;t find any articles matching your search query &ldquo;{searchQuery}&rdquo;. Try checking your spelling or selecting another category.
          </p>
        </div>
      )}
    </div>
  );
}
