
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
}

export const usePerformanceOptimization = () => {
  const measurePerformance = useCallback((): Promise<PerformanceMetrics> => {
    return new Promise((resolve) => {
      const metrics: Partial<PerformanceMetrics> = {};

      // Measure Core Web Vitals
      if ('web-vital' in window) {
        // This would integrate with web-vitals library if installed
        resolve(metrics as PerformanceMetrics);
      } else {
        // Fallback measurements
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        metrics.fcp = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        metrics.lcp = navigation.loadEventEnd - navigation.fetchStart;
        metrics.fid = 0; // Would need actual user interaction measurement
        metrics.cls = 0; // Would need layout shift measurement
        
        resolve(metrics as PerformanceMetrics);
      }
    });
  }, []);

  const optimizeImages = useCallback(() => {
    // Add lazy loading to images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }, []);

  const enableServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }, []);

  const prefetchCriticalResources = useCallback((urls: string[]) => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    // Auto-optimize images on mount
    optimizeImages();
    
    // Enable service worker
    enableServiceWorker();
  }, [optimizeImages, enableServiceWorker]);

  return {
    measurePerformance,
    optimizeImages,
    enableServiceWorker,
    prefetchCriticalResources
  };
};
