import { MessageCircle, X, Phone, CreditCard } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const lines = [
  {
    icon: Phone,
    label: "Línea Comercial",
    sublabel: "Luis Mejía",
    phone: "573157525555",
    message: "Hola, estoy interesado en sus vehículos",
  },
  {
    icon: CreditCard,
    label: "Créditos y Asistencia",
    sublabel: "+57 315 000 0990",
    phone: "573150000990",
    message: "Hola, necesito información sobre créditos y asistencia",
  },
];

const WhatsAppFloat = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {/* Menu */}
      <div
        className={`bg-card border border-border rounded-2xl shadow-xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 bg-[#25D366] text-white">
          <p className="font-bold text-sm">¿Cómo podemos ayudarte?</p>
          <p className="text-xs text-white/80">Elige una línea de atención</p>
        </div>
        <div className="p-2">
          {lines.map((line, i) => (
            <a
              key={i}
              href={`https://wa.me/${line.phone}?text=${encodeURIComponent(line.message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-accent transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0 group-hover:bg-[#25D366] transition-colors">
                <line.icon className="h-5 w-5 text-[#25D366] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{line.label}</p>
                <p className="text-xs text-muted-foreground">{line.sublabel}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Contactar por WhatsApp"
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        )}
        <div className="relative bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110">
          {isOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <MessageCircle className="h-7 w-7" />
          )}
        </div>
      </button>
    </div>
  );
};

export default WhatsAppFloat;
