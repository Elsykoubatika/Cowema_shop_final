
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import CustomizableAnalyticsDashboard from '@/components/admin/analytics/CustomizableAnalyticsDashboard';

const AnalyticsCustomizable: React.FC = () => {
  return (
    <AdminPageLayout>
      <AdminPageHeader title="Analytics Personnalisés" />
      <div className="container-cowema p-4">
        <CustomizableAnalyticsDashboard />
      </div>
    </AdminPageLayout>
  );
};

export default AnalyticsCustomizable;
