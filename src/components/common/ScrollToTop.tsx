
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ne pas réinitialiser le scroll si l'utilisateur navigue back/forward
    // Le navigateur gère automatiquement la restauration de la position
    if (window.history.state && window.history.state.usr) {
      // Il s'agit d'une navigation programmatique (back/forward)
      return;
    }
    
    // Pour les nouvelles navigations, aller en haut de la page
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
