import PageBanner from "@/components/layout/PageBanner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, FileSearch, CreditCard, ShieldCheck, Wrench, ArrowRight } from "lucide-react";

const services = [
  { icon: Car, title: "Consignación de Vehículos", desc: "Dejamos tu vehículo a la venta sin que tengas que preocuparte por nada. Nos encargamos de todo el proceso.", link: "/consignacion" },
  { icon: FileSearch, title: "Inspección Vehicular", desc: "Realizamos una revisión completa del estado mecánico, legal y estético de cada vehículo." },
  { icon: CreditCard, title: "Financiación", desc: "Ofrecemos opciones de financiación con las mejores entidades aliadas para que puedas adquirir tu vehículo." },
  { icon: ShieldCheck, title: "Trámites y Legalización", desc: "Gestionamos todos los trámites de traspaso, impuestos y legalización de tu vehículo." },
  { icon: Wrench, title: "Asesoría Mecánica", desc: "Contamos con aliados especializados para garantizar el buen estado mecánico de cada vehículo." },
];

const Servicios = () => {
  return (
    <>
      <PageBanner title="Nuestros Servicios" breadcrumbs={[{ label: "Inicio", path: "/" }, { label: "Servicios" }]} />
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
              <s.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-bold text-lg text-foreground mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
              {s.link && (
                <Button asChild variant="link" className="p-0 text-primary font-semibold">
                  <Link to={s.link}>Más Información <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Servicios;
