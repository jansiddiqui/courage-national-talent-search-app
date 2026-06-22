import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllBlogPosts, getBlogPostBySlug, getRelatedPosts } from "@/lib/blog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TableOfContents from "@/components/blog/TableOfContents";
import BlogCTA from "@/components/blog/BlogCTA";
import AuthorProfile from "@/components/blog/AuthorProfile";
import RelatedArticles from "@/components/blog/RelatedArticles";
import JsonLd from "@/components/shared/JsonLd";
import { BlogPostViewsTracker } from "@/components/blog/BlogPostViewsTracker";
import { 
  ComparisonBox, 
  CognitiveTransition, 
  PathwayMapping, 
  BloomsTaxonomyPyramid, 
  CohortBenchmarkChart 
} from "@/components/blog/BlogDiagrams";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Courage Library",
    };
  }

  return {
    title: `${post.seoTitle} | Courage Library`,
    description: post.seoDescription,
    alternates: {
      canonical: `https://thecouragelibrary.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: `https://thecouragelibrary.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate,
      authors: [post.author],
      images: [
        {
          url: post.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [post.ogImage],
    },
  };
}

// Helper to extract text contents recursively from React-Markdown nodes
function getHeadingText(children: any): string {
  if (!children) return "";
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(getHeadingText).join("");
  }
  if (children.props && children.props.children) {
    return getHeadingText(children.props.children);
  }
  return String(children);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Word count check to conditionally show Table of Contents (only for articles longer than 1000 words)
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const showTOC = wordCount > 1000;

  // Retrieve related posts (max 2)
  const relatedPosts = getRelatedPosts(post.slug, post.category, 2);

  // Generate schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": `https://thecouragelibrary.com${post.featuredImage}`,
    "datePublished": post.publishDate,
    "dateModified": post.updatedDate,
    "author": {
      "@type": "Organization",
      "name": "Courage Library",
      "url": "https://thecouragelibrary.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Courage Library",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thecouragelibrary.com/images/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://thecouragelibrary.com/blog/${post.slug}`
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://thecouragelibrary.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://thecouragelibrary.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://thecouragelibrary.com/blog/${post.slug}`
      }
    ]
  };

  // Custom components for Markdown headings matching TOC ids
  const markdownComponents = {
    h2: ({ children, ...props }: any) => {
      const text = getHeadingText(children);
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return <h2 id={id} className="text-xl md:text-2xl font-bold font-display mt-8 mb-4 text-slate-900" {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }: any) => {
      const text = getHeadingText(children);
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return <h3 id={id} className="text-lg md:text-xl font-bold font-display mt-6 mb-3 text-slate-800" {...props}>{children}</h3>;
    },
    p: ({ children, ...props }: any) => {
      return <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6" {...props}>{children}</p>;
    },
    ul: ({ children, ...props }: any) => {
      return <ul className="list-disc pl-6 mb-6 text-slate-600 text-sm md:text-base space-y-2" {...props}>{children}</ul>;
    },
    ol: ({ children, ...props }: any) => {
      return <ol className="list-decimal pl-6 mb-6 text-slate-600 text-sm md:text-base space-y-2" {...props}>{children}</ol>;
    },
    li: ({ children, ...props }: any) => {
      return <li className="leading-relaxed" {...props}>{children}</li>;
    },
    a: ({ children, href, ...props }: any) => {
      return <a href={href} className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors" {...props}>{children}</a>;
    },
    blockquote: ({ children, ...props }: any) => {
      return <blockquote className="border-l-4 border-blue-600 bg-slate-50 pl-4 py-1 italic my-6 text-slate-700" {...props}>{children}</blockquote>;
    },
    table: ({ children, ...props }: any) => {
      return (
        <div className="overflow-x-auto my-8 border border-slate-200 rounded-3xl shadow-sm">
          <table className="w-full text-left border-collapse text-xs md:text-sm" {...props}>
            {children}
          </table>
        </div>
      );
    },
    thead: ({ children, ...props }: any) => {
      return <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold" {...props}>{children}</thead>;
    },
    tbody: ({ children, ...props }: any) => {
      return <tbody className="divide-y divide-slate-100 bg-white" {...props}>{children}</tbody>;
    },
    tr: ({ children, ...props }: any) => {
      return <tr className="hover:bg-slate-50/50 transition-colors" {...props}>{children}</tr>;
    },
    th: ({ children, ...props }: any) => {
      return <th className="p-4 font-semibold text-slate-800" {...props}>{children}</th>;
    },
    td: ({ children, ...props }: any) => {
      return <td className="p-4 text-slate-600 leading-normal" {...props}>{children}</td>;
    },
    code: ({ className, children, ...props }: any) => {
      const match = /language-([\w-]+)/.exec(className || "");
      const lang = match ? match[1] : "";
      const content = String(children).replace(/\n$/, "");

      if (lang === "comparison-exams") {
        try {
          const data = JSON.parse(content);
          return <ComparisonBox {...data} />;
        } catch (e) {
          console.error("Failed to parse comparison-exams JSON: ", e);
        }
      }
      if (lang === "cognitive-transition") {
        try {
          const data = JSON.parse(content);
          return <CognitiveTransition {...data} />;
        } catch (e) {
          console.error("Failed to parse cognitive-transition JSON: ", e);
        }
      }
      if (lang === "pathway-mapping") {
        try {
          const data = JSON.parse(content);
          return <PathwayMapping {...data} />;
        } catch (e) {
          console.error("Failed to parse pathway-mapping JSON: ", e);
        }
      }
      if (lang === "blooms-taxonomy-pyramid") {
        try {
          const data = JSON.parse(content);
          return <BloomsTaxonomyPyramid {...data} />;
        } catch (e) {
          console.error("Failed to parse blooms-taxonomy-pyramid JSON: ", e);
        }
      }
      if (lang === "cohort-benchmark-chart") {
        try {
          const data = JSON.parse(content);
          return <CohortBenchmarkChart {...data} />;
        } catch (e) {
          console.error("Failed to parse cohort-benchmark-chart JSON: ", e);
        }
      }

      const isInline = !className && !String(children).includes("\n");
      if (isInline) {
        return <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800" {...props}>{children}</code>;
      }

      return (
        <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl overflow-x-auto text-xs font-mono my-6 border border-slate-800 shadow-inner">
          <code className={className} {...props}>{children}</code>
        </pre>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar theme="light" />
      <JsonLd schema={[articleSchema, breadcrumbSchema]} />
      <BlogPostViewsTracker slug={post.slug} />

      <main className="flex-grow pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="space-y-4 mb-8">
            <span className="inline-block text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {post.category}
            </span>
            <h1 className="font-display font-black text-3xl md:text-5xl text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs font-semibold">
              <span>By {post.author}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>
                {new Date(post.publishDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{post.readingTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-[240px] md:h-[400px] rounded-3xl overflow-hidden mb-8 border border-slate-200 shadow-sm bg-slate-100">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Table of Contents (Sticky on Desktop) */}
            {showTOC && (
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 order-2 lg:order-1">
                <TableOfContents markdown={post.content} />
              </div>
            )}

            {/* Main Content Area */}
            <div className={`prose prose-slate max-w-none ${showTOC ? "lg:col-span-8" : "lg:col-span-12"} order-1 lg:order-2`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {post.content}
              </ReactMarkdown>

              {/* Conversion CTA Block */}
              <BlogCTA />

              {/* EEAT Author Card */}
              <AuthorProfile />

              {/* Related Articles Section */}
              <RelatedArticles articles={relatedPosts} />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
