import PageBanner from "@/components/layout/PageBanner";
import FadeInSection from "@/components/shared/FadeInSection";
import { Shield, Users, Award, Handshake, Target, Heart, CheckCircle } from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";

const values = [
  { icon: Shield, title: "Transparencia", desc: "Cada vehículo pasa por un proceso de inspección riguroso. Toda la información es verificada." },
  { icon: Users, title: "Atención Personalizada", desc: "Te acompañamos durante todo el proceso de compra o venta de tu vehículo." },
  { icon: Award, title: "Experiencia", desc: "Más de 10 años en el mercado automotriz colombiano nos respaldan." },
  { icon: Handshake, title: "Confianza", desc: "Miles de clientes satisfechos avalan nuestro compromiso con la calidad." },
];

const timeline = [
  { year: "2014", title: "Nuestros inicios", desc: "Comenzamos como una pequeña consignataria con la visión de transformar el mercado de autos usados." },
  { year: "2017", title: "Expansión", desc: "Ampliamos nuestras operaciones y consolidamos alianzas estratégicas con financieras." },
  { year: "2020", title: "Digitalización", desc: "Lanzamos nuestra plataforma digital para ofrecer una mejor experiencia a nuestros clientes." },
  { year: "2024", title: "Hoy", desc: "Más de 500 vehículos vendidos y miles de clientes satisfechos en todo Colombia." },
];

const stats = [
  { value: "10+", label: "Años de experiencia" },
  { value: "500+", label: "Vehículos vendidos" },
  { value: "1000+", label: "Clientes satisfechos" },
  { value: "98%", label: "Tasa de satisfacción" },
];

const SobreNosotros = () => {
  usePageTitle("Sobre Nosotros");

  return (
    <>
      <PageBanner title="Sobre Nosotros" breadcrumbs={[{ label: "Inicio", path: "/" }, { label: "Sobre Nosotros" }]} />
      
      {/* Hero section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                  Nuestra Historia
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2 mb-6">
                  ¿Quiénes <span className="text-primary">Somos</span>?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  LM Autos es una consignataria de vehículos con sede en Colombia, dedicada a facilitar la compra y venta de autos usados y seminuevos. Nuestro compromiso es ofrecer un servicio transparente, seguro y de calidad.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Desde 2014, hemos ayudado a cientos de familias colombianas a encontrar el vehículo perfecto para sus necesidades, siempre con honestidad y profesionalismo.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Vehículos verificados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Proceso transparente</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Asesoría gratuita</span>
                  </div>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection delay={200}>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  <img 
                    src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80" 
                    alt="Showroom LM Autos"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                  <div className="text-4xl font-black">10+</div>
                  <div className="text-sm">Años de experiencia</div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-secondary-foreground/70">{stat.label}</div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
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
                <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
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

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, i) => (
              <FadeInSection key={i} delay={i * 150}>
                <div className="flex gap-6 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                      {item.year}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-primary/20 mt-2" />
                    )}
                  </div>
                  <div className="pt-2 pb-4">
                    <h3 className="font-bold text-foreground text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeInSection>
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">Nuestra Misión</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Facilitar la compra y venta de vehículos usados en Colombia, ofreciendo un servicio transparente, seguro y de alta calidad que genere confianza en cada transacción.
                </p>
              </div>
            </FadeInSection>
            <FadeInSection delay={150}>
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">Nuestra Visión</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ser la consignataria de vehículos líder en Colombia, reconocida por nuestra excelencia en servicio al cliente y nuestro compromiso con la transparencia.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </>
  );
};

export default SobreNosotros;
