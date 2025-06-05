
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, RefreshCcw, Settings, Wifi, WifiOff } from 'lucide-react';

interface UserManagerHeaderProps {
  connectionStatus: any;
  loading: boolean;
  error: string | null;
  users: any[];
  onRefresh: () => void;
  onDiagnosis: () => void;
  onCreateUser: () => void;
  isDiagnosing: boolean;
}

const UserManagerHeader: React.FC<UserManagerHeaderProps> = ({
  connectionStatus,
  loading,
  error,
  users,
  onRefresh,
  onDiagnosis,
  onCreateUser,
  isDiagnosing
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">Interface de gestion des comptes utilisateurs</span>
          {connectionStatus && (
            <Badge className={connectionStatus.color}>
              {connectionStatus.status === 'connected' ? <Wifi size={12} className="mr-1" /> : <WifiOff size={12} className="mr-1" />}
              {connectionStatus.label}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </Button>
        {(error || users.length === 0) && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDiagnosis}
            disabled={isDiagnosing}
          >
            <Settings className={`mr-2 h-4 w-4 ${isDiagnosing ? 'animate-spin' : ''}`} />
            {isDiagnosing ? 'Diagnostic...' : 'Diagnostic'}
          </Button>
        )}
        <Button
          size="sm"
          onClick={onCreateUser}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>
    </div>
  );
};

export default UserManagerHeader;
