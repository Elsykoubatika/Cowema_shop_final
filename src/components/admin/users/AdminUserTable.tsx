
import React, { useState } from 'react';
import { UserProfile } from '@/types/userManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, User, Eye, EyeOff, Key } from 'lucide-react';
import { useUserManager } from '@/hooks/admin/useUserManager';
import { getRoleIcon, getRoleLabel, getRoleColor } from './utils/userTableUtils';
import UserTableRow from './components/UserTableRow';

interface AdminUserTableProps {
  users: UserProfile[];
}

const AdminUserTable: React.FC<AdminUserTableProps> = ({ users }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deletingUsers, setDeletingUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [showPasswordReset, setShowPasswordReset] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { deleteUser, updateUser, resetPassword } = useUserManager();

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`⚠️ Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?\n\nCette action est irréversible.`)) {
      setDeletingUsers(prev => [...prev, userId]);
      await deleteUser(userId);
      setDeletingUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user.id);
    setEditData({
      nom: user.nom,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role,
      gender: user.gender,
      city: user.city
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser || !editData) return;
    
    const success = await updateUser(editingUser, editData);
    if (success) {
      setEditingUser(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditData({});
  };

  const handlePasswordReset = async (userId: string) => {
    if (!newPassword) return;
    
    const success = await resetPassword(userId, newPassword);
    if (success) {
      setShowPasswordReset(null);
      setNewPassword('');
      setShowPassword(false);
    }
  };

  const handleShowPasswordReset = (userId: string) => {
    setShowPasswordReset(userId);
  };

  const handleCancelPasswordReset = () => {
    setShowPasswordReset(null);
    setNewPassword('');
    setShowPassword(false);
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur</h3>
        <p className="text-gray-500">Commencez par créer votre premier utilisateur.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{users.length}</span> utilisateur{users.length > 1 ? 's' : ''} 
          </p>
          <div className="flex gap-2">
            {Object.entries(
              users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([role, count]) => {
              const RoleIcon = getRoleIcon(role);
              return (
                <Badge key={role} variant="outline" className={`${getRoleColor(role)} text-xs`}>
                  <RoleIcon size={12} className="mr-1" />
                  {getRoleLabel(role)}: {count}
                </Badge>
              );
            })}
          </div>
        </div>
        
        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedUsers.length} sélectionné{selectedUsers.length > 1 ? 's' : ''}
            </span>
            <Button variant="destructive" size="sm">
              <Trash2 size={14} className="mr-1" />
              Supprimer
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle & Localisation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Authentification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Créé le
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isDeleting={deletingUsers.includes(user.id)}
                editingUser={editingUser}
                editData={editData}
                setEditData={setEditData}
                showPasswordReset={showPasswordReset}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onEdit={handleEditUser}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onDelete={handleDeleteUser}
                onPasswordReset={handlePasswordReset}
                onShowPasswordReset={handleShowPasswordReset}
                onCancelPasswordReset={handleCancelPasswordReset}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserTable;
