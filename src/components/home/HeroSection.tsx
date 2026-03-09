import { Link } from "react-router-dom";
import { Search, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-secondary min-h-[520px] flex items-center overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/70" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative container py-20">
        <div className="max-w-2xl">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Consignataria de Vehículos
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary-foreground leading-tight mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Encuentra tu <span className="text-primary">vehículo ideal</span>
          </h1>
          <p className="text-secondary-foreground/80 text-lg mb-8 leading-relaxed max-w-lg">
            Compra, vende o consigna tu vehículo con total confianza. Los mejores autos usados y seminuevos en Colombia.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="text-base font-bold uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <Link to="/catalogo">
                <Search className="mr-2 h-5 w-5" />
                Ver Catálogo
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base font-bold uppercase tracking-wide border-primary text-primary hover:bg-primary hover:text-primary-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <Link to="/consignacion">
                <Car className="mr-2 h-5 w-5" />
                Vender mi Vehículo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
