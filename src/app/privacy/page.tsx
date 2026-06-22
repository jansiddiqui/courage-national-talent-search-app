import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Courage National Talent Search",
  description: "Read the privacy policy and children's data safety guidelines for the Courage National Talent Search (CNTS) 2026 assessment program.",
  alternates: {
    canonical: "https://thecouragelibrary.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Courage National Talent Search",
    description: "Read the privacy policy and children's data safety guidelines for the Courage National Talent Search (CNTS) 2026 assessment program.",
    url: "https://thecouragelibrary.com/privacy",
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
