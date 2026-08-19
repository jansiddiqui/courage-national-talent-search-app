import type { Metadata } from "next";
import TimelinePageClient from "./TimelinePageClient";

export const metadata: Metadata = {
  title: "CNTS 2026 Exam Timeline — Registration to Results | Courage Library",
  description: "View the complete CNTS 2026 schedule: registrations close September 25, exam on September 27, results on October 10. Official 10-phase timeline for the Courage National Talent Search.",
  alternates: {
    canonical: "https://thecouragelibrary.com/timeline",
  },
  openGraph: {
    title: "CNTS 2026 Exam Timeline — Registration to Results",
    description: "View the complete CNTS 2026 schedule: registrations close September 25, exam on September 27, results on October 10.",
    url: "https://thecouragelibrary.com/timeline",
    images: [{ url: "/og-cnts.png", width: 1200, height: 630, alt: "CNTS 2026 Timeline" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CNTS 2026 Exam Timeline — Registration to Results",
    description: "View the complete CNTS 2026 schedule: registrations close September 25, exam on September 27, results on October 10.",
    images: ["/og-cnts.png"],
  },
};

export default function TimelinePage() {
  return <TimelinePageClient />;
}
