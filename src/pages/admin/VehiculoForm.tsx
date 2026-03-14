import { useState, useEffect, useCallback } from "react";
import { generateSlug } from "@/lib/slugify";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Upload, X, Loader2, GripVertical, ExternalLink } from "lucide-react";

const marcas = ["Chevrolet", "Renault", "Mazda", "Toyota", "Nissan", "Hyundai", "Kia", "Ford", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Honda", "Suzuki", "Mitsubishi", "Jeep", "Dodge", "Fiat", "Peugeot", "Citroën"];
const combustibles = ["Gasolina", "Diesel", "Híbrido", "Eléctrico", "Gas"];
const transmisiones = ["Automática", "Manual", "Automática secuencial"];
const tracciones = ["4x2", "4x4", "AWD"];
const estados = ["Nuevo", "Usado", "Certificado"];
const statuses = [
  { value: "disponible", label: "Disponible", class: "bg-emerald-500/15 text-emerald-700" },
  { value: "consignado", label: "Consignado", class: "bg-blue-500/15 text-blue-700" },
  { value: "reservado", label: "Reservado", class: "bg-amber-500/15 text-amber-700" },
  { value: "vendido", label: "Vendido", class: "bg-red-500/15 text-red-700" },
  { value: "en_tramite", label: "En Trámite", class: "bg-purple-500/15 text-purple-700" },
  { value: "oculto", label: "Oculto", class: "bg-muted text-muted-foreground" },
];

interface FormData {
  marca: string; modelo: string; version: string; year: string; price: string;
  kilometraje: string; combustible: string; transmision: string; color: string;
  cilindrada: string; num_puertas: string; traccion: string; estado_vehiculo: string;
  descripcion: string; status: string; destacado: boolean; recien_ingresado: boolean;
  transito: string; fecha_venta: string;
}

const defaultForm: FormData = {
  marca: "", modelo: "", version: "", year: "", price: "", kilometraje: "",
  combustible: "", transmision: "", color: "", cilindrada: "", num_puertas: "4",
  traccion: "", estado_vehiculo: "", descripcion: "", status: "disponible",
  destacado: false, recien_ingresado: false, transito: "", fecha_venta: "",
};

const VehiculoForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState<FormData>(defaultForm);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { data: vehicle } = useQuery({
    queryKey: ["admin-vehicle", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (vehicle) {
      setForm({
        marca: vehicle.marca, modelo: vehicle.modelo, version: vehicle.version || "",
        year: String(vehicle.year), price: String(vehicle.price), kilometraje: String(vehicle.kilometraje),
        combustible: vehicle.combustible, transmision: vehicle.transmision, color: vehicle.color || "",
        cilindrada: vehicle.cilindrada || "", num_puertas: String(vehicle.num_puertas || 4),
        traccion: vehicle.traccion || "", estado_vehiculo: vehicle.estado_vehiculo || "",
        descripcion: vehicle.descripcion || "", status: vehicle.status || "disponible",
        destacado: vehicle.destacado || false, recien_ingresado: vehicle.recien_ingresado || false,
        transito: (vehicle as any).transito || "", fecha_venta: (vehicle as any).fecha_venta ? new Date((vehicle as any).fecha_venta).toISOString().split("T")[0] : "",
      });
      setImages((vehicle.images as string[]) || []);
    }
  }, [vehicle]);

  const update = (key: keyof FormData, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("vehicle-images").upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("vehicle-images").getPublicUrl(path);
        newImages.push(urlData.publicUrl);
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

  // Drag & drop reorder
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    setImages(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const slug = generateSlug(form.marca, form.modelo, form.version, form.year);
      const payload: Record<string, any> = {
        marca: form.marca, modelo: form.modelo, version: form.version || null,
        year: parseInt(form.year), price: parseInt(form.price), kilometraje: parseInt(form.kilometraje),
        combustible: form.combustible, transmision: form.transmision, color: form.color || null,
        cilindrada: form.cilindrada || null, num_puertas: parseInt(form.num_puertas) || null,
        traccion: form.traccion || null, estado_vehiculo: form.estado_vehiculo || null,
        descripcion: form.descripcion || null, status: form.status, destacado: form.destacado,
        recien_ingresado: form.recien_ingresado, images: images, user_id: user!.id,
        transito: form.transito || null,
        fecha_venta: (form.status === "vendido" || form.status === "en_tramite") && form.fecha_venta ? form.fecha_venta : null,
        slug,
      };
      if (isEdit) {
        const { error } = await supabase.from("vehicles").update(payload as any).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vehicles").insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast({ title: isEdit ? "Vehículo actualizado" : "Vehículo creado" });
      navigate("/admin/vehiculos");
    },
    onError: (err: any) => {
      toast({ title: "Error al guardar", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.marca || !form.modelo || !form.year || !form.price || !form.kilometraje || !form.combustible || !form.transmision) {
      toast({ title: "Completa los campos requeridos", variant: "destructive" });
      return;
    }
    saveMutation.mutate();
  };

  const currentStatus = statuses.find(s => s.value === form.status) || statuses[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/vehiculos")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wide text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
            </h1>
            {isEdit && form.marca && (
              <p className="text-sm text-muted-foreground">{form.marca} {form.modelo} {form.version} {form.year}</p>
            )}
          </div>
        </div>
        {isEdit && (
          <Button variant="outline" size="sm" asChild>
            <a href={`/vehiculo/${(vehicle as any)?.slug || id}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" /> Ver en sitio
            </a>
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images with drag reorder */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm uppercase tracking-wide text-foreground">Fotografías</h2>
            <span className="text-xs text-muted-foreground">{images.length} foto(s) · Arrastra para reordenar</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
            {images.map((img, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={() => handleDrop(i)}
                onDragEnd={handleDragEnd}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group cursor-grab active:cursor-grabbing transition-all ${
                  dragOverIndex === i ? 'ring-2 ring-primary scale-105' : ''
                } ${dragIndex === i ? 'opacity-50' : ''}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-70 transition-opacity">
                  <GripVertical className="h-4 w-4 text-white drop-shadow" />
                </div>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                    Principal
                  </span>
                )}
              </div>
            ))}
            <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
              {uploading ? (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground">Subir fotos</span>
                </>
              )}
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-bold text-sm uppercase tracking-wide text-foreground mb-4">Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Marca *</Label>
              <Select value={form.marca} onValueChange={(v) => update("marca", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>{marcas.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Modelo *</Label>
              <Input value={form.modelo} onChange={e => update("modelo", e.target.value)} placeholder="Ej: Spark GT" />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Versión</Label>
              <Input value={form.version} onChange={e => update("version", e.target.value)} placeholder="Ej: LTZ" />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Año *</Label>
              <Input type="number" value={form.year} onChange={e => update("year", e.target.value)} placeholder="2024" />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Precio (COP) *</Label>
              <Input type="number" value={form.price} onChange={e => update("price", e.target.value)} placeholder="45000000" />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Kilometraje *</Label>
              <Input type="number" value={form.kilometraje} onChange={e => update("kilometraje", e.target.value)} placeholder="15000" />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Tránsito</Label>
              <Input value={form.transito} onChange={e => update("transito", e.target.value)} placeholder="Ej: Bogotá, Medellín" />
            </div>
          </div>
        </div>

        {/* Technical */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-bold text-sm uppercase tracking-wide text-foreground mb-4">Especificaciones Técnicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Combustible *</Label>
              <Select value={form.combustible} onValueChange={(v) => update("combustible", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>{combustibles.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Transmisión *</Label>
              <Select value={form.transmision} onValueChange={(v) => update("transmision", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>{transmisiones.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Tracción</Label>
              <Select value={form.traccion} onValueChange={(v) => update("traccion", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>{tracciones.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Color</Label>
              <Input value={form.color} onChange={e => update("color", e.target.value)} placeholder="Blanco" />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Cilindraje</Label>
              <Input value={form.cilindrada} onChange={e => update("cilindrada", e.target.value)} placeholder="1.2L" />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Puertas</Label>
              <Input type="number" value={form.num_puertas} onChange={e => update("num_puertas", e.target.value)} />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Estado del vehículo</Label>
              <Select value={form.estado_vehiculo} onValueChange={(v) => update("estado_vehiculo", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>{estados.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-bold text-sm uppercase tracking-wide text-foreground mb-4">Descripción</h2>
          <Textarea
            value={form.descripcion}
            onChange={e => update("descripcion", e.target.value)}
            placeholder="Describe el vehículo, equipamiento, historial de mantenimiento..."
            rows={5}
          />
          <p className="text-xs text-muted-foreground mt-2">{form.descripcion.length} caracteres</p>
        </div>

        {/* Status & Flags */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-bold text-sm uppercase tracking-wide text-foreground mb-4">Publicación</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Estado de publicación</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${s.value === 'disponible' ? 'bg-emerald-500' : s.value === 'vendido' ? 'bg-red-500' : s.value === 'reservado' ? 'bg-amber-500' : s.value === 'consignado' ? 'bg-blue-500' : s.value === 'en_tramite' ? 'bg-purple-500' : 'bg-muted-foreground'}`} />
                        {s.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
              <div>
                <Label className="text-xs uppercase text-muted-foreground font-semibold">Destacado</Label>
                <p className="text-[10px] text-muted-foreground">Aparece en la sección principal</p>
              </div>
              <Switch checked={form.destacado} onCheckedChange={(v) => update("destacado", v)} />
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
              <div>
                <Label className="text-xs uppercase text-muted-foreground font-semibold">Recién Ingresado</Label>
                <p className="text-[10px] text-muted-foreground">Muestra badge "Nuevo"</p>
              </div>
              <Switch checked={form.recien_ingresado} onCheckedChange={(v) => update("recien_ingresado", v)} />
            </div>
            {(form.status === "vendido" || form.status === "en_tramite") && (
              <div>
                <Label className="text-xs uppercase text-muted-foreground font-semibold">Fecha de Venta</Label>
                <Input type="date" value={form.fecha_venta} onChange={e => update("fecha_venta", e.target.value)} />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-between items-center bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground">
            {isEdit && vehicle && <>Última actualización: {new Date(vehicle.updated_at).toLocaleString('es-CO')}</>}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/vehiculos")}>Cancelar</Button>
            <Button type="submit" disabled={saveMutation.isPending} className="font-bold uppercase tracking-wide">
              {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEdit ? "Guardar Cambios" : "Crear Vehículo"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VehiculoForm;
