

# Agregar campo "Tipo de Documento" en datos del propietario

## Resumen

Agregar un campo select "Tipo de Documento" junto al campo existente de "Cédula en tarjeta de propiedad" en la sección de datos del propietario, con las opciones mostradas en la imagen de referencia.

## Plan

### 1. Migración de base de datos
Agregar columna `propietario_tipo_documento` (text, nullable) a la tabla `vehicles`.

### 2. Actualizar formulario de vehículos
En `src/pages/admin/VehiculoForm.tsx`:
- Agregar `propietario_tipo_documento` al `FormData` interface y `defaultForm`
- Agregar un `Select` con las opciones:
  - Cédula Ciudadanía
  - Carnet Diplomático
  - Cédula de Extranjería
  - Pasaporte
  - Tarjeta de Identidad
- Ubicarlo justo antes del campo de "Cédula en tarjeta de propiedad" para que el flujo sea: Tipo de Documento -> Numero de Documento
- Incluirlo en la carga de datos existentes y en el payload de guardado

### Archivos a modificar
- `src/pages/admin/VehiculoForm.tsx`
- Nueva migración SQL

