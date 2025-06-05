
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Play, Video } from 'lucide-react';
import VideoDisplay from './VideoDisplay';
import VideoThumbnail from './VideoThumbnail';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  videoUrl?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName, videoUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  console.log('🎬 ProductGallery - Video check:', {
    videoUrl: videoUrl?.trim(),
    hasValidVideo: !!(videoUrl?.trim() && (
      videoUrl?.trim().includes('youtube.com') || 
      videoUrl?.trim().includes('youtu.be')
    )),
    productName: productName?.substring(0, 30)
  });

  const validImages = images.filter(img => img && img.trim() !== '' && img !== '/placeholder-image.jpg');
  const displayImages = validImages.length > 0 ? validImages : ['/placeholder-image.jpg'];

  const cleanVideoUrl = videoUrl?.trim();
  const hasValidVideo = !!(cleanVideoUrl && (
    cleanVideoUrl.includes('youtube.com') || 
    cleanVideoUrl.includes('youtu.be')
  ));

  const totalItems = displayImages.length + (hasValidVideo ? 1 : 0);
  const isVideoSlide = hasValidVideo && currentIndex === displayImages.length;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
    setShowVideo(false);
    setIsZoomed(false);
    setIsVideoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
    setShowVideo(false);
    setIsZoomed(false);
    setIsVideoPlaying(false);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setShowVideo(false);
    setIsZoomed(false);
    setIsVideoPlaying(false);
  };

  const handleVideoThumbnailClick = () => {
    setCurrentIndex(displayImages.length);
    setShowVideo(true);
    setIsZoomed(false);
    setIsVideoPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleZoomToggle = () => {
    if (!isVideoSlide) {
      setIsZoomed(!isZoomed);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image/Video Display */}
      <div className="relative group">
        <div className="w-full h-[500px] bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
          {isVideoSlide && hasValidVideo ? (
            <VideoDisplay 
              videoUrl={cleanVideoUrl} 
              title={productName}
              asThumbnail={false}
              onVideoPlay={handleVideoPlay}
            />
          ) : (
            <img
              src={displayImages[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className={`w-full h-full object-contain transition-transform duration-300 cursor-pointer bg-gray-50 ${
                isZoomed ? 'scale-150' : 'hover:scale-105'
              }`}
              onClick={handleZoomToggle}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
            />
          )}
        </div>

        {/* Navigation Arrows */}
        {totalItems > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg hover:shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg hover:shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Zoom Icon (only for images) */}
        {!isVideoSlide && (
          <div className="absolute top-4 right-4 bg-white/90 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <ZoomIn size={20} />
          </div>
        )}

        {/* Counter */}
        {totalItems > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
            {currentIndex + 1} / {totalItems}
          </div>
        )}

        {/* Badge pour plusieurs images */}
        {displayImages.length > 1 && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
            +{displayImages.length - 1} photo{displayImages.length > 2 ? 's' : ''}
          </div>
        )}

        {/* Badge vidéo si disponible - caché pendant la lecture */}
        {hasValidVideo && !isVideoPlaying && (
          <div className="absolute top-16 left-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg animate-pulse">
            🎬 Vidéo dispo
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {totalItems > 1 && (
        <div className="w-full">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Image Thumbnails */}
            {displayImages.map((image, index) => (
              <button
                key={`thumb-${index}`}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all duration-300 shadow-md hover:shadow-lg ${
                  index === currentIndex && !isVideoSlide
                    ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} - Miniature ${index + 1}`}
                  className="w-full h-full object-cover bg-gray-50"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
              </button>
            ))}

            {/* Video Thumbnail */}
            {hasValidVideo && (
              <button
                onClick={handleVideoThumbnailClick}
                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all duration-300 shadow-md hover:shadow-lg ${
                  isVideoSlide
                    ? 'border-red-500 ring-2 ring-red-200 scale-105'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <VideoThumbnail
                  videoUrl={cleanVideoUrl}
                  onClick={handleVideoThumbnailClick}
                  size="small"
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Informations sur les médias disponibles */}
      {(displayImages.length > 1 || hasValidVideo) && (
        <div className="text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {displayImages.length} image{displayImages.length > 1 ? 's' : ''} 
              {hasValidVideo && ` • 1 vidéo`}
            </span>
            <span className="text-blue-600 font-medium">
              Cliquez sur les vignettes pour naviguer
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
