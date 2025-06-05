
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import OrderDetails from './OrderDetails';
import AdminCustomers from './AdminCustomers';
import AdminProducts from './AdminProducts';
import AdminReviews from './AdminReviews';
import ReviewsManager from './ReviewsManager';
import AdminPromotions from './AdminPromotions';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';
import Analytics from './Analytics';
import AnalyticsCustomizable from './AnalyticsCustomizable';
import AnalyticsDashboard from './AnalyticsDashboard';
import TrafficAnalytics from './TrafficAnalytics';
import InfluencerManager from './InfluencerManager';
import YaBaBosser from './YaBaBosser';
import MessagingCenter from './MessagingCenter';
import UnassignedOrders from './UnassignedOrders';
import MyOrders from './MyOrders';
import MyCustomers from './MyCustomers';
import AISales from './AISales';
import MessageTemplates from './MessageTemplates';
import UserManager from './UserManager';
import SolarInstallations from './SolarInstallations';
import BlogManager from './BlogManager';
import { useAuthStore } from '@/hooks/useAuthStore';

const AdminRoutes: React.FC = () => {
  const { user } = useAuthStore();

  if (!user || !['admin', 'sales_manager', 'team_lead', 'seller'].includes(user.role || '')) {
    return <div>Accès non autorisé</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/unassigned-orders" element={<UnassignedOrders />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/customers" element={<AdminCustomers />} />
      <Route path="/my-customers" element={<MyCustomers />} />
      <Route path="/products" element={<AdminProducts />} />
      <Route path="/reviews" element={<AdminReviews />} />
      <Route path="/reviews-manager" element={<ReviewsManager />} />
      <Route path="/promotions" element={<AdminPromotions />} />
      <Route path="/users" element={<UserManager />} />
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="/traffic" element={<Analytics />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
      <Route path="/analytics-customizable" element={<AnalyticsCustomizable />} />
      <Route path="/traffic-analytics" element={<TrafficAnalytics />} />
      <Route path="/influencers" element={<InfluencerManager />} />
      <Route path="/yababosser" element={<YaBaBosser />} />
      <Route path="/messaging" element={<MessagingCenter />} />
      <Route path="/ai-sales" element={<AISales />} />
      <Route path="/messages" element={<MessageTemplates />} />
      <Route path="/solar-installations" element={<SolarInstallations />} />
      <Route path="/blog" element={<BlogManager />} />
    </Routes>
  );
};

export default AdminRoutes;
