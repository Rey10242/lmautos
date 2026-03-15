import SEOHead from "@/components/shared/SEOHead";
import { SITE_URL } from "@/lib/constants";
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
    description: "Consignataria de vehículos usados y seminuevos en Cartagena, Colombia. Compra, vende o consigna tu carro con total confianza.",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cartagena de Indias",
      addressRegion: "Bolívar",
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "10.3910",
      longitude: "-75.5144",
    },
    telephone: ["+573157525555", "+573150000990"],
    email: "autos.luismejia@gmail.com",
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
    ],
    sameAs: [
      "https://www.facebook.com/autos.luismejia",
      "https://www.instagram.com/lmautos.ctg/",
    ],
    priceRange: "$$",
    currenciesAccepted: "COP",
    paymentAccepted: "Efectivo, Transferencia, Financiación",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: "10.3910", longitude: "-75.5144" },
      geoRadius: "200000",
    },
  };

  return (
    <>
      <SEOHead
        title="Compra y Venta de Vehículos Usados en Cartagena"
        description="Consignataria de vehículos usados y seminuevos en Cartagena, Colombia. Compra, vende o consigna tu carro con total confianza."
        canonical={`${SITE_URL}/`}
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
