import { Car, LayoutDashboard, MessageSquare, FileText, LogOut, Home, Receipt, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRole";
import logoWhite from "@/assets/logo-white-horizontal.png";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();
  const { isSuperAdmin } = useUserRoles();

  // Badge counts
  const { data: pendingConsignments } = useQuery({
    queryKey: ["sidebar-pending-consignments"],
    queryFn: async () => {
      const { count } = await supabase.from("consignment_requests").select("*", { count: "exact", head: true }).eq("status", "pendiente");
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const { data: newMessages } = useQuery({
    queryKey: ["sidebar-new-messages"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "nuevo");
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const { data: salesThisMonth } = useQuery({
    queryKey: ["sidebar-sales-month"],
    queryFn: async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("vehicles")
        .select("*", { count: "exact", head: true })
        .eq("status", "vendido")
        .gte("fecha_venta", start.toISOString());
      return count || 0;
    },
    refetchInterval: 60000,
  });

  const navItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard, badge: 0 },
    { title: "Vehículos", url: "/admin/vehiculos", icon: Car, badge: 0 },
    { title: "Ventas", url: "/admin/ventas", icon: Receipt, badge: 0 },
    { title: "Consignaciones", url: "/admin/consignaciones", icon: FileText, badge: pendingConsignments || 0 },
    { title: "Mensajes", url: "/admin/mensajes", icon: MessageSquare, badge: newMessages || 0 },
    ...(isSuperAdmin ? [{ title: "Auditoría", url: "/admin/auditoria", icon: ShieldCheck, badge: 0 }] : []),
  ];

  const isActive = (url: string) => {
    if (url === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-4 py-5 flex items-center gap-3">
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
              <Car className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
          ) : (
            <img src={logoWhite} alt="LM Autos" className="h-8 w-auto" />
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40">Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative",
                        isActive(item.url)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm flex-1">{item.title}</span>}
                      {item.badge > 0 && (
                        <span className={cn(
                          "bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center",
                          collapsed ? "absolute -top-1 -right-1 w-4 h-4" : "w-5 h-5"
                        )}>
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-1">
        <SidebarMenuButton asChild>
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent rounded-lg transition-colors">
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">Ver Sitio</span>}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton asChild>
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 w-full text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors">
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">Cerrar Sesión</span>}
          </button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
