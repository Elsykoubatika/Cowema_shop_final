
import React, { ReactNode } from 'react';

// Ce fichier n'est plus utilisé car tous les providers sont maintenant dans App.tsx
// Gardé pour compatibilité mais peut être supprimé si aucune référence n'existe

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Simple passthrough - tous les providers sont maintenant dans App.tsx
  return <>{children}</>;
};
