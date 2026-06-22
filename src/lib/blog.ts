import fs from "fs";
import path from "path";

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  featuredImage: string;
  author: string;
  publishDate: string;
  updatedDate: string;
  category: string;
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Parses frontmatter metadata block and body content from raw markdown string
 */
function parseMarkdown(fileContent: string, slug: string): BlogPost {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  const metadata: Record<string, string> = {};
  let content = fileContent;

  if (match) {
    const frontmatterString = match[1];
    content = fileContent.replace(frontmatterRegex, "").trim();

    const lines = frontmatterString.split("\n");
    for (const line of lines) {
      const parts = line.split(":");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(":").trim().replace(/^['"]|['"]$/g, ""); // strip outer quotes
        metadata[key] = value;
      }
    }
  }

  let featuredImage = metadata.featuredImage || "/images/logo.png";
  if (featuredImage.startsWith("/")) {
    const fullPath = path.join(process.cwd(), "public", featuredImage);
    if (!fs.existsSync(fullPath)) {
      featuredImage = "/og-cnts.png";
    }
  }

  return {
    title: metadata.title || "Untitled",
    slug,
    description: metadata.description || "",
    featuredImage,
    author: metadata.author || "Courage Library Team",
    publishDate: metadata.publishDate || new Date().toISOString().split("T")[0],
    updatedDate: metadata.updatedDate || new Date().toISOString().split("T")[0],
    category: metadata.category || "Student Assessments",
    readingTime: metadata.readingTime || "5 min read",
    seoTitle: metadata.seoTitle || metadata.title || "Untitled",
    seoDescription: metadata.seoDescription || metadata.description || "",
    ogImage: metadata.ogImage || metadata.featuredImage || "/images/logo.png",
    content,
  };
}

/**
 * Returns all blog posts parsed from markdown directory, sorted descending by date
 */
export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  const posts = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const filePath = path.join(BLOG_DIR, file);
      const rawContent = fs.readFileSync(filePath, "utf-8");
      return parseMarkdown(rawContent, slug);
    });

  // Sort descending by publishDate
  return posts.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

/**
 * Retrieves a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return parseMarkdown(rawContent, slug);
  } catch (error) {
    console.error(`Failed to read blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Returns N latest blog posts
 */
export function getLatestBlogPosts(limit = 3): BlogPost[] {
  return getAllBlogPosts().slice(0, limit);
}

/**
 * Returns blog posts in a specific category
 */
export function getBlogPostsByCategory(category: string): BlogPost[] {
  return getAllBlogPosts().filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Returns related articles for a post by matching category
 */
export function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit = 3
): BlogPost[] {
  return getAllBlogPosts()
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}
