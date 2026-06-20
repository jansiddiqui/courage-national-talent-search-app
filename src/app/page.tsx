import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Trust from "@/components/sections/Trust";
import FounderLetter from "@/components/sections/FounderLetter";
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

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Trust />
      <FounderLetter />
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
      <FAQ />
      <NeedHelp />
      <CTA />
      <StickyMobileCTA />
      <FAQBubble />
      <Footer />
    </main>
  );
}