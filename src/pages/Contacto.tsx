import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import PageBanner from "@/components/layout/PageBanner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, Phone, Mail, MapPin } from "lucide-react";

const schema = z.object({
  nombre: z.string().trim().min(1, "Requerido").max(100),
  telefono: z.string().trim().min(7, "Teléfono inválido").max(20),
  correo: z.string().trim().email("Correo inválido").max(255).optional().or(z.literal("")),
  mensaje: z.string().trim().min(1, "Requerido").max(2000),
});

type FormValues = z.infer<typeof schema>;

const Contacto = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", telefono: "", correo: "", mensaje: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("contact_messages").insert({
      nombre: values.nombre,
      telefono: values.telefono,
      correo: values.correo || null,
      mensaje: values.mensaje,
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo enviar el mensaje. Intenta de nuevo.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <PageBanner title="Contacto" breadcrumbs={[{ label: "Inicio", path: "/" }, { label: "Contacto" }]} />
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>Información de Contacto</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Teléfono</p>
                  <a href="tel:+573150000990" className="text-muted-foreground hover:text-primary transition-colors">+57 315 000 0990</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Correo</p>
                  <a href="mailto:autos.luismejia@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">autos.luismejia@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Ubicación</p>
                  <p className="text-muted-foreground">Colombia</p>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <Button asChild className="w-full font-bold uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <a href="https://wa.me/573150000990" target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </Button>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>¡Mensaje Enviado!</h2>
                <p className="text-muted-foreground mt-2">Nos pondremos en contacto contigo pronto.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="nombre" render={({ field }) => (
                      <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input placeholder="Tu nombre" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="telefono" render={({ field }) => (
                      <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input placeholder="315 000 0990" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="correo" render={({ field }) => (
                    <FormItem><FormLabel>Correo (opcional)</FormLabel><FormControl><Input type="email" placeholder="tu@correo.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="mensaje" render={({ field }) => (
                    <FormItem><FormLabel>Mensaje</FormLabel><FormControl><Textarea placeholder="¿En qué podemos ayudarte?" rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" size="lg" className="w-full font-bold uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }} disabled={form.formState.isSubmitting}>
                    <Send className="mr-2 h-5 w-5" />
                    {form.formState.isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacto;
