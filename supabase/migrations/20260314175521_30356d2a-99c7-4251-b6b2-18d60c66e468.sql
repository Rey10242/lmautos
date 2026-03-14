ALTER TABLE public.vehicles ADD COLUMN transito text;
ALTER TABLE public.vehicles ADD COLUMN fecha_venta timestamptz;
ALTER TABLE public.vehicles ADD COLUMN fecha_ingreso timestamptz DEFAULT now();