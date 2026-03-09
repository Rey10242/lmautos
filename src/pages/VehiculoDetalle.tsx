import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageBanner from "@/components/layout/PageBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatKm } from "@/lib/formatPrice";
import { Fuel, Gauge, Calendar, Settings2, Car, Palette, DoorOpen, Cog, MessageCircle } from "lucide-react";
import { useState } from "react";

const VehiculoDetalle = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <>
        <PageBanner title="Cargando..." breadcrumbs={[{ label: "Inicio", path: "/" }, { label: "Catálogo", path: "/catalogo" }, { label: "..." }]} />
        <div className="container py-10">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </>
    );
  }

  if (!vehicle) {
    return (
      <>
        <PageBanner title="Vehículo no encontrado" breadcrumbs={[{ label: "Inicio", path: "/" }, { label: "Catálogo", path: "/catalogo" }]} />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">Este vehículo no existe o ya no está disponible.</p>
          <Button asChild className="mt-4"><Link to="/catalogo">Volver al Catálogo</Link></Button>
        </div>
      </>
    );
  }

  const images = (vehicle.images as string[]) || [];
  const displayImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"];
  const title = `${vehicle.marca} ${vehicle.modelo} ${vehicle.version || ""} ${vehicle.year}`;
  const whatsappMsg = encodeURIComponent(`Hola, estoy interesado en el ${title}. ¿Está disponible?`);

  const specs = [
    { icon: Calendar, label: "Año", value: vehicle.year },
    { icon: Gauge, label: "Kilometraje", value: formatKm(vehicle.kilometraje) },
    { icon: Fuel, label: "Combustible", value: vehicle.combustible },
    { icon: Settings2, label: "Transmisión", value: vehicle.transmision },
    { icon: Cog, label: "Cilindrada", value: vehicle.cilindrada || "N/A" },
    { icon: Car, label: "Tracción", value: vehicle.traccion || "N/A" },
    { icon: Palette, label: "Color", value: vehicle.color || "N/A" },
    { icon: DoorOpen, label: "Puertas", value: vehicle.num_puertas || "N/A" },
  ];

  return (
    <>
      <PageBanner
        title={title.trim()}
        breadcrumbs={[
          { label: "Inicio", path: "/" },
          { label: "Catálogo", path: "/catalogo" },
          { label: `${vehicle.marca} ${vehicle.modelo}` },
        ]}
      />

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Gallery */}
          <div className="lg:col-span-3">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-3">
              <img src={displayImages[selectedImage]} alt={title} className="w-full h-full object-cover" />
            </div>
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              {vehicle.recien_ingresado && <Badge className="bg-primary text-primary-foreground mb-2">Recién Ingresado</Badge>}
              <h2 className="text-2xl font-black text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title.trim()}</h2>
              <div className="text-3xl font-black text-primary mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {formatPrice(vehicle.price)}
              </div>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {specs.map((s, i) => (
                <div key={i} className="bg-muted rounded-lg p-3 flex items-center gap-3">
                  <s.icon className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="text-sm font-semibold text-foreground">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <Button asChild size="lg" className="w-full font-bold uppercase text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <a href={`https://wa.me/573150000990?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Description */}
        {vehicle.descripcion && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Descripción</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{vehicle.descripcion}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default VehiculoDetalle;
