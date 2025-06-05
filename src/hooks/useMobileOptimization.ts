
import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileOptimizationConfig {
  enableTouchOptimization: boolean;
  enableSwipeGestures: boolean;
  enablePullToRefresh: boolean;
  optimizeAnimations: boolean;
}

export const useMobileOptimization = () => {
  const isMobile = useIsMobile();
  const [config, setConfig] = useState<MobileOptimizationConfig>({
    enableTouchOptimization: true,
    enableSwipeGestures: true,
    enablePullToRefresh: true,
    optimizeAnimations: true
  });

  const enableTouchOptimization = useCallback(() => {
    if (!isMobile) return;

    // Add touch-action CSS for better touch performance
    document.body.style.touchAction = 'manipulation';
    
    // Disable text selection on mobile for better UX
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    // Prevent zoom on double tap
    document.body.style.touchAction = 'manipulation';
  }, [isMobile]);

  const enableSwipeGestures = useCallback(() => {
    if (!isMobile || !config.enableSwipeGestures) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Detect swipe direction
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            // Swipe left
            document.dispatchEvent(new CustomEvent('swipeLeft'));
          } else {
            // Swipe right
            document.dispatchEvent(new CustomEvent('swipeRight'));
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, config.enableSwipeGestures]);

  const optimizeAnimations = useCallback(() => {
    if (!isMobile || !config.optimizeAnimations) return;

    // Reduce animations on mobile for better performance
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        *, *::before, *::after {
          animation-duration: 0.1s !important;
          animation-delay: 0s !important;
          transition-duration: 0.1s !important;
          transition-delay: 0s !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isMobile, config.optimizeAnimations]);

  const enablePullToRefresh = useCallback(() => {
    if (!isMobile || !config.enablePullToRefresh) return;

    let startY = 0;
    let pullDistance = 0;
    const threshold = 100;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY) {
        const currentY = e.touches[0].clientY;
        pullDistance = currentY - startY;
        
        if (pullDistance > 0) {
          e.preventDefault();
          // Visual feedback for pull to refresh
          document.body.style.transform = `translateY(${Math.min(pullDistance * 0.5, 50)}px)`;
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > threshold) {
        // Trigger refresh
        window.location.reload();
      }
      
      // Reset
      document.body.style.transform = '';
      startY = 0;
      pullDistance = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, config.enablePullToRefresh]);

  useEffect(() => {
    if (!isMobile) return;

    const cleanupFunctions: (() => void)[] = [];

    enableTouchOptimization();
    
    const swipeCleanup = enableSwipeGestures();
    if (swipeCleanup) cleanupFunctions.push(swipeCleanup);
    
    const animationCleanup = optimizeAnimations();
    if (animationCleanup) cleanupFunctions.push(animationCleanup);
    
    const pullRefreshCleanup = enablePullToRefresh();
    if (pullRefreshCleanup) cleanupFunctions.push(pullRefreshCleanup);

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [isMobile, enableTouchOptimization, enableSwipeGestures, optimizeAnimations, enablePullToRefresh]);

  return {
    isMobile,
    config,
    setConfig
  };
};
