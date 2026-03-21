import FadeInSection from "@/components/shared/FadeInSection";

const stats = [
  { value: "15+", label: "Años de experiencia" },
  { value: "2.000+", label: "Vehículos gestionados" },
  { value: "60m²", label: "Showroom físico" },
  { value: "98%", label: "Clientes satisfechos" },
];

const AboutStats = () => (
  <section className="py-12 bg-secondary">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <FadeInSection key={i} delay={i * 100}>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-secondary-foreground/70">
                {stat.label}
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  </section>
);

export default AboutStats;
