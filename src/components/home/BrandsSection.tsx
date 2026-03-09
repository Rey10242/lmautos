import { Link } from "react-router-dom";

const brands = [
  "Chevrolet", "Renault", "Mazda", "Toyota", "Nissan",
  "Hyundai", "Kia", "Ford", "Volkswagen", "BMW",
  "Mercedes-Benz", "Audi",
];

const BrandsSection = () => {
  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-12 bg-muted border-y border-border overflow-hidden">
      <div className="container">
        <h3 className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">
          Marcas que manejamos
        </h3>
      </div>
      
      {/* Carousel container */}
      <div className="relative group">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling track */}
        <div 
          className="flex items-center gap-12 animate-scroll group-hover:[animation-play-state:paused]"
          style={{
            width: 'fit-content',
          }}
        >
          {duplicatedBrands.map((brand, i) => (
            <Link
              key={`${brand}-${i}`}
              to={`/catalogo?marca=${encodeURIComponent(brand)}`}
              className="shrink-0 text-xl font-bold text-muted-foreground/50 hover:text-primary hover:scale-110 transition-all duration-300 px-4 py-2"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
