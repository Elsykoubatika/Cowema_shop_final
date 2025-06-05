
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ImageOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThumbnailImageProps {
  src: string;
  alt: string;
  isLoaded: boolean;
  hasError: boolean;
  onLoad: () => void;
  onError: () => void;
  retryOnError?: boolean;
}

const ThumbnailImage: React.FC<ThumbnailImageProps> = ({
  src,
  alt,
  isLoaded,
  hasError,
  onLoad,
  onError,
  retryOnError = false
}) => {
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [finalError, setFinalError] = useState(false);
  
  const handleRetry = () => {
    if (retryCount < 2 && retryOnError) {
      setRetryCount(prev => prev + 1);
      setFinalError(false);
      
      // Show toast for retry attempt
      toast({
        title: "Nouvelle tentative",
        description: `Tentative ${retryCount + 1}/3 de chargement de l'image.`,
        duration: 2000,
      });
    } else {
      setFinalError(true);
      toast({
        variant: "destructive",
        title: "Échec de chargement",
        description: "Impossible de charger l'image après plusieurs tentatives.",
        duration: 3000,
      });
    }
  };
  
  const handleImageError = () => {
    onError();
    if (retryOnError && retryCount < 2) {
      handleRetry();
    } else {
      setFinalError(true);
    }
  };

  return (
    <div className="w-full h-72 relative" aria-live="polite">
      {/* Loading skeleton */}
      {!isLoaded && !hasError && !finalError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      {/* Error display */}
      {(hasError || finalError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <ImageOff className="h-8 w-8 text-gray-400 mb-2" aria-hidden="true" />
          <p className="text-gray-500 text-sm">Impossible de charger l'image</p>
          
          {retryOnError && retryCount < 2 && !finalError && (
            <button 
              onClick={handleRetry}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
              aria-label="Réessayer de charger l'image"
            >
              Réessayer
            </button>
          )}
        </div>
      )}
      
      {/* Actual image */}
      {!finalError && (
        <img 
          src={`${src}${retryCount > 0 ? `?retry=${retryCount}` : ''}`}
          alt={alt}
          className={`w-full h-72 object-cover object-center transition-all duration-300 ${
            isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={onLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default ThumbnailImage;
