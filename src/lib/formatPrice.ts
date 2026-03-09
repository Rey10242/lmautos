export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatKm = (km: number): string => {
  return new Intl.NumberFormat('es-CO').format(km) + ' km';
};
