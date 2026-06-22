import type { Metadata } from "next";
import { getLatestBlogPosts } from "@/lib/blog";
import ForSchoolsClient from "./ForSchoolsClient";

export const metadata: Metadata = {
  title: "School Partnerships & Onboarding | Courage National Talent Search",
  description: "Register your school for the Courage National Talent Search (CNTS) 2026. Manage student lists, generate batch roll numbers, and download institutional cognitive profiles.",
  alternates: {
    canonical: "https://thecouragelibrary.com/for-schools",
  },
  openGraph: {
    title: "School Partnerships & Onboarding | Courage National Talent Search",
    description: "Register your school for the Courage National Talent Search (CNTS) 2026. Manage student lists, generate batch roll numbers, and download institutional cognitive profiles.",
    url: "https://thecouragelibrary.com/for-schools",
    images: [
      {
        url: "/og-cnts.png",
        width: 1200,
        height: 630,
        alt: "CNTS Open Graph Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School Partnerships & Onboarding | Courage National Talent Search",
    description: "Register your school for the Courage National Talent Search (CNTS) 2026. Manage student lists, generate batch roll numbers, and download institutional cognitive profiles.",
    images: ["/og-cnts.png"],
  },
};

export default function Page() {
  const posts = getLatestBlogPosts(3);
  return <ForSchoolsClient initialPosts={posts} />;
}
