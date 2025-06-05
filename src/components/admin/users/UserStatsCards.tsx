
import React from 'react';

interface UserStatsCardsProps {
  users: any[];
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ users }) => {
  if (users.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-blue-600">{users.length}</div>
        <div className="text-sm text-gray-500">Total utilisateurs</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-green-600">
          {users.filter(u => ['admin', 'sales_manager', 'team_lead', 'seller'].includes(u.role)).length}
        </div>
        <div className="text-sm text-gray-500">Staff</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-purple-600">
          {users.filter(u => u.role === 'influencer').length}
        </div>
        <div className="text-sm text-gray-500">Influenceurs</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-gray-600">
          {users.filter(u => u.role === 'user').length}
        </div>
        <div className="text-sm text-gray-500">Clients</div>
      </div>
    </div>
  );
};

export default UserStatsCards;
