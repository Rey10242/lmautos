export const generateSlug = (marca: string, modelo: string, version: string, year: string | number): string => {
  const parts = [marca, modelo, version, String(year)].filter(Boolean);
  return parts
    .join("-")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
