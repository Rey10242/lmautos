const brands = [
  "Chevrolet", "Renault", "Mazda", "Toyota", "Nissan",
  "Hyundai", "Kia", "Ford", "Volkswagen", "BMW",
  "Mercedes-Benz", "Audi",
];

const BrandsSection = () => {
  return (
    <section className="py-12 bg-muted border-y border-border">
      <div className="container">
        <h3 className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">
          Marcas que manejamos
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-lg font-bold text-muted-foreground/50 hover:text-primary transition-colors cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
