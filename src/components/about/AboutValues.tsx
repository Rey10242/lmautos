import FadeInSection from "@/components/shared/FadeInSection";
import { Shield, Users, Award, Handshake } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Transparencia",
    desc: "Cada vehículo pasa por un proceso de inspección y verificación para garantizar su calidad y procedencia.",
  },
  {
    icon: Users,
    title: "Atención Personalizada",
    desc: "Acompañamos a cada cliente durante todo el proceso, brindando asesoría integral y soluciones a la medida.",
  },
  {
    icon: Award,
    title: "Experiencia y Compromiso",
    desc: "Más de una década en el sector automotriz nos respalda. Creamos relaciones de confianza que permanecen en el tiempo.",
  },
  {
    icon: Handshake,
    title: "Confianza",
    desc: "Nuestros clientes son nuestra mejor carta de presentación: su satisfacción avala nuestro trabajo diario.",
  },
];

const AboutValues = () => (
  <section className="py-16 md:py-20">
    <div className="container">
      <FadeInSection>
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">
            Nuestros Valores
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">
            Lo que nos <span className="text-primary">define</span>
          </h2>
        </div>
      </FadeInSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, i) => (
          <FadeInSection key={i} delay={i * 100}>
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <v.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  </section>
);

export default AboutValues;
