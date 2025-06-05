
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import TestApiSync from '@/components/admin/TestApiSync';

const ApiTest: React.FC = () => {
  return (
    <AdminPageLayout>
      <AdminPageHeader title="Test API" />
      <div className="container-cowema">
        <TestApiSync />
      </div>
    </AdminPageLayout>
  );
};

export default ApiTest;
