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

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminClients from './pages/admin/AdminClients'
import AdminEditClient from './pages/admin/AdminEditClient'
import AdminStatistics from './pages/admin/AdminStatistics'
import AdminHelp from './pages/admin/AdminHelp'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminProducts from './pages/admin/AdminProducts'

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
        </Route>

        {/* Rutas admin con Layout admin - Protegidas por rol */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="clientes" element={<AdminClients />} />
          <Route path="clientes/editar/:id" element={<AdminEditClient />} />
          <Route path="estadisticas" element={<AdminStatistics />} />
          <Route path="ayuda" element={<AdminHelp />} />
          <Route path="notificaciones" element={<AdminNotifications />} />
          <Route path="productos" element={<AdminProducts />} />
        </Route>
      </Routes>
    </>
  )
}

export default App