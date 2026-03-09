import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/formatPrice";
import { FileText, Phone, Mail, MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react";

const statusColors: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  contactado: "bg-blue-100 text-blue-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
};

const Consignaciones = () => {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-consignments", statusFilter],
    queryFn: async () => {
      let query = supabase.from("consignment_requests").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "todos") query = query.eq("status", statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Solicitudes de Consignación
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{requests?.length ?? 0} solicitud(es)</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="contactado">Contactados</SelectItem>
            <SelectItem value="aprobado">Aprobados</SelectItem>
            <SelectItem value="rechazado">Rechazados</SelectItem>
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
                  <div>
                    <p className="font-semibold text-foreground">{r.marca} {r.modelo} {r.year}</p>
                    <p className="text-xs text-muted-foreground">{r.nombre} · {new Date(r.created_at).toLocaleDateString('es-CO')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`text-[10px] uppercase font-bold ${statusColors[r.status || 'pendiente'] || statusColors.pendiente}`}>
                    {r.status}
                  </Badge>
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
                      <span className="text-muted-foreground text-xs uppercase">Fecha</span>
                      <p className="font-semibold">{new Date(r.created_at).toLocaleString('es-CO')}</p>
                    </div>
                  </div>

                  {r.descripcion && (
                    <div>
                      <span className="text-muted-foreground text-xs uppercase">Descripción</span>
                      <p className="text-sm mt-1">{r.descripcion}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <a
                      href={`https://wa.me/57${r.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      Contactar por WhatsApp
                    </a>
                    <a
                      href={`mailto:${r.correo}?subject=Consignación ${r.marca} ${r.modelo} ${r.year}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Enviar Correo
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
          {requests?.length === 0 && (
            <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p>No hay solicitudes de consignación</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Consignaciones;
