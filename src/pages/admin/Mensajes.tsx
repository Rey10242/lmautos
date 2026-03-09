import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Phone, Mail, ChevronDown, ChevronUp, Clock } from "lucide-react";

const statusColors: Record<string, string> = {
  nuevo: "bg-amber-100 text-amber-700",
  leido: "bg-blue-100 text-blue-700",
  respondido: "bg-green-100 text-green-700",
};

const Mensajes = () => {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages", statusFilter],
    queryFn: async () => {
      let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
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
            Mensajes de Contacto
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{messages?.length ?? 0} mensaje(s)</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="nuevo">Nuevos</SelectItem>
            <SelectItem value="leido">Leídos</SelectItem>
            <SelectItem value="respondido">Respondidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-card animate-pulse rounded-xl border border-border" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {messages?.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{m.nombre}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{m.mensaje}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge className={`text-[10px] uppercase font-bold ${statusColors[m.status || 'nuevo'] || statusColors.nuevo}`}>
                    {m.status}
                  </Badge>
                  {expandedId === m.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {expandedId === m.id && (
                <div className="border-t border-border p-5 bg-muted/20 space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`tel:${m.telefono}`} className="hover:text-primary">{m.telefono}</a>
                    </div>
                    {m.correo && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <a href={`mailto:${m.correo}`} className="hover:text-primary">{m.correo}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(m.created_at).toLocaleString('es-CO')}</span>
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-4 border border-border">
                    <p className="text-sm whitespace-pre-wrap">{m.mensaje}</p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/57${m.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      Responder por WhatsApp
                    </a>
                    {m.correo && (
                      <a
                        href={`mailto:${m.correo}?subject=Re: Mensaje de contacto LM Autos`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Responder por Correo
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {messages?.length === 0 && (
            <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p>No hay mensajes de contacto</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mensajes;
