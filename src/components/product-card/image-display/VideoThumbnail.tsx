
import React, { useState } from 'react';
import { AlertCircle, Play, Video, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getYouTubeVideoId } from '@/utils/videoUtils';

interface VideoThumbnailProps {
  thumbnailUrl: string;
  title: string;
  isLoaded: boolean;
  hasError: boolean;
  onLoad: () => void;
  onError: () => void;
  retryOnError?: boolean;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnailUrl,
  title,
  isLoaded,
  hasError,
  onLoad,
  onError,
  retryOnError = false
}) => {
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [finalError, setFinalError] = useState(false);
  
  // Validate thumbnail URL before using it - NOUVEAU: validation plus stricte
  const isValidThumbnailUrl = thumbnailUrl && 
    thumbnailUrl.includes('img.youtube.com/vi/') && 
    !thumbnailUrl.includes('/watch/') && // Prevent the malformed URL
    !thumbnailUrl.includes('/watch') && // Extra safety check
    (() => {
      try {
        // Extract video ID from thumbnail URL for validation
        const urlParts = thumbnailUrl.split('/');
        const videoIdIndex = urlParts.findIndex(part => part === 'vi') + 1;
        const videoId = urlParts[videoIdIndex];
        return videoId && videoId !== 'watch' && videoId.length >= 10 && videoId.length <= 12;
      } catch {
        return false;
      }
    })();
  
  const handleRetry = () => {
    if (retryCount < 2 && retryOnError) {
      setRetryCount(prev => prev + 1);
      setFinalError(false);
      
      // Show toast for retry attempt
      toast({
        title: "Nouvelle tentative",
        description: `Tentative ${retryCount + 1}/3 de chargement de la vignette vidéo.`,
        duration: 2000,
      });
    } else {
      setFinalError(true);
      toast({
        variant: "destructive",
        title: "Échec de chargement",
        description: "Impossible de charger la vignette vidéo après plusieurs tentatives.",
        duration: 3000,
      });
    }
  };
  
  const handleThumbnailError = () => {
    console.error('Thumbnail error for URL:', thumbnailUrl);
    onError();
    if (retryOnError && retryCount < 2) {
      handleRetry();
    } else {
      setFinalError(true);
    }
  };

  return (
    <div className="w-full h-72 relative bg-black flex items-center justify-center">
      {isValidThumbnailUrl ? (
        <div className="w-full h-72 relative">
          {/* Loading indicator */}
          {!isLoaded && !hasError && !finalError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {/* Error display */}
          {(hasError || finalError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
              <VideoOff className="h-8 w-8 text-gray-400 mb-2" aria-hidden="true" />
              <p className="text-gray-500 text-sm">Impossible de charger la vignette vidéo</p>
              
              {retryOnError && retryCount < 2 && !finalError && (
                <button 
                  onClick={handleRetry}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
                  aria-label="Réessayer de charger la vignette"
                >
                  Réessayer
                </button>
              )}
            </div>
          )}
          
          {/* Actual thumbnail */}
          {!finalError && (
            <img 
              src={`${thumbnailUrl}${retryCount > 0 ? `?retry=${retryCount}` : ''}`}
              alt={`${title} - aperçu de la vidéo`}
              className={`w-full h-72 object-cover object-center transition-all duration-300 ${
                isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={onLoad}
              onError={handleThumbnailError}
              loading="lazy"
            />
          )}
        </div>
      ) : (
        <div className="bg-gray-900 w-full h-full flex items-center justify-center">
          <Video size={40} className="text-gray-300" aria-hidden="true" />
        </div>
      )}
      
      {/* Play button overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-black/60 rounded-full p-2 transform transition-transform hover:scale-110">
          <Play size={24} className="text-white" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail;
