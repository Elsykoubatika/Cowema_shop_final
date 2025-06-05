
import React from 'react';
import { UserProfile } from '@/types/userManager';

interface EditableUserInfoProps {
  user: UserProfile;
  editData: Partial<UserProfile>;
  setEditData: (data: Partial<UserProfile>) => void;
  isEditing: boolean;
}

const EditableUserInfo: React.FC<EditableUserInfoProps> = ({
  user,
  editData,
  setEditData,
  isEditing
}) => {
  if (isEditing) {
    return (
      <div className="space-y-1">
        <input
          type="text"
          value={editData.nom || ''}
          onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
          className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
          placeholder="Nom complet"
        />
        <div className="flex gap-1">
          <input
            type="text"
            value={editData.first_name || ''}
            onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
            className="text-xs text-gray-500 border border-gray-300 rounded px-1 py-0.5 w-20"
            placeholder="Prénom"
          />
          <input
            type="text"
            value={editData.last_name || ''}
            onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
            className="text-xs text-gray-500 border border-gray-300 rounded px-1 py-0.5 w-20"
            placeholder="Nom"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm font-medium text-gray-900">{user.nom}</div>
      <div className="text-sm text-gray-500">
        {user.first_name || ''} {user.last_name || ''}
      </div>
    </div>
  );
};

export default EditableUserInfo;
