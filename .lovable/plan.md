

## Plan: Sistema de Ubicación de Vehículos + Control de Propietarios

### Concepto de negocio

Dos dimensiones nuevas por vehículo:

1. **Ubicación / disponibilidad para ver el vehículo** (visible al público):
   - **En Sala de Ventas** — El cliente puede ir directamente a verlo
   - **Con Cita Previa** — Vehículo de tercero, requiere agendar día y hora

2. **Tipo de propiedad** (solo visible en el admin):
   - **Propio** — LM Autos lo compró (retoma, oportunidad, etc.)
   - **De tercero** — LM Autos actúa como intermediario. Se registran los datos del dueño real (nombre, teléfono, cédula, notas)

### 1. Migración de base de datos

Agregar columnas a la tabla `vehicles`:

```sql
-- Ubicación pública del vehículo
ALTER TABLE vehicles ADD COLUMN ubicacion text NOT NULL DEFAULT 'sala';
-- valores: 'sala' | 'cita_previa'

-- Tipo de propiedad (interno)
ALTER TABLE vehicles ADD COLUMN tipo_propiedad text NOT NULL DEFAULT 'propio';
-- valores: 'propio' | 'tercero'

-- Datos del dueño (solo cuando tipo_propiedad = 'tercero')
ALTER TABLE vehicles ADD COLUMN propietario_nombre text;
ALTER TABLE vehicles ADD COLUMN propietario_telefono text;
ALTER TABLE vehicles ADD COLUMN propietario_cedula text;
ALTER TABLE vehicles ADD COLUMN propietario_notas text;
```

### 2. Página del vehículo (PDP) — `VehiculoDetalle.tsx`

Agregar un badge visual prominente debajo del título/precio:

```text
┌─────────────────────────────────────┐
│  🏢  Disponible en Sala de Ventas   │  ← fondo verde sutil
│  Visítanos sin cita                 │
└─────────────────────────────────────┘

        — o —

┌─────────────────────────────────────┐
│  📅  Disponible con Cita Previa     │  ← fondo ámbar sutil
│  Agenda tu visita por WhatsApp      │
│  [ Agendar Cita → ]                │
└─────────────────────────────────────┘
```

- Para "cita previa", el botón de agendar abre WhatsApp con mensaje: "Hola, quiero agendar una cita para ver el [vehículo]. ¿Qué día y hora tienen disponible?"
- El badge se muestra también en las cards del catálogo como un indicador sutil

### 3. Tarjeta de vehículo — `VehicleCard.tsx`

Agregar un indicador pequeño en la parte inferior de la card:

- **Sala**: Icono de edificio + "En sala" (texto verde discreto)
- **Cita previa**: Icono de calendario + "Con cita" (texto ámbar discreto)

### 4. Formulario admin — `VehiculoForm.tsx`

Nueva sección "Propiedad y Ubicación" entre Descripción y Publicación:

```text
┌─────────────────────────────────────────────────┐
│  PROPIEDAD Y UBICACIÓN                          │
│                                                 │
│  Ubicación:  [En Sala ▾]  [Con Cita Previa ▾]  │
│                                                 │
│  Tipo:       [Propio ▾]   [De Tercero ▾]       │
│                                                 │
│  ── Si "De Tercero" se expande: ──              │
│  Nombre del propietario:  [____________]        │
│  Teléfono:                [____________]        │
│  Cédula / NIT:            [____________]        │
│  Notas internas:          [____________]        │
└─────────────────────────────────────────────────┘
```

Los datos del propietario son privados y protegidos por RLS (solo usuarios autenticados ven estos campos). Nunca se exponen en el frontend público.

### 5. Lista admin de vehículos — `Vehiculos.tsx`

Agregar columna/indicador visual del tipo de propiedad para que el dueño identifique rápido cuáles son propios y cuáles de terceros.

### Archivos a modificar
- **Migración SQL** — Nuevas columnas en `vehicles`
- `src/pages/admin/VehiculoForm.tsx` — Sección de propiedad + ubicación con campos condicionales
- `src/pages/admin/Vehiculos.tsx` — Indicador de propiedad en la lista
- `src/pages/VehiculoDetalle.tsx` — Badge público de ubicación
- `src/components/vehicles/VehicleCard.tsx` — Indicador sutil de ubicación

