import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, FileText, MessageSquare, TrendingUp, Eye, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/formatPrice";

const Dashboard = () => {
  const { data: vehicleStats } = useQuery({
    queryKey: ["admin-vehicle-stats"],
    queryFn: async () => {
      const { data: all } = await supabase.from("vehicles").select("id, price, status, created_at");
      const disponibles = all?.filter(v => v.status === "disponible") || [];
      const totalValue = disponibles.reduce((sum, v) => sum + Number(v.price), 0);
      const recent = all?.filter(v => {
        const d = new Date(v.created_at);
        const now = new Date();
        return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
      }) || [];
      return { total: all?.length || 0, disponibles: disponibles.length, totalValue, recentCount: recent.length };
    },
  });

  const { data: consignmentCount } = useQuery({
    queryKey: ["admin-consignment-count"],
    queryFn: async () => {
      const { count } = await supabase.from("consignment_requests").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: messageCount } = useQuery({
    queryKey: ["admin-message-count"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "nuevo");
      return count || 0;
    },
  });

  const { data: recentVehicles } = useQuery({
    queryKey: ["admin-recent-vehicles"],
    queryFn: async () => {
      const { data } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  const stats = [
    { label: "Vehículos Totales", value: vehicleStats?.total ?? "—", icon: Car, color: "bg-primary/10 text-primary", link: "/admin/vehiculos" },
    { label: "Disponibles", value: vehicleStats?.disponibles ?? "—", icon: Eye, color: "bg-green-500/10 text-green-600", link: "/admin/vehiculos" },
    { label: "Consignaciones", value: consignmentCount ?? "—", icon: FileText, color: "bg-blue-500/10 text-blue-600", link: "/admin/consignaciones" },
    { label: "Mensajes Nuevos", value: messageCount ?? "—", icon: MessageSquare, color: "bg-amber-500/10 text-amber-600", link: "/admin/mensajes" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Resumen general del inventario y actividad</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      {/* Inventory Value */}
      {vehicleStats && (
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground">
          <p className="text-sm uppercase tracking-wide opacity-80">Valor Total del Inventario Disponible</p>
          <p className="text-3xl font-black mt-1">{formatPrice(vehicleStats.totalValue)}</p>
          <p className="text-sm opacity-70 mt-1">{vehicleStats.disponibles} vehículos disponibles · {vehicleStats.recentCount} agregados esta semana</p>
        </div>
      )}

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
          {recentVehicles?.map((v) => {
            const images = (v.images as string[]) || [];
            return (
              <Link key={v.id} to={`/admin/vehiculos/${v.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={images[0] || "/placeholder.svg"}
                    alt={`${v.marca} ${v.modelo}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{v.marca} {v.modelo} {v.year}</p>
                  <p className="text-xs text-muted-foreground">{v.combustible} · {v.transmision}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-primary text-sm">{formatPrice(v.price)}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    v.status === 'disponible' ? 'bg-green-100 text-green-700' :
                    v.status === 'vendido' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {v.status}
                  </span>
                </div>
              </Link>
            );
          })}
          {(!recentVehicles || recentVehicles.length === 0) && (
            <div className="p-8 text-center text-muted-foreground">No hay vehículos registrados</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
