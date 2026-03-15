import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";
import SEOHead from "@/components/shared/SEOHead";

const NotFound = () => {
  usePageTitle("Página no encontrada");

  return (
    <>
      <SEOHead
        title="Página no encontrada"
        description="La página que buscas no existe o ha sido movida."
        noIndex
      />
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center px-6">
        <div className="text-8xl font-black text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Página no encontrada</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Button asChild size="lg" className="font-bold uppercase tracking-wide">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Volver al Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
