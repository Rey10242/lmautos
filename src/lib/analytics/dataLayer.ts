declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export interface VehicleData {
  id: string;
  marca: string;
  modelo: string;
  version: string | null;
  year: number;
  price: number;
  kilometraje: number;
  combustible: string;
  transmision: string;
  status: string | null;
  ubicacion: string;
}

export function initDataLayer(): void {
  window.dataLayer = window.dataLayer || [];
}

export function pushToDataLayer(data: Record<string, unknown>): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

export function clearEcommerce(): void {
  pushToDataLayer({ ecommerce: null });
}

export function vehicleToEcommerceItem(vehicle: VehicleData, index?: number) {
  return {
    item_id: vehicle.id,
    item_name: `${vehicle.marca} ${vehicle.modelo} ${vehicle.year}`,
    item_brand: vehicle.marca,
    item_category: vehicle.combustible,
    item_category2: vehicle.transmision,
    item_category3: vehicle.ubicacion,
    item_variant: vehicle.version ?? '',
    price: vehicle.price,
    quantity: 1,
    ...(typeof index === 'number' ? { index } : {}),
  };
}

export function getPageType(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/catalogo') return 'catalog';
  if (pathname.startsWith('/vehiculo/')) return 'vehicle_detail';
  if (pathname === '/contacto') return 'contact';
  if (pathname === '/consignacion') return 'consignment';
  if (pathname === '/sobre-nosotros') return 'about';
  if (pathname === '/servicios') return 'services';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'not_found';
}
