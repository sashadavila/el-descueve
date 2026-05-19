import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop'
import Layout from './components/common/Layout'
import AdminLayout from './components/layout/AdminLayout'

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

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminClients from './pages/admin/AdminClients'
import AdminEditClient from './pages/admin/AdminEditClient'
import AdminStatistics from './pages/admin/AdminStatistics'

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
        </Route>

        {/* Rutas admin con Layout admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clientes" element={<AdminClients />} />
          <Route path="clientes/editar/:id" element={<AdminEditClient />} />
          <Route path="estadisticas" element={<AdminStatistics />} />
        </Route>
      </Routes>
    </>
  )
}

export default App