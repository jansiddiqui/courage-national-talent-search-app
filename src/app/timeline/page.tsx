import type { Metadata } from "next";
import TimelinePageClient from "./TimelinePageClient";

export const metadata: Metadata = {
  title: "CNTS 2026 Exam Timeline — Registration to Results | Courage Library",
  description: "View the complete CNTS 2026 schedule: registrations open July 15, exam in August, results by September. 10-phase detailed timeline for the Courage National Talent Search.",
  alternates: {
    canonical: "https://thecouragelibrary.com/timeline",
  },
  openGraph: {
    title: "CNTS 2026 Exam Timeline — Registration to Results",
    description: "View the complete CNTS 2026 schedule: registrations open July 15, exam in August, results by September.",
    url: "https://thecouragelibrary.com/timeline",
    images: [{ url: "/og-cnts.png", width: 1200, height: 630, alt: "CNTS 2026 Timeline" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CNTS 2026 Exam Timeline — Registration to Results",
    description: "View the complete CNTS 2026 schedule: registrations open July 15, exam in August, results by September.",
    images: ["/og-cnts.png"],
  },
};

export default function TimelinePage() {
  return <TimelinePageClient />;
}
