
import React, { useState } from 'react';
import { formatYouTubeUrl } from '@/utils/videoUtils';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onError?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  
  const formattedVideoUrl = formatYouTubeUrl(videoUrl);
  
  const handleVideoLoad = () => {
    setIsLoaded(true);
  };
  
  const handleVideoError = () => {
    setHasError(true);
    if (onError) {
      onError();
    }
    toast({
      title: "Erreur de lecture vidéo",
      description: `Impossible de charger la vidéo pour "${title}". Veuillez réessayer plus tard.`,
      variant: "destructive",
      duration: 5000,
    });
  };
  
  if (hasError) {
    return (
      <Alert variant="destructive" className="h-full flex flex-col items-center justify-center">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
        <AlertTitle>Erreur de chargement vidéo</AlertTitle>
        <AlertDescription>
          La vidéo n'a pas pu être chargée. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="relative w-full h-full" aria-label={`Vidéo de ${title}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" aria-label="Chargement de la vidéo" role="status"></div>
        </div>
      )}
      
      <iframe
        src={`${formattedVideoUrl}${formattedVideoUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`}
        title={`Démonstration de ${title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={cn(
          "w-full h-full transition-opacity duration-500 border-0", 
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleVideoLoad}
        onError={handleVideoError}
        aria-hidden={!isLoaded}
      />
    </div>
  );
};

export default VideoPlayer;
