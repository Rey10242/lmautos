import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const WhatsAppFloat = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="https://wa.me/573150000990?text=Hola%2C%20estoy%20interesado%20en%20sus%20veh%C3%ADculos"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      aria-label="Contactar por WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        
        {/* Main button */}
        <div className="relative bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 group">
          <MessageCircle className="h-7 w-7" />
        </div>

        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground text-sm font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-border">
          ¿Necesitas ayuda?
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-card border-r border-t border-border rotate-45" />
        </span>
      </div>
    </a>
  );
};

export default WhatsAppFloat;
