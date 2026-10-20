import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import FoundingFamiliesClient from "./FoundingFamiliesClient";

export const metadata: Metadata = {
  title: "CNTS Founding Families Program | Courage National Talent Search",
  description: "Become a CNTS Founding Family. Secure early-bird notification, get parent resources, and help launch India's premier cognitive talent search.",
  alternates: {
    canonical: `${SITE_URL}/founding-families`,
  },
  openGraph: {
    title: "CNTS Founding Families Program | Courage National Talent Search",
    description: "Become a CNTS Founding Family. Secure early-bird notification, get parent resources, and help launch India's premier cognitive talent search.",
    url: `${SITE_URL}/founding-families`,
    images: [
      {
        url: "/og-cnts.png",
        width: 1200,
        height: 630,
        alt: "CNTS Founding Families",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CNTS Founding Families Program | Courage National Talent Search",
    description: "Become a CNTS Founding Family. Secure early-bird notification, get parent resources, and help launch India's premier cognitive talent search.",
    images: ["/og-cnts.png"],
  },
};

export default function FoundingFamiliesPage() {
  return <FoundingFamiliesClient />;
}
