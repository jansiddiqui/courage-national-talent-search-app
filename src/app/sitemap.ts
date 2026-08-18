import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllPublishedSchoolSlugs } from "@/lib/schoolProfiles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thecouragelibrary.com";
  const staticRoutes = [
    "",
    "/schools",
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
    "/academy",
    "/academy/reasoning",
    "/academy/mathematics",
    "/academy/language",
    "/academy/critical",
    "/founding-families",
    "/blog",
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

  let schoolSitemaps: MetadataRoute.Sitemap = [];
  try {
    const schoolSlugs = await getAllPublishedSchoolSlugs();
    schoolSitemaps = schoolSlugs.map((s) => ({
      url: `${baseUrl}/schools/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("Failed to read school profiles in sitemap generation", e);
  }

  return [...staticSitemaps, ...postsSitemaps, ...schoolSitemaps];
}
