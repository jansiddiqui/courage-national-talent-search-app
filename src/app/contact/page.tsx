import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact & Support Desk | Courage National Talent Search",
  description: "Get in touch with the CNTS support desk. Ask questions about candidate registrations, test syllabus details, and school onboarding.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact & Support Desk | Courage National Talent Search",
    description: "Get in touch with the CNTS support desk. Ask questions about candidate registrations, test syllabus details, and school onboarding.",
    url: `${SITE_URL}/contact`,
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
    title: "Contact & Support Desk | Courage National Talent Search",
    description: "Get in touch with the CNTS support desk. Ask questions about candidate registrations, test syllabus details, and school onboarding.",
    images: ["/images/logo.png"],
  },
};

export default function Page() {
  return <ContactClient />;
}
