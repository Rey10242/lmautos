import FadeInSection from "@/components/shared/FadeInSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AboutCTA = () => (
  <section className="py-16 md:py-20 bg-secondary">
    <div className="container">
      <FadeInSection>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-secondary-foreground mb-4">
            ¿Listo para encontrar tu próximo{" "}
            <span className="text-primary">vehículo</span>?
          </h2>
          <p className="text-secondary-foreground/70 mb-8 leading-relaxed">
            En LM Autos no solo te ayudamos a encontrar tu próximo carro: te
            guiamos en cada paso del proceso para que tu compra o venta sea ágil,
            clara y segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-bold">
              <Link to="/catalogo">
                Ver catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-bold border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10">
              <Link to="/contacto">Contáctanos</Link>
            </Button>
          </div>
        </div>
      </FadeInSection>
    </div>
  </section>
);

export default AboutCTA;
