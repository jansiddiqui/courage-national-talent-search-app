import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import BlogIndexClient from "./BlogIndexClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Courage Library Blog | Academic Insights & Talent Discovery",
  description: "Explore parent guides, school coordination tips, scholarship updates, and cognitive assessment insights by Courage National Talent Search (CNTS).",
  alternates: {
    canonical: "https://thecouragelibrary.com/blog",
  },
  openGraph: {
    title: "Courage Library Blog | Academic Insights & Talent Discovery",
    description: "Explore parent guides, school coordination tips, scholarship updates, and cognitive assessment insights by Courage National Talent Search (CNTS).",
    url: "https://thecouragelibrary.com/blog",
    images: [
      {
        url: "/og-cnts.png",
        width: 1200,
        height: 630,
        alt: "Courage Library Blog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courage Library Blog | Academic Insights & Talent Discovery",
    description: "Explore parent guides, school coordination tips, scholarship updates, and cognitive assessment insights by Courage National Talent Search (CNTS).",
    images: ["/og-cnts.png"],
  },
};

export default function Page() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar theme="light" />
      <main className="flex-grow pt-24 pb-16">
        <BlogIndexClient initialPosts={posts} />
      </main>
      <Footer />
    </div>
  );
}
