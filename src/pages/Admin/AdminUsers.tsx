
import React, { useState } from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Eye, RefreshCcw, Users, AlertCircle } from 'lucide-react';
import AdminUserCreateForm from '@/components/admin/users/AdminUserCreateForm';
import AdminUserTable from '@/components/admin/users/AdminUserTable';
import { useUserManager } from '@/hooks/admin/useUserManager';

const AdminUsers: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { users, loading, error, fetchUsers } = useUserManager();

  const getRoleStats = () => {
    return users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const roleStats = getRoleStats();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'sales_manager': return 'bg-blue-100 text-blue-800';
      case 'team_lead': return 'bg-green-100 text-green-800';
      case 'seller': return 'bg-orange-100 text-orange-800';
      case 'influencer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'sales_manager': return 'Responsable des ventes';
      case 'team_lead': return 'Chef d\'équipe';
      case 'seller': return 'Vendeur';
      case 'influencer': return 'Influenceur';
      default: return 'Client';
    }
  };

  const handleCreateUser = () => {
    console.log('Opening create user form');
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    console.log('Closing create user form');
    setShowCreateForm(false);
  };

  const handleUserCreated = async () => {
    console.log('User created successfully, refreshing data and closing form');
    setShowCreateForm(false);
    // The useUserManager hook already refreshes the data after user creation
    // but we can force a refresh here to be sure
    await fetchUsers();
  };

  return (
    <AdminPageLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h2>
            <p className="text-muted-foreground">
              Gérez les comptes utilisateurs et leurs permissions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Rafraîchir
            </Button>
            <Button onClick={handleCreateUser}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-gray-600">Total utilisateurs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {Object.entries(roleStats).map(([role, count]) => (
            <Card key={role}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-600">{getRoleText(role)}</p>
                  </div>
                  <Badge className={getRoleColor(role)}>
                    {getRoleText(role)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">Erreur de chargement</p>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchUsers}
                className="mt-2"
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Créer un nouvel utilisateur</CardTitle>
                <Button variant="outline" onClick={handleCloseForm}>
                  Fermer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AdminUserCreateForm onSuccess={handleUserCreated} />
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Liste des utilisateurs</span>
              {loading && <RefreshCcw className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && users.length === 0 ? (
              <div className="text-center py-12">
                <RefreshCcw className="mx-auto h-8 w-8 text-gray-400 animate-spin mb-4" />
                <p className="text-gray-600">Chargement des utilisateurs...</p>
              </div>
            ) : (
              <AdminUserTable users={users} />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default AdminUsers;
