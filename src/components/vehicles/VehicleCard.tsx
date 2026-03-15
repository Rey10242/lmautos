import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatKm } from "@/lib/formatPrice";
import { Fuel, Gauge, Calendar, Settings2, Eye, Building2, CalendarClock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  vehicle: Tables<"vehicles">;
}

const VehicleCard = ({ vehicle }: Props) => {
  const images = (vehicle.images as string[]) || [];
  const mainImage = images[0] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80";
  const title = `${vehicle.marca} ${vehicle.modelo} ${vehicle.year}`;

  return (
    <Link
      to={`/vehiculo/${vehicle.slug || vehicle.id}`}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wide px-5 py-2.5 rounded-lg flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Ver Detalles
          </span>
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {vehicle.recien_ingresado && (
            <Badge className="bg-primary text-primary-foreground text-xs font-bold">Nuevo Ingreso</Badge>
          )}
          {vehicle.destacado && (
            <Badge className="bg-secondary text-secondary-foreground text-xs font-bold">Destacado</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        {vehicle.version && (
          <p className="text-xs text-muted-foreground mt-0.5">{vehicle.version}</p>
        )}

        <div className="text-xl sm:text-2xl font-black text-primary mt-2">
          {formatPrice(vehicle.price)}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary/70" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gauge className="h-3.5 w-3.5 text-primary/70" />
            <span>{formatKm(vehicle.kilometraje)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Fuel className="h-3.5 w-3.5 text-primary/70" />
            <span>{vehicle.combustible}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Settings2 className="h-3.5 w-3.5 text-primary/70" />
            <span>{vehicle.transmision}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
