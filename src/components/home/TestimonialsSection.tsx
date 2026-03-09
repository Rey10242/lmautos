import { Star, Quote } from "lucide-react";
import FadeInSection from "@/components/shared/FadeInSection";

const testimonials = [
  {
    name: "Carlos Rodríguez",
    role: "Comprador",
    avatar: "CR",
    rating: 5,
    text: "Excelente servicio. Encontré el carro perfecto para mi familia. Todo el proceso fue muy transparente y rápido.",
  },
  {
    name: "María González",
    role: "Vendedora",
    avatar: "MG",
    rating: 5,
    text: "Vendí mi carro en menos de 2 semanas. El equipo de LM Autos se encargó de todo, desde las fotos hasta el traspaso.",
  },
  {
    name: "Andrés Martínez",
    role: "Comprador",
    avatar: "AM",
    rating: 5,
    text: "La mejor consignataria de Bogotá. Muy profesionales y honestos. Recomendados al 100%.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <FadeInSection>
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Testimonios
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">
              Lo que dicen nuestros <span className="text-primary">clientes</span>
            </h2>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <FadeInSection key={i} delay={i * 100}>
              <div className="bg-card border border-border rounded-xl p-6 relative h-full flex flex-col">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-4">
                  "{t.text}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
