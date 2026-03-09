import usePageTitle from "@/hooks/usePageTitle";
import HeroSection from "@/components/home/HeroSection";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import WhyUs from "@/components/home/WhyUs";
import StatsSection from "@/components/home/StatsSection";
import BrandsSection from "@/components/home/BrandsSection";
import ConsignacionCTA from "@/components/home/ConsignacionCTA";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTA from "@/components/home/FinalCTA";
import FadeInSection from "@/components/shared/FadeInSection";

const Index = () => {
  usePageTitle("");
  return (
    <>
      <HeroSection />
      <FadeInSection>
        <FeaturedVehicles />
      </FadeInSection>
      <FadeInSection>
        <WhyUs />
      </FadeInSection>
      <FadeInSection>
        <StatsSection />
      </FadeInSection>
      <FadeInSection>
        <BrandsSection />
      </FadeInSection>
      <FadeInSection>
        <TestimonialsSection />
      </FadeInSection>
      <FadeInSection>
        <ConsignacionCTA />
      </FadeInSection>
      <FinalCTA />
    </>
  );
};

export default Index;
