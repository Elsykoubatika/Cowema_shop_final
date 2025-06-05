
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UserManagerQuickActionsProps {
  diagnosticResult: any;
  onDiagnosis: () => void;
  isDiagnosing: boolean;
}

const UserManagerQuickActions: React.FC<UserManagerQuickActionsProps> = ({
  diagnosticResult,
  onDiagnosis,
  isDiagnosing
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg border">
      <div>
        <h2 className="text-lg font-semibold">Actions rapides</h2>
        <p className="text-sm text-gray-600">Créer des utilisateurs spécifiques ou gérer les comptes</p>
      </div>
      <div className="flex gap-2">
        <Link 
          to="/admin/create-specific-user"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Créer utilisateur spécifique
        </Link>
        {diagnosticResult && !diagnosticResult.connectionTest && (
          <Button 
            variant="outline" 
            onClick={onDiagnosis}
            disabled={isDiagnosing}
          >
            {isDiagnosing ? 'Diagnostic...' : 'Réparer connexion'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserManagerQuickActions;
