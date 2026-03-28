

# Analytics de Visitas por Vehículo

## Resumen

Registrar cada visita a la ficha de un vehículo y mostrar las estadísticas en el backoffice (lista de vehículos y detalle).

## Plan

### 1. Crear tabla `vehicle_views`
Nueva tabla para registrar cada visita:
- `id` (uuid, PK)
- `vehicle_id` (uuid, FK a vehicles)
- `viewed_at` (timestamptz, default now())

RLS: INSERT abierto para anon+authenticated, SELECT solo para authenticated.

### 2. Registrar visitas en la ficha del vehículo
En `VehiculoDetalle.tsx`, al cargar un vehículo exitosamente, insertar un registro en `vehicle_views`. Se usa un `useEffect` para que solo se registre una vez por carga de página.

### 3. Mostrar contador de visitas en la lista de vehículos del backoffice
En `admin/Vehiculos.tsx`, agregar una columna con un ícono de ojo y el conteo de visitas de cada vehículo. Se obtiene con una consulta agrupada o un view en la base de datos.

### 4. (Opcional) Vista de base de datos para eficiencia
Crear una vista SQL `vehicle_view_counts` que agrupe por `vehicle_id` con `COUNT(*)` para hacer las consultas más simples desde el frontend.

## Detalle técnico

- La tabla `vehicle_views` no almacena datos personales, solo el ID del vehículo y timestamp
- Se crea un índice en `vehicle_id` para consultas rápidas
- El insert desde la página pública usa el rol `anon`, por lo que la política de INSERT debe permitirlo
- En el backoffice se puede mostrar visitas totales y visitas de los últimos 7 días

