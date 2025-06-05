
import React, { useState, useEffect } from 'react';
import { Play, Youtube, Video, VideoOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getYouTubeThumbnailUrl, getYouTubeFallbackThumbnailUrl, isYouTubeUrl } from '@/utils/videoUtils';
import { useToast } from '@/hooks/use-toast';

interface VideoThumbnailProps {
  videoUrl: string;
  onClick: () => void;
  size?: 'small' | 'large';
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ 
  videoUrl, 
  onClick,
  size = 'large'
}) => {
  const { toast } = useToast();
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  
  const isYoutube = isYouTubeUrl(videoUrl);
  
  useEffect(() => {
    if (isYoutube) {
      const primaryUrl = getYouTubeThumbnailUrl(videoUrl);
      setThumbnailUrl(primaryUrl);
      setThumbnailLoaded(false);
      setThumbnailError(false);
    }
  }, [videoUrl, isYoutube]);
  
  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
    setThumbnailError(false);
  };
  
  const handleThumbnailError = () => {
    if (isRetrying) {
      setThumbnailError(true);
      return;
    }
    
    setIsRetrying(true);
    const fallbackUrl = getYouTubeFallbackThumbnailUrl(videoUrl);
    
    if (fallbackUrl && fallbackUrl !== thumbnailUrl) {
      setThumbnailUrl(fallbackUrl);
    } else {
      setThumbnailError(true);
    }
  };
  
  if (size === 'small') {
    return (
      <div 
        className="h-24 w-24 overflow-hidden rounded-xl cursor-pointer border-3 border-red-400 flex items-center justify-center bg-black relative group shadow-lg"
        onClick={onClick}
      >
        {thumbnailUrl && !thumbnailError ? (
          <>
            {!thumbnailLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Skeleton className="h-full w-full" />
              </div>
            )}
            <img 
              src={thumbnailUrl} 
              alt="Vignette vidéo" 
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                thumbnailLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleThumbnailLoad}
              onError={handleThumbnailError}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all">
              <div className="bg-white/20 rounded-full p-2">
                <Play size={16} className="text-white" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-1 left-1 text-white text-xs font-medium bg-red-600/80 px-2 py-1 rounded">
              Vidéo
            </div>
          </>
        ) : (
          <>
            <Video className="text-white" size={28} />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white/20 rounded-full p-2">
                <Play size={16} className="text-white" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-1 left-1 text-white text-xs font-medium bg-red-600/80 px-2 py-1 rounded">
              Vidéo
            </div>
          </>
        )}
      </div>
    );
  }
  
  return (
    <div className="w-full h-full relative">
      {thumbnailUrl && !thumbnailError ? (
        <>
          {!thumbnailLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Skeleton className="w-full h-full" />
            </div>
          )}
          <img 
            src={thumbnailUrl} 
            alt="Vignette vidéo"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              thumbnailLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleThumbnailLoad}
            onError={handleThumbnailError}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="bg-black bg-opacity-60 p-4 rounded-full mb-4">
              <Play size={48} className="text-white" />
            </div>
            <p className="text-white font-medium text-shadow mb-4">
              Cliquez pour voir la démonstration
            </p>
            <button 
              onClick={onClick} 
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2 px-6 py-2 rounded-md text-white transition-colors"
            >
              <Play size={16} />
              Regarder la vidéo
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
          {thumbnailError ? (
            <VideoOff size={48} className="mb-2 text-gray-400" />
          ) : (
            <Video size={48} className="mb-2 text-gray-400" />
          )}
          <p className="text-gray-700 font-medium text-center">
            {thumbnailError ? 
              "Impossible de charger l'aperçu de la vidéo" : 
              "Vidéo disponible pour ce produit"}
          </p>
          <p className="text-gray-500 text-sm mb-4 text-center">
            Cliquez pour voir la démonstration
          </p>
          <button 
            onClick={onClick} 
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2 px-6 py-2 rounded-md text-white transition-colors"
          >
            <Play size={16} />
            Regarder la vidéo
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
