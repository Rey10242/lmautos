import FadeInSection from "@/components/shared/FadeInSection";
import { Target, Heart } from "lucide-react";

const AboutMissionVision = () => (
  <section className="py-16 md:py-20">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <FadeInSection>
          <div className="bg-card border border-border rounded-xl p-8 h-full">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-3">
              Nuestra Misión
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Facilitar la compra y venta de vehículos usados y seminuevos en
              Colombia, ofreciendo un servicio confiable, transparente y de alta
              calidad que genere seguridad en cada transacción.
            </p>
          </div>
        </FadeInSection>
        <FadeInSection delay={150}>
          <div className="bg-card border border-border rounded-xl p-8 h-full">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-3">
              Nuestra Visión
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Ser la consignataria líder en el país, reconocida por su excelencia
              en servicio al cliente, su innovación tecnológica y su compromiso
              con la transparencia.
            </p>
          </div>
        </FadeInSection>
      </div>
    </div>
  </section>
);

export default AboutMissionVision;
