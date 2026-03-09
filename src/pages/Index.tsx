import usePageTitle from "@/hooks/usePageTitle";
import HeroSection from "@/components/home/HeroSection";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import WhyUs from "@/components/home/WhyUs";
import StatsSection from "@/components/home/StatsSection";
import BrandsSection from "@/components/home/BrandsSection";
import ConsignacionCTA from "@/components/home/ConsignacionCTA";

const Index = () => {
  usePageTitle("");
  return (
    <>
      <HeroSection />
      <FeaturedVehicles />
      <WhyUs />
      <StatsSection />
      <BrandsSection />
      <ConsignacionCTA />
    </>
  );
};

export default Index;
