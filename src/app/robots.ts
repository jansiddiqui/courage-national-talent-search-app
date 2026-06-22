import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/dashboard/admin",
      ],
    },
    sitemap: "https://thecouragelibrary.com/sitemap.xml",
  };
}
