
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/cart/components/CartProvider';
import { useEmailConfirmationHandler } from './hooks/useEmailConfirmationHandler';

// Pages
import Index from './pages/Index';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import UserDashboard from './pages/UserDashboard';
import ClientSpace from './pages/ClientSpace';
import Checkout from './pages/Checkout';
import AllDeals from './pages/AllDeals';
import Promotions from './pages/Promotions';
import EmailConfirmation from './pages/EmailConfirmation';
import YaBaBoss from './pages/YaBaBoss';
import YaBaBossProducts from './pages/YaBaBossProducts';
import Solaire from './pages/Solaire';
import SolarDemos from './pages/SolarDemos';

// Admin Pages
import Admin from './pages/Admin/Admin';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminOrdersHub from './pages/Admin/AdminOrdersHub';
import AdminOrders from './pages/Admin/AdminOrders';
import OrderDetails from './pages/Admin/OrderDetails';
import UnassignedOrders from './pages/Admin/UnassignedOrders';
import MyOrders from './pages/Admin/MyOrders';
import AdminCustomers from './pages/Admin/AdminCustomers';
import AllCustomers from './pages/Admin/AllCustomers';
import MyCustomers from './pages/Admin/MyCustomers';
import AdminProducts from './pages/Admin/AdminProducts';
import YaBaBosser from './pages/Admin/YaBaBosser';
import Analytics from './pages/Admin/Analytics';
import AnalyticsCustomizable from './pages/Admin/AnalyticsCustomizable';
import TrafficAnalytics from './pages/Admin/TrafficAnalytics';
import AISales from './pages/Admin/AISales';
import MessagingCenter from './pages/Admin/MessagingCenter';
import MessageTemplates from './pages/Admin/MessageTemplates';
import AdminPromotions from './pages/Admin/AdminPromotions';
import AdminReviews from './pages/Admin/AdminReviews';
import InfluencerManager from './pages/Admin/InfluencerManager';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSettings from './pages/Admin/AdminSettings';
import UserManager from './pages/Admin/UserManager';
import SolarInstallations from './pages/Admin/SolarInstallations';

// Influencer Pages
import Influencer from './pages/Influencer';
import InfluencerLogin from './pages/InfluencerLogin';
import InfluencerDashboard from './pages/InfluencerDashboard';

import Cart from './components/Cart';
import ProtectedRoute from './components/auth/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to handle routing and email confirmation within all contexts
const AppRoutes: React.FC = () => {
  // Hook is now correctly called within all provider contexts
  useEmailConfirmationHandler();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'sales_manager', 'team_lead', 'seller', 'influencer']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/client-space" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'sales_manager', 'team_lead', 'seller', 'influencer']}>
            <ClientSpace />
          </ProtectedRoute>
        } />
        <Route path="/deals" element={<AllDeals />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/ya-ba-boss" element={<YaBaBoss />} />
        <Route path="/ya-ba-boss/products" element={<YaBaBossProducts />} />
        <Route path="/solaire" element={<Solaire />} />
        <Route path="/solar-demos" element={<SolarDemos />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* Admin Login */}
        <Route path="/admin/kota" element={<AdminLogin />} />
        
        {/* Influencer Routes */}
        <Route path="/influencer" element={<Influencer />} />
        <Route path="/influencer/login" element={<InfluencerLogin />} />
        <Route path="/influencer/dashboard" element={
          <ProtectedRoute allowedRoles={['influencer']}>
            <InfluencerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'sales_manager', 'team_lead', 'seller']}>
            <Admin />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="commandes" element={<AdminOrdersHub />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="unassigned-orders" element={<UnassignedOrders />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="customers" element={<AllCustomers />} />
          <Route path="my-customers" element={<MyCustomers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="yababosser" element={<YaBaBosser />} />
          <Route path="traffic" element={<Analytics />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics-customizable" element={<AnalyticsCustomizable />} />
          <Route path="traffic-analytics" element={<TrafficAnalytics />} />
          <Route path="ai-sales" element={<AISales />} />
          <Route path="messaging" element={<MessagingCenter />} />
          <Route path="messages" element={<MessageTemplates />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="influencers" element={<InfluencerManager />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="solar-installations" element={<SolarInstallations />} />
        </Route>
      </Routes>
      
      {/* Cart global component */}
      <Cart />
    </>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Router>
            <CartProvider>
              <AppRoutes />
              <Toaster />
            </CartProvider>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
