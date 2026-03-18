

## Plan: Filtrar catálogo público + corregir error de estado "consignado"

### Problema 1: Vehículos vendidos y en trámite visibles en el catálogo público

Actualmente, el catálogo (`Catalogo.tsx`) y los vehículos destacados (`FeaturedVehicles.tsx`) solo filtran por `status = "disponible"`. Necesitamos incluir también `consignado` y `reservado`, pero excluir `vendido`, `en_tramite` y `oculto`.

**Archivos a modificar:**

1. **`src/pages/Catalogo.tsx`** — Cambiar `.eq("status", "disponible")` por `.in("status", ["disponible", "consignado", "reservado"])`

2. **`src/components/home/FeaturedVehicles.tsx`** — Misma lógica: usar `.in("status", ["disponible", "consignado", "reservado"])` en ambas queries (destacados y fallback)

3. **`src/pages/VehiculoDetalle.tsx`** — En la query de vehículos similares, usar `.in("status", ...)` en vez de solo "disponible"

4. **`supabase/functions/sitemap/index.ts`** — Incluir los 3 estados públicos en el sitemap

5. **RLS policy de vehicles** — Actualizar la política SELECT para que también oculte `vendido` y `en_tramite` del público (no solo `oculto`). La política pasará de `status <> 'oculto'` a `status IN ('disponible', 'consignado', 'reservado') OR auth.uid() = user_id`.

### Problema 2: Error al cambiar estado a "consignado"

El error ocurre porque la política RLS de UPDATE requiere `auth.uid() = user_id`. Si el `user_id` del vehículo no coincide con el usuario logueado, la actualización falla silenciosamente o lanza error. 

El código usa `as any` en los `.update()` calls, lo cual podría enmascarar problemas de tipo pero no es la causa del error en runtime.

**Solución:** Verificar y corregir que el `changeStatus` y `bulkStatusMutation` manejen errores correctamente con toast de error. Además, revisar si la RLS policy es demasiado restrictiva — si hay un solo admin, debería funcionar, pero agregaremos manejo de error visible.

**Archivos a modificar:**
- **`src/pages/admin/Vehiculos.tsx`** — Agregar `onError` con toast descriptivo a `changeStatus` y `bulkStatusMutation`

**Migración de base de datos:**
- Actualizar la RLS SELECT policy de `vehicles` para excluir `vendido` y `en_tramite` del público

### Resumen de cambios
- 5 archivos de código modificados
- 1 migración de base de datos (RLS policy)

