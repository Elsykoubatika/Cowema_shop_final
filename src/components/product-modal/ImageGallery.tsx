
import React, { useState } from 'react';
import { useImageGallery } from './gallery/useImageGallery';
import MainImage from './gallery/MainImage';
import PromotionBanner from './gallery/PromotionBanner';
import { Play, Video } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
  isYaBaBoss: boolean;
  videoUrl?: string;
  onVideoThumbnailClick?: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  title, 
  isYaBaBoss, 
  videoUrl,
  onVideoThumbnailClick 
}) => {
  const {
    selectedImage,
    imageLoaded,
    showVideo,
    activeSlide,
    handleImageLoad,
    handleVideoThumbnailClick,
    handleThumbnailClick
  } = useImageGallery({ images, videoUrl, onVideoThumbnailClick });
  
  // S'assurer qu'il y a au moins une image à afficher
  const displayImages = images && images.length > 0 ? images : ['/placeholder.svg'];
  const currentImage = selectedImage || displayImages[0];
  
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {/* Thumbnails strip - Vertical on left, more compact */}
        <div className="flex flex-col gap-1.5 w-12">
          {displayImages.map((img, index) => (
            <div 
              key={index}
              className={`h-10 w-10 overflow-hidden rounded-md cursor-pointer border-2 transition-colors ${
                selectedImage === img && !showVideo ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleThumbnailClick(img, index)}
            >
              <img 
                src={img} 
                alt={`${title} - ${index + 1}`} 
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          
          {/* Video Thumbnail */}
          {videoUrl && (
            <div 
              className={`h-10 w-10 overflow-hidden rounded-md cursor-pointer border-2 transition-colors bg-black relative ${
                showVideo ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={handleVideoThumbnailClick}
            >
              <div className="h-full w-full flex items-center justify-center">
                <Video className="h-3 w-3 text-white" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Play size={8} className="text-white" fill="currentColor" />
              </div>
            </div>
          )}
        </div>

        {/* Main image area - Portrait orientation, no side spacing */}
        <div className="flex-1 bg-gray-50 rounded-lg h-80 flex items-center justify-center relative overflow-hidden border">
          {showVideo && videoUrl ? (
            <div className="w-full h-full relative">
              <iframe
                src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
                title={`Démonstration de ${title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
              
              {/* Bouton pour revenir aux images */}
              <button
                onClick={() => handleThumbnailClick(currentImage, 0)}
                className="absolute top-2 left-2 bg-black/60 text-white px-3 py-1 rounded-md text-sm hover:bg-black/80 transition-colors"
              >
                ← Images
              </button>
            </div>
          ) : (
            <>
              <MainImage 
                src={currentImage}
                title={title}
                onLoad={handleImageLoad}
                imageLoaded={imageLoaded}
              />
              
              {/* Video play button overlay if video exists */}
              {videoUrl && !showVideo && (
                <button
                  onClick={handleVideoThumbnailClick}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  aria-label="Lire la vidéo"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Promotion Banner */}
      <PromotionBanner isYaBaBoss={isYaBaBoss} />
    </div>
  );
};

export default ImageGallery;
