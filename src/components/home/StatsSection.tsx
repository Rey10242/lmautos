import { Car, Users, Shield, ThumbsUp } from "lucide-react";

const stats = [
  { icon: Car, value: "500+", label: "Vehículos Vendidos" },
  { icon: Users, value: "1,200+", label: "Clientes Satisfechos" },
  { icon: Shield, value: "100%", label: "Transparencia" },
  { icon: ThumbsUp, value: "10+", label: "Años de Experiencia" },
];

const StatsSection = () => {
  return (
    <section className="py-14 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="h-10 w-10 text-primary mx-auto mb-3" />
              <div className="text-2xl sm:text-3xl font-black text-secondary-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-sm text-secondary-foreground/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
