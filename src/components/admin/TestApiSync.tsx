
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SyncResult {
  success: boolean;
  message?: string;
  error?: string;
  stats?: {
    total_fetched: number;
    processed: number;
    errors: number;
    timestamp: string;
  };
}

const TestApiSync: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Use the Supabase constants directly
      const supabaseUrl = "https://hvrlcwfbujadozdhwvon.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cmxjd2ZidWphZG96ZGh3dm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzU3OTksImV4cCI6MjA2MTI1MTc5OX0.Yd5XDATYl2mCD_mxwrMZa4CGGQpYRSPq4ASk3gP4mPA";
      const functionUrl = `${supabaseUrl}/functions/v1/sync-products`;
      
      console.log('Calling edge function at:', functionUrl);

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Synchronisation réussie",
          description: `${data.stats?.processed || 0} produits synchronisés`,
        });
      } else {
        toast({
          title: "Erreur de synchronisation",
          description: data.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      setResult({
        success: false,
        error: 'Erreur de connexion à l\'API'
      });
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au service de synchronisation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test de Synchronisation API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cliquez sur le bouton ci-dessous pour charger la première page de produits depuis l'API Cowema.
          </p>
          
          <Button 
            onClick={handleSync} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Synchronisation en cours...
              </>
            ) : (
              'Charger les données API'
            )}
          </Button>

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                {result.success ? (
                  <div>
                    <p className="font-medium text-green-800">Synchronisation réussie !</p>
                    {result.stats && (
                      <div className="mt-2 text-sm text-green-700">
                        <p>• Produits récupérés: {result.stats.total_fetched}</p>
                        <p>• Produits traités: {result.stats.processed}</p>
                        <p>• Erreurs: {result.stats.errors}</p>
                        <p>• Timestamp: {new Date(result.stats.timestamp).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-red-800">
                    <span className="font-medium">Erreur:</span> {result.error}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestApiSync;
