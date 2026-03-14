import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import usePageTitle from "@/hooks/usePageTitle";
import SEOHead from "@/components/shared/SEOHead";
import { SITE_URL } from "@/lib/constants";
import PageBanner from "@/components/layout/PageBanner";
import VehicleCard from "@/components/vehicles/VehicleCard";
import VehicleFilters, { defaultFilters, type VehicleFilterValues } from "@/components/vehicles/VehicleFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Catalogo = () => {
  usePageTitle("Catálogo de Vehículos");
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<VehicleFilterValues>(() => ({
    ...defaultFilters,
    marca: searchParams.get("marca") || "",
  }));
  const [sort, setSort] = useState("recientes");

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles", filters, sort],
    queryFn: async () => {
      let query = supabase.from("vehicles").select("*").eq("status", "disponible");

      if (filters.marca) query = query.eq("marca", filters.marca);
      if (filters.combustible) query = query.eq("combustible", filters.combustible);
      if (filters.transmision) query = query.eq("transmision", filters.transmision);
      if (filters.yearMin) query = query.gte("year", parseInt(filters.yearMin));
      if (filters.yearMax) query = query.lte("year", parseInt(filters.yearMax));
      if (filters.priceMin) query = query.gte("price", parseInt(filters.priceMin));
      if (filters.priceMax) query = query.lte("price", parseInt(filters.priceMax));

      // Text search across marca + modelo
      if (filters.search) {
        query = query.or(`marca.ilike.%${filters.search}%,modelo.ilike.%${filters.search}%`);
      }

      if (sort === "precio-asc") query = query.order("price", { ascending: true });
      else if (sort === "precio-desc") query = query.order("price", { ascending: false });
      else if (sort === "año-desc") query = query.order("year", { ascending: false });
      else if (sort === "km-asc") query = query.order("kilometraje", { ascending: true });
      else query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <SEOHead
        title="Catálogo de Vehículos Usados"
        description="Explora nuestro catálogo de vehículos usados y seminuevos disponibles en Cartagena, Colombia. Filtra por marca, precio, año y más."
        canonical={`${SITE_URL}/catalogo`}
      />
      <PageBanner
        title="Vehículos Disponibles"
        breadcrumbs={[
          { label: "Inicio", path: "/" },
          { label: "Catálogo" },
        ]}
      />

      <div className="container py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 shrink-0">
            <VehicleFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {vehicles ? `${vehicles.length} vehículo(s) encontrado(s)` : "Cargando..."}
              </p>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recientes">Más Recientes</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="año-desc">Año: Más Nuevo</SelectItem>
                  <SelectItem value="km-asc">Kilometraje: Menor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl h-80 animate-pulse border border-border" />
                ))}
              </div>
            ) : vehicles && vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No se encontraron vehículos con los filtros seleccionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Catalogo;
