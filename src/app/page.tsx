import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Trust from "@/components/sections/Trust";
import FounderLetter from "@/components/sections/FounderLetter";
import BrandingSection from "@/components/sections/BrandingSection";
import WhySubsidized from "@/components/sections/WhySubsidized";
import WhyCNTS from "@/components/sections/WhyCNTS";
import SampleQuestions from "@/components/sections/SampleQuestions";
import WhatParentsDiscover from "@/components/sections/WhatParentsDiscover";
import TalentProfile from "@/components/sections/TalentProfile";
import ExamOverview from "@/components/sections/ExamOverview";
import PrizePool from "@/components/sections/PrizePool";
import HowItWorks from "@/components/sections/HowItWorks";
import TimelineReassurance from "@/components/sections/TimelineReassurance";
import ParentBenefits from "@/components/sections/ParentBenefits";
import FAQ from "@/components/sections/FAQ";
import NeedHelp from "@/components/layout/NeedHelp";
import CTA from "@/components/sections/CTA";
import StickyMobileCTA from "@/components/layout/StickyMobileCTA";
import FAQBubble from "@/components/layout/FAQBubble";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/shared/JsonLd";
import LatestArticles from "@/components/sections/LatestArticles";

export const metadata: Metadata = {
  title: "Courage National Talent Search (CNTS) | Official Program by Courage Library",
  description: "India's premier talent discovery platform for students in Classes 5–8. Operated by Courage Library to identify cognitive strengths and award verified merit profiles.",
  alternates: {
    canonical: "https://thecouragelibrary.com",
  },
  openGraph: {
    title: "Courage National Talent Search (CNTS) | Official Program by Courage Library",
    description: "India's premier talent discovery platform for students in Classes 5–8. Operated by Courage Library to identify cognitive strengths and award verified merit profiles.",
    url: "https://thecouragelibrary.com",
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
    title: "Courage National Talent Search (CNTS) | Official Program by Courage Library",
    description: "India's premier talent discovery platform for students in Classes 5–8. Operated by Courage Library to identify cognitive strengths and award verified merit profiles.",
    images: ["/images/logo.png"],
  },
};

export default function Home() {
  const edSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Courage Library",
    "url": "https://thecouragelibrary.com",
    "logo": "https://thecouragelibrary.com/images/logo.png",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Educational Programs",
      "itemListElement": [
        {
          "@type": "EducationalProgram",
          "name": "Courage National Talent Search (CNTS)",
          "description": "Courage National Talent Search (CNTS) is the official talent discovery and assessment program operated by Courage Library for school students across India.",
          "provider": {
            "@type": "Organization",
            "name": "Courage Library"
          }
        }
      ]
    }
  };

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://thecouragelibrary.com/#webpage",
    "url": "https://thecouragelibrary.com",
    "name": "Courage Library - Home",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://thecouragelibrary.com/#website",
      "name": "Courage Library",
      "url": "https://thecouragelibrary.com"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://thecouragelibrary.com"
      }
    ]
  };

  return (
    <main className="min-h-screen">
      <JsonLd schema={[edSchema, pageSchema, breadcrumbSchema]} />
      <Navbar />
      <Hero />
      <Trust />
      <FounderLetter />
      <BrandingSection />
      <WhySubsidized />
      <WhyCNTS />
      <SampleQuestions />
      <WhatParentsDiscover />
      <TalentProfile />
      <ExamOverview />
      <PrizePool />
      <HowItWorks />
      <TimelineReassurance />
      <ParentBenefits />
      <LatestArticles />
      <FAQ />
      <NeedHelp />
      <CTA />
      <StickyMobileCTA />
      <FAQBubble />
      <Footer />
    </main>
  );
}