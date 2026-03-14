

## Plan: Dashboard sin valores monetarios, solo conteos absolutos

### Cambios en `src/pages/admin/Dashboard.tsx`

**Reemplazar las 2 tarjetas de "Valor Total Inventario" y "Precio Promedio" (líneas 124-144)** por tarjetas con métricas absolutas:

1. **Vendidos** — cantidad de vehículos con status `vendido`
2. **Reservados** — cantidad con status `reservado`
3. **Agregados esta semana** — conteo de vehículos creados en los últimos 7 días
4. **Total Consignaciones** — el `consignmentCount` ya existente

Estas tarjetas usarán el mismo estilo visual (gradient card + bordered card) pero mostrarán números absolutos en vez de precios.

También se eliminará el `import { formatPrice }` y el `import { DollarSign, BarChart3 }` ya que no se usarán más (se reemplazarán por iconos como `ShoppingCart`, `CalendarPlus`, `Layers`).

La lista de vehículos recientes (líneas 210-232) seguirá mostrando el precio por vehículo ya que es información útil de referencia — a menos que prefieras eliminarlo también.

### Resumen de tarjetas resultantes

```text
┌─────────────────────────────┬─────────────────────────────┐
│  🟢 Vendidos: 12            │  📦 Total Consignaciones: 5 │
│  gradient card              │  bordered card              │
│  + reservados esta semana   │  + agregados esta semana    │
└─────────────────────────────┴─────────────────────────────┘
```

