// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop'
import Layout from './components/common/Layout'
import AdminLayout from './components/layout/AdminLayout'
import { useAuth } from './hooks/useAuth'

// Públicas
import HomePage from './pages/public/HomePage'
import CatalogoPage from './pages/public/CatalogoPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import CartPage from './pages/public/CartPage'
import CheckoutPage from './pages/public/CheckoutPage'
import OrderConfirmationPage from './pages/public/ConfirmacionCompraPage'
import OrderTrackingPage from './pages/public/OrderTrackingPage'
import LoginPage from './pages/public/LoginPage'
import SignupPage from './pages/public/SignupPage'
import ContactPage from './pages/public/ContactPage'
import AboutPage from './pages/public/AboutPage'
import ForgotPasswordPage from './pages/public/ForgotPasswordPage'
import ResetPasswordPage from './pages/public/ResetPasswordPage'
import GoogleCallback from './pages/public/GoogleCallback'
import LogoutPage from './pages/public/LogoutPage'
import TermsConditions from './pages/legal/TermsConditions'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import InvoicePage from './pages/public/InvoicePage'

// Admin - Zona Clientes
import AdminClientsDirectory from './pages/admin/zones/clients/AdminClientsDirectory'
import AdminClientsStats from './pages/admin/zones/clients/AdminClientsStats'
import AdminClientsNotifications from './pages/admin/zones/clients/AdminClientsNotifications'

// Admin - Zona Inventarios
import AdminInventoryDirectory from './pages/admin/zones/inventory/AdminInventoryDirectory'
import AdminInventoryStats from './pages/admin/zones/inventory/AdminInventoryStats'
import AdminInventoryNotifications from './pages/admin/zones/inventory/AdminInventoryNotifications'

// Admin - Zona Pedidos
import AdminOrdersDirectory from './pages/admin/zones/orders/AdminOrdersDirectory'
import AdminOrdersStats from './pages/admin/zones/orders/AdminOrdersStats'
import AdminOrdersNotifications from './pages/admin/zones/orders/AdminOrdersNotifications'

// Admin - Zona Envíos
import AdminShipmentsDirectory from './pages/admin/zones/shipments/AdminShipmentsDirectory'
import AdminShipmentsStats from './pages/admin/zones/shipments/AdminShipmentsStats'
import AdminShipmentsNotifications from './pages/admin/zones/shipments/AdminShipmentsNotifications'

// Admin - Zona Mensajes
import AdminMessagesDirectory from './pages/admin/zones/messages/AdminMessagesDirectory'
import AdminMessagesStats from './pages/admin/zones/messages/AdminMessagesStats'
import AdminMessagesNotifications from './pages/admin/zones/messages/AdminMessagesNotifications'

// Admin - Ayuda
import AdminHelp from './pages/admin/AdminHelp'  // ← Agregar esta línea

// Componente para proteger rutas admin
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Rutas públicas con Layout normal */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/seguimiento/:orderId" element={<OrderTrackingPage />} />
          <Route path="/confirmacion" element={<OrderConfirmationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth-callback" element={<GoogleCallback />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/terminos-y-condiciones" element={<TermsConditions />} />
          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
          <Route path="/factura/:orderId" element={<InvoicePage />} />
        </Route>

        {/* Rutas admin con Layout admin - Protegidas por rol */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to="/admin/clientes/directorio" replace />} />

          {/* Zona Clientes */}
          <Route path="clientes/directorio" element={<AdminClientsDirectory />} />
          <Route path="clientes/estadisticas" element={<AdminClientsStats />} />
          <Route path="clientes/notificaciones" element={<AdminClientsNotifications />} />

          {/* Zona Inventarios */}
          <Route path="inventarios/directorio" element={<AdminInventoryDirectory />} />
          <Route path="inventarios/estadisticas" element={<AdminInventoryStats />} />
          <Route path="inventarios/notificaciones" element={<AdminInventoryNotifications />} />

          {/* Zona Pedidos */}
          <Route path="pedidos/directorio" element={<AdminOrdersDirectory />} />
          <Route path="pedidos/estadisticas" element={<AdminOrdersStats />} />
          <Route path="pedidos/notificaciones" element={<AdminOrdersNotifications />} />

          {/* Zona Envíos */}
          <Route path="envios/directorio" element={<AdminShipmentsDirectory />} />
          <Route path="envios/estadisticas" element={<AdminShipmentsStats />} />
          <Route path="envios/notificaciones" element={<AdminShipmentsNotifications />} />

          {/* Zona Mensajes */}
          <Route path="mensajes/directorio" element={<AdminMessagesDirectory />} />
          <Route path="mensajes/estadisticas" element={<AdminMessagesStats />} />
          <Route path="mensajes/notificaciones" element={<AdminMessagesNotifications />} />

          {/* Ayuda */}
          <Route path="ayuda" element={<AdminHelp />} />
        </Route>
      </Routes>
    </>
  )
}

export default App