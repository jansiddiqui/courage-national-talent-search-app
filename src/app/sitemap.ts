import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thecouragelibrary.com";
  const routes = [
    "",
    "/cnts",
    "/register",
    "/for-schools",
    "/contact",
    "/privacy",
    "/terms",
    "/about",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : route === "/cnts" ? 0.9 : 0.8,
  }));
}
