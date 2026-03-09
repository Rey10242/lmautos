import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <span className="text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="text-primary">LM</span>
              <span className="text-secondary-foreground text-base font-semibold ml-1">autos</span>
            </span>
            <p className="mt-3 text-sm text-secondary-foreground/70 leading-relaxed">
              Consignataria de vehículos en Colombia. Compra, vende y consigna tu vehículo con total confianza y transparencia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Enlaces
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link></li>
              <li><Link to="/consignacion" className="hover:text-primary transition-colors">Consignación</Link></li>
              <li><Link to="/sobre-nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/servicios" className="hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+573150000990" className="hover:text-primary transition-colors">+57 315 000 0990</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:autos.luismejia@gmail.com" className="hover:text-primary transition-colors">autos.luismejia@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Colombia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10">
        <div className="container py-4 text-center text-xs text-secondary-foreground/50">
          © {new Date().getFullYear()} LM Autos SAS. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
