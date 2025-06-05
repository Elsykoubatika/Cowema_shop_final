
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface UserManagerDiagnosticsProps {
  error: string | null;
  diagnosticResult: any;
  onDiagnosis: () => void;
  onRefresh: () => void;
  loading: boolean;
  isDiagnosing: boolean;
}

const UserManagerDiagnostics: React.FC<UserManagerDiagnosticsProps> = ({
  error,
  diagnosticResult,
  onDiagnosis,
  onRefresh,
  loading,
  isDiagnosing
}) => {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-3">
          <div>
            <strong>Problème détecté:</strong> {error}
          </div>
          
          {diagnosticResult && (
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Diagnostic:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Configuration: {diagnosticResult.configValid ? '✅ Valide' : '❌ Invalide'}</li>
                  <li>Connexion Admin: {diagnosticResult.connectionTest ? '✅ OK' : '❌ Échec'}</li>
                  <li>Accès Données: {diagnosticResult.dataAccess ? '✅ OK' : '❌ Limité'}</li>
                </ul>
              </div>
              
              {diagnosticResult.recommendations && diagnosticResult.recommendations.length > 0 && (
                <div className="text-sm">
                  <strong>Recommandations:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {diagnosticResult.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDiagnosis}
              disabled={isDiagnosing}
            >
              {isDiagnosing ? 'Diagnostic en cours...' : 'Relancer diagnostic'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={loading}
            >
              Réessayer
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default UserManagerDiagnostics;
