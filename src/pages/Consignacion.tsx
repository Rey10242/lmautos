import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import PageBanner from "@/components/layout/PageBanner";
import SEOHead from "@/components/shared/SEOHead";
import { SITE_URL } from "@/lib/constants";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, Upload, X, ImageIcon } from "lucide-react";
import { trackConsignmentFormSubmit, trackFormStart } from "@/lib/analytics";

const schema = z.object({
  nombre: z.string().trim().min(1, "Requerido").max(100),
  telefono: z.string().trim().min(7, "Teléfono inválido").max(20),
  correo: z.string().trim().email("Correo inválido").max(255),
  marca: z.string().trim().min(1, "Requerido").max(50),
  modelo: z.string().trim().min(1, "Requerido").max(50),
  year: z.coerce.number().min(1981, "Año inválido").max(new Date().getFullYear() + 1, "Año inválido"),
  kilometraje: z.coerce.number().min(0, "Kilometraje inválido"),
  ciudad: z.string().trim().min(1, "Requerido").max(100),
  precio_esperado: z.coerce.number().min(0).optional().or(z.literal("")),
  descripcion: z.string().trim().max(2000).optional(),
});

type FormValues = z.infer<typeof schema>;

const MAX_PHOTOS = 10;
const MAX_PHOTO_SIZE_MB = 8;

const Consignacion = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", telefono: "", correo: "", marca: "", modelo: "", year: undefined as any, kilometraje: undefined as any, ciudad: "", precio_esperado: "" as any, descripcion: "" },
  });

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - photos.length;
    const accepted: File[] = [];
    for (const f of files.slice(0, remaining)) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
        toast({ title: "Foto muy grande", description: `${f.name} supera ${MAX_PHOTO_SIZE_MB}MB`, variant: "destructive" });
        continue;
      }
      accepted.push(f);
    }
    if (files.length > remaining) {
      toast({ title: "Límite alcanzado", description: `Máximo ${MAX_PHOTOS} fotos.` });
    }
    setPhotos((prev) => [...prev, ...accepted]);
    setPreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onSubmit = async (values: FormValues) => {
    let uploadedUrls: string[] = [];
    if (photos.length > 0) {
      setUploading(true);
      const folder = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      for (const file of photos) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${folder}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("consignment-photos").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
        if (upErr) {
          setUploading(false);
          toast({ title: "Error subiendo fotos", description: upErr.message, variant: "destructive" });
          return;
        }
        const { data: pub } = supabase.storage.from("consignment-photos").getPublicUrl(path);
        uploadedUrls.push(pub.publicUrl);
      }
      setUploading(false);
    }

    const { error } = await supabase.from("consignment_requests").insert({
      nombre: values.nombre,
      telefono: values.telefono,
      correo: values.correo,
      marca: values.marca,
      modelo: values.modelo,
      year: values.year,
      kilometraje: values.kilometraje,
      ciudad: values.ciudad,
      precio_esperado: values.precio_esperado ? Number(values.precio_esperado) : null,
      descripcion: values.descripcion || null,
      fotos: uploadedUrls,
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo enviar la solicitud. Intenta de nuevo.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    trackConsignmentFormSubmit({
      nombre: values.nombre,
      telefono: values.telefono,
      marca: values.marca,
      modelo: values.modelo,
      year: values.year,
      precio_esperado: values.precio_esperado ? Number(values.precio_esperado) : undefined,
    });
  };

  return (
    <>
      <SEOHead
        title="Consigna tu Vehículo"
        description="Consigna tu vehículo en LM Autos Cartagena. Nos encargamos de la venta: fotografía profesional, publicación, negociación y trámites. Sin complicaciones."
        canonical={`${SITE_URL}/consignacion`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Consignación de Vehículos",
          description: "Servicio de consignación de vehículos usados en Cartagena, Colombia",
          provider: { "@type": "AutoDealer", name: "LM Autos", url: SITE_URL },
          areaServed: { "@type": "City", name: "Cartagena de Indias" },
        }}
      />
      <PageBanner title="Consignación de Vehículos" breadcrumbs={[{ label: "Inicio", path: "/" }, { label: "Consignación" }]} />
      <div className="container py-10 max-w-2xl">
        {submitted ? (
          <div className="text-center py-16">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>¡Solicitud Enviada!</h2>
            <p className="text-muted-foreground mt-2">Nos pondremos en contacto contigo pronto.</p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-8">
              Completa el formulario con los datos de tu vehículo y nos pondremos en contacto contigo para iniciar el proceso de consignación.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" onFocus={() => { if (!formStarted) { setFormStarted(true); trackFormStart('consignacion_vehiculo'); } }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="nombre" render={({ field }) => (
                    <FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input placeholder="Tu nombre" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="telefono" render={({ field }) => (
                    <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input placeholder="315 000 0990" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="correo" render={({ field }) => (
                    <FormItem><FormLabel>Correo Electrónico</FormLabel><FormControl><Input type="email" placeholder="tu@correo.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="ciudad" render={({ field }) => (
                    <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input placeholder="Bogotá" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="marca" render={({ field }) => (
                    <FormItem><FormLabel>Marca</FormLabel><FormControl><Input placeholder="Chevrolet" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="modelo" render={({ field }) => (
                    <FormItem><FormLabel>Modelo</FormLabel><FormControl><Input placeholder="Spark GT" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem><FormLabel>Año</FormLabel><FormControl><Input type="number" placeholder="2020" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="kilometraje" render={({ field }) => (
                    <FormItem><FormLabel>Kilometraje</FormLabel><FormControl><Input type="number" placeholder="50000" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="precio_esperado" render={({ field }) => (
                    <FormItem><FormLabel>Precio Esperado (COP)</FormLabel><FormControl><Input type="number" placeholder="35000000" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="descripcion" render={({ field }) => (
                  <FormItem><FormLabel>Descripción Adicional</FormLabel><FormControl><Textarea placeholder="Detalles adicionales del vehículo..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="space-y-2">
                  <Label>Fotos del vehículo <span className="text-muted-foreground font-normal">(opcional, máximo {MAX_PHOTOS})</span></Label>
                  <label
                    htmlFor="consignment-photos-input"
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-muted/30 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium">Sube fotos de tu vehículo</span>
                    <span className="text-xs text-muted-foreground">JPG, PNG o WEBP · Máx {MAX_PHOTO_SIZE_MB}MB c/u</span>
                    <input
                      id="consignment-photos-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotosChange}
                      disabled={photos.length >= MAX_PHOTOS}
                    />
                  </label>
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
                      {previews.map((src, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-md overflow-hidden border border-border bg-muted">
                          <img src={src} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 bg-background/90 hover:bg-destructive hover:text-destructive-foreground rounded-full p-1 transition-colors shadow"
                            aria-label="Eliminar foto"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {photos.length > 0 && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> {photos.length} foto(s) seleccionada(s)
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full font-bold uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }} disabled={form.formState.isSubmitting || uploading}>
                  <Send className="mr-2 h-5 w-5" />
                  {uploading ? "Subiendo fotos..." : form.formState.isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </form>
            </Form>
          </>
        )}
      </div>
    </>
  );
};

export default Consignacion;
