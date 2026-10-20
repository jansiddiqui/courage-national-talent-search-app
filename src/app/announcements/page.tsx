import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import AnnouncementsPageClient from "./AnnouncementsPageClient";

export const metadata: Metadata = {
  title: "CNTS 2026 Official Announcements — Updates & Alerts | Courage Library",
  description: "Stay informed with the latest CNTS 2026 official announcements — registration alerts, exam date updates, Learning Academy launch, and results notifications.",
  alternates: {
    canonical: `${SITE_URL}/announcements`,
  },
  openGraph: {
    title: "CNTS 2026 Official Announcements — Updates & Alerts",
    description: "Stay informed with the latest CNTS 2026 official announcements — registration alerts, exam date updates, Learning Academy launch, and results notifications.",
    url: `${SITE_URL}/announcements`,
    images: [{ url: "/og-cnts.png", width: 1200, height: 630, alt: "CNTS 2026 Announcements" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CNTS 2026 Official Announcements",
    description: "Stay informed with the latest CNTS 2026 official announcements.",
    images: ["/og-cnts.png"],
  },
};

export default function AnnouncementsPage() {
  return <AnnouncementsPageClient />;
}
