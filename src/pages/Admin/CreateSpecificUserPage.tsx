
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import CreateSpecificUser from '@/components/admin/users/CreateSpecificUser';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateSpecificUserPage: React.FC = () => {
  return (
    <AdminPageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/users" 
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Retour à la gestion des utilisateurs
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-6">Créer un utilisateur spécifique</h1>
          <CreateSpecificUser />
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default CreateSpecificUserPage;
