
import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface MainImageProps {
  src: string;
  title: string;
  onLoad: () => void;
  imageLoaded: boolean;
}

const MainImage: React.FC<MainImageProps> = ({ src, title, onLoad, imageLoaded }) => {
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setHasError(false);
    setIsVisible(false);
  }, [src]);

  const handleImageLoad = () => {
    setIsVisible(true);
    onLoad();
  };

  const handleImageError = () => {
    setHasError(true);
    setIsVisible(false);
  };

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
        <ImageOff className="h-12 w-12 mb-2" />
        <p className="text-sm">Image non disponible</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Loading spinner */}
      {!isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Main image - Contain to show full image for portrait orientation */}
      <img 
        src={src} 
        alt={title} 
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default MainImage;
