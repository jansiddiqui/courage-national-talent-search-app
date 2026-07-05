import type { Metadata } from "next";
import PreparePageClient from "./PreparePageClient";

export const metadata: Metadata = {
  title: "Prepare for CNTS 2026 — Syllabus, Study Plan & Learning Academy | Courage Library",
  description: "Explore the complete CNTS 2026 syllabus for Classes 5–8, access the interactive Learning Academy, and follow a structured 4-week study plan for the Courage National Talent Search.",
  alternates: {
    canonical: "https://thecouragelibrary.com/prepare",
  },
  openGraph: {
    title: "Prepare for CNTS 2026 — Syllabus, Study Plan & Learning Academy",
    description: "Explore the complete CNTS 2026 syllabus for Classes 5–8, access the interactive Learning Academy, and follow a structured 4-week study plan.",
    url: "https://thecouragelibrary.com/prepare",
    images: [{ url: "/og-cnts.png", width: 1200, height: 630, alt: "CNTS 2026 Preparation Guide" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prepare for CNTS 2026 — Syllabus, Study Plan & Learning Academy",
    description: "Explore the complete CNTS 2026 syllabus for Classes 5–8 and follow a structured 4-week study plan.",
    images: ["/og-cnts.png"],
  },
};

export default function PreparePage() {
  return <PreparePageClient />;
}
