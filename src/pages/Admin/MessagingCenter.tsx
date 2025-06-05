
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { MessagingCenter } from '@/components/admin/messaging/MessagingCenter';

const MessagingCenterPage: React.FC = () => {
  return (
    <AdminPageLayout>
      <AdminPageHeader title="Centre de messagerie" />
      <div className="container-cowema space-y-6 p-4">
        <MessagingCenter />
      </div>
    </AdminPageLayout>
  );
};

export default MessagingCenterPage;
