
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getRoleIcon, getRoleLabel, getRoleColor } from '../utils/userTableUtils';

interface UserRoleBadgeProps {
  role: string;
  city?: string;
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role, city }) => {
  const RoleIcon = getRoleIcon(role);
  
  return (
    <div className="space-y-1">
      <Badge className={`${getRoleColor(role)} border`}>
        <RoleIcon className="w-3 h-3 mr-1" />
        {getRoleLabel(role)}
      </Badge>
      {city && (
        <div className="text-sm text-gray-500 flex items-center">
          📍 {city.charAt(0).toUpperCase() + city.slice(1)}
        </div>
      )}
    </div>
  );
};

export default UserRoleBadge;
