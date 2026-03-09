import { Link } from "react-router-dom";
import { Fuel, Gauge, Calendar, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatKm } from "@/lib/formatPrice";
import type { Tables } from "@/integrations/supabase/types";

interface VehicleCardProps {
  vehicle: Tables<"vehicles">;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const images = (vehicle.images as string[]) || [];
  const mainImage = images[0] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80";

  return (
    <Link to={`/vehiculo/${vehicle.id}`} className="group block bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={mainImage}
          alt={`${vehicle.marca} ${vehicle.modelo} ${vehicle.year}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {vehicle.recien_ingresado && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-bold text-xs">
            Recién Ingresado
          </Badge>
        )}
        {vehicle.destacado && (
          <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground font-bold text-xs">
            Destacado
          </Badge>
        )}
      </div>

      {/* Tags */}
      <div className="px-4 pt-3 flex flex-wrap gap-1">
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{vehicle.transmision}</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{vehicle.combustible}</span>
        {vehicle.traccion && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{vehicle.traccion}</span>}
      </div>

      {/* Info */}
      <div className="p-4 pt-2">
        <h3 className="font-bold text-foreground text-lg leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {vehicle.marca} {vehicle.modelo} {vehicle.version || ""}
        </h3>
        <div className="text-2xl font-black text-primary mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {formatPrice(vehicle.price)}
        </div>

        {/* Specs row */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{formatKm(vehicle.kilometraje)}</span>
          <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" />{vehicle.combustible}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{vehicle.year}</span>
          <span className="flex items-center gap-1"><Settings2 className="h-3.5 w-3.5" />{vehicle.transmision}</span>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
