
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { MultiVendorMessaging } from '@/components/admin/messaging/MultiVendorMessaging';

const MultiVendorWhatsAppPage: React.FC = () => {
  return (
    <AdminPageLayout>
      <AdminPageHeader title="WhatsApp Multi-Vendeurs" />
      <div className="container-cowema space-y-6 p-4">
        <MultiVendorMessaging />
      </div>
    </AdminPageLayout>
  );
};

export default MultiVendorWhatsAppPage;
