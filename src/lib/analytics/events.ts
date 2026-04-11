import {
  pushToDataLayer,
  clearEcommerce,
  vehicleToEcommerceItem,
  getPageType,
  type VehicleData,
} from './dataLayer';

// ── PAGE VIEWS ──

export function trackPageView(pathname: string, title?: string): void {
  pushToDataLayer({
    event: 'page_view',
    page_type: getPageType(pathname),
    page_path: pathname,
    page_title: title ?? document.title,
  });
}

// ── ECOMMERCE ──

export function trackVehicleView(vehicle: VehicleData): void {
  clearEcommerce();
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: 'COP',
      value: vehicle.price,
      items: [vehicleToEcommerceItem(vehicle)],
    },
  });
}

export function trackVehicleListView(vehicles: VehicleData[], listName: string): void {
  clearEcommerce();
  pushToDataLayer({
    event: 'view_item_list',
    ecommerce: {
      item_list_id: listName,
      item_list_name: listName,
      items: vehicles.map((v, i) => vehicleToEcommerceItem(v, i)),
    },
  });
}

export function trackVehicleClick(vehicle: VehicleData, listName: string): void {
  clearEcommerce();
  pushToDataLayer({
    event: 'select_item',
    ecommerce: {
      item_list_id: listName,
      item_list_name: listName,
      items: [vehicleToEcommerceItem(vehicle)],
    },
  });
}

// ── LEADS ──

export function trackWhatsAppClick(buttonLocation: string, vehicle?: VehicleData): void {
  const vehicleName = vehicle ? `${vehicle.marca} ${vehicle.modelo} ${vehicle.year}` : undefined;
  const conversionValue = vehicle ? Math.round(vehicle.price * 0.02) : 50000;

  pushToDataLayer({
    event: 'lead_whatsapp_click',
    vehicle_id: vehicle?.id ?? null,
    vehicle_name: vehicleName ?? null,
    vehicle_price: vehicle?.price ?? null,
    button_location: buttonLocation,
    page_path: window.location.pathname,
  });

  pushToDataLayer({
    event: 'conversion_whatsapp',
    conversion_value: conversionValue,
    currency: 'COP',
    vehicle_id: vehicle?.id ?? null,
  });
}

export function trackContactFormSubmit(formData: {
  nombre: string;
  telefono: string;
  correo?: string;
}): void {
  pushToDataLayer({
    event: 'lead_form_submit_contact',
    form_name: 'contact',
    contact_name: formData.nombre,
    contact_phone: formData.telefono,
    contact_email: formData.correo ?? null,
    page_path: window.location.pathname,
  });
}

export function trackConsignmentFormSubmit(formData: {
  nombre: string;
  telefono: string;
  marca: string;
  modelo: string;
  year: number;
  precio_esperado?: number;
}): void {
  pushToDataLayer({
    event: 'lead_form_submit_consignment',
    form_name: 'consignment',
    contact_name: formData.nombre,
    contact_phone: formData.telefono,
    vehicle_brand: formData.marca,
    vehicle_model: formData.modelo,
    vehicle_year: formData.year,
    vehicle_expected_price: formData.precio_esperado ?? null,
    page_path: window.location.pathname,
  });
}

export function trackPhoneClick(phoneNumber: string): void {
  pushToDataLayer({
    event: 'lead_phone_click',
    phone_number: phoneNumber,
    page_path: window.location.pathname,
  });
}

// ── ENGAGEMENT ──

export function trackGalleryOpen(vehicleId: string, imageIndex: number): void {
  pushToDataLayer({
    event: 'engagement_vehicle_gallery_open',
    vehicle_id: vehicleId,
    image_index: imageIndex,
    page_path: window.location.pathname,
  });
}

export function trackVehicleShare(
  vehicle: VehicleData,
  method: 'whatsapp' | 'facebook' | 'copy_link',
): void {
  pushToDataLayer({
    event: 'engagement_vehicle_share',
    vehicle_id: vehicle.id,
    vehicle_name: `${vehicle.marca} ${vehicle.modelo} ${vehicle.year}`,
    share_method: method,
  });

  pushToDataLayer({
    event: 'share',
    method,
    content_type: 'vehicle',
    item_id: vehicle.id,
  });
}

export function trackCatalogFilter(filterType: string, filterValue: string): void {
  pushToDataLayer({
    event: 'engagement_catalog_filter',
    filter_type: filterType,
    filter_value: filterValue,
    page_path: window.location.pathname,
  });
}

export function trackCatalogSort(sortBy: string, sortOrder: string): void {
  pushToDataLayer({
    event: 'engagement_catalog_sort',
    sort_by: sortBy,
    sort_order: sortOrder,
    page_path: window.location.pathname,
  });
}

// ── FORMS ──

export function trackFormStart(formName: string): void {
  pushToDataLayer({
    event: 'form_start',
    form_name: formName,
    page_path: window.location.pathname,
  });
}

export function trackFormError(formName: string, fieldName: string, errorType: string): void {
  pushToDataLayer({
    event: 'form_error',
    form_name: formName,
    field_name: fieldName,
    error_type: errorType,
    page_path: window.location.pathname,
  });
}
