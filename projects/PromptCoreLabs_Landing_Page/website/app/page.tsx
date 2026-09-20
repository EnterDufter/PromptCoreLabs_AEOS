import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { AuthoritySection } from "@/components/sections/AuthoritySection";
import { BunkerSection } from "@/components/sections/BunkerSection";
import { ContentHubPreview } from "@/components/sections/ContentHubPreview";
import { EducationSection } from "@/components/sections/EducationSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { ProjectOSSection } from "@/components/sections/ProjectOSSection";
import { AEOSSection } from "@/components/sections/AEOSSection";
import { QuizAssessment } from "@/components/sections/QuizAssessment";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { WhatWeDoSection } from "@/components/sections/WhatWeDoSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, organizationSchema, websiteSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema(), faqSchema()]} />
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <ProblemSection />
        <WhatWeDoSection />
        <ServicesSection />
        <BunkerSection />
        <AudienceSection />
        <ApproachSection />
        <ProjectOSSection />
        <AEOSSection />
        <EducationSection />
        <AuthoritySection />
        <QuizAssessment />
        <ContentHubPreview />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
