import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Phone, Mail, ChevronDown, ChevronUp, Clock, Search, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusOptions = [
  { key: "nuevo", label: "Nuevo", class: "bg-amber-500/15 text-amber-700 border-amber-200" },
  { key: "leido", label: "Leído", class: "bg-blue-500/15 text-blue-700 border-blue-200" },
  { key: "respondido", label: "Respondido", class: "bg-emerald-500/15 text-emerald-700 border-emerald-200" },
];

const getStatusClass = (status: string) => statusOptions.find(s => s.key === status)?.class || statusOptions[0].class;

const Mensajes = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages", statusFilter, search],
    queryFn: async () => {
      let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "todos") query = query.eq("status", statusFilter);
      if (search) query = query.or(`nombre.ilike.%${search}%,mensaje.ilike.%${search}%,correo.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      toast({ title: "Estado actualizado" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      toast({ title: "Mensaje eliminado" });
    },
  });

  // Auto-mark as read on expand
  const handleExpand = (id: string, currentStatus: string | null) => {
    const isExpanding = expandedId !== id;
    setExpandedId(isExpanding ? id : null);
    if (isExpanding && currentStatus === "nuevo") {
      updateStatus.mutate({ id, status: "leido" });
    }
  };

  const newCount = messages?.filter(m => m.status === "nuevo").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Mensajes de Contacto
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {messages?.length ?? 0} mensaje(s) {newCount > 0 && <span className="text-amber-600 font-semibold">· {newCount} nuevos</span>}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar nombre, mensaje, correo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
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
          {messages?.map((m) => (
            <div key={m.id} className={`bg-card border rounded-xl overflow-hidden transition-colors ${m.status === 'nuevo' ? 'border-amber-300/50 bg-amber-50/30' : 'border-border'}`}>
              <button
                onClick={() => handleExpand(m.id, m.status)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${m.status === 'nuevo' ? 'bg-amber-500/15' : 'bg-primary/10'}`}>
                    <MessageSquare className={`h-5 w-5 ${m.status === 'nuevo' ? 'text-amber-600' : 'text-primary'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      {m.nombre}
                      {m.status === 'nuevo' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{m.mensaje}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:block">{new Date(m.created_at).toLocaleDateString('es-CO')}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={e => e.stopPropagation()}
                        className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 ${getStatusClass(m.status || 'nuevo')}`}
                      >
                        {m.status || "nuevo"}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {statusOptions.map(s => (
                        <DropdownMenuItem key={s.key} onClick={() => updateStatus.mutate({ id: m.id, status: s.key })}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${s.key === 'nuevo' ? 'bg-amber-500' : s.key === 'leido' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                          {s.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`https://wa.me/57${m.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      WhatsApp
                    </a>
                    {m.correo && (
                      <a
                        href={`mailto:${m.correo}?subject=Re: Mensaje de contacto LM Autos`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Responder Correo
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus.mutate({ id: m.id, status: "respondido" })}
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    >
                      Marcar Respondido
                    </Button>
                    <div className="ml-auto">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar mensaje?</AlertDialogTitle>
                            <AlertDialogDescription>Se eliminará el mensaje de {m.nombre} permanentemente.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(m.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {messages?.length === 0 && (
            <div className="p-16 text-center text-muted-foreground bg-card rounded-xl border border-border">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
              <p className="font-semibold text-lg">No hay mensajes de contacto</p>
              <p className="text-sm mt-1">Los nuevos mensajes aparecerán aquí</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mensajes;
