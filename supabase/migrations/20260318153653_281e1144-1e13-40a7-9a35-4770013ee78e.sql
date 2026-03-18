
ALTER TABLE public.vehicles DROP CONSTRAINT vehicles_status_check;

ALTER TABLE public.vehicles ADD CONSTRAINT vehicles_status_check
CHECK (status = ANY (ARRAY['disponible', 'consignado', 'reservado', 'vendido', 'en_tramite', 'oculto']));
