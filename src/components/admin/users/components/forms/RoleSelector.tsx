
import React from 'react';
import { User, Shield, Star, Users, TrendingUp } from 'lucide-react';

interface RoleDefinition {
  value: string;
  label: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  requiresCity: boolean;
}

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  isDisabled?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleChange, isDisabled }) => {
  const roleDefinitions: RoleDefinition[] = [
    {
      value: 'user',
      label: 'Client',
      description: 'Accès client standard',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      requiresCity: false
    },
    {
      value: 'seller',
      label: 'Vendeur',
      description: 'Gestion des ventes et clients',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      requiresCity: true
    },
    {
      value: 'team_lead',
      label: 'Chef d\'équipe',
      description: 'Supervision d\'équipe de vente',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      requiresCity: true
    },
    {
      value: 'sales_manager',
      label: 'Responsable des ventes',
      description: 'Gestion globale des ventes',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      requiresCity: false
    },
    {
      value: 'influencer',
      label: 'Influenceur',
      description: 'Programme d\'affiliation',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      requiresCity: true
    },
    {
      value: 'admin',
      label: 'Administrateur',
      description: 'Accès complet au système',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      requiresCity: false
    }
  ];

  return (
    <div>
      <label className="block mb-3 font-medium text-gray-700">
        Rôle utilisateur <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {roleDefinitions.map((role) => {
          const IconComponent = role.icon;
          const isSelected = selectedRole === role.value;
          return (
            <label
              key={role.value}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? `${role.borderColor} ${role.bgColor}`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={isSelected}
                onChange={(e) => onRoleChange(e.target.value)}
                disabled={isDisabled}
                className="sr-only"
              />
              <IconComponent className={`w-5 h-5 mr-3 ${role.color}`} />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{role.label}</div>
                <div className="text-sm text-gray-500">{role.description}</div>
                {role.requiresCity && (
                  <div className="text-xs text-orange-600 mt-1">Ville requise</div>
                )}
              </div>
              {isSelected && (
                <div className={`w-4 h-4 rounded-full ${role.color.replace('text-', 'bg-')}`}></div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
