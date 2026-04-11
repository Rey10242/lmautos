import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, FileText, MessageSquare, TrendingUp, Eye, Clock, ShoppingCart, CalendarPlus, Layers, Plus, Handshake, FileCheck, CalendarRange, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/formatPrice";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Area, AreaChart } from "recharts";
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

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border/60 rounded-xl px-4 py-2.5 shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.payload.color }} />
        <span className="text-sm font-semibold text-foreground">{d.name}</span>
      </div>
      <p className="text-lg font-black text-foreground mt-0.5">{d.value} <span className="text-xs font-normal text-muted-foreground">vehículos</span></p>
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border/60 rounded-xl px-4 py-2.5 shadow-2xl">
      <p className="text-sm font-bold text-foreground">{label}</p>
      <p className="text-lg font-black text-primary">{payload[0].value} <span className="text-xs font-normal text-muted-foreground">unidades</span></p>
    </div>
  );
};

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border/60 rounded-xl px-4 py-2.5 shadow-2xl">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-lg font-black text-foreground">{payload[0].value} <span className="text-xs font-normal text-muted-foreground">visitas</span></p>
    </div>
  );
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

  // Fetch last 7 days of views
  const { data: viewsData } = useQuery({
    queryKey: ["admin-views-7days"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 6);
      since.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("vehicle_views")
        .select("viewed_at")
        .gte("viewed_at", since.toISOString());
      return data || [];
    },
  });

  const viewsTrend = useMemo(() => {
    const days: { label: string; views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric" });
      const count = viewsData?.filter(v => v.viewed_at.startsWith(key)).length || 0;
      days.push({ label, views: count });
    }
    return days;
  }, [viewsData]);

  const totalViews7Days = viewsTrend.reduce((s, d) => s + d.views, 0);

  const dateFilter = getDateFilter(dateRange);

  const filteredVehicles = vehicles?.filter(v => {
    if (!dateFilter) return true;
    return new Date(v.created_at) >= dateFilter;
  }) || [];

  const inventarioTotal = vehicles?.filter(v => ["disponible", "consignado", "reservado"].includes(v.status || "")).length || 0;
  const disponibles = vehicles?.filter(v => v.status === "disponible").length || 0;
  const consignados = vehicles?.filter(v => v.status === "consignado").length || 0;
  const vendidos = filteredVehicles.filter(v => v.status === "vendido").length;
  const enTramite = vehicles?.filter(v => v.status === "en_tramite").length || 0;
  const reservados = vehicles?.filter(v => v.status === "reservado").length || 0;

  const statusData = vehicles ? [
    { name: "Disponible", value: vehicles.filter(v => v.status === "disponible").length, color: COLORS.disponible },
    { name: "Vendido", value: vehicles.filter(v => v.status === "vendido").length, color: COLORS.vendido },
    { name: "Reservado", value: vehicles.filter(v => v.status === "reservado").length, color: COLORS.reservado },
    { name: "Consignado", value: vehicles.filter(v => v.status === "consignado").length, color: COLORS.consignado },
    { name: "En Trámite", value: vehicles.filter(v => v.status === "en_tramite").length, color: COLORS.en_tramite },
    { name: "Oculto", value: vehicles.filter(v => v.status === "oculto").length, color: COLORS.oculto },
  ].filter(d => d.value > 0) : [];

  const totalVehicles = statusData.reduce((s, d) => s + d.value, 0);

  const brandData = vehicles ? Object.entries(
    vehicles.reduce<Record<string, number>>((acc, v) => {
      acc[v.marca] = (acc[v.marca] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)
  : [];

  const recentVehicles = vehicles
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) || [];

  const mainStats = [
    { label: "Total Inventario", value: inventarioTotal, icon: Car, gradient: "from-primary/20 to-primary/5", iconBg: "bg-primary/15 text-primary", shadow: "shadow-primary/10" },
    { label: "Disponibles", value: disponibles, icon: Eye, gradient: "from-emerald-500/20 to-emerald-500/5", iconBg: "bg-emerald-500/15 text-emerald-600", shadow: "shadow-emerald-500/10" },
    { label: "Consignados", value: consignados, icon: Handshake, gradient: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/15 text-blue-600", shadow: "shadow-blue-500/10" },
    { label: "Vendidos", value: vendidos, icon: ShoppingCart, gradient: "from-red-500/20 to-red-500/5", iconBg: "bg-red-500/15 text-red-600", shadow: "shadow-red-500/10" },
  ];

  const secondaryStats = [
    { label: "En Trámite", value: enTramite, icon: FileCheck, color: "text-purple-600", iconBg: "bg-purple-500/10" },
    { label: "Reservados", value: reservados, icon: Clock, color: "text-amber-600", iconBg: "bg-amber-500/10" },
    { label: "Consignaciones", value: pendingConsignments ?? "—", icon: FileText, color: "text-orange-600", iconBg: "bg-orange-500/10", link: "/admin/consignaciones" },
    { label: "Mensajes", value: newMessages ?? "—", icon: MessageSquare, color: "text-cyan-600", iconBg: "bg-cyan-500/10", link: "/admin/mensajes" },
  ];

  const dateRangeLabel: Record<DateRange, string> = {
    all: "Todo el tiempo",
    this_week: "Esta semana",
    this_month: "Este mes",
    last_3_months: "Últimos 3 meses",
    this_year: "Este año",
  };

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Dashboard
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Resumen general del inventario y actividad</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
              <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dateRangeLabel).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/admin/vehiculos/nuevo">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Vehículo
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Stats - Glassmorphism cards with gradients */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat) => (
          <Link
            key={stat.label}
            to="/admin/vehiculos"
            className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} backdrop-blur-sm border border-border/60 rounded-2xl p-5 hover:shadow-xl ${stat.shadow} hover:scale-[1.02] transition-all duration-300 group`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg} transition-transform group-hover:scale-110 duration-300`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">{stat.value}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Secondary Stats - Compact row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {secondaryStats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link || "/admin/vehiculos"}
            className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Donut Chart */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <h2 className="font-bold text-foreground uppercase tracking-wider text-xs mb-5 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-primary" />
            Distribución
          </h2>
          {statusData.length > 0 ? (
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      strokeWidth={0}
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="text-3xl font-black text-foreground">{totalVehicles}</span>
                    <span className="block text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Total</span>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                {statusData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-sm group/legend">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-md group-hover/legend:scale-125 transition-transform" style={{ backgroundColor: d.color }} />
                      <span className="text-foreground text-xs font-medium">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{totalVehicles > 0 ? Math.round((d.value / totalVehicles) * 100) : 0}%</span>
                      <span className="font-bold text-foreground text-sm w-6 text-right">{d.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">Sin datos</p>
          )}
        </div>

        {/* Bar Chart - Top Brands */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <h2 className="font-bold text-foreground uppercase tracking-wider text-xs mb-5 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-blue-500" />
            Top Marcas
          </h2>
          {brandData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={brandData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={85}
                  tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'hsl(40, 95%, 50%, 0.06)' }} />
                <Bar
                  dataKey="value"
                  fill="hsl(40, 95%, 50%)"
                  radius={[0, 8, 8, 0]}
                  barSize={20}
                  background={{ fill: 'hsl(220, 13%, 90%, 0.3)', radius: 8 } as any}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">Sin datos</p>
          )}
        </div>

        {/* Area Chart - Visits trend */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-foreground uppercase tracking-wider text-xs flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-emerald-500" />
              Visitas 7 días
            </h2>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 rounded-lg px-2.5 py-1">
              <Activity className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-sm font-black text-emerald-600">{totalViews7Days}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={viewsTrend} margin={{ left: -10, right: 5, top: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="hsl(160, 60%, 45%)"
                strokeWidth={2.5}
                fill="url(#viewsGradient)"
                dot={{ r: 4, fill: 'hsl(160, 60%, 45%)', strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 6, fill: 'hsl(160, 60%, 45%)', strokeWidth: 3, stroke: 'white' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-bold text-foreground uppercase tracking-wider text-xs flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-primary" />
            Últimos Vehículos
          </h2>
          <Link to="/admin/vehiculos" className="text-xs text-primary font-bold hover:underline underline-offset-4">
            Ver todos →
          </Link>
        </div>
        <div className="divide-y divide-border/40">
          {recentVehicles.map((v) => {
            const imgs = (v.images as string[]) || [];
            const statusColor = COLORS[v.status || "disponible"] || COLORS.oculto;
            const statusLabel = STATUS_LABELS[v.status || "disponible"] || v.status;
            return (
              <Link key={v.id} to={`/admin/vehiculos/${v.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group">
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-muted shrink-0 ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                  <img src={imgs[0] || "/placeholder.svg"} alt={`${v.marca} ${v.modelo}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{v.marca} {v.modelo} {v.version || ""} {v.year}</p>
                  <p className="text-xs text-muted-foreground">{v.combustible} · {v.transmision}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-foreground text-sm">{formatPrice(v.price)}</p>
                  <span
                    className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5"
                    style={{ backgroundColor: `${statusColor}18`, color: statusColor }}
                  >
                    {statusLabel}
                  </span>
                </div>
              </Link>
            );
          })}
          {recentVehicles.length === 0 && (
            <div className="p-10 text-center text-muted-foreground text-sm">No hay vehículos registrados</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
