import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw, X } from "lucide-react";

export interface VehicleFilterValues {
  marca: string;
  combustible: string;
  transmision: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  search: string;
}

const defaultFilters: VehicleFilterValues = {
  marca: "",
  combustible: "",
  transmision: "",
  yearMin: "",
  yearMax: "",
  priceMin: "",
  priceMax: "",
  search: "",
};

const marcas = ["Chevrolet", "Renault", "Mazda", "Toyota", "Nissan", "Hyundai", "Kia", "Ford", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Subaru", "Chery", "SsangYong", "SEAT"];
const combustibles = ["Gasolina", "Diesel", "Híbrido", "Eléctrico", "Gas"];
const transmisiones = ["Automática", "Manual", "Automática secuencial"];

interface Props {
  filters: VehicleFilterValues;
  onFiltersChange: (f: VehicleFilterValues) => void;
}

const VehicleFilters = ({ filters, onFiltersChange }: Props) => {
  const update = (key: keyof VehicleFilterValues, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clear = (key: keyof VehicleFilterValues) => {
    onFiltersChange({ ...filters, [key]: "" });
  };

  // Active filter chips
  const activeFilters: { key: keyof VehicleFilterValues; label: string }[] = [];
  if (filters.marca) activeFilters.push({ key: "marca", label: filters.marca });
  if (filters.combustible) activeFilters.push({ key: "combustible", label: filters.combustible });
  if (filters.transmision) activeFilters.push({ key: "transmision", label: filters.transmision });
  if (filters.yearMin) activeFilters.push({ key: "yearMin", label: `Desde ${filters.yearMin}` });
  if (filters.yearMax) activeFilters.push({ key: "yearMax", label: `Hasta ${filters.yearMax}` });
  if (filters.priceMin) activeFilters.push({ key: "priceMin", label: `Min $${Number(filters.priceMin).toLocaleString()}` });
  if (filters.priceMax) activeFilters.push({ key: "priceMax", label: `Max $${Number(filters.priceMax).toLocaleString()}` });

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <h3 className="font-bold text-foreground uppercase tracking-wide text-sm flex items-center gap-2">
        <Search className="h-4 w-4 text-primary" />
        Encuentra tu carro ideal
      </h3>

      {/* Text search */}
      <div>
        <Input
          placeholder="Buscar marca, modelo..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="bg-muted"
        />
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeFilters.map((f) => (
            <Badge
              key={f.key}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors text-xs gap-1"
              onClick={() => clear(f.key)}
            >
              {f.label}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label className="text-xs font-semibold uppercase text-muted-foreground">Marca</Label>
          <Select value={filters.marca} onValueChange={(v) => update("marca", v)}>
            <SelectTrigger><SelectValue placeholder="Todas las marcas" /></SelectTrigger>
            <SelectContent>
              {marcas.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase text-muted-foreground">Combustible</Label>
          <Select value={filters.combustible} onValueChange={(v) => update("combustible", v)}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              {combustibles.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase text-muted-foreground">Transmisión</Label>
          <Select value={filters.transmision} onValueChange={(v) => update("transmision", v)}>
            <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
            <SelectContent>
              {transmisiones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Año Min</Label>
            <Input type="number" placeholder="2010" value={filters.yearMin} onChange={(e) => update("yearMin", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Año Max</Label>
            <Input type="number" placeholder="2025" value={filters.yearMax} onChange={(e) => update("yearMax", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Precio Min</Label>
            <Input type="number" placeholder="0" value={filters.priceMin} onChange={(e) => update("priceMin", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Precio Max</Label>
            <Input type="number" placeholder="200000000" value={filters.priceMax} onChange={(e) => update("priceMax", e.target.value)} />
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={() => onFiltersChange(defaultFilters)}>
        <RotateCcw className="mr-2 h-3.5 w-3.5" />
        Limpiar Filtros
      </Button>
    </div>
  );
};

export { defaultFilters };
export default VehicleFilters;
