import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { CalendarIcon, Download, FileSpreadsheet, Receipt, Search, TrendingUp, Wallet, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; class: string }> = {
  vendido: { label: "Vendido", class: "bg-red-500/15 text-red-700 border-red-200" },
  en_tramite: { label: "En Trámite", class: "bg-purple-500/15 text-purple-700 border-purple-200" },
  reservado: { label: "Reservado", class: "bg-amber-500/15 text-amber-700 border-amber-200" },
};

const Ventas = () => {
  const { toast } = useToast();
  const today = new Date();
  const last30 = new Date();
  last30.setDate(today.getDate() - 30);

  const [statusFilter, setStatusFilter] = useState<string>("vendido");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(last30);
  const [dateTo, setDateTo] = useState<Date | undefined>(today);
  const [buyerSearch, setBuyerSearch] = useState("");
  const [sellerSearch, setSellerSearch] = useState("");
  const [plateSearch, setPlateSearch] = useState("");

  const { data: sales, isLoading } = useQuery({
    queryKey: ["admin-ventas", statusFilter, dateFrom?.toISOString(), dateTo?.toISOString()],
    queryFn: async () => {
      let q = supabase.from("vehicles").select("*").order("fecha_venta", { ascending: false, nullsFirst: false });
      if (statusFilter === "todos") {
        q = q.in("status", ["vendido", "en_tramite", "reservado"]);
      } else {
        q = q.eq("status", statusFilter);
      }
      if (dateFrom) q = q.gte("fecha_venta", dateFrom.toISOString().split("T")[0]);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        q = q.lte("fecha_venta", end.toISOString());
      }
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    if (!sales) return [];
    return sales.filter((v: any) => {
      if (buyerSearch && !(v.comprador_nombre || "").toLowerCase().includes(buyerSearch.toLowerCase())) return false;
      if (sellerSearch && !(v.vendedor_nombre || "").toLowerCase().includes(sellerSearch.toLowerCase())) return false;
      if (plateSearch && !(v.placa || "").toLowerCase().includes(plateSearch.toLowerCase())) return false;
      return true;
    });
  }, [sales, buyerSearch, sellerSearch, plateSearch]);

  const totalVentas = filtered.length;
  const totalValor = filtered.reduce((acc: number, v: any) => acc + Number(v.valor_venta || v.price || 0), 0);
  const ticketPromedio = totalVentas > 0 ? totalValor / totalVentas : 0;

  const exportData = () =>
    filtered.map((v: any) => ({
      "Fecha de venta": v.fecha_venta ? format(new Date(v.fecha_venta), "yyyy-MM-dd") : "",
      Marca: v.marca,
      Modelo: v.modelo,
      Versión: v.version || "",
      Año: v.year,
      Placa: v.placa || "",
      Vendedor: v.vendedor_nombre || "",
      Comprador: v.comprador_nombre || "",
      Cédula: v.comprador_cedula || "",
      Teléfono: v.comprador_telefono || "",
      Correo: v.comprador_correo || "",
      Dirección: v.comprador_direccion || "",
      Ciudad: v.comprador_ciudad || "",
      "Valor de venta": Number(v.valor_venta || v.price || 0),
      Estado: statusConfig[v.status]?.label || v.status,
    }));

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      toast({ title: "Nada para exportar", description: "Ajusta los filtros para incluir resultados.", variant: "destructive" });
      return;
    }
    const ws = XLSX.utils.json_to_sheet(exportData());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, `ventas_lmautos_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast({ title: "Excel exportado", description: `${filtered.length} ventas descargadas.` });
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast({ title: "Nada para exportar", variant: "destructive" });
      return;
    }
    const ws = XLSX.utils.json_to_sheet(exportData());
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ventas_lmautos_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exportado", description: `${filtered.length} ventas descargadas.` });
  };

  const clearFilters = () => {
    setBuyerSearch("");
    setSellerSearch("");
    setPlateSearch("");
    setStatusFilter("vendido");
    setDateFrom(last30);
    setDateTo(today);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Gestión de Ventas
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">CRM de cierres comerciales · Exportable a Excel/CSV</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="font-bold uppercase tracking-wide text-xs">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button onClick={handleExportExcel} className="font-bold uppercase tracking-wide">
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard icon={<Receipt className="h-4 w-4 text-red-600" />} label="Ventas en rango" value={totalVentas.toString()} bg="bg-red-500/10" />
        <KpiCard icon={<Wallet className="h-4 w-4 text-emerald-600" />} label="Valor total" value={formatPrice(totalValor)} bg="bg-emerald-500/10" />
        <KpiCard icon={<TrendingUp className="h-4 w-4 text-blue-600" />} label="Ticket promedio" value={formatPrice(ticketPromedio)} bg="bg-blue-500/10" />
      </div>

      {/* Filtros */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Desde</Label>
            <DatePickerField date={dateFrom} onChange={setDateFrom} placeholder="Fecha inicio" />
          </div>
          <div>
            <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Hasta</Label>
            <DatePickerField date={dateTo} onChange={setDateTo} placeholder="Fecha fin" />
          </div>
          <div>
            <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Estado</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="en_tramite">En Trámite</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
                <SelectItem value="todos">Todos (vendido + trámite + reservado)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Comprador</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={buyerSearch} onChange={(e) => setBuyerSearch(e.target.value)} placeholder="Nombre" className="pl-8" />
            </div>
          </div>
          <div>
            <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Vendedor / Placa</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input value={sellerSearch} onChange={(e) => setSellerSearch(e.target.value)} placeholder="Vendedor" />
              <Input value={plateSearch} onChange={(e) => setPlateSearch(e.target.value)} placeholder="Placa" />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{filtered.length} resultado(s)</span>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">Limpiar filtros</Button>
        </div>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-card animate-pulse rounded-lg border border-border" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-foreground">No hay ventas que coincidan con los filtros</p>
          <p className="text-xs text-muted-foreground mt-1">Marca un vehículo como Vendido y completa los datos del comprador.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <Th>Fecha</Th>
                  <Th>Vehículo</Th>
                  <Th>Placa</Th>
                  <Th>Vendedor</Th>
                  <Th>Comprador</Th>
                  <Th className="hidden md:table-cell">Teléfono</Th>
                  <Th className="text-right">Valor</Th>
                  <Th className="text-center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((v: any) => {
                  const sc = statusConfig[v.status] || statusConfig.vendido;
                  return (
                    <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {v.fecha_venta ? format(new Date(v.fecha_venta), "dd/MM/yyyy") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/vehiculos/${v.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                          {v.marca} {v.modelo} {v.version || ""}
                        </Link>
                        <div className="text-xs text-muted-foreground">{v.year}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{v.placa || <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-4 py-3 text-muted-foreground">{v.vendedor_nombre || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{v.comprador_nombre || "—"}</div>
                        {v.comprador_ciudad && <div className="text-xs text-muted-foreground">{v.comprador_ciudad}</div>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{v.comprador_telefono || "—"}</td>
                      <td className="px-4 py-3 text-right font-bold text-foreground whitespace-nowrap">
                        {formatPrice(Number(v.valor_venta || v.price || 0))}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={cn("font-bold uppercase text-[10px]", sc.class)}>{sc.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={cn("text-left px-4 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wide", className)}>{children}</th>
);

const KpiCard = ({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) => (
  <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", bg)}>{icon}</div>
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
      <div className="text-lg font-black text-foreground truncate" style={{ fontFamily: "Montserrat, sans-serif" }}>{value}</div>
    </div>
  </div>
);

const DatePickerField = ({ date, onChange, placeholder }: { date?: Date; onChange: (d?: Date) => void; placeholder: string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
        {date ? format(date, "dd MMM yyyy") : <span>{placeholder}</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar mode="single" selected={date} onSelect={onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
    </PopoverContent>
  </Popover>
);

export default Ventas;
