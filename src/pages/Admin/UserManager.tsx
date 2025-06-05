
import React, { useState } from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminUserTable from '@/components/admin/users/AdminUserTable';
import AdminUserCreateForm from '@/components/admin/users/AdminUserCreateForm';
import UserManagerHeader from '@/components/admin/users/UserManagerHeader';
import UserStatsCards from '@/components/admin/users/UserStatsCards';
import UserManagerDiagnostics from '@/components/admin/users/UserManagerDiagnostics';
import UserManagerQuickActions from '@/components/admin/users/UserManagerQuickActions';
import { useUserManager } from '@/hooks/admin/useUserManager';
import { RefreshCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { diagnosisAdminClient } from '@/integrations/supabase/adminClient';

const UserManager: React.FC = () => {
  const { users, loading, error, fetchUsers } = useUserManager();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  const handleDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      console.log('🩺 Lancement du diagnostic...');
      const diagnosis = await diagnosisAdminClient();
      console.log('📊 Résultat diagnostic:', diagnosis);
      setDiagnosticResult(diagnosis);
      
      if (diagnosis.connectionTest || diagnosis.dataAccess) {
        setTimeout(() => {
          fetchUsers();
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Erreur diagnostic:', error);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleRefresh = async () => {
    setDiagnosticResult(null);
    await fetchUsers();
  };

  const getConnectionStatus = () => {
    if (diagnosticResult) {
      if (diagnosticResult.connectionTest) {
        return { status: 'connected', label: 'Connexion Admin OK', color: 'bg-green-100 text-green-800' };
      } else if (diagnosticResult.dataAccess) {
        return { status: 'limited', label: 'Accès Limité', color: 'bg-yellow-100 text-yellow-800' };
      } else {
        return { status: 'disconnected', label: 'Connexion Échouée', color: 'bg-red-100 text-red-800' };
      }
    }
    return null;
  };

  const connectionStatus = getConnectionStatus();

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        <UserManagerHeader
          connectionStatus={connectionStatus}
          loading={loading}
          error={error}
          users={users}
          onRefresh={handleRefresh}
          onDiagnosis={handleDiagnosis}
          onCreateUser={() => setShowCreateForm(!showCreateForm)}
          isDiagnosing={isDiagnosing}
        />

        <UserStatsCards users={users} />

        <UserManagerDiagnostics
          error={error}
          diagnosticResult={diagnosticResult}
          onDiagnosis={handleDiagnosis}
          onRefresh={handleRefresh}
          loading={loading}
          isDiagnosing={isDiagnosing}
        />
        
        <UserManagerQuickActions
          diagnosticResult={diagnosticResult}
          onDiagnosis={handleDiagnosis}
          isDiagnosing={isDiagnosing}
        />

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Créer un nouvel utilisateur</h2>
            <AdminUserCreateForm onSuccess={() => setShowCreateForm(false)} />
          </div>
        )}

        {/* Tableau des utilisateurs */}
        {loading && users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <RefreshCcw className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Chargement des utilisateurs...</p>
          </div>
        ) : error && users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-4" />
            <p className="text-gray-600 mb-4">Impossible de charger les utilisateurs</p>
            <div className="flex justify-center gap-2">
              <Button onClick={handleDiagnosis} disabled={isDiagnosing} variant="outline">
                {isDiagnosing ? 'Diagnostic en cours...' : 'Lancer le diagnostic'}
              </Button>
              <Button onClick={handleRefresh} disabled={loading}>
                Réessayer
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <AdminUserTable users={users} />
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default UserManager;
