
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useSmartRedirect } from '@/hooks/useSmartRedirect';
import AdminLoginForm from '@/components/admin/auth/AdminLoginForm';
import AdminLoginHeader from '@/components/admin/auth/AdminLoginHeader';
import AdminLoginFooter from '@/components/admin/auth/AdminLoginFooter';
import AdminAccountSetup from '@/components/admin/auth/AdminAccountSetup';
import LoadingSpinner from '@/components/admin/auth/LoadingSpinner';
import { Button } from '@/components/ui/button';

const AdminLogin: React.FC = () => {
  const { isAuthenticated, user, isLoading, login } = useUnifiedAuth();
  const { redirectToDashboard } = useSmartRedirect();
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && ['admin', 'sales_manager', 'team_lead', 'seller'].includes(user.role || '')) {
      console.log('🔄 Admin user already authenticated, redirecting...', {
        userRole: user.role,
        nom: user.nom
      });
      
      redirectToDashboard(user);
    } else if (isAuthenticated && user) {
      console.log('⚠️ User authenticated but not admin role:', user.role);
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, redirectToDashboard, navigate]);

  const handleLogin = async (email: string, password: string) => {
    console.log('🔐 Admin login attempt for:', email);
    const success = await login(email, password, 'admin');
    
    if (success) {
      console.log('✅ Admin login successful, auth state will update automatically');
      // La redirection sera gérée par l'useEffect ci-dessus
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Vérification de l'authentification..." />;
  }

  if (isAuthenticated && user && ['admin', 'sales_manager', 'team_lead', 'seller'].includes(user.role || '')) {
    return (
      <LoadingSpinner 
        message={`Redirection vers l'administration... Bienvenue ${user.nom}`} 
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative">
        <Link 
          to="/" 
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm"
        >
          <Home size={16} />
          Accueil
        </Link>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSetup(!showSetup)}
          className="absolute top-4 right-4 text-gray-600 hover:text-primary"
        >
          <Settings size={16} />
        </Button>
        
        {showSetup ? (
          <AdminAccountSetup />
        ) : (
          <>
            <AdminLoginHeader />
            <AdminLoginForm 
              onSubmit={handleLogin}
              isSubmitting={isLoading}
            />
            <AdminLoginFooter />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
