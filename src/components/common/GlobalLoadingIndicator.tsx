
import React from 'react';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { Loader2 } from 'lucide-react';

const GlobalLoadingIndicator: React.FC = () => {
  const { isLoading, loadingMessage } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium">{loadingMessage}</p>
      </div>
    </div>
  );
};

export default GlobalLoadingIndicator;
