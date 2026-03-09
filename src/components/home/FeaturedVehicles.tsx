import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedVehicles = () => {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["featured-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("status", "disponible")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-16 bg-muted">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Vehículos <span className="text-primary">Destacados</span>
          </h2>
          <p className="text-muted-foreground">Explora nuestra selección de vehículos disponibles</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No hay vehículos disponibles en este momento.</p>
        )}

        <div className="text-center mt-10">
          <Button asChild size="lg" className="font-bold uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Link to="/catalogo">
              Ver Todo el Catálogo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
