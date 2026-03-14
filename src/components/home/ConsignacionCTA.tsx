import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const ConsignacionCTA = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="bg-primary rounded-xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-primary-foreground uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              ¿Quieres vender tu vehículo?
            </h2>
            <p className="text-primary-foreground/90 mt-2 max-w-lg">
              Déjanos tu vehículo en consignación. Nos encargamos de todo el proceso de venta de manera transparente y segura.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="font-bold uppercase tracking-wide shrink-0" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Link to="/consignacion">
              <Car className="mr-2 h-5 w-5" />
              Consignar Vehículo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConsignacionCTA;
