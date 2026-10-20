import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import ResultsClient from "./ResultsClient";

export const metadata: Metadata = {
  title: "Retrieve Assessment Results | Courage National Talent Search",
  description: "Access the CNTS 2026 participant results, national percentiles, ranks, and cognitive profile reports.",
  alternates: {
    canonical: `${SITE_URL}/results`,
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Retrieve Assessment Results | Courage National Talent Search",
    description: "Access the CNTS 2026 participant results, national percentiles, ranks, and cognitive profile reports.",
    url: `${SITE_URL}/results`,
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
    title: "Retrieve Assessment Results | Courage National Talent Search",
    description: "Access the CNTS 2026 participant results, national percentiles, ranks, and cognitive profile reports.",
    images: ["/images/logo.png"],
  },
};

export default function Page() {
  return <ResultsClient />;
}
