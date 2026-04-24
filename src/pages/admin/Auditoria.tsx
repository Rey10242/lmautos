import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Activity, Eye, FileText, Filter, Search, ShieldAlert, ShieldCheck, User, ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  occurred_at: string;
  actor_id: string | null;
  actor_email: string | null;
  table_name: string;
  record_id: string | null;
  action: "INSERT" | "UPDATE" | "DELETE";
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  changed_fields: string[] | null;
}

const actionConfig: Record<string, { label: string; class: string }> = {
  INSERT: { label: "Creación", class: "bg-emerald-500/15 text-emerald-700 border-emerald-200" },
  UPDATE: { label: "Edición", class: "bg-blue-500/15 text-blue-700 border-blue-200" },
  DELETE: { label: "Eliminación", class: "bg-red-500/15 text-red-700 border-red-200" },
};

const tableLabels: Record<string, string> = {
  vehicles: "Vehículo",
  consignment_requests: "Consignación",
};

const Auditoria = () => {
  const { isSuperAdmin, isLoading: rolesLoading } = useUserRoles();

  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-foreground flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
          <ShieldCheck className="h-6 w-6 text-primary" />
          Auditoría
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          Bitácora de seguridad · Solo visible para super-admins
        </p>
      </div>

      <Tabs defaultValue="actions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="actions" className="gap-2">
            <Activity className="h-4 w-4" /> Acciones de admins
          </TabsTrigger>
          <TabsTrigger value="views" className="gap-2">
            <Eye className="h-4 w-4" /> Visitas públicas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <AdminActionsTab />
        </TabsContent>
        <TabsContent value="views" className="space-y-4">
          <PublicViewsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ============================================================
// TAB 1: Acciones de admins
// ============================================================
const AdminActionsTab = () => {
  const [tableFilter, setTableFilter] = useState<string>("todos");
  const [actionFilter, setActionFilter] = useState<string>("todos");
  const [actorSearch, setActorSearch] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs", tableFilter, actionFilter],
    queryFn: async () => {
      let q = supabase
        .from("audit_logs" as any)
        .select("*")
        .order("occurred_at", { ascending: false })
        .limit(500);
      if (tableFilter !== "todos") q = q.eq("table_name", tableFilter);
      if (actionFilter !== "todos") q = q.eq("action", actionFilter);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown) as AuditLog[];
    },
  });

  const filtered = useMemo(() => {
    if (!logs) return [];
    return logs.filter((l) => {
      if (actorSearch && !(l.actor_email || "").toLowerCase().includes(actorSearch.toLowerCase())) return false;
      return true;
    });
  }, [logs, actorSearch]);

  return (
    <>
      {/* Filtros */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Tabla</Label>
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="vehicles">Vehículos</SelectItem>
                <SelectItem value="consignment_requests">Consignaciones</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Acción</Label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="INSERT">Creación</SelectItem>
                <SelectItem value="UPDATE">Edición</SelectItem>
                <SelectItem value="DELETE">Eliminación</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Email del admin</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={actorSearch} onChange={(e) => setActorSearch(e.target.value)} placeholder="admin@..." className="pl-8" />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} registro(s) — últimos 500</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-card animate-pulse rounded-lg border border-border" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FileText className="h-10 w-10" />} title="Sin registros de auditoría" subtitle="Los cambios futuros en vehículos y consignaciones aparecerán aquí." />
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => <LogRow key={log.id} log={log} />)}
        </div>
      )}
    </>
  );
};

const LogRow = ({ log }: { log: AuditLog }) => {
  const [open, setOpen] = useState(false);
  const ac = actionConfig[log.action];
  const recordLabel = log.new_data
    ? buildRecordLabel(log.table_name, log.new_data)
    : log.old_data
    ? buildRecordLabel(log.table_name, log.old_data)
    : "—";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left">
            {open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            <Badge variant="outline" className={cn("font-bold uppercase text-[10px] shrink-0", ac.class)}>{ac.label}</Badge>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground shrink-0">
              {tableLabels[log.table_name] || log.table_name}
            </span>
            <span className="text-sm text-foreground truncate flex-1">{recordLabel}</span>
            <span className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <User className="h-3 w-3" />
              {log.actor_email || <span className="italic">sistema</span>}
            </span>
            <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
              {format(new Date(log.occurred_at), "dd/MM/yy HH:mm", { locale: es })}
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border px-4 py-4 bg-muted/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <Field label="Actor" value={log.actor_email || "Sistema"} />
              <Field label="Record ID" value={log.record_id || "—"} mono />
              <Field label="Fecha" value={format(new Date(log.occurred_at), "dd MMM yyyy · HH:mm:ss", { locale: es })} />
            </div>
            {log.action === "UPDATE" && log.changed_fields && log.changed_fields.length > 0 && (
              <DiffView oldData={log.old_data || {}} newData={log.new_data || {}} fields={log.changed_fields} />
            )}
            {log.action === "INSERT" && log.new_data && (
              <JsonView title="Datos creados" data={log.new_data} />
            )}
            {log.action === "DELETE" && log.old_data && (
              <JsonView title="Datos eliminados" data={log.old_data} />
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

const buildRecordLabel = (table: string, data: Record<string, any>) => {
  if (table === "vehicles") {
    return [data.marca, data.modelo, data.version, data.year].filter(Boolean).join(" ");
  }
  if (table === "consignment_requests") {
    return `${data.nombre || "—"} · ${data.marca || ""} ${data.modelo || ""} ${data.year || ""}`.trim();
  }
  return data.id || "—";
};

const Field = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
    <div className={cn("text-sm text-foreground truncate", mono && "font-mono text-xs")}>{value}</div>
  </div>
);

const HIDDEN_FIELDS = new Set(["id", "user_id", "created_at", "updated_at", "slug", "images"]);

const DiffView = ({ oldData, newData, fields }: { oldData: Record<string, any>; newData: Record<string, any>; fields: string[] }) => {
  const visibleFields = fields.filter((f) => !HIDDEN_FIELDS.has(f));
  if (visibleFields.length === 0) {
    return <p className="text-xs text-muted-foreground italic">Solo cambiaron campos internos (timestamps / slug).</p>;
  }
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Cambios ({visibleFields.length})</div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Campo</th>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Antes</th>
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Después</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleFields.map((f) => (
              <tr key={f}>
                <td className="px-3 py-2 font-mono font-semibold text-foreground">{f}</td>
                <td className="px-3 py-2 text-red-700 dark:text-red-400 break-all">{formatValue(oldData[f])}</td>
                <td className="px-3 py-2 text-emerald-700 dark:text-emerald-400 break-all">{formatValue(newData[f])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JsonView = ({ title, data }: { title: string; data: Record<string, any> }) => {
  const visible = Object.fromEntries(Object.entries(data).filter(([k]) => !HIDDEN_FIELDS.has(k)));
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{title}</div>
      <pre className="text-[11px] bg-background border border-border rounded-lg p-3 overflow-x-auto max-h-64 overflow-y-auto font-mono">
        {JSON.stringify(visible, null, 2)}
      </pre>
    </div>
  );
};

const formatValue = (v: any): string => {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  if (typeof v === "string" && v.length > 80) return v.slice(0, 80) + "…";
  return String(v);
};

// ============================================================
// TAB 2: Visitas públicas
// ============================================================
const PublicViewsTab = () => {
  const [search, setSearch] = useState("");

  const { data: views, isLoading } = useQuery({
    queryKey: ["public-views"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_views")
        .select("id, viewed_at, vehicle_id, vehicles!inner(marca, modelo, version, year)")
        .order("viewed_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as any[];
    },
  });

  const filtered = useMemo(() => {
    if (!views) return [];
    if (!search) return views;
    const s = search.toLowerCase();
    return views.filter((v) => {
      const veh = v.vehicles;
      const label = `${veh?.marca || ""} ${veh?.modelo || ""} ${veh?.version || ""} ${veh?.year || ""}`.toLowerCase();
      return label.includes(s);
    });
  }, [views, search]);

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Vehículo</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Marca, modelo, año…" className="pl-8" />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {filtered.length} visita(s) — últimas 500 · El tráfico público se registra de forma anónima
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-card animate-pulse rounded-lg border border-border" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Eye className="h-10 w-10" />} title="Sin visitas registradas" subtitle="Aún no se ha registrado tráfico en el catálogo." />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide">Vehículo</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide hidden md:table-cell">ID</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      {v.vehicles ? `${v.vehicles.marca} ${v.vehicles.modelo} ${v.vehicles.version || ""} ${v.vehicles.year}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell font-mono text-[10px] text-muted-foreground">{v.vehicle_id}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums whitespace-nowrap">
                      {format(new Date(v.viewed_at), "dd/MM/yy HH:mm:ss", { locale: es })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

const EmptyState = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
    <div className="text-muted-foreground/40 mx-auto mb-3 flex justify-center">{icon}</div>
    <p className="text-sm font-semibold text-foreground">{title}</p>
    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
  </div>
);

export default Auditoria;
