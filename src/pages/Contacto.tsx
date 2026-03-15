import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import PageBanner from "@/components/layout/PageBanner";
import FadeInSection from "@/components/shared/FadeInSection";
import SEOHead from "@/components/shared/SEOHead";
import { SITE_URL } from "@/lib/constants";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";

const schema = z.object({
  nombre: z.string().trim().min(1, "Requerido").max(100),
  telefono: z.string().trim().min(7, "Teléfono inválido").max(20),
  correo: z.string().trim().email("Correo inválido").max(255).optional().or(z.literal("")),
  mensaje: z.string().trim().min(1, "Requerido").max(2000),
});

type FormValues = z.infer<typeof schema>;

const contactInfo = [
  { icon: Phone, label: "Línea Comercial", value: "+57 315 752 5555", href: "tel:+573157525555" },
  { icon: Phone, label: "Créditos y Asistencia", value: "+57 315 000 0990", href: "tel:+573150000990" },
  { icon: Mail, label: "Correo", value: "autos.luismejia@gmail.com", href: "mailto:autos.luismejia@gmail.com" },
  { icon: MapPin, label: "Ubicación", value: "Colombia", href: null },
];

const hours = [
  { day: "Lunes a Viernes", time: "8:00 AM - 6:00 PM" },
  { day: "Sábados", time: "9:00 AM - 2:00 PM" },
  { day: "Domingos", time: "Cerrado" },
];

const Contacto = () => {
  usePageTitle("Contacto");
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
      
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact info sidebar */}
            <div className="space-y-6">
              <FadeInSection>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Información de Contacto</h2>
                  <div className="space-y-5">
                    {contactInfo.map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="font-semibold text-foreground hover:text-primary transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="font-semibold text-foreground">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection delay={100}>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">Horario de Atención</h3>
                  </div>
                  <div className="space-y-3">
                    {hours.map((h, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{h.day}</span>
                        <span className="font-semibold text-foreground">{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection delay={200}>
                <Button asChild size="lg" className="w-full font-bold uppercase">
                  <a href="https://wa.me/573157525555" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Escribir por WhatsApp
                  </a>
                </Button>
              </FadeInSection>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <FadeInSection>
                {submitted ? (
                  <div className="bg-card border border-border rounded-xl p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">¡Mensaje Enviado!</h2>
                    <p className="text-muted-foreground">
                      Gracias por contactarnos. Nos pondremos en contacto contigo lo antes posible.
                    </p>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-foreground mb-2">Envíanos un mensaje</h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      Completa el formulario y te responderemos a la brevedad.
                    </p>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="nombre" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre completo</FormLabel>
                              <FormControl><Input placeholder="Tu nombre" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="telefono" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl><Input placeholder="315 000 0990" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="correo" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico (opcional)</FormLabel>
                            <FormControl><Input type="email" placeholder="tu@correo.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="mensaje" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensaje</FormLabel>
                            <FormControl><Textarea placeholder="¿En qué podemos ayudarte?" rows={5} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="submit" size="lg" className="w-full font-bold uppercase" disabled={form.formState.isSubmitting}>
                          <Send className="mr-2 h-5 w-5" />
                          {form.formState.isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-16">
        <div className="container">
          <FadeInSection>
            <div className="bg-muted rounded-xl overflow-hidden h-[300px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">Ubicación en Colombia</p>
                <p className="text-sm text-muted-foreground/70">Contáctanos para coordinar una visita</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
};

export default Contacto;
