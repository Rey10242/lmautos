import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, FileText, MessageSquare, TrendingUp, Eye, Clock, ShoppingCart, CalendarPlus, Layers, Plus, Handshake, FileCheck, CalendarRange } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/formatPrice";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS: Record<string, string> = {
  disponible: "hsl(160, 60%, 45%)",
  vendido: "hsl(0, 70%, 55%)",
  reservado: "hsl(40, 90%, 50%)",
  consignado: "hsl(210, 70%, 55%)",
  en_tramite: "hsl(270, 60%, 55%)",
  oculto: "hsl(220, 10%, 60%)",
};

const STATUS_LABELS: Record<string, string> = {
  disponible: "Disponible",
  vendido: "Vendido",
  reservado: "Reservado",
  consignado: "Consignado",
  en_tramite: "En Trámite",
  oculto: "Oculto",
};

type DateRange = "all" | "this_week" | "this_month" | "last_3_months" | "this_year";

const getDateFilter = (range: DateRange): Date | null => {
  const now = new Date();
  switch (range) {
    case "this_week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    case "this_month": {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    case "last_3_months": {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 3);
      return d;
    }
    case "this_year": {
      return new Date(now.getFullYear(), 0, 1);
    }
    default:
      return null;
  }
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>("all");

  const { data: vehicles } = useQuery({
    queryKey: ["admin-all-vehicles"],
    queryFn: async () => {
      const { data } = await supabase.from("vehicles").select("*");
      return data || [];
    },
  });

  const { data: pendingConsignments } = useQuery({
    queryKey: ["admin-pending-consignments"],
    queryFn: async () => {
      const { count } = await supabase.from("consignment_requests").select("*", { count: "exact", head: true }).eq("status", "pendiente");
      return count || 0;
    },
  });

  const { data: newMessages } = useQuery({
    queryKey: ["admin-new-messages"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "nuevo");
      return count || 0;
    },
  });

  const dateFilter = getDateFilter(dateRange);

  // Filtered vehicles by date
  const filteredVehicles = vehicles?.filter(v => {
    if (!dateFilter) return true;
    const created = new Date(v.created_at);
    return created >= dateFilter;
  }) || [];

  // All-time counts for inventory
  const inventarioTotal = vehicles?.filter(v => ["disponible", "consignado", "reservado"].includes(v.status || "")).length || 0;
  const disponibles = vehicles?.filter(v => v.status === "disponible").length || 0;
  const consignados = vehicles?.filter(v => v.status === "consignado").length || 0;
  const vendidos = filteredVehicles.filter(v => v.status === "vendido").length;
  const enTramite = vehicles?.filter(v => v.status === "en_tramite").length || 0;
  const reservados = vehicles?.filter(v => v.status === "reservado").length || 0;
  const agregados = filteredVehicles.length;

  // Charts data
  const statusData = vehicles ? [
    { name: "Disponible", value: vehicles.filter(v => v.status === "disponible").length, color: COLORS.disponible },
    { name: "Vendido", value: vehicles.filter(v => v.status === "vendido").length, color: COLORS.vendido },
    { name: "Reservado", value: vehicles.filter(v => v.status === "reservado").length, color: COLORS.reservado },
    { name: "Consignado", value: vehicles.filter(v => v.status === "consignado").length, color: COLORS.consignado },
    { name: "En Trámite", value: vehicles.filter(v => v.status === "en_tramite").length, color: COLORS.en_tramite },
    { name: "Oculto", value: vehicles.filter(v => v.status === "oculto").length, color: COLORS.oculto },
  ].filter(d => d.value > 0) : [];

  const brandData = vehicles ? Object.entries(
    vehicles.reduce<Record<string, number>>((acc, v) => {
      acc[v.marca] = (acc[v.marca] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 8)
  : [];

  const recentVehicles = vehicles
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) || [];

  const mainStats = [
    { label: "Total Inventario", value: inventarioTotal, icon: Car, color: "bg-primary/10 text-primary", link: "/admin/vehiculos" },
    { label: "Disponibles", value: disponibles, icon: Eye, color: "bg-emerald-500/10 text-emerald-600", link: "/admin/vehiculos" },
    { label: "Consignados", value: consignados, icon: Handshake, color: "bg-blue-500/10 text-blue-600", link: "/admin/vehiculos" },
    { label: "Vendidos", value: vendidos, icon: ShoppingCart, color: "bg-red-500/10 text-red-600", link: "/admin/vehiculos" },
  ];

  const secondaryStats = [
    { label: "En Trámite", value: enTramite, icon: FileCheck, color: "bg-purple-500/10 text-purple-600", link: "/admin/vehiculos" },
    { label: "Reservados", value: reservados, icon: Clock, color: "bg-amber-500/10 text-amber-600", link: "/admin/vehiculos" },
    { label: "Consignaciones Pendientes", value: pendingConsignments ?? "—", icon: FileText, color: "bg-orange-500/10 text-orange-600", link: "/admin/consignaciones" },
    { label: "Mensajes Nuevos", value: newMessages ?? "—", icon: MessageSquare, color: "bg-cyan-500/10 text-cyan-600", link: "/admin/mensajes" },
  ];

  const dateRangeLabel: Record<DateRange, string> = {
    all: "Todo el tiempo",
    this_week: "Esta semana",
    this_month: "Este mes",
    last_3_months: "Últimos 3 meses",
    this_year: "Este año",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Resumen general del inventario y actividad</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
              <SelectTrigger className="w-[180px] h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dateRangeLabel).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link to="/admin/vehiculos/nuevo">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Vehículo
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-3xl font-black text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryStats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/20 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-bold text-foreground uppercase tracking-wide text-sm mb-4">Distribución por Estado</h2>
          {statusData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {statusData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-foreground">{d.name}</span>
                    </div>
                    <span className="font-bold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Sin datos</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-bold text-foreground uppercase tracking-wide text-sm mb-4">Top Marcas</h2>
          {brandData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={brandData} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 13%, 91%)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(40, 95%, 50%)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Sin datos</p>
          )}
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground uppercase tracking-wide text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Últimos Vehículos Agregados
          </h2>
          <Link to="/admin/vehiculos" className="text-xs text-primary font-semibold hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentVehicles.map((v) => {
            const images = (v.images as string[]) || [];
            const statusColor = COLORS[v.status || "disponible"] || COLORS.oculto;
            const statusLabel = STATUS_LABELS[v.status || "disponible"] || v.status;
            return (
              <Link key={v.id} to={`/admin/vehiculos/${v.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img src={images[0] || "/placeholder.svg"} alt={`${v.marca} ${v.modelo}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{v.marca} {v.modelo} {v.version || ""} {v.year}</p>
                  <p className="text-xs text-muted-foreground">{v.combustible} · {v.transmision}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-foreground text-sm">{formatPrice(v.price)}</p>
                  <span
                    className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block"
                    style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                  >
                    {statusLabel}
                  </span>
                </div>
              </Link>
            );
          })}
          {recentVehicles.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No hay vehículos registrados</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
