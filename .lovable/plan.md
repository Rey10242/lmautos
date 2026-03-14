

## Plan: Dashboard completo, nuevos estados y campo "Tránsito"

### 1. Migración de base de datos — nuevas columnas en `vehicles`

Agregar:
- `transito` (text, nullable) — ciudad/departamento donde está matriculado
- `fecha_venta` (timestamptz, nullable) — fecha en que se marcó como vendido
- `fecha_ingreso` (timestamptz, nullable, default `created_at`) — fecha de ingreso al catálogo

Esto permite registrar cuándo se vendió y cuándo ingresó, y filtrar por fechas en el dashboard.

### 2. Nuevos estados de vehículo

Actualmente: `disponible`, `vendido`, `reservado`, `oculto`

Agregar:
- **`consignado`** — vehículo dejado por un cliente para mostrar en sala
- **`en_tramite`** — vendido pero pendiente de entrega por trámites

Estos se agregan en el formulario del vehículo (`VehiculoForm.tsx`) y se reflejan en el dashboard, cards y detalle.

### 3. Dashboard rediseñado

Tarjetas principales (fila superior):
| Total Inventario | Disponibles | Consignados | Vendidos |
|---|---|---|---|
| disponible + consignado + reservado | solo `disponible` | solo `consignado` | solo `vendido` |

Tarjetas secundarias:
| En Trámite | Consignaciones Pendientes | Mensajes Nuevos | Agregados esta semana |
|---|---|---|---|

**Filtro de fechas**: Selector de rango (este mes, últimos 3 meses, este año, todo) que filtra los conteos de vendidos y agregados por período.

Gráficas y lista de vehículos recientes se mantienen, actualizadas con los nuevos estados y colores.

### 4. Formulario de vehículo (`VehiculoForm.tsx`)

- Agregar campo **"Tránsito"** (input texto, ej: "Bogotá", "Medellín") en la sección de información básica
- Agregar **"Fecha de Venta"** (date picker, visible solo cuando status es `vendido` o `en_tramite`)
- Agregar los 2 nuevos estados al selector de publicación con colores:
  - `consignado` → azul
  - `en_tramite` → púrpura

### 5. Detalle del vehículo (`VehiculoDetalle.tsx`)

- Agregar spec "Tránsito" con icono `MapPin` en la grilla de especificaciones (solo si tiene valor)

### 6. Vehicle Card y listas

- Actualizar mapeo de colores de badges para incluir `consignado` y `en_tramite`

### Archivos a modificar
- **Migración SQL**: `ALTER TABLE vehicles ADD COLUMN transito, fecha_venta, fecha_ingreso`
- `src/pages/admin/Dashboard.tsx` — rediseño completo de métricas + filtro de fechas
- `src/pages/admin/VehiculoForm.tsx` — nuevos campos y estados
- `src/pages/VehiculoDetalle.tsx` — mostrar tránsito
- `src/pages/admin/Vehiculos.tsx` — colores de nuevos estados (si aplica)

