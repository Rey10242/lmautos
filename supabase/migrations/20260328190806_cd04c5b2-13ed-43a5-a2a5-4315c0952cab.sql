-- Table to track vehicle page views
CREATE TABLE public.vehicle_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast aggregation
CREATE INDEX idx_vehicle_views_vehicle_id ON public.vehicle_views(vehicle_id);

-- RLS
ALTER TABLE public.vehicle_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (track visits)
CREATE POLICY "Cualquiera puede registrar visitas"
ON public.vehicle_views FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can read (admin backoffice)
CREATE POLICY "Usuarios autenticados pueden ver visitas"
ON public.vehicle_views FOR SELECT
TO authenticated
USING (true);

-- View for aggregated counts
CREATE OR REPLACE VIEW public.vehicle_view_counts AS
SELECT
  vehicle_id,
  COUNT(*) AS total_views,
  COUNT(*) FILTER (WHERE viewed_at >= now() - interval '7 days') AS views_last_7_days
FROM public.vehicle_views
GROUP BY vehicle_id;