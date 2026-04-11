export {
  initDataLayer,
  pushToDataLayer,
  clearEcommerce,
  vehicleToEcommerceItem,
  getPageType,
} from './dataLayer';

export type { VehicleData } from './dataLayer';

export {
  trackPageView,
  trackVehicleView,
  trackVehicleListView,
  trackVehicleClick,
  trackWhatsAppClick,
  trackContactFormSubmit,
  trackConsignmentFormSubmit,
  trackPhoneClick,
  trackGalleryOpen,
  trackVehicleShare,
  trackCatalogFilter,
  trackCatalogSort,
  trackFormStart,
  trackFormError,
} from './events';

export {
  captureAndPersistUtm,
  getAttribution,
  getAttributionForLead,
} from './utm';

export type { AttributionData } from './utm';
