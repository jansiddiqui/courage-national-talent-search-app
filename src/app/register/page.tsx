import type { Metadata } from "next";
import { getLatestBlogPosts } from "@/lib/blog";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Register for CNTS 2026 | Courage National Talent Search",
  description: "Register your child for the Courage National Talent Search (CNTS) 2026 Founding Edition. Open for students in Classes 5–8. Complete your profile details and secure a seat.",
  alternates: {
    canonical: "https://thecouragelibrary.com/register",
  },
  openGraph: {
    title: "Register for CNTS 2026 | Courage National Talent Search",
    description: "Register your child for the Courage National Talent Search (CNTS) 2026 Founding Edition. Open for students in Classes 5–8. Complete your profile details and secure a seat.",
    url: "https://thecouragelibrary.com/register",
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
    title: "Register for CNTS 2026 | Courage National Talent Search",
    description: "Register your child for the Courage National Talent Search (CNTS) 2026 Founding Edition. Open for students in Classes 5–8. Complete your profile details and secure a seat.",
    images: ["/og-cnts.png"],
  },
};

export default function Page() {
  const posts = getLatestBlogPosts(3);
  return <RegisterClient initialPosts={posts} />;
}
