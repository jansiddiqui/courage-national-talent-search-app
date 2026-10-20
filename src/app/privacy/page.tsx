import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Courage National Talent Search",
  description: "Read the privacy policy and children's data safety guidelines for the Courage National Talent Search (CNTS) 2026 assessment program.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | Courage National Talent Search",
    description: "Read the privacy policy and children's data safety guidelines for the Courage National Talent Search (CNTS) 2026 assessment program.",
    url: `${SITE_URL}/privacy`,
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "CNTS Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Courage National Talent Search",
    description: "Read the privacy policy and children's data safety guidelines for the Courage National Talent Search (CNTS) 2026 assessment program.",
    images: ["/images/logo.png"],
  },
};

export default function Page() {
  return <PrivacyClient />;
}
