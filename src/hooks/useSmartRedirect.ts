import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { AuthUser } from './useUnifiedAuth';

export const useSmartRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardForRole = useCallback((role: string): string => {
    console.log('🎯 Getting dashboard for role:', role);
    
    switch (role) {
      case 'admin':
      case 'sales_manager':
      case 'team_lead':
      case 'seller':
        return '/admin';
      case 'influencer':
        return '/influencer/dashboard';
      case 'user':
      default:
        return '/client-space';
    }
  }, []);

  const getLoginPageForPath = useCallback((pathname: string): string => {
    console.log('🔐 Getting login page for path:', pathname);
    
    if (pathname.startsWith('/admin')) {
      return '/admin/kota';
    }
    if (pathname.startsWith('/influencer')) {
      return '/influencer/login';
    }
    return '/login';
  }, []);

  const redirectToDashboard = useCallback((user: AuthUser) => {
    const currentPath = location.pathname;
    const dashboardPath = getDashboardForRole(user.role);
    const savedPath = location.state?.from;

    console.log('🚀 Executing redirect to dashboard:', {
      userRole: user.role,
      currentPath,
      dashboardPath,
      savedPath,
      timestamp: new Date().toISOString()
    });

    // Si on est sur une page de login, rediriger vers le dashboard approprié
    if (currentPath.includes('/login') || currentPath.includes('/kota')) {
      console.log('➡️ Redirecting from login page to:', dashboardPath);
      
      // Utiliser un délai court pour éviter les problèmes de timing
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 100);
      return;
    }

    // Si on a une page sauvegardée et que l'utilisateur a les permissions, y rediriger
    if (savedPath && savedPath !== currentPath) {
      // Vérifier si l'utilisateur a accès à la page sauvegardée
      const hasAccess = checkPageAccess(savedPath, user.role);
      if (hasAccess) {
        console.log('➡️ Redirecting to saved path:', savedPath);
        setTimeout(() => {
          navigate(savedPath, { replace: true });
        }, 100);
        return;
      }
    }

    // Sinon, rediriger vers le dashboard par défaut
    if (currentPath !== dashboardPath) {
      console.log('➡️ Redirecting to default dashboard:', dashboardPath);
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 100);
    }
  }, [location, navigate, getDashboardForRole]);

  const redirectToLogin = useCallback((savePage = true) => {
    const currentPath = location.pathname;
    const loginPath = getLoginPageForPath(currentPath);

    console.log('🔐 Redirecting to login:', {
      currentPath,
      loginPath,
      savePage
    });

    // Sauvegarder la page actuelle pour redirection après login
    const state = savePage && !currentPath.includes('/login') && !currentPath.includes('/kota')
      ? { from: currentPath } 
      : undefined;

    navigate(loginPath, { state, replace: true });
  }, [location, navigate, getLoginPageForPath]);

  const checkPageAccess = useCallback((path: string, role: string): boolean => {
    // Admin routes
    if (path.startsWith('/admin')) {
      return ['admin', 'sales_manager', 'team_lead', 'seller'].includes(role);
    }
    
    // Influencer routes
    if (path.startsWith('/influencer/dashboard')) {
      return role === 'influencer';
    }
    
    // Protected user routes
    if (path === '/account' || path === '/client-space') {
      return true; // Tous les utilisateurs connectés peuvent accéder
    }
    
    // Public routes
    return true;
  }, []);

  return {
    redirectToDashboard,
    redirectToLogin,
    getDashboardForRole,
    getLoginPageForPath,
    checkPageAccess
  };
};
