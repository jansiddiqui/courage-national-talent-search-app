import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Use & Service Rules | Courage National Talent Search",
  description: "Review the official terms of use, class eligibility guidelines, refund policies, and scoring framework of the CNTS 2026 assessment.",
  alternates: {
    canonical: "https://thecouragelibrary.com/terms",
  },
  openGraph: {
    title: "Terms of Use & Service Rules | Courage National Talent Search",
    description: "Review the official terms of use, class eligibility guidelines, refund policies, and scoring framework of the CNTS 2026 assessment.",
    url: "https://thecouragelibrary.com/terms",
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
    title: "Terms of Use & Service Rules | Courage National Talent Search",
    description: "Review the official terms of use, class eligibility guidelines, refund policies, and scoring framework of the CNTS 2026 assessment.",
    images: ["/images/logo.png"],
  },
};

export default function Page() {
  return <TermsClient />;
}
