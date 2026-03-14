
-- Drop the old RLS policy with hardcoded year <= 2025
DROP POLICY IF EXISTS "Solicitudes válidas pueden ser enviadas" ON public.consignment_requests;

-- Recreate with dynamic year check using EXTRACT
CREATE POLICY "Solicitudes válidas pueden ser enviadas"
ON public.consignment_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (nombre IS NOT NULL) AND (length(TRIM(BOTH FROM nombre)) > 0) AND
  (telefono IS NOT NULL) AND (length(TRIM(BOTH FROM telefono)) > 0) AND
  (correo IS NOT NULL) AND (length(TRIM(BOTH FROM correo)) > 0) AND
  (marca IS NOT NULL) AND (length(TRIM(BOTH FROM marca)) > 0) AND
  (modelo IS NOT NULL) AND (length(TRIM(BOTH FROM modelo)) > 0) AND
  (year IS NOT NULL) AND (year > 1980) AND (year <= EXTRACT(YEAR FROM now())::int + 1) AND
  (kilometraje IS NOT NULL) AND (kilometraje >= 0) AND
  (ciudad IS NOT NULL) AND (length(TRIM(BOTH FROM ciudad)) > 0)
);
