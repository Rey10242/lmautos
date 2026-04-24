# Módulo de Gestión de Ventas

## Objetivo
Permitir registrar la información completa del cierre de venta (datos del comprador) cuando un vehículo pasa a estado **VENDIDO**, y disponer de un módulo CRM para consultar, filtrar y exportar el histórico de ventas a Excel/CSV.

---

## 1. Cambios en base de datos

Se agregan columnas a la tabla `vehicles` (no se crea tabla nueva: la venta vive ligada al vehículo y evita duplicar datos).

Nuevas columnas:
- `comprador_nombre` (text)
- `comprador_cedula` (text)
- `comprador_telefono` (text)
- `comprador_correo` (text, opcional)
- `comprador_direccion` (text)
- `comprador_ciudad` (text)
- `valor_venta` (numeric, opcional — si no se ingresa cae a `price`)
- `vendedor_nombre` (text) — quien cerró la venta dentro del equipo
- `placa` (text) — la placa del vehículo vendido (hoy no existe en `vehicles`, se requiere para reportes)

Notas:
- `fecha_venta` ya existe.
- Todas nullables (los vehículos no vendidos no las usan).
- RLS ya cubre: solo autenticados pueden actualizar/ver.

## 2. Formulario del vehículo (`VehiculoForm.tsx`)

Se agrega una nueva sección **“Datos de la venta”** que aparece **únicamente cuando `status === "vendido"`** (similar al patrón ya existente para `tipo_propiedad === "tercero"`).

Campos:
- Fecha de venta (ya existe, se reusa)
- Vendedor (input, se prellena con el nombre del usuario autenticado si está disponible)
- Placa
- Valor de venta (formato miles, default = precio)
- Subsección Comprador: Nombre, Cédula, Teléfono, Correo (opcional), Dirección, Ciudad

Validación: si `status === "vendido"` se exigen como mínimo nombre, cédula, teléfono y fecha de venta del comprador.

Al guardar con otro estado distinto a vendido, los campos de comprador se preservan (no se borran) por si se revierte.

## 3. Nuevo módulo "Gestión de Ventas"

Nueva ruta: `/admin/ventas` → página `src/pages/admin/Ventas.tsx`.

Se agrega item al `AdminSidebar` con icono `DollarSign` (o `Receipt`) entre "Vehículos" y "Consignaciones". Badge con conteo del mes en curso.

### Vista
Tabla con todos los vehículos donde `status = 'vendido'`:

| Fecha venta | Vehículo | Placa | Vendedor | Comprador | Tel. comprador | Valor venta | Estado |

- Fila clickeable → abre el detalle del vehículo (`/admin/vehiculos/:id`).
- Cards de KPIs arriba: total de ventas en el rango, suma del valor de venta, ticket promedio.

### Filtros
- Rango de fechas (dos date pickers, default últimos 30 días)
- Buscador por nombre de comprador
- Buscador por nombre de vendedor
- Buscador por placa
- Selector de estado (por defecto "Vendido"; se incluye "En Trámite" como opción para ver pipeline cercano al cierre)

Filtros aplicados en la query a Supabase + filtro client-side para los textos parciales.

### Exportación
Botón **"Exportar Excel"** que genera un `.xlsx` con exactamente las filas visibles (tras aplicar filtros) usando `xlsx` (SheetJS).

Columnas exportadas: Fecha venta, Marca, Modelo, Versión, Año, Placa, Vendedor, Comprador, Cédula, Teléfono, Correo, Dirección, Ciudad, Valor venta, Estado.

Nombre del archivo: `ventas_lmautos_YYYY-MM-DD.xlsx`.

También se añade botón secundario **"Exportar CSV"** para quien prefiera ese formato.

## 4. Routing

En `src/App.tsx` se agrega:
```tsx
const Ventas = lazy(() => import("./pages/admin/Ventas"));
// ...
<Route path="/admin/ventas" element={<Ventas />} />
```

## 5. Detalles técnicos

- **Librería de exportación**: `xlsx` (SheetJS) — ligera y ya estándar para este caso.
- **Date pickers**: shadcn DatePicker con `Popover + Calendar` (ya disponible en el proyecto).
- **Query**: `useQuery` con `queryKey` que incluye los filtros para refresco automático.
- **Migración SQL**: una sola migración `ALTER TABLE vehicles ADD COLUMN ...` para los 9 campos nuevos.
- **Compatibilidad**: el `bulkStatusMutation` "Marcar Vendido" existente sigue funcionando — el admin podrá luego entrar al vehículo y completar los datos del comprador.

## 6. Archivos a crear/modificar

**Crear:**
- `src/pages/admin/Ventas.tsx` — página principal del módulo
- Migración SQL para nuevas columnas

**Modificar:**
- `src/pages/admin/VehiculoForm.tsx` — sección condicional de datos de venta
- `src/components/admin/AdminSidebar.tsx` — nuevo item "Ventas"
- `src/App.tsx` — nueva ruta `/admin/ventas`
- `package.json` — añadir dependencia `xlsx`

## Fuera de alcance
- Tabla histórica separada de ventas (no necesaria; un vehículo se vende una vez).
- Permisos por rol de vendedor (todos los admins ven todo, igual que hoy).
- Edición masiva de ventas pasadas desde la tabla del CRM (se hace entrando a cada vehículo).
