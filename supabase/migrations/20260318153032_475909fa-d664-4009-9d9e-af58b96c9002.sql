
DROP POLICY IF EXISTS "Todos pueden ver vehículos públicos" ON public.vehicles;

CREATE POLICY "Todos pueden ver vehículos públicos"
ON public.vehicles
FOR SELECT
TO public
USING (
  status IN ('disponible', 'consignado', 'reservado')
  OR auth.uid() = user_id
);
