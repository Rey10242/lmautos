import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/formatPrice";
import { useToast } from "@/hooks/use-toast";
import { FileText, Phone, Mail, MapPin, Search, ChevronDown, ChevronUp, Trash2, Calendar } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusOptions = [
  { key: "pendiente", label: "Pendiente", class: "bg-amber-500/15 text-amber-700 border-amber-200" },
  { key: "contactado", label: "Contactado", class: "bg-blue-500/15 text-blue-700 border-blue-200" },
  { key: "aprobado", label: "Aprobado", class: "bg-emerald-500/15 text-emerald-700 border-emerald-200" },
  { key: "rechazado", label: "Rechazado", class: "bg-red-500/15 text-red-700 border-red-200" },
];

const getStatusClass = (status: string) => statusOptions.find(s => s.key === status)?.class || statusOptions[0].class;

const Consignaciones = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-consignments", statusFilter, search],
    queryFn: async () => {
      let query = supabase.from("consignment_requests").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "todos") query = query.eq("status", statusFilter);
      if (search) query = query.or(`nombre.ilike.%${search}%,marca.ilike.%${search}%,modelo.ilike.%${search}%,correo.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("consignment_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-consignments"] });
      toast({ title: "Estado actualizado" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("consignment_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-consignments"] });
      toast({ title: "Solicitud eliminada" });
    },
  });

  const pendingCount = requests?.filter(r => r.status === "pendiente").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Solicitudes de Consignación
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {requests?.length ?? 0} solicitud(es) {pendingCount > 0 && <span className="text-amber-600 font-semibold">· {pendingCount} pendientes</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar nombre, marca, correo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {statusOptions.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-card animate-pulse rounded-xl border border-border" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {requests?.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{r.marca} {r.modelo} {r.year}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.nombre} · {r.ciudad} · {new Date(r.created_at).toLocaleDateString('es-CO')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={e => e.stopPropagation()}
                        className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 ${getStatusClass(r.status || 'pendiente')}`}
                      >
                        {r.status || "pendiente"}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {statusOptions.map(s => (
                        <DropdownMenuItem key={s.key} onClick={() => updateStatus.mutate({ id: r.id, status: s.key })}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${s.key === 'pendiente' ? 'bg-amber-500' : s.key === 'contactado' ? 'bg-blue-500' : s.key === 'aprobado' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {s.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {expandedId === r.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {expandedId === r.id && (
                <div className="border-t border-border p-5 bg-muted/20 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`tel:${r.telefono}`} className="text-foreground hover:text-primary">{r.telefono}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href={`mailto:${r.correo}`} className="text-foreground hover:text-primary">{r.correo}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{r.ciudad}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs uppercase">Kilometraje</span>
                      <p className="font-semibold">{r.kilometraje.toLocaleString()} km</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs uppercase">Precio esperado</span>
                      <p className="font-semibold text-primary">{r.precio_esperado ? formatPrice(Number(r.precio_esperado)) : 'No definido'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs uppercase">Año</span>
                      <p className="font-semibold">{r.year}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs uppercase flex items-center gap-1"><Calendar className="h-3 w-3" /> Fecha</span>
                      <p className="font-semibold">{new Date(r.created_at).toLocaleString('es-CO')}</p>
                    </div>
                  </div>

                  {r.descripcion && (
                    <div className="bg-background rounded-lg p-3 border border-border">
                      <span className="text-muted-foreground text-xs uppercase block mb-1">Descripción</span>
                      <p className="text-sm">{r.descripcion}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    <a
                      href={`https://wa.me/${r.telefono.replace(/\D/g, '').replace(/^0+/, '').replace(/^(?!57)/, '57')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${r.correo}?subject=Consignación ${r.marca} ${r.modelo} ${r.year}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Enviar Correo
                    </a>
                    <div className="ml-auto">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar solicitud?</AlertDialogTitle>
                            <AlertDialogDescription>Se eliminará la solicitud de {r.nombre} permanentemente.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(r.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {requests?.length === 0 && (
            <div className="p-16 text-center text-muted-foreground bg-card rounded-xl border border-border">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
              <p className="font-semibold text-lg">No hay solicitudes de consignación</p>
              <p className="text-sm mt-1">Las nuevas solicitudes aparecerán aquí</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Consignaciones;
