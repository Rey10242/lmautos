import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";

export interface VehicleFilterValues {
  marca: string;
  combustible: string;
  transmision: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
}

const defaultFilters: VehicleFilterValues = {
  marca: "",
  combustible: "",
  transmision: "",
  yearMin: "",
  yearMax: "",
  priceMin: "",
  priceMax: "",
};

const marcas = ["Chevrolet", "Renault", "Mazda", "Toyota", "Nissan", "Hyundai", "Kia", "Ford", "Volkswagen", "BMW", "Mercedes-Benz", "Audi"];
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

  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-5">
      <h3 className="font-bold text-foreground uppercase tracking-wide text-sm flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <Search className="h-4 w-4 text-primary" />
        Encuentra tu carro ideal
      </h3>

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
