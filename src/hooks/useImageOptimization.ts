
import { useState, useCallback } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
}

export const useImageOptimization = () => {
  const [cache] = useState(new Map<string, string>());

  const optimizeImageUrl = useCallback((
    originalUrl: string, 
    options: ImageOptimizationOptions = {}
  ): string => {
    const {
      quality = 75,
      format = 'webp',
      width,
      height
    } = options;

    // Create cache key
    const cacheKey = `${originalUrl}-${JSON.stringify(options)}`;
    
    // Return cached URL if available
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    // Build optimized URL (using a generic image optimization service pattern)
    const params = new URLSearchParams();
    params.set('q', quality.toString());
    params.set('f', format);
    
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    
    const optimizedUrl = `${originalUrl}?${params.toString()}`;
    
    // Cache the result
    cache.set(cacheKey, optimizedUrl);
    
    return optimizedUrl;
  }, [cache]);

  const generateSrcSet = useCallback((
    originalUrl: string,
    widths: number[] = [320, 640, 768, 1024, 1280, 1920]
  ): string => {
    return widths
      .map(width => {
        const optimizedUrl = optimizeImageUrl(originalUrl, { width, quality: 75 });
        return `${optimizedUrl} ${width}w`;
      })
      .join(', ');
  }, [optimizeImageUrl]);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }, []);

  return {
    optimizeImageUrl,
    generateSrcSet,
    preloadImage
  };
};
