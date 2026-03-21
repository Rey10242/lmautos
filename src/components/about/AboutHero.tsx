import FadeInSection from "@/components/shared/FadeInSection";
import { CheckCircle } from "lucide-react";
import showroomImg from "@/assets/showroom-lmautos.png";

const highlights = [
  "Vehículos verificados",
  "Proceso transparente",
  "Asesoría gratuita",
  "Showroom de 60m²",
];

const AboutHero = () => (
  <section className="py-16 md:py-20 bg-muted/30">
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <FadeInSection>
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Quiénes Somos
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2 mb-6">
              Tu aliado en la compra y venta de{" "}
              <span className="text-primary">vehículos</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              En LM Autos nos apasiona ayudar a las personas a encontrar el
              vehículo ideal para su estilo de vida. Somos una consignataria con
              sede en Cartagena de Indias, Colombia, especializada en la compra y
              venta de autos usados y seminuevos, ofreciendo un servicio
              transparente, seguro y de confianza.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Desde 2009 hemos acompañado a cientos de familias y conductores en
              el proceso de adquirir o vender su vehículo, siempre con honestidad,
              asesoría experta y un compromiso real con la satisfacción del
              cliente.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Contamos con un showroom de más de 60 metros cuadrados, donde
              exhibimos una amplia selección de vehículos verificados y listos
              para entregar. Hemos gestionado más de 2.000 vehículos entre nuevos,
              usados y seminuevos, consolidándonos como una empresa de trayectoria
              en el mercado automotriz colombiano.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection delay={200}>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80"
                alt="Showroom LM Autos en Cartagena"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-primary text-primary-foreground p-4 sm:p-6 rounded-xl shadow-lg">
              <div className="text-3xl sm:text-4xl font-black">15+</div>
              <div className="text-xs sm:text-sm">Años de experiencia</div>
            </div>
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-secondary text-secondary-foreground p-3 sm:p-4 rounded-xl shadow-lg">
              <div className="text-2xl sm:text-3xl font-black">2K+</div>
              <div className="text-xs sm:text-sm">Vehículos gestionados</div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  </section>
);

export default AboutHero;
