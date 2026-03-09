import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Car } from "lucide-react";
import FadeInSection from "@/components/shared/FadeInSection";

const FinalCTA = () => {
  return (
    <section className="py-20 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary to-secondary/80" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container relative">
        <FadeInSection>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-secondary-foreground mb-4">
              ¿Listo para encontrar tu <span className="text-primary">próximo vehículo</span>?
            </h2>
            <p className="text-secondary-foreground/80 text-lg mb-8">
              Explora nuestro catálogo de vehículos verificados o contáctanos para vender el tuyo de forma segura.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base font-bold uppercase tracking-wide">
                <Link to="/catalogo">
                  <Search className="mr-2 h-5 w-5" />
                  Ver Catálogo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base font-bold uppercase tracking-wide border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/consignacion">
                  <Car className="mr-2 h-5 w-5" />
                  Vender mi Vehículo
                </Link>
              </Button>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default FinalCTA;
