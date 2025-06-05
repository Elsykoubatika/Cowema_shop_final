
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageReset = (resetCallback: () => void) => {
  const location = useLocation();
  const lastPathnameRef = useRef<string>(location.pathname);
  const isInitialRender = useRef<boolean>(true);

  useEffect(() => {
    const currentPathname = location.pathname;
    
    // Skip reset on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      lastPathnameRef.current = currentPathname;
      return;
    }
    
    // Only reset if pathname actually changed and it's not a back/forward navigation
    if (lastPathnameRef.current !== currentPathname) {
      console.log('usePageReset - Path changed from', lastPathnameRef.current, 'to', currentPathname);
      
      // Check if it's a back/forward navigation by looking at the navigation type
      const navigationType = (performance.getEntriesByType('navigation')[0] as any)?.type;
      const isBackForward = navigationType === 'back_forward' || 
                           (window.history.state && 'idx' in window.history.state);
      
      if (!isBackForward) {
        resetCallback();
      }
      
      lastPathnameRef.current = currentPathname;
    }
  }, [location.pathname, resetCallback]);
};
