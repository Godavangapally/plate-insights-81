import { PageWrapper } from "@/components/layout/PageWrapper";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";

const Index = () => {
  return (
    <PageWrapper>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
    </PageWrapper>
  );
};

export default Index;
