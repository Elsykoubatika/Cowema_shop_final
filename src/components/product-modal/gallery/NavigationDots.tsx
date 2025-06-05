
import React from 'react';

interface NavigationDotsProps {
  images: string[];
  activeSlide: number;
  showVideo: boolean;
  onImageClick: (img: string, index: number) => void;
  onVideoClick: () => void;
  videoUrl?: string;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({ 
  images, 
  activeSlide, 
  showVideo, 
  onImageClick, 
  onVideoClick,
  videoUrl
}) => {
  return (
    <div className="absolute bottom-2 right-2 flex gap-1.5 z-20">
      {images.map((_, index) => (
        <div 
          key={`nav-dot-${index}`}
          onClick={() => onImageClick(images[index], index)}
          className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
            activeSlide === index && !showVideo ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
          }`}
        />
      ))}
      {videoUrl && (
        <div 
          onClick={onVideoClick}
          className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
            showVideo ? 'bg-red-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
          }`}
        />
      )}
    </div>
  );
};

export default NavigationDots;
