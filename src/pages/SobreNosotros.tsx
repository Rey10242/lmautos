import PageBanner from "@/components/layout/PageBanner";
import SEOHead from "@/components/shared/SEOHead";
import { SITE_URL } from "@/lib/constants";
import usePageTitle from "@/hooks/usePageTitle";
import AboutHero from "@/components/about/AboutHero";
import AboutStats from "@/components/about/AboutStats";
import AboutValues from "@/components/about/AboutValues";
import AboutTimeline from "@/components/about/AboutTimeline";
import AboutMissionVision from "@/components/about/AboutMissionVision";
import AboutCTA from "@/components/about/AboutCTA";

const SobreNosotros = () => {
  usePageTitle("Sobre Nosotros");

  return (
    <>
      <SEOHead
        title="Sobre Nosotros | LM Autos"
        description="Conoce a LM Autos: más de 15 años de experiencia en compra, venta y consignación de vehículos usados en Cartagena. Transparencia, confianza y servicio personalizado."
        canonical={`${SITE_URL}/sobre-nosotros`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          mainEntity: {
            "@type": "AutoDealer",
            name: "LM Autos",
            description:
              "Consignataria de vehículos usados y seminuevos con más de 15 años de experiencia en Cartagena, Colombia",
            foundingDate: "2009",
            url: SITE_URL,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Cartagena de Indias",
              addressCountry: "CO",
            },
          },
        }}
      />
      <PageBanner
        title="Sobre Nosotros"
        breadcrumbs={[
          { label: "Inicio", path: "/" },
          { label: "Sobre Nosotros" },
        ]}
      />

      <AboutHero />
      <AboutStats />
      <AboutValues />
      <AboutTimeline />
      <AboutMissionVision />
      <AboutCTA />
    </>
  );
};

export default SobreNosotros;
