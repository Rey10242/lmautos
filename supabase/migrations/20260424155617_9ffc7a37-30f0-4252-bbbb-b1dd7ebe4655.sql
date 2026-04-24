ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS comprador_nombre text,
  ADD COLUMN IF NOT EXISTS comprador_cedula text,
  ADD COLUMN IF NOT EXISTS comprador_telefono text,
  ADD COLUMN IF NOT EXISTS comprador_correo text,
  ADD COLUMN IF NOT EXISTS comprador_direccion text,
  ADD COLUMN IF NOT EXISTS comprador_ciudad text,
  ADD COLUMN IF NOT EXISTS valor_venta numeric,
  ADD COLUMN IF NOT EXISTS vendedor_nombre text,
  ADD COLUMN IF NOT EXISTS placa text;

CREATE INDEX IF NOT EXISTS idx_vehicles_status_fecha_venta
  ON public.vehicles (status, fecha_venta DESC);