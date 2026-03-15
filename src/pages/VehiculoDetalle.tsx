import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageBanner from "@/components/layout/PageBanner";
import FadeInSection from "@/components/shared/FadeInSection";
import SEOHead from "@/components/shared/SEOHead";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatPrice, formatKm } from "@/lib/formatPrice";
import { Fuel, Gauge, Calendar, Settings2, Car, Palette, DoorOpen, Cog, MessageCircle, Share2, Copy, ChevronLeft, ChevronRight, X, MapPin, Building2, CalendarClock } from "lucide-react";
import { useState } from "react";
import { SITE_URL } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const VehiculoDetalle = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", slug],
    queryFn: async () => {
      // Try slug first, fallback to id for backwards compatibility
      let { data, error } = await supabase.from("vehicles").select("*").eq("slug", slug!).maybeSingle();
      if (!data) {
        ({ data, error } = await supabase.from("vehicles").select("*").eq("id", slug!).maybeSingle());
      }
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: similarVehicles } = useQuery({
    queryKey: ["similar-vehicles", vehicle?.marca, vehicle?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("marca", vehicle!.marca)
        .neq("id", vehicle!.id)
        .eq("status", "disponible")
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!vehicle?.marca,
  });

  const title = vehicle ? `${vehicle.marca} ${vehicle.modelo} ${vehicle.version || ""} ${vehicle.year}`.trim() : "";
  const images = vehicle ? ((vehicle.images as string[]) || []) : [];
  const displayImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"];
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const canonicalUrl = vehicle ? `${SITE_URL}/vehiculo/${vehicle.slug || vehicle.id}` : undefined;

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
    ...(vehicle.transito ? [{ icon: MapPin, label: "Tránsito", value: vehicle.transito }] : []),
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "¡Enlace copiado!", description: "El enlace ha sido copiado al portapapeles." });
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Mira este vehículo: ${title} - ${shareUrl}`)}`, "_blank");
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    } else {
      setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    }
  };

  const seoDescription = `${title} - ${formatPrice(vehicle.price)} | ${formatKm(vehicle.kilometraje)} km | ${vehicle.combustible} | ${vehicle.transmision}. Disponible en LM Autos, Cartagena Colombia.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: title,
    description: vehicle.descripcion || seoDescription,
    image: images[0] || undefined,
    brand: { "@type": "Brand", name: vehicle.marca },
    model: vehicle.modelo,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.kilometraje,
      unitCode: "KMT",
    },
    fuelType: vehicle.combustible,
    vehicleTransmission: vehicle.transmision,
    color: vehicle.color || undefined,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "COP",
      availability: vehicle.status === "disponible" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "AutoDealer",
        name: "LM Autos",
        url: SITE_URL,
      },
    },
    url: canonicalUrl,
  };

  return (
    <>
      <SEOHead
        title={title}
        description={seoDescription}
        canonical={canonicalUrl}
        ogImage={images[0]}
        ogType="product"
        jsonLd={jsonLd}
      />

      <PageBanner
        title={title}
        breadcrumbs={[
          { label: "Inicio", path: "/" },
          { label: "Catálogo", path: "/catalogo" },
          { label: `${vehicle.marca} ${vehicle.modelo}` },
        ]}
      />

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Gallery */}
          <FadeInSection className="lg:col-span-3">
            <div 
              className="aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-3 cursor-pointer relative group"
              onClick={() => setLightboxOpen(true)}
            >
              <img src={displayImages[selectedImage]} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  Click para ampliar
                </span>
              </div>
              {displayImages.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-2 py-1 rounded">
                  {selectedImage + 1} / {displayImages.length}
                </div>
              )}
            </div>
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-transparent hover:border-primary/50"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </FadeInSection>

          {/* Info */}
          <FadeInSection delay={150} className="lg:col-span-2 space-y-6">
            <div>
              {vehicle.recien_ingresado && <Badge className="bg-primary text-primary-foreground mb-2">Recién Ingresado</Badge>}
              <h2 className="text-2xl font-black text-foreground">{title}</h2>
              <div className="text-2xl sm:text-3xl font-black text-primary mt-2">
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
            <Button asChild size="lg" className="w-full font-bold uppercase text-base">
              <a href={`https://wa.me/573157525555?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </Button>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Share2 className="h-4 w-4" /> Compartir:
              </span>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareWhatsApp} className="text-[#25D366]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareFacebook} className="text-[#1877F2]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </Button>
            </div>
          </FadeInSection>
        </div>

        {/* Description */}
        {vehicle.descripcion && (
          <FadeInSection className="mt-10">
            <h3 className="text-xl font-bold text-foreground mb-3">Descripción</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{vehicle.descripcion}</p>
          </FadeInSection>
        )}

        {/* Similar vehicles */}
        {similarVehicles && similarVehicles.length > 0 && (
          <FadeInSection className="mt-16">
            <h3 className="text-2xl font-black text-foreground mb-6">
              También te puede <span className="text-primary">interesar</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </FadeInSection>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl bg-black/95 border-none p-0">
          <button 
            onClick={() => setLightboxOpen(false)} 
            className="absolute top-4 right-4 z-10 text-white hover:text-primary transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative flex items-center justify-center min-h-[70vh]">
            <img 
              src={displayImages[selectedImage]} 
              alt={title} 
              className="max-h-[80vh] max-w-full object-contain"
            />
            
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 text-white hover:text-primary transition-colors p-2"
                >
                  <ChevronLeft className="h-10 w-10" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 text-white hover:text-primary transition-colors p-2"
                >
                  <ChevronRight className="h-10 w-10" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 px-3 py-1 rounded">
                  {selectedImage + 1} / {displayImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehiculoDetalle;
