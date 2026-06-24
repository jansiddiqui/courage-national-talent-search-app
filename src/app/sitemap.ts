import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thecouragelibrary.com";
  const staticRoutes = [
    "",
    "/why-cnts",
    "/register",
    "/for-schools",
    "/about",
    "/prizes",
    "/achievers",
    "/timeline",
    "/prepare",
    "/exam-pattern",
    "/exam-instructions",
    "/sample-report",
    "/parent-guide",
    "/announcements",
    "/updates",
    "/faq",
    "/verify",
    "/contact",
    "/admit-card-portal",
    "/login",
    "/privacy",
    "/terms",
    "/refund",
    "/data-deletion",
  ];

  const staticSitemaps = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let postsSitemaps: MetadataRoute.Sitemap = [];
  try {
    const posts = getAllBlogPosts();
    postsSitemaps = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedDate),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error("Failed to read blog posts in sitemap generation", e);
  }

  return [...staticSitemaps, ...postsSitemaps];
}
