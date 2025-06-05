
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { MessageTemplateManager } from '@/components/admin/messages/MessageTemplateManager';

const MessageTemplates: React.FC = () => {
  return (
    <AdminPageLayout>
      <AdminPageHeader title="Gestion des modèles de messages" />
      <div className="container-cowema space-y-6 p-4">
        <MessageTemplateManager />
      </div>
    </AdminPageLayout>
  );
};

export default MessageTemplates;
