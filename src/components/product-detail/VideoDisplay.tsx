
import React, { useState } from 'react';
import { Video, VideoOff, Youtube, Play } from 'lucide-react';
import { isYouTubeUrl, formatYouTubeUrl, getYouTubeThumbnailUrl } from '@/utils/videoUtils';
import VideoPlayer from './VideoPlayer';

interface VideoDisplayProps {
  videoUrl?: string;
  title: string;
  asThumbnail?: boolean;
  onThumbnailClick?: () => void;
  onVideoPlay?: () => void;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ 
  videoUrl, 
  title, 
  asThumbnail = false,
  onThumbnailClick,
  onVideoPlay 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  if (!videoUrl || hasError) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <VideoOff className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Vidéo non disponible</p>
        </div>
      </div>
    );
  }

  const thumbnailUrl = getYouTubeThumbnailUrl(videoUrl);

  const handlePlay = () => {
    setIsPlaying(true);
    if (onVideoPlay) {
      onVideoPlay();
    }
    if (onThumbnailClick) {
      onThumbnailClick();
    }
  };

  const handleError = () => {
    setHasError(true);
  };

  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
  };

  const handleThumbnailError = () => {
    setThumbnailLoaded(false);
  };

  // Si affiché comme vignette, on montre juste un aperçu cliquable
  if (asThumbnail) {
    return (
      <div 
        className="w-16 h-16 bg-gray-100 rounded-lg cursor-pointer relative overflow-hidden group bg-black flex items-center justify-center"
        onClick={onThumbnailClick || handlePlay}
      >
        <Video className="h-6 w-6 text-white" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all">
          <Play className="h-4 w-4 text-white" fill="currentColor" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Lecteur vidéo ou vignette */}
      <div className="w-full h-full relative">
        {isPlaying ? (
          <VideoPlayer 
            videoUrl={videoUrl} 
            title={title}
            onError={handleError}
          />
        ) : (
          <div 
            className="w-full h-full cursor-pointer relative group"
            onClick={handlePlay}
          >
            {/* Image de prévisualisation YouTube */}
            {thumbnailUrl ? (
              <>
                {!thumbnailLoaded && (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={thumbnailUrl}
                  alt={`Prévisualisation de la vidéo ${title}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    thumbnailLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleThumbnailLoad}
                  onError={handleThumbnailError}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Video className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            {/* Overlay de lecture */}
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <div className="bg-red-600 rounded-full p-4 transform transition-transform group-hover:scale-110">
                <Play className="h-12 w-12 text-white" fill="currentColor" />
              </div>
            </div>
            
            {/* Texte d'instruction */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
              Cliquez pour lire la vidéo
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDisplay;
