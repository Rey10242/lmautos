import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice, formatKm } from "@/lib/formatPrice";
import {
  Plus, Search, Trash2, Edit, Star, Sparkles, Car, Image as ImageIcon,
  ArrowUpDown, ArrowUp, ArrowDown, Copy, ExternalLink, MoreHorizontal, CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SortField = "created_at" | "price" | "year" | "kilometraje" | "marca";
type SortDir = "asc" | "desc";

const statusConfig: Record<string, { label: string; class: string }> = {
  disponible: { label: "Disponible", class: "bg-emerald-500/15 text-emerald-700 border-emerald-200" },
  consignado: { label: "Consignado", class: "bg-blue-500/15 text-blue-700 border-blue-200" },
  reservado: { label: "Reservado", class: "bg-amber-500/15 text-amber-700 border-amber-200" },
  vendido: { label: "Vendido", class: "bg-red-500/15 text-red-700 border-red-200" },
  en_tramite: { label: "En Trámite", class: "bg-purple-500/15 text-purple-700 border-purple-200" },
  oculto: { label: "Oculto", class: "bg-muted text-muted-foreground border-border" },
};

const Vehiculos = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["admin-vehicles", search, statusFilter, sortField, sortDir],
    queryFn: async () => {
      let query = supabase.from("vehicles").select("*").order(sortField, { ascending: sortDir === "asc" });
      if (statusFilter !== "todos") query = query.eq("status", statusFilter);
      if (search) query = query.or(`marca.ilike.%${search}%,modelo.ilike.%${search}%,version.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast({ title: "Vehículo eliminado" });
    },
    onError: () => toast({ title: "Error al eliminar", variant: "destructive" }),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("vehicles").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vehicles"] });
      setSelectedIds(new Set());
      toast({ title: `${selectedIds.size} vehículo(s) eliminado(s)` });
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      const { error } = await supabase.from("vehicles").update({ status } as any).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vehicles"] });
      setSelectedIds(new Set());
      toast({ title: "Estado actualizado" });
    },
  });

  const toggleField = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: boolean }) => {
      const { error } = await supabase.from("vehicles").update({ [field]: value } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vehicles"] }),
  });

  const changeStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("vehicles").update({ status } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast({ title: "Estado actualizado" });
    },
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  const allSelected = vehicles?.length ? vehicles.every(v => selectedIds.has(v.id)) : false;
  const someSelected = selectedIds.size > 0;

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(vehicles?.map(v => v.id) || []));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({ title: "ID copiado al portapapeles" });
  };

  // Stats
  const totalVehicles = vehicles?.length || 0;
  const disponibles = vehicles?.filter(v => v.status === "disponible").length || 0;
  const consignados = vehicles?.filter(v => v.status === "consignado").length || 0;
  const vendidos = vehicles?.filter(v => v.status === "vendido").length || 0;
  const reservados = vehicles?.filter(v => v.status === "reservado").length || 0;
  const enTramite = vehicles?.filter(v => v.status === "en_tramite").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Inventario de Vehículos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {totalVehicles} total · {disponibles} disponibles · {vendidos} vendidos · {reservados} reservados
          </p>
        </div>
        <Button asChild className="font-bold uppercase tracking-wide">
          <Link to="/admin/vehiculos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Vehículo
          </Link>
        </Button>
      </div>

      {/* Quick stat pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "todos", label: "Todos", count: totalVehicles },
          { key: "disponible", label: "Disponibles", count: disponibles },
          { key: "vendido", label: "Vendidos", count: vendidos },
          { key: "reservado", label: "Reservados", count: reservados },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${
              statusFilter === s.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      {/* Filters & bulk actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar marca, modelo, versión..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {someSelected && (
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">{selectedIds.size} seleccionado(s)</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 text-xs">Acciones</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => bulkStatusMutation.mutate({ ids: [...selectedIds], status: "disponible" })}>
                  Marcar Disponible
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkStatusMutation.mutate({ ids: [...selectedIds], status: "vendido" })}>
                  Marcar Vendido
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkStatusMutation.mutate({ ids: [...selectedIds], status: "reservado" })}>
                  Marcar Reservado
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkStatusMutation.mutate({ ids: [...selectedIds], status: "oculto" })}>
                  Marcar Oculto
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => bulkDeleteMutation.mutate([...selectedIds])}
                >
                  Eliminar seleccionados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-card animate-pulse rounded-lg border border-border" />)}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-3 w-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                    Vehículo
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide hidden md:table-cell cursor-pointer select-none" onClick={() => toggleSort("price")}>
                    <span className="inline-flex items-center gap-1">Precio <SortIcon field="price" /></span>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort("kilometraje")}>
                    <span className="inline-flex items-center gap-1">Km <SortIcon field="kilometraje" /></span>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort("year")}>
                    <span className="inline-flex items-center gap-1">Año <SortIcon field="year" /></span>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide">Estado</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide hidden md:table-cell">Flags</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vehicles?.map((v) => {
                  const images = (v.images as string[]) || [];
                  const sc = statusConfig[v.status || "disponible"] || statusConfig.disponible;
                  return (
                    <tr key={v.id} className={`transition-colors ${selectedIds.has(v.id) ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                      <td className="px-3 py-3">
                        <Checkbox checked={selectedIds.has(v.id)} onCheckedChange={() => toggleOne(v.id)} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0 group">
                            <img src={images[0] || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                            {images.length > 0 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[9px] font-bold px-1 rounded flex items-center gap-0.5">
                                <ImageIcon className="h-2.5 w-2.5" />{images.length}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link to={`/admin/vehiculos/${v.id}`} className="font-semibold text-foreground hover:text-primary transition-colors truncate block">
                              {v.marca} {v.modelo} {v.version || ""}
                            </Link>
                            <p className="text-xs text-muted-foreground">{v.combustible} · {v.transmision} {v.color ? `· ${v.color}` : ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-bold text-foreground">{formatPrice(v.price)}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{formatKm(v.kilometraje)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground font-medium">{v.year}</td>
                      <td className="px-4 py-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 ${sc.class}`}>
                              {sc.label}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center">
                            {Object.entries(statusConfig).map(([key, cfg]) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() => changeStatus.mutate({ id: v.id, status: key })}
                                className={v.status === key ? "font-bold" : ""}
                              >
                                <span className={`w-2 h-2 rounded-full mr-2 ${key === 'disponible' ? 'bg-emerald-500' : key === 'vendido' ? 'bg-red-500' : key === 'reservado' ? 'bg-amber-500' : 'bg-muted-foreground'}`} />
                                {cfg.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleField.mutate({ id: v.id, field: "destacado", value: !v.destacado })}
                                className={`p-1.5 rounded-md transition-all ${v.destacado ? 'text-amber-500 bg-amber-500/10 shadow-sm' : 'text-muted-foreground/25 hover:text-amber-500'}`}
                              >
                                <Star className="h-4 w-4" fill={v.destacado ? "currentColor" : "none"} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Destacado</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleField.mutate({ id: v.id, field: "recien_ingresado", value: !v.recien_ingresado })}
                                className={`p-1.5 rounded-md transition-all ${v.recien_ingresado ? 'text-emerald-500 bg-emerald-500/10 shadow-sm' : 'text-muted-foreground/25 hover:text-emerald-500'}`}
                              >
                                <Sparkles className="h-4 w-4" fill={v.recien_ingresado ? "currentColor" : "none"} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Recién ingresado</TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/vehiculos/${v.id}`} className="flex items-center gap-2">
                                <Edit className="h-3.5 w-3.5" /> Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/vehiculo/${v.id}`} target="_blank" className="flex items-center gap-2">
                                <ExternalLink className="h-3.5 w-3.5" /> Ver en sitio
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyId(v.id)} className="flex items-center gap-2">
                              <Copy className="h-3.5 w-3.5" /> Copiar ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:text-destructive flex items-center gap-2"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Se eliminará {v.marca} {v.modelo} {v.year} permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMutation.mutate(v.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {vehicles?.length === 0 && (
            <div className="p-16 text-center text-muted-foreground">
              <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
              <p className="font-semibold text-lg">No se encontraron vehículos</p>
              <p className="text-sm mt-1">Intenta cambiar los filtros o agrega un nuevo vehículo</p>
              <Button asChild className="mt-4">
                <Link to="/admin/vehiculos/nuevo">
                  <Plus className="mr-2 h-4 w-4" /> Agregar Vehículo
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Vehiculos;
