
import React from 'react';
import { Star, Video, Youtube, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BadgeOverlaysProps {
  isYaBaBoss?: boolean;
  hasVideo?: boolean;
  isYoutube?: boolean;
  videoUrl?: string;
  currentSlide: number;
  totalSlides: number;
}

const BadgeOverlays: React.FC<BadgeOverlaysProps> = ({
  isYaBaBoss = false,
  hasVideo = false,
  isYoutube = false,
  videoUrl = '',
  currentSlide,
  totalSlides
}) => {
  const navigate = useNavigate();
  
  const handleYaBaBossClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    navigate('/ya-ba-boss');
  };
  
  const handleYaBaBossKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('/ya-ba-boss');
    }
  };
  
  return (
    <>
      {/* YA BA BOSS Badge */}
      {isYaBaBoss && (
        <span 
          className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-yellow-600 z-10"
          onClick={handleYaBaBossClick}
          role="button"
          tabIndex={0}
          aria-label="Voir les produits YA BA BOSS"
          onKeyDown={handleYaBaBossKeyDown}
        >
          <Star size={12} fill="currentColor" aria-hidden="true" /> YA BA BOSS
        </span>
      )}
      
      {/* Video Badge - Only show if video is valid */}
      {hasVideo && videoUrl && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 z-10">
          <div className="flex items-center gap-1 text-white">
            {isYoutube ? (
              <Youtube size={16} className="text-red-500" aria-hidden="true" />
            ) : (
              <Video size={16} className="text-yellow-400" aria-hidden="true" />
            )}
            <span className="text-xs font-medium">Vidéo disponible</span>
            <Play size={14} className="ml-auto" aria-hidden="true" />
          </div>
        </div>
      )}
      
      {/* Slideshow indicators (dots) - Only show if there's more than one slide */}
      {totalSlides > 1 && (
        <div className="absolute bottom-2 right-2 flex gap-1 z-10" aria-hidden="true">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div 
              key={`dot-${index}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BadgeOverlays;
