import { Shield, HandCoins, FileCheck, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Garantía de Confianza",
    description: "Todos nuestros vehículos pasan por una inspección rigurosa antes de ser publicados.",
  },
  {
    icon: HandCoins,
    title: "Precio Justo",
    description: "Asesoría personalizada para que compres o vendas al mejor precio del mercado.",
  },
  {
    icon: FileCheck,
    title: "Trámites Incluidos",
    description: "Nos encargamos de toda la documentación legal y traspaso del vehículo.",
  },
  {
    icon: Headphones,
    title: "Atención Personalizada",
    description: "Acompañamiento durante todo el proceso de compra, venta o consignación.",
  },
];

const WhyUs = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground mb-2">
            ¿Por qué <span className="text-primary">LM Autos</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Más de 10 años respaldando la compra y venta de vehículos en Colombia con transparencia y profesionalismo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 hover:shadow-lg transition-all group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <b.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
