import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, formatKm } from "@/lib/formatPrice";
import { Plus, Search, Trash2, Edit, Star, Sparkles, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Vehiculos = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["admin-vehicles", search, statusFilter],
    queryFn: async () => {
      let query = supabase.from("vehicles").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "todos") query = query.eq("status", statusFilter);
      if (search) query = query.or(`marca.ilike.%${search}%,modelo.ilike.%${search}%`);
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

  const toggleField = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: boolean }) => {
      const { error } = await supabase.from("vehicles").update({ [field]: value } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vehicles"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Vehículos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {vehicles?.length ?? 0} vehículo(s) en el inventario
          </p>
        </div>
        <Button asChild className="font-bold uppercase tracking-wide">
          <Link to="/admin/vehiculos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Vehículo
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar marca, modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="vendido">Vendido</SelectItem>
            <SelectItem value="reservado">Reservado</SelectItem>
            <SelectItem value="oculto">Oculto</SelectItem>
          </SelectContent>
        </Select>
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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide">Vehículo</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide hidden md:table-cell">Precio</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide hidden lg:table-cell">Km</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide">Estado</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide hidden md:table-cell">Flags</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vehicles?.map((v) => {
                  const images = (v.images as string[]) || [];
                  return (
                    <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img src={images[0] || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{v.marca} {v.modelo} {v.year}</p>
                            <p className="text-xs text-muted-foreground">{v.combustible} · {v.transmision}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell font-bold text-primary">{formatPrice(v.price)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{formatKm(v.kilometraje)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={v.status === 'disponible' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                          {v.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => toggleField.mutate({ id: v.id, field: "destacado", value: !v.destacado })}
                            className={`p-1.5 rounded-md transition-colors ${v.destacado ? 'text-amber-500 bg-amber-50' : 'text-muted-foreground/30 hover:text-amber-500'}`}
                            title="Destacado"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleField.mutate({ id: v.id, field: "recien_ingresado", value: !v.recien_ingresado })}
                            className={`p-1.5 rounded-md transition-colors ${v.recien_ingresado ? 'text-green-500 bg-green-50' : 'text-muted-foreground/30 hover:text-green-500'}`}
                            title="Recién ingresado"
                          >
                            <Sparkles className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                            <Link to={`/admin/vehiculos/${v.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {vehicles?.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p>No se encontraron vehículos</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Vehiculos;
