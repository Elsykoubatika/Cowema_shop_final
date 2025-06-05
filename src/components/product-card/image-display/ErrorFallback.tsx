
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorFallbackProps {
  title: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ title }) => {
  return (
    <Alert variant="destructive" className="h-72 flex flex-col justify-center">
      <AlertCircle className="h-6 w-6" />
      <AlertTitle className="mt-2">Erreur de chargement</AlertTitle>
      <AlertDescription>
        Les images pour "{title}" n'ont pas pu être chargées.
      </AlertDescription>
    </Alert>
  );
};

export default ErrorFallback;
