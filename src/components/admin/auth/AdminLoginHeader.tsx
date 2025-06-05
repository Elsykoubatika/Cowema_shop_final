
import React from 'react';
import { Shield } from 'lucide-react';

const AdminLoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Shield className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Admin COWEMA</h1>
      <p className="text-gray-600 mt-2">
        Connectez-vous pour accéder à l'interface d'administration
      </p>
    </div>
  );
};

export default AdminLoginHeader;
