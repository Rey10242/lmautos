import { Car, Users, Shield, ThumbsUp } from "lucide-react";
import FadeInSection from "@/components/shared/FadeInSection";

const stats = [
  { icon: Car, value: "2.000+", label: "Vehículos Gestionados" },
  { icon: Users, value: "98%", label: "Clientes Satisfechos" },
  { icon: Shield, value: "100%", label: "Transparencia" },
  { icon: ThumbsUp, value: "15+", label: "Años de Experiencia" },
];

const StatsSection = () => {
  return (
    <section className="py-14 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <FadeInSection key={i} delay={i * 100}>
              <div className="text-center">
                <stat.icon className="h-9 w-9 sm:h-11 sm:w-11 text-primary mx-auto mb-3" strokeWidth={1.5} />
                <div className="text-2xl sm:text-3xl font-black text-secondary-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-secondary-foreground/70 mt-1">{stat.label}</div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
