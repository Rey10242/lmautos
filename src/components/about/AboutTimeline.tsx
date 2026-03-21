import FadeInSection from "@/components/shared/FadeInSection";

const timeline = [
  {
    year: "2009",
    title: "Primeros pasos",
    desc: "Después de varios años de experiencia en marcas como Toyota y Kia, decidimos emprender un nuevo camino, transformando la pasión por los autos en un proyecto independiente.",
  },
  {
    year: "2019",
    title: "Nace LM Autos",
    desc: "Iniciamos con una oficina dedicada a la asesoría en compra y venta de vehículos usados, con una visión clara: brindar un servicio honesto, humano y de calidad.",
  },
  {
    year: "2020",
    title: "Crecimiento y alianzas",
    desc: "Ampliamos nuestras operaciones y establecimos alianzas con entidades financieras para ofrecer a nuestros clientes más facilidades y mejores opciones.",
  },
  {
    year: "2021",
    title: "Digitalización",
    desc: "Lanzamos nuestros canales digitales para simplificar la experiencia de los usuarios y llevar nuestro servicio a todo el país.",
  },
  {
    year: "2024",
    title: "Showroom propio",
    desc: "Inauguramos nuestro espacio físico de exhibición de 60 m² en Cartagena, ofreciendo una experiencia presencial moderna y profesional.",
  },
  {
    year: "2026",
    title: "Hoy",
    desc: "Contamos con más de 2.000 vehículos gestionados, presencia digital consolidada y una comunidad de clientes satisfechos que siguen confiando en nuestro trabajo.",
  },
];
const AboutTimeline = () => (
  <section className="py-16 md:py-20 bg-muted/30">
    <div className="container">
      <FadeInSection>
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">
            Trayectoria
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">
            Nuestra <span className="text-primary">historia</span>
          </h2>
        </div>
      </FadeInSection>

      <div className="max-w-3xl mx-auto relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

        {timeline.map((item, i) => (
          <FadeInSection key={i} delay={i * 120}>
            <div className="flex gap-4 sm:gap-6 pb-10 last:pb-0 relative">
              <div className="flex flex-col items-center shrink-0 z-10">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                  {item.year}
                </div>
              </div>
              <div className="pt-1 pb-2 bg-card border border-border rounded-xl p-5 flex-1 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-foreground text-lg mb-1">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  </section>
);

export default AboutTimeline;
