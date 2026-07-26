import type { Metadata } from "next";
import { getLatestBlogPosts } from "@/lib/blog";
import ForSchoolsClient from "./ForSchoolsClient";

export const metadata: Metadata = {
  title: "School Partnership Portal | Courage National Talent Search (CNTS 2026)",
  description: "Partner with CNTS 2026 — India's premier cognitive talent assessment for Classes 5–8. Zero setup cost for schools. NEP 2020 aligned diagnostic reports for every student.",
  alternates: {
    canonical: "https://thecouragelibrary.com/for-schools",
  },
  openGraph: {
    title: "School Partnership Portal | Courage National Talent Search (CNTS 2026)",
    description: "Partner with CNTS 2026 — India's premier cognitive talent assessment for Classes 5–8. Zero setup cost for schools. NEP 2020 aligned diagnostic reports for every student.",
    url: "https://thecouragelibrary.com/for-schools",
    images: [
      {
        url: "/og-cnts.png",
        width: 1200,
        height: 630,
        alt: "CNTS School Partnership Portal 2026",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School Partnership Portal | Courage National Talent Search (CNTS 2026)",
    description: "Partner with CNTS 2026 — India's premier cognitive talent assessment for Classes 5–8. Zero setup cost for schools. NEP 2020 aligned diagnostic reports for every student.",
    images: ["/og-cnts.png"],
  },
};

export default function Page() {
  const posts = getLatestBlogPosts(3);
  return <ForSchoolsClient initialPosts={posts} />;
}
