import { Link, useNavigate } from "react-router-dom";
import { Search, Car, ShieldCheck, Clock, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const marcas = ["Chevrolet", "Renault", "Mazda", "Toyota", "Nissan", "Hyundai", "Kia", "Ford", "Volkswagen", "BMW", "Mercedes-Benz", "Audi"];

const stats = [
  { icon: Car, value: "500+", label: "Vehículos vendidos" },
  { icon: Clock, value: "10+", label: "Años de experiencia" },
  { icon: ThumbsUp, value: "98%", label: "Clientes satisfechos" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [marca, setMarca] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (marca) params.set("marca", marca);
    navigate(`/catalogo?${params.toString()}`);
  };

  return (
    <section className="relative bg-secondary min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/70" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative container py-16 md:py-20">
        <div className="max-w-2xl">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded mb-6 animate-fade-up">
            Consignataria de Vehículos
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary-foreground leading-tight mb-6 animate-fade-up-delay-1">
            Encuentra tu <span className="text-primary">vehículo ideal</span>
          </h1>
          <p className="text-secondary-foreground/80 text-lg mb-8 leading-relaxed max-w-lg animate-fade-up-delay-2">
            Compra, vende o consigna tu vehículo con total confianza. Los mejores autos usados y seminuevos en Colombia.
          </p>

          {/* Quick search bar */}
          <div className="bg-background/10 backdrop-blur-sm border border-secondary-foreground/20 rounded-xl p-4 mb-8 max-w-lg animate-fade-up-delay-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={marca} onValueChange={setMarca}>
                <SelectTrigger className="flex-1 bg-background text-foreground border-border">
                  <SelectValue placeholder="Selecciona marca" />
                </SelectTrigger>
                <SelectContent>
                  {marcas.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="font-bold uppercase tracking-wide shrink-0">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
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

          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 mb-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-black text-secondary-foreground">{stat.value}</div>
                <div className="text-xs text-secondary-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
