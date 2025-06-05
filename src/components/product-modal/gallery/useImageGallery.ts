
import { useState, useEffect } from 'react';

interface UseImageGalleryProps {
  images: string[];
  videoUrl?: string;
  onVideoThumbnailClick?: () => void;
}

export const useImageGallery = ({ 
  images, 
  videoUrl, 
  onVideoThumbnailClick 
}: UseImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Total slides (images + video if present)
  const totalSlides = videoUrl && videoUrl.trim() ? images.length + 1 : images.length;
  
  // Update selected image when images change
  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
      setImageLoaded(false);
      setShowVideo(false);
      setActiveSlide(0);
    }
  }, [images]);

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  // Handle video thumbnail click
  const handleVideoThumbnailClick = () => {
    if (onVideoThumbnailClick) {
      onVideoThumbnailClick();
    }
    setShowVideo(true);
    setActiveSlide(images.length); // Video is after all images
  };
  
  // Handle thumbnail click
  const handleThumbnailClick = (img: string, index: number) => {
    setSelectedImage(img);
    setImageLoaded(false);
    setShowVideo(false);
    setActiveSlide(index);
  };

  return {
    selectedImage,
    imageLoaded,
    showVideo,
    activeSlide,
    totalSlides,
    handleImageLoad,
    handleVideoThumbnailClick,
    handleThumbnailClick
  };
};
