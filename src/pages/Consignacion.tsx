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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";
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

const Consignacion = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", telefono: "", correo: "", marca: "", modelo: "", year: undefined as any, kilometraje: undefined as any, ciudad: "", precio_esperado: "" as any, descripcion: "" },
  });

  const onSubmit = async (values: FormValues) => {
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
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo enviar la solicitud. Intenta de nuevo.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

                <Button type="submit" size="lg" className="w-full font-bold uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }} disabled={form.formState.isSubmitting}>
                  <Send className="mr-2 h-5 w-5" />
                  {form.formState.isSubmitting ? "Enviando..." : "Enviar Solicitud"}
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
