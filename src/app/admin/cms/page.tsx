"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Plus, Settings, Eye, CheckCircle, ShieldAlert, Save, FileText, Globe } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  version: number;
  published: boolean;
  created_at: string;
}

export default function CmsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  // Editor states
  const [showEditor, setShowEditor] = useState(false);
  const [articleId, setArticleId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("FAQ");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchArticles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cms");
      if (!res.ok) throw new Error("Failed to load articles");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err: any) {
      setError(err.message || "Failed to load CMS articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId || undefined,
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          category,
          content: content.trim(),
          published
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Article saved successfully!");
        setShowEditor(false);
        setArticleId("");
        setTitle("");
        setSlug("");
        setContent("");
        fetchArticles();
      } else {
        showToast(data.message || "Failed to save article.");
      }
    } catch (err: any) {
      showToast(err.message || "Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-800" />
            CMS Editor Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage FAQs, knowledgebase articles, and announcement posts.</p>
        </div>
        <button
          onClick={() => {
            setArticleId("");
            setTitle("");
            setSlug("");
            setCategory("FAQ");
            setContent("");
            setPublished(true);
            setShowEditor(true);
          }}
          className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          New Article
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-800 border border-blue-700 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <CheckCircle size={14} />
          {toast}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-sm text-red-700">
          <ShieldAlert size={16} />
          {error}
        </div>
      )}

      {showEditor ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto space-y-6">
          <h2 className="text-lg font-bold text-slate-800">{articleId ? "Edit Article" : "Create Article"}</h2>
          <form onSubmit={handleSaveArticle} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                    if (!articleId) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }
                  }}
                  placeholder="e.g., How to apply for CNTS 2026?"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Slug Path</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="e.g., how-to-apply"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800"
                >
                  <option value="FAQ">FAQ</option>
                  <option value="BLOG">Blog Post</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                </select>
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs text-slate-500 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                    className="rounded border-slate-300 bg-white text-blue-800 focus:ring-0"
                  />
                  Publish this version to public website
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Article content (HTML / Rich Markdown)</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your article details here..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800 h-64 font-mono"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving || !title.trim() || !slug.trim() || !content.trim()}
                className="flex-1 py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Article"}
              </button>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-800 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {articles.length === 0 ? (
                <div className="text-center py-24 text-slate-400 text-sm font-medium">
                  No articles published yet. Click "New Article" to start.
                </div>
              ) : (
                articles.map((article) => (
                  <div key={article.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          article.published 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        }`}>
                          {article.published ? "Active" : "Draft"}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {article.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          v{article.version}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-slate-800 text-base">{article.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Globe size={13} className="text-slate-400" />
                        <span className="font-mono">/help/{article.slug}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setArticleId(article.id);
                          setTitle(article.title);
                          setSlug(article.slug);
                          setCategory(article.category);
                          setContent(article.content);
                          setPublished(article.published);
                          setShowEditor(true);
                        }}
                        className="px-3.5 py-2 text-xs font-semibold bg-slate-55 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Settings size={12} />
                        Edit
                      </button>
                      <a
                        href={`/help/${article.slug}`}
                        target="_blank"
                        className="px-3.5 py-2 text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 transition-all flex items-center gap-1"
                      >
                        <Eye size={12} />
                        View
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
