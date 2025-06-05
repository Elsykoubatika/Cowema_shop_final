
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User, LogOut, Star, Loader2 } from 'lucide-react';
import { useUnifiedAuth } from '../../hooks/useUnifiedAuth';

const AuthLinks: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading } = useUnifiedAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    console.log('🚪 Header: Starting logout process for user:', user?.nom, 'Role:', user?.role);
    setIsLoggingOut(true);
    
    try {
      await logout();
      // Le logout gère maintenant la redirection directement
    } catch (error) {
      console.error('❌ Header: Logout error:', error);
      // Force redirect even on error
      window.location.replace('/');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
      </div>
    );
  }
  
  return (
    <>
      {!isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Link to="/login" className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
            <LogIn size={18} /> Connexion
          </Link>
          <Link to="/influencer/login" className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
            <Star size={18} /> Espace influenceur
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/account" className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
            <User size={18} /> {user?.nom || user?.firstName || 'Mon compte'}
          </Link>
          
          {user?.role === 'influencer' && (
            <>
              <span className="text-gray-300">|</span>
              <Link to="/influencer/dashboard" className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                <Star size={18} /> Espace influenceur
              </Link>
            </>
          )}
          
          <span className="text-gray-300">|</span>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1 text-sm hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Déconnexion...
              </>
            ) : (
              <>
                <LogOut size={18} />
                Déconnexion
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default AuthLinks;
