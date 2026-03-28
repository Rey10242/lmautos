import FadeInSection from "@/components/shared/FadeInSection";
import SEOHead from "@/components/shared/SEOHead";
import { SITE_URL } from "@/lib/constants";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Car,
  FileSearch,
  CreditCard,
  ShieldCheck,
  Wrench,
  ArrowRight,
  CheckCircle,
  Phone,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";

const services = [
  {
    icon: Car,
    title: "Consignación de Vehículos",
    desc: "Dejamos tu vehículo a la venta sin que tengas que preocuparte por nada. Nos encargamos de todo el proceso.",
    features: [
      "Fotografía profesional",
      "Publicación en múltiples plataformas",
      "Gestión de visitas",
      "Negociación con compradores",
    ],
    link: "/consignacion",
    accent: "from-primary/20 to-primary/5",
    iconBg: "bg-primary",
  },
  {
    icon: FileSearch,
    title: "Inspección Vehicular",
    desc: "Revisión completa del estado mecánico, legal y estético de cada vehículo antes de la compra.",
    features: [
      "Revisión mecánica completa",
      "Verificación de documentos",
      "Historial del vehículo",
      "Reporte detallado",
    ],
    accent: "from-blue-500/20 to-blue-500/5",
    iconBg: "bg-blue-500",
  },
  {
    icon: CreditCard,
    title: "Financiación",
    desc: "Opciones de financiación con las mejores entidades aliadas para que puedas adquirir tu vehículo.",
    features: [
      "Múltiples opciones de crédito",
      "Tasas competitivas",
      "Asesoría personalizada",
      "Proceso rápido",
    ],
    accent: "from-emerald-500/20 to-emerald-500/5",
    iconBg: "bg-emerald-500",
  },
  {
    icon: ShieldCheck,
    title: "Trámites y Legalización",
    desc: "Gestionamos todos los trámites de traspaso, impuestos y legalización de tu vehículo.",
    features: [
      "Traspaso de propiedad",
      "Levantamiento de prenda",
      "Gestión de impuestos",
      "SOAT y Tecnicomecánica",
    ],
    accent: "from-violet-500/20 to-violet-500/5",
    iconBg: "bg-violet-500",
  },
  {
    icon: Wrench,
    title: "Asesoría Mecánica",
    desc: "Aliados especializados para garantizar el buen estado mecánico de cada vehículo.",
    features: [
      "Diagnóstico computarizado",
      "Peritaje vehicular",
      "Recomendaciones de mantenimiento",
      "Red de talleres aliados",
    ],
    accent: "from-rose-500/20 to-rose-500/5",
    iconBg: "bg-rose-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Contáctanos",
    desc: "Comunícate con nosotros por WhatsApp o visítanos.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Evaluación",
    desc: "Realizamos una evaluación completa del vehículo.",
    icon: FileSearch,
  },
  {
    number: "03",
    title: "Proceso",
    desc: "Gestionamos todo de manera transparente y eficiente.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Entrega",
    desc: "Finalizamos con toda la documentación en regla.",
    icon: CheckCircle,
  },
];

const Servicios = () => {
  usePageTitle("Servicios");

  return (
    <>
      <SEOHead
        title="Servicios Automotrices"
        description="Servicios de consignación, inspección vehicular, financiación, trámites y peritaje en LM Autos Cartagena. Soluciones integrales para tu vehículo."
        canonical={`${SITE_URL}/servicios`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Servicios de LM Autos",
          itemListElement: [
            { "@type": "Service", position: 1, name: "Consignación de Vehículos", description: "Dejamos tu vehículo a la venta sin que tengas que preocuparte por nada" },
            { "@type": "Service", position: 2, name: "Inspección Vehicular", description: "Revisión completa del estado mecánico, legal y estético" },
            { "@type": "Service", position: 3, name: "Financiación", description: "Opciones de financiación con las mejores entidades aliadas" },
            { "@type": "Service", position: 4, name: "Trámites y Legalización", description: "Gestión completa de traspaso, impuestos y SOAT" },
          ],
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-secondary overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-secondary/80" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>
        
        <div className="relative container py-20 sm:py-28 md:py-32">
          <div className="max-w-3xl">
            <FadeInSection>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                <Sparkles className="h-4 w-4" />
                Soluciones integrales
              </span>
            </FadeInSection>
            <FadeInSection delay={100}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-secondary-foreground leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Nuestros{" "}
                <span className="text-primary relative">
                  Servicios
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C40 2 100 2 198 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </span>
              </h1>
            </FadeInSection>
            <FadeInSection delay={200}>
              <p className="text-lg sm:text-xl text-secondary-foreground/60 mt-6 max-w-xl leading-relaxed">
                Todo lo que necesitas para comprar, vender o mantener tu vehículo en un solo lugar. Experiencia y confianza garantizada.
              </p>
            </FadeInSection>

            {/* Breadcrumbs */}
            <FadeInSection delay={300}>
              <nav aria-label="Breadcrumb" className="mt-8">
                <ol className="flex items-center gap-2 text-sm text-secondary-foreground/50">
                  <li>
                    <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
                  </li>
                  <li aria-hidden="true">›</li>
                  <li>
                    <span className="text-secondary-foreground/80" aria-current="page">Servicios</span>
                  </li>
                </ol>
              </nav>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <FadeInSection
                key={i}
                delay={i * 80}
                className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}
              >
                <div
                  className={`relative group bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 ${
                    i === 0 ? "md:flex-row" : ""
                  }`}
                >
                  {/* Gradient accent top */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className={`relative p-7 md:p-8 flex flex-col flex-grow ${i === 0 ? "md:w-1/2" : ""}`}>
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <s.icon className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {s.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-grow">
                      {s.desc}
                    </p>

                    {s.link && (
                      <Button
                        asChild
                        variant="link"
                        className="p-0 text-primary font-semibold self-start group/btn"
                      >
                        <Link to={s.link} className="flex items-center gap-1">
                          Más información
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Features column for first card, list for rest */}
                  <div className={`relative ${i === 0 ? "md:w-1/2 md:border-l border-border" : "border-t border-border"} bg-muted/30 p-7 md:p-8`}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                      Incluye
                    </p>
                    <ul className="space-y-3">
                      {s.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm text-foreground/80">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <CheckCircle className="h-3.5 w-3.5 text-primary" />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps - Horizontal Timeline */}
      <section className="py-20 md:py-28 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden lg:block" />
        </div>

        <div className="container relative">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
                Proceso Simple
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary-foreground">
                ¿Cómo{" "}
                <span className="text-primary">funciona</span>?
              </h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <FadeInSection key={i} delay={i * 150}>
                <div className="relative text-center group">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] right-[-40%] h-0.5 bg-gradient-to-r from-primary/40 to-primary/10" />
                  )}

                  {/* Number circle */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary-foreground/5 border border-secondary-foreground/10 mb-6 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-500">
                    <step.icon className="w-8 h-8 text-secondary-foreground/40 group-hover:text-primary transition-colors duration-300" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-secondary-foreground mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-secondary-foreground/50 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <FadeInSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-secondary/90 p-10 md:p-16 text-center max-w-4xl mx-auto">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                  <Phone className="h-4 w-4" />
                  Estamos para ayudarte
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary-foreground mb-5">
                  ¿Necesitas más{" "}
                  <span className="text-primary">información</span>?
                </h2>
                <p className="text-secondary-foreground/60 mb-8 max-w-lg mx-auto text-lg">
                  Contáctanos y resolveremos todas tus dudas. Nuestro equipo está listo para asesorarte.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="font-bold uppercase text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                  >
                    <a
                      href="https://wa.me/573157525555"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Contactar por WhatsApp
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="font-bold uppercase text-base px-8 py-6 rounded-xl border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
                  >
                    <Link to="/contacto">
                      Formulario de Contacto
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
};

export default Servicios;
