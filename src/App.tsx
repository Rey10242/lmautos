import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/layout/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLayout from "./components/admin/AdminLayout";
import AnalyticsProvider from "./components/analytics/AnalyticsProvider";

const Index = lazy(() => import("./pages/Index"));
const Catalogo = lazy(() => import("./pages/Catalogo"));
const VehiculoDetalle = lazy(() => import("./pages/VehiculoDetalle"));
const Consignacion = lazy(() => import("./pages/Consignacion"));
const Contacto = lazy(() => import("./pages/Contacto"));
const SobreNosotros = lazy(() => import("./pages/SobreNosotros"));
const Servicios = lazy(() => import("./pages/Servicios"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin
const Login = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Vehiculos = lazy(() => import("./pages/admin/Vehiculos"));
const VehiculoForm = lazy(() => import("./pages/admin/VehiculoForm"));
const Consignaciones = lazy(() => import("./pages/admin/Consignaciones"));
const Mensajes = lazy(() => import("./pages/admin/Mensajes"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/vehiculo/:slug" element={<VehiculoDetalle />} />
                <Route path="/consignacion" element={<Consignacion />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                <Route path="/servicios" element={<Servicios />} />
              </Route>

              {/* Admin */}
              <Route path="/admin/login" element={<Login />} />
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/vehiculos" element={<Vehiculos />} />
                <Route path="/admin/vehiculos/nuevo" element={<VehiculoForm />} />
                <Route path="/admin/vehiculos/:id" element={<VehiculoForm />} />
                <Route path="/admin/consignaciones" element={<Consignaciones />} />
                <Route path="/admin/mensajes" element={<Mensajes />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
