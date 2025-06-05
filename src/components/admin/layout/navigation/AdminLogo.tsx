
import React from "react";
import { useAuthStore } from '@/hooks/useAuthStore';

/**
 * Logo et titre de l'application admin
 */
const AdminLogo: React.FC = () => {
  const { user } = useAuthStore();
  
  // Déterminer le texte secondaire en fonction du rôle
  const getRoleText = () => {
    if (!user?.role) return '';
    
    switch (user.role) {
      case 'admin':
        return 'Administration';
      case 'sales_manager':
        return 'Gestion des ventes';
      case 'team_lead':
        return `Team Lead (${user.city || ''})`;
      case 'seller':
        return `Vendeur (${user.city || ''})`;
      default:
        return '';
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Cowema</h1>
      <p className="text-sm text-muted-foreground">
        {getRoleText()}
      </p>
    </div>
  );
};

export default AdminLogo;
