import { FinalCTASection } from "@/sections/FinalCTASection";
import { HeroSection } from "@/sections/HeroSection";
import { HowItWorksSection } from "@/sections/HowItWorksSection";
import { PartnerValueSection } from "@/sections/PartnerValueSection";
import { PlatformPillarsSection } from "@/sections/PlatformPillarsSection";
import { ProblemSection } from "@/sections/ProblemSection";
import { SolutionSection } from "@/sections/SolutionSection";
import { UseCaseSection } from "@/sections/UseCaseSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <PlatformPillarsSection />
      <HowItWorksSection />
      <UseCaseSection />
      <PartnerValueSection />
      <FinalCTASection />
    </main>
  );
}
