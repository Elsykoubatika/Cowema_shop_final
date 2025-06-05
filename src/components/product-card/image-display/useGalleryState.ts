
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getYouTubeThumbnailUrl, isYouTubeUrl } from '@/utils/videoUtils';

export const useGalleryState = (images: string[], title: string, videoUrl?: string) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const [videoThumbnailLoaded, setVideoThumbnailLoaded] = useState(false);
  const [videoThumbnailError, setVideoThumbnailError] = useState(false);
  const { toast } = useToast();
  
  // Only count video slide if video exists and URL is provided
  const validVideo = !!videoUrl?.trim() && isYouTubeUrl(videoUrl);
  
  // Total slides count (images + video if present and valid)
  const totalSlides = validVideo ? images.length + 1 : images.length;
  
  // Prepare thumbnail URL from video URL
  const videoThumbnailUrl = validVideo ? getYouTubeThumbnailUrl(videoUrl) : '';
  const isYoutube = isYouTubeUrl(videoUrl || '');
  
  // Initialize image loading state when images change
  useEffect(() => {
    setImagesLoaded(Array(images.length).fill(false));
    setImageErrors(Array(images.length).fill(false));
  }, [images]);
  
  // Set up autoplay for carousel
  useEffect(() => {
    // Start autoplay only if there's more than one slide
    if (totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 3000); // Change slide every 3 seconds
      
      setAutoplayInterval(interval);
    }
    
    // Clear interval on component unmount
    return () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    };
  }, [totalSlides]);
  
  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };
  
  const handleImageError = (index: number) => {
    setImageErrors(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
    
    // Show toast notification for image loading error
    toast({
      title: "Erreur de chargement d'image",
      description: `L'image ${index + 1} du produit "${title}" n'a pas pu être chargée.`,
      variant: "destructive",
      duration: 3000,
    });
  };
  
  const handleVideoThumbnailLoad = () => {
    setVideoThumbnailLoaded(true);
  };
  
  const handleVideoThumbnailError = () => {
    setVideoThumbnailError(true);
    
    // Show toast notification for video thumbnail loading error
    toast({
      title: "Erreur de chargement",
      description: `La vignette vidéo pour "${title}" n'a pas pu être chargée.`,
      variant: "destructive",
      duration: 3000,
    });
  };
  
  // Check if all images have errors
  const allImagesHaveErrors = images.length > 0 && imageErrors.every(error => error);
  
  return {
    currentSlide,
    setCurrentSlide,
    imagesLoaded,
    imageErrors,
    videoThumbnailLoaded,
    videoThumbnailError,
    validVideo,
    totalSlides,
    videoThumbnailUrl,
    isYoutube,
    handleImageLoad,
    handleImageError,
    handleVideoThumbnailLoad,
    handleVideoThumbnailError,
    allImagesHaveErrors
  };
};
