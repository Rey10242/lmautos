

## Plan: Build LM Autos Website Matching WordPress Branding

Based on the screenshots, the WordPress site has a distinct layout: orange/amber branding, a header with logo + contact info + social + Login/Register button, a nav bar with dark background, and pages like Catalog with filters, vehicle cards, and a sidebar.

### Current State
- Layout components exist (Navbar, Footer, Layout, PageBanner) but are **not wired into routing** (App.tsx still uses plain routes without Layout wrapper)
- Index.tsx is the default placeholder
- Database has `vehicles`, `consignment_requests`, `contact_messages` tables ready
- Color theme already matches (orange primary `33 100% 50%`, dark secondary)

### Implementation Plan

**1. Wire up Layout and Routing**
- Update `App.tsx` to wrap routes in `<Layout />` using nested `<Route element={<Layout />}>`
- Add routes: `/catalogo`, `/sobre-nosotros`, `/servicios`, `/consignacion`, `/contacto`, `/vehiculo/:id`

**2. Update Navbar to match WordPress site**
- Top bar: logo on left, "CORREO DE SOPORTE" + "LINEA DE ATENCION" in center, social icons + "LOGIN/REGISTER" button on right
- Main nav: dark background, uppercase links (SOBRE NOSOTROS, SERVICIOS, CALCULADORA DE CREDITOS, CATALOGO, COMPARAR VEHICULOS)
- Keep mobile responsive hamburger menu

**3. Build Homepage (`Index.tsx`)**
- Hero section with car background, search CTA
- Featured/recent vehicles grid pulling from database
- "Vender tu vehiculo" CTA section
- Stats/trust section

**4. Build Catalog Page (`/catalogo`)**
- PageBanner with "Vehiculos Disponibles" + breadcrumbs over car photo background
- Results bar: count, sort dropdown (A-Z), items per page, grid/list toggle
- Vehicle cards (image carousel, tags like "Automaticos/Gasolina/Sedanes", title, price, specs: km, fuel, year, engine, seats, transmission)
- Sidebar: "Encuentra tu carro ideal" filter panel (brand, model, year, fuel, transmission, price range), "Vender tu vehiculo" CTA banner, "Recientes" list
- Fetch from `vehicles` table, filter by `status = 'disponible'`

**5. Build Vehicle Detail Page (`/vehiculo/:id`)**
- Image gallery, full specs, description, contact CTA (WhatsApp link)

**6. Build Consignment Page (`/consignacion`)**
- Form matching `consignment_requests` table fields
- Submit to database (public insert, no auth needed)

**7. Build Contact Page (`/contacto`)**
- Contact form submitting to `contact_messages`
- Map/location info, phone, email

**8. Build About Us + Services pages**
- Static content pages with PageBanner

### Technical Details
- All vehicle queries use `supabase.from('vehicles').select('*').eq('status', 'disponible')`
- Price formatting: Colombian peso format with `Intl.NumberFormat('es-CO')`
- Images stored as JSON array in `images` column
- No auth required for public pages; Login/Register button will link to a future auth page
- Catalog filters use URL search params for shareable filtered views

### File Structure
```
src/pages/Index.tsx          - Homepage
src/pages/Catalogo.tsx       - Vehicle catalog
src/pages/VehiculoDetalle.tsx - Vehicle detail
src/pages/Consignacion.tsx   - Consignment form
src/pages/Contacto.tsx       - Contact page
src/pages/SobreNosotros.tsx  - About us
src/pages/Servicios.tsx      - Services
src/components/vehicles/VehicleCard.tsx    - Reusable card
src/components/vehicles/VehicleFilters.tsx - Sidebar filters
src/components/vehicles/VehicleGrid.tsx    - Grid/list display
src/components/home/HeroSection.tsx        - Homepage hero
src/components/home/FeaturedVehicles.tsx   - Featured cars
```

This will be implemented incrementally, starting with routing + navbar, then catalog (the core page), then remaining pages.

