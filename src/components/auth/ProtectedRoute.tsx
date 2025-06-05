
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'user' | 'admin' | 'seller' | 'team_lead' | 'sales_manager' | 'influencer';
  allowedRoles?: ('user' | 'admin' | 'seller' | 'team_lead' | 'sales_manager' | 'influencer')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  role,
  allowedRoles = []
}) => {
  const { isAuthenticated, user, isLoading } = useUnifiedAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', { 
    isAuthenticated, 
    userRole: user?.role, 
    isLoading,
    requiredRole: role,
    allowedRoles,
    pathname: location.pathname
  });

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">Vérification de votre accès...</p>
            <p className="text-sm text-gray-500">Chargement des informations d'authentification</p>
          </div>
        </div>
      </div>
    );
  }

  // Utilisateur non authentifié - redirection vers login approprié
  if (!isAuthenticated || !user) {
    console.log('❌ User not authenticated, redirecting to login...');
    
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/kota" replace />;
    } else if (location.pathname.startsWith('/influencer')) {
      return <Navigate to="/influencer/login" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // Vérification des rôles spécifiques
  if (role && user.role !== role) {
    console.log('⚠️ Role mismatch:', { userRole: user.role, requiredRole: role });
    
    // Redirection intelligente selon le rôle de l'utilisateur
    switch (user.role) {
      case 'influencer':
        return <Navigate to="/influencer/dashboard" replace />;
      case 'admin':
      case 'sales_manager':
      case 'team_lead':
      case 'seller':
        return <Navigate to="/admin" replace />;
      case 'user':
      default:
        return <Navigate to="/account" replace />;
    }
  }

  // Vérification des rôles autorisés
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('⚠️ Role not in allowed list:', { userRole: user.role, allowedRoles });
    
    // Redirection intelligente selon le rôle de l'utilisateur
    switch (user.role) {
      case 'influencer':
        return <Navigate to="/influencer/dashboard" replace />;
      case 'admin':
      case 'sales_manager':
      case 'team_lead':
      case 'seller':
        return <Navigate to="/admin" replace />;
      case 'user':
      default:
        return <Navigate to="/account" replace />;
    }
  }

  console.log('✅ Access granted for user:', { 
    role: user.role, 
    nom: user.nom,
    pathname: location.pathname 
  });
  
  return <>{children}</>;
};

export default ProtectedRoute;
