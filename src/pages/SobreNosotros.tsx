import PageBanner from "@/components/layout/PageBanner";
import { Shield, Users, Award, Handshake } from "lucide-react";

const values = [
  { icon: Shield, title: "Transparencia", desc: "Cada vehículo pasa por un proceso de inspección riguroso. Toda la información es verificada." },
  { icon: Users, title: "Atención Personalizada", desc: "Te acompañamos durante todo el proceso de compra o venta de tu vehículo." },
  { icon: Award, title: "Experiencia", desc: "Más de 10 años en el mercado automotriz colombiano nos respaldan." },
  { icon: Handshake, title: "Confianza", desc: "Miles de clientes satisfechos avalan nuestro compromiso con la calidad." },
];

const SobreNosotros = () => {
  return (
    <>
      <PageBanner title="Sobre Nosotros" breadcrumbs={[{ label: "Inicio", path: "/" }, { label: "Sobre Nosotros" }]} />
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-black text-foreground uppercase mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ¿Quiénes <span className="text-primary">Somos</span>?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            LM Autos es una consignataria de vehículos con sede en Colombia, dedicada a facilitar la compra y venta de autos usados y seminuevos. Nuestro compromiso es ofrecer un servicio transparente, seguro y de calidad, garantizando la satisfacción de nuestros clientes en cada transacción.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {values.map((v, i) => (
            <div key={i} className="flex gap-4 p-6 bg-card border border-border rounded-lg">
              <v.icon className="h-10 w-10 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SobreNosotros;
