-- 1) Recrear la vista con security_invoker para que use permisos del consultante
DROP VIEW IF EXISTS public.vehicle_view_counts;

CREATE VIEW public.vehicle_view_counts
WITH (security_invoker = true)
AS
SELECT
  vehicle_id,
  COUNT(*)::bigint AS total_views,
  COUNT(*) FILTER (WHERE viewed_at >= now() - interval '7 days')::bigint AS views_last_7_days
FROM public.vehicle_views
GROUP BY vehicle_id;

-- 2) Función helper para verificar si el caller está autenticado en el backoffice.
--    Hoy todos los usuarios autenticados son admins; si en el futuro se introduce
--    una tabla de roles (user_roles + has_role), basta con cambiar el cuerpo aquí.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- 3) Reemplazar policies "true" por public.is_admin()

-- consignment_requests
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver solicitudes" ON public.consignment_requests;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar consignaciones" ON public.consignment_requests;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar consignaciones" ON public.consignment_requests;

CREATE POLICY "Admins pueden ver solicitudes"
  ON public.consignment_requests
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins pueden actualizar consignaciones"
  ON public.consignment_requests
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins pueden eliminar consignaciones"
  ON public.consignment_requests
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- contact_messages
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver mensajes" ON public.contact_messages;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar mensajes" ON public.contact_messages;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar mensajes" ON public.contact_messages;

CREATE POLICY "Admins pueden ver mensajes"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins pueden actualizar mensajes"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins pueden eliminar mensajes"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- vehicle_views: el SELECT ya usa USING(true) y se mantiene (sólo authenticated lo ve)
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver visitas" ON public.vehicle_views;
CREATE POLICY "Admins pueden ver visitas"
  ON public.vehicle_views
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 4) Restringir listado del bucket público de imágenes de vehículos.
--    Las URLs públicas siguen funcionando (no pasan por esta policy).
DROP POLICY IF EXISTS "Public read vehicle images" ON storage.objects;

CREATE POLICY "Authenticated users can list vehicle images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'vehicle-images');