

## Plan: Actualizar redes sociales, mejorar WhatsApp flotante con 2 líneas

### 1. Actualizar URLs de redes sociales en todo el proyecto

Reemplazar en todos los archivos donde aparecen:
- `https://facebook.com` → `https://www.facebook.com/autos.luismejia`
- `https://instagram.com` → `https://www.instagram.com/lmautos.ctg/`

**Archivos**: `Navbar.tsx`, `Footer.tsx`

### 2. Actualizar teléfonos

Actualmente solo hay una línea (`315 000 0990`). Se agrega la segunda (`315 752 5555`) y se diferencia su uso:

- **Navbar top bar**: Mostrar ambas líneas con etiquetas cortas
- **Footer contacto**: Ambas líneas con etiqueta (Créditos / Comercial)
- **Contacto.tsx**: Actualizar `contactInfo` con ambas líneas
- **Index.tsx**: JSON-LD con teléfono principal comercial

### 3. Mejorar WhatsApp flotante (`WhatsAppFloat.tsx`)

Rediseñar el botón flotante para que al hacer clic se expanda un mini-menú con las 2 líneas:

```text
┌──────────────────────────────┐
│ 📱 Línea Comercial           │
│    +57 315 752 5555          │
│ 💳 Créditos y Asistencia     │
│    +57 315 000 0990          │
└──────────────────────────────┘
         [ 🟢 WhatsApp ]  ← botón flotante
```

- Al hacer clic en el botón verde, se abre/cierra el menú con las 2 opciones
- Cada opción lleva al `wa.me` correspondiente con mensaje predefinido
- Click fuera cierra el menú
- Animación suave de entrada/salida
- Mantener el pulse ring y el estilo actual del botón principal

### 4. Actualizar WhatsApp en páginas específicas

- **VehiculoDetalle.tsx**: El botón "Consultar por WhatsApp" va a la línea comercial (`3157525555`)
- **Servicios.tsx**: Botón de contacto va a línea comercial
- **Footer.tsx**: Botón "Escríbenos" va a línea comercial

### Archivos a modificar
- `src/components/layout/WhatsAppFloat.tsx` — rediseño con menú de 2 líneas
- `src/components/layout/Navbar.tsx` — URLs redes + ambos teléfonos
- `src/components/layout/Footer.tsx` — URLs redes + ambos teléfonos + WhatsApp comercial
- `src/pages/Contacto.tsx` — ambas líneas en info de contacto
- `src/pages/VehiculoDetalle.tsx` — WhatsApp comercial
- `src/pages/Servicios.tsx` — WhatsApp comercial
- `src/pages/Index.tsx` — teléfono en JSON-LD

