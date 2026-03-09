
-- Allow authenticated users to UPDATE consignment_requests (for status changes)
CREATE POLICY "Usuarios autenticados pueden actualizar consignaciones"
ON public.consignment_requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to UPDATE contact_messages (for status changes)
CREATE POLICY "Usuarios autenticados pueden actualizar mensajes"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to DELETE consignment_requests
CREATE POLICY "Usuarios autenticados pueden eliminar consignaciones"
ON public.consignment_requests
FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users to DELETE contact_messages
CREATE POLICY "Usuarios autenticados pueden eliminar mensajes"
ON public.contact_messages
FOR DELETE
TO authenticated
USING (true);

-- Fix vehicles SELECT policy so admins can see hidden vehicles too
DROP POLICY IF EXISTS "Todos pueden ver vehículos disponibles" ON public.vehicles;

CREATE POLICY "Todos pueden ver vehículos públicos"
ON public.vehicles
FOR SELECT
USING (
  status <> 'oculto' OR auth.uid() = user_id
);
