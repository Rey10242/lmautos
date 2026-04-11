

# Mejoras al Backoffice

## 1. Dashboard moderno y espectacular

Rediseñar el dashboard con gráficos más impactantes usando gradientes, animaciones y mejor diseño visual:

- **Stat cards**: Agregar gradientes de fondo sutiles, sombras con color, y micro-animaciones hover (scale + shadow).
- **Gráfico de dona (Distribución por Estado)**: Hacerlo más grande, agregar label central con el total, usar gradientes en los segmentos, y tooltips personalizados con el componente `ChartTooltipContent`.
- **Gráfico de barras (Top Marcas)**: Barras con gradientes, bordes redondeados más pronunciados, labels mejorados, y un diseño horizontal más limpio.
- **Agregar un nuevo gráfico**: Línea temporal de visitas de los últimos 7 días usando datos de `vehicle_views`, mostrando la tendencia de interés.
- **Tabla de últimos vehículos**: Mejorar con avatares más grandes, badges de estado con mejor contraste, y hover effects más suaves.
- **Layout general**: Mejorar spacing, usar glassmorphism sutil en las cards, y agregar decorative elements discretos.

## 2. Nuevos campos del propietario en el formulario de vehículos

Agregar 3 campos nuevos a la sección "Datos del Propietario" (solo visible cuando tipo_propiedad = "tercero"):

### Migración de base de datos
Agregar columnas a la tabla `vehicles`:
- `propietario_correo` (text, nullable)
- `propietario_direccion` (text, nullable)  
- `comision_pactada` (numeric, nullable) — monto de la comisión acordada entre LM Autos y el dueño

### Cambios en `VehiculoForm.tsx`
- Agregar los 3 campos al `FormData` interface y `defaultForm`
- Agregar inputs en la sección de datos del propietario:
  - Correo electrónico (input type email)
  - Dirección (input text)
  - Comisión pactada (input numérico con formato de miles, similar al precio)
- Incluir los nuevos campos en el payload de guardado

## Archivos a modificar
- `src/pages/admin/Dashboard.tsx` — Rediseño visual completo
- `src/pages/admin/VehiculoForm.tsx` — Agregar campos de correo, dirección y comisión
- Nueva migración SQL — Agregar 3 columnas a `vehicles`

