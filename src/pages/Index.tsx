import SEOHead from "@/components/shared/SEOHead";
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "LM Autos",
    description: "Consignataria de vehículos usados y seminuevos en Cartagena, Colombia",
    url: "https://lmautos.lovable.app",
    address: { "@type": "PostalAddress", addressLocality: "Cartagena", addressCountry: "CO" },
    telephone: "+573150000990",
    email: "autos.luismejia@gmail.com",
  };

  return (
    <>
      <SEOHead
        title="Compra y Venta de Vehículos Usados en Cartagena"
        description="Consignataria de vehículos usados y seminuevos en Cartagena, Colombia. Compra, vende o consigna tu carro con total confianza."
        canonical="https://lmautos.lovable.app/"
        jsonLd={jsonLd}
      />
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
