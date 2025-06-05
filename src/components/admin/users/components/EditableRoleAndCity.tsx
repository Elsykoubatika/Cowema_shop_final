
import React from 'react';
import { UserProfile } from '@/types/userManager';
import UserRoleBadge from './UserRoleBadge';

interface EditableRoleAndCityProps {
  user: UserProfile;
  editData: Partial<UserProfile>;
  setEditData: (data: Partial<UserProfile>) => void;
  isEditing: boolean;
}

const EditableRoleAndCity: React.FC<EditableRoleAndCityProps> = ({
  user,
  editData,
  setEditData,
  isEditing
}) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <select
          value={editData.role || user.role}
          onChange={(e) => setEditData({ ...editData, role: e.target.value as UserProfile['role'] })}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="user">Client</option>
          <option value="seller">Vendeur</option>
          <option value="team_lead">Chef d'équipe</option>
          <option value="sales_manager">Responsable Vente</option>
          <option value="influencer">Influenceur</option>
          <option value="admin">Administrateur</option>
        </select>
        <select
          value={editData.city || user.city || ''}
          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Aucune ville</option>
          <option value="brazzaville">Brazzaville</option>
          <option value="pointe-noire">Pointe-Noire</option>
          <option value="dolisie">Dolisie</option>
          <option value="ouesso">Ouesso</option>
          <option value="impfondo">Impfondo</option>
        </select>
      </div>
    );
  }

  return <UserRoleBadge role={user.role} city={user.city} />;
};

export default EditableRoleAndCity;
