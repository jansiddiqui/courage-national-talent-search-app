import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Clock, Calendar } from "lucide-react";
import { getLatestBlogPosts } from "@/lib/blog";

export default function LatestArticles() {
  const posts = getLatestBlogPosts(3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700 uppercase tracking-widest">
              <BookOpen size={12} />
              Resources &amp; Insights
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight">
              Latest from Courage Library
            </h2>
            <p className="text-slate-500 text-sm max-w-xl">
              Academic strategies, Olympiad comparisons, and parent guidebooks prepared by leading educators.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
          >
            Browse All Articles
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 bg-slate-100">
                  <Image
                    src={post.featuredImage || "/images/logo.png"}
                    alt={post.title}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold text-white bg-blue-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(post.publishDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readingTime}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base leading-snug line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Read Article
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
