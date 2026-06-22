import Link from "next/link";
import { BookOpen } from "lucide-react";
import { BlogPost } from "@/lib/blog";

interface RelatedArticlesProps {
  articles: BlogPost[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 pt-8 mt-12">
      <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
        <BookOpen size={20} className="text-blue-600" />
        Related Articles
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="group block p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-500/30 transition-all shadow-sm hover:shadow-md h-full flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                  {article.category}
                </span>
                <h4 className="font-display font-bold text-slate-950 group-hover:text-blue-600 transition-colors text-sm md:text-base leading-snug">
                  {article.title}
                </h4>
                <p className="text-slate-550 text-xs line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              </div>
              <span className="text-blue-600 text-xs font-semibold group-hover:underline inline-flex items-center gap-1 mt-4">
                Read Article &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
