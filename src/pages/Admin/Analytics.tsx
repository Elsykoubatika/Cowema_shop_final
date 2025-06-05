
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';

const Analytics: React.FC = () => {
  return (
    <AdminPageLayout>
      <AdminPageHeader title="Analytics & Rapports" />
      <div className="container-cowema p-4">
        <AnalyticsDashboard />
      </div>
    </AdminPageLayout>
  );
};

export default Analytics;
