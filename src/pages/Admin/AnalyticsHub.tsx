
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AnalyticsSelector from '@/components/admin/analytics/AnalyticsSelector';
import { BarChart3 } from 'lucide-react';

const AnalyticsHub: React.FC = () => {
  return (
    <AdminPageLayout>
      <AdminPageHeader 
        title="Centre Analytics" 
        icon={<BarChart3 className="h-6 w-6" />}
        description="Choisissez le type d'analyse qui correspond à vos besoins"
      />
      <AnalyticsSelector />
    </AdminPageLayout>
  );
};

export default AnalyticsHub;
