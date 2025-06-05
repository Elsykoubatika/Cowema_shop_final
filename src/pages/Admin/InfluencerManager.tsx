
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import InfluencerList from './InfluencerList';

const InfluencerManager: React.FC = () => {
  return (
    <AdminPageLayout>
      <AdminPageHeader title="Gestion des influenceurs" />
      <div className="container-cowema p-4">
        <InfluencerList />
      </div>
    </AdminPageLayout>
  );
};

export default InfluencerManager;
