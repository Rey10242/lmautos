import PageBanner from "@/components/layout/PageBanner";
import FadeInSection from "@/components/shared/FadeInSection";
import SEOHead from "@/components/shared/SEOHead";
import { SITE_URL } from "@/lib/constants";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, FileSearch, CreditCard, ShieldCheck, Wrench, ArrowRight, CheckCircle, Phone } from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";

const services = [
  { 
    icon: Car, 
    title: "Consignación de Vehículos", 
    desc: "Dejamos tu vehículo a la venta sin que tengas que preocuparte por nada. Nos encargamos de todo el proceso de venta.",
    features: ["Fotografía profesional", "Publicación en múltiples plataformas", "Gestión de visitas", "Negociación con compradores"],
    link: "/consignacion" 
  },
  { 
    icon: FileSearch, 
    title: "Inspección Vehicular", 
    desc: "Realizamos una revisión completa del estado mecánico, legal y estético de cada vehículo.",
    features: ["Revisión mecánica completa", "Verificación de documentos", "Historial del vehículo", "Reporte detallado"],
  },
  { 
    icon: CreditCard, 
    title: "Financiación", 
    desc: "Ofrecemos opciones de financiación con las mejores entidades aliadas para que puedas adquirir tu vehículo.",
    features: ["Múltiples opciones de crédito", "Tasas competitivas", "Asesoría personalizada", "Proceso rápido"],
  },
  { 
    icon: ShieldCheck, 
    title: "Trámites y Legalización", 
    desc: "Gestionamos todos los trámites de traspaso, impuestos y legalización de tu vehículo.",
    features: ["Traspaso de propiedad", "Levantamiento de prenda", "Gestión de impuestos", "SOAT y Tecnicomecánica"],
  },
  { 
    icon: Wrench, 
    title: "Asesoría Mecánica", 
    desc: "Contamos con aliados especializados para garantizar el buen estado mecánico de cada vehículo.",
    features: ["Diagnóstico computarizado", "Peritaje vehicular", "Recomendaciones de mantenimiento", "Red de talleres aliados"],
  },
];

const steps = [
  { number: "01", title: "Contáctanos", desc: "Comunícate con nosotros por WhatsApp o visítanos para conocer tus necesidades." },
  { number: "02", title: "Evaluación", desc: "Realizamos una evaluación completa del vehículo o te ayudamos a encontrar el ideal." },
  { number: "03", title: "Proceso", desc: "Gestionamos todo el proceso de compra, venta o consignación de manera transparente." },
  { number: "04", title: "Entrega", desc: "Finalizamos la transacción con toda la documentación en regla y tu satisfacción garantizada." },
];

const Servicios = () => {
  usePageTitle("Servicios");

  return (
    <>
      <PageBanner title="Nuestros Servicios" breadcrumbs={[{ label: "Inicio", path: "/" }, { label: "Servicios" }]} />
      
      {/* Services grid */}
      <section className="py-16">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                ¿Qué Ofrecemos?
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">
                Servicios <span className="text-primary">integrales</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Ofrecemos una amplia gama de servicios para hacer tu experiencia de compra o venta de vehículos lo más sencilla posible.
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <s.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{s.desc}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {s.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {s.link && (
                    <Button asChild variant="link" className="p-0 text-primary font-semibold self-start">
                      <Link to={s.link}>Más Información <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  )}
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                Proceso
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">
                ¿Cómo <span className="text-primary">funciona</span>?
              </h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <FadeInSection key={i} delay={i * 150}>
                <div className="text-center relative">
                  <div className="text-6xl font-black text-primary/10 mb-2">{step.number}</div>
                  <h3 className="font-bold text-foreground text-lg mb-2 -mt-8">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                  
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-primary/30" />
                  )}
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <FadeInSection>
            <div className="bg-secondary rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-secondary-foreground mb-4">
                ¿Necesitas más información?
              </h2>
              <p className="text-secondary-foreground/70 mb-6">
                Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="font-bold uppercase">
                  <a href="https://wa.me/573157525555" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-5 w-5" />
                    Contactar por WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-bold uppercase border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link to="/contacto">
                    Formulario de Contacto
                  </Link>
                </Button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
};

export default Servicios;
