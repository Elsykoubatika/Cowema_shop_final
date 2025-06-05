
import React from 'react';
import { UserProfile } from '@/types/userManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, X, Trash2, Key, Eye, EyeOff, Loader2 } from 'lucide-react';
import { getRoleIcon, getRoleLabel, getRoleColor } from '../utils/userTableUtils';

interface UserTableRowProps {
  user: UserProfile;
  isDeleting: boolean;
  editingUser: string | null;
  editData: Partial<UserProfile>;
  setEditData: (data: Partial<UserProfile>) => void;
  showPasswordReset: string | null;
  newPassword: string;
  setNewPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onEdit: (user: UserProfile) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (userId: string, userName: string) => void;
  onPasswordReset: (userId: string) => void;
  onShowPasswordReset: (userId: string) => void;
  onCancelPasswordReset: () => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isDeleting,
  editingUser,
  editData,
  setEditData,
  showPasswordReset,
  newPassword,
  setNewPassword,
  showPassword,
  setShowPassword,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onPasswordReset,
  onShowPasswordReset,
  onCancelPasswordReset,
}) => {
  const RoleIcon = getRoleIcon(user.role);
  const isEditing = editingUser === user.id;
  const isResettingPassword = showPasswordReset === user.id;

  return (
    <tr className={isDeleting ? 'opacity-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
              {user.nom.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ml-4">
            {isEditing ? (
              <div className="space-y-1">
                <Input
                  value={editData.nom || ''}
                  onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                  className="text-sm"
                  placeholder="Nom"
                />
                <div className="flex gap-2">
                  <Input
                    value={editData.first_name || ''}
                    onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                    className="text-xs"
                    placeholder="Prénom"
                  />
                  <Input
                    value={editData.last_name || ''}
                    onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                    className="text-xs"
                    placeholder="Nom de famille"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium text-gray-900">{user.nom}</div>
                <div className="text-sm text-gray-500">
                  {user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Nom complet non défini'}
                </div>
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="space-y-2">
            <Select value={editData.role} onValueChange={(value) => setEditData({ ...editData, role: value as any })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Client</SelectItem>
                <SelectItem value="seller">Vendeur</SelectItem>
                <SelectItem value="team_lead">Chef d'équipe</SelectItem>
                <SelectItem value="sales_manager">Responsable Commercial</SelectItem>
                <SelectItem value="influencer">Influenceur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={editData.city || ''}
              onChange={(e) => setEditData({ ...editData, city: e.target.value })}
              placeholder="Ville"
            />
          </div>
        ) : (
          <div>
            <Badge className={`${getRoleColor(user.role)} mb-1`}>
              <RoleIcon size={12} className="mr-1" />
              {getRoleLabel(user.role)}
            </Badge>
            <div className="text-sm text-gray-500">
              {user.city || 'Ville non définie'}
            </div>
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-mono">
          {user.email}
        </div>
        <div className="text-xs text-gray-500">
          {user.email_confirmed_at ? (
            <span className="text-green-600">✓ Confirmé</span>
          ) : (
            <span className="text-red-600">✗ Non confirmé</span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <Input
            value={editData.phone || ''}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            placeholder="Téléphone"
          />
        ) : (
          <div className="text-sm text-gray-900">
            {user.phone || 'Non défini'}
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {user.loyalty_points || 0} pts
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.created_at).toLocaleDateString('fr-FR')}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {isDeleting ? (
          <div className="flex items-center justify-end">
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            <span className="ml-2 text-red-500">Suppression...</span>
          </div>
        ) : isEditing ? (
          <div className="flex gap-2">
            <Button onClick={onSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
              <Save size={14} />
            </Button>
            <Button onClick={onCancelEdit} size="sm" variant="outline">
              <X size={14} />
            </Button>
          </div>
        ) : isResettingPassword ? (
          <div className="flex flex-col gap-2 min-w-48">
            <div className="flex gap-1">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                onClick={() => onPasswordReset(user.id)} 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 flex-1"
                disabled={!newPassword}
              >
                <Key size={12} className="mr-1" />
                Changer
              </Button>
              <Button onClick={onCancelPasswordReset} size="sm" variant="outline">
                <X size={12} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => onEdit(user)} size="sm" variant="outline">
              <Edit size={14} />
            </Button>
            <Button onClick={() => onShowPasswordReset(user.id)} size="sm" variant="outline">
              <Key size={14} />
            </Button>
            <Button 
              onClick={() => onDelete(user.id, user.nom)} 
              size="sm" 
              variant="destructive"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default UserTableRow;
