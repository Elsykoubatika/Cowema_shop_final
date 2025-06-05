
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '../../ui/carousel';
import ThumbnailImage from './ThumbnailImage';
import VideoThumbnail from './VideoThumbnail';

interface GalleryCarouselProps {
  images: string[];
  title: string;
  imagesLoaded: boolean[];
  imageErrors: boolean[];
  handleImageLoad: (index: number) => void;
  handleImageError: (index: number) => void;
  videoThumbnailUrl?: string;
  videoThumbnailLoaded: boolean;
  videoThumbnailError: boolean;
  handleVideoThumbnailLoad: () => void;
  handleVideoThumbnailError: () => void;
  totalSlides: number;
  validVideo: boolean;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
  images,
  title,
  imagesLoaded,
  imageErrors,
  handleImageLoad,
  handleImageError,
  videoThumbnailUrl,
  videoThumbnailLoaded,
  videoThumbnailError,
  handleVideoThumbnailLoad,
  handleVideoThumbnailError,
  totalSlides,
  validVideo
}) => {
  return (
    <Carousel 
      className="w-full" 
      opts={{ 
        loop: totalSlides > 1, // Only enable loop if there's more than one slide
        startIndex: 0 
      }}
    >
      <CarouselContent>
        {/* Show all images */}
        {images.map((image, index) => (
          <CarouselItem key={`img-${index}`}>
            <ThumbnailImage
              src={image}
              alt={`${title} - ${index === 0 ? 'Image principale' : `Vue supplémentaire ${index}`}`}
              isLoaded={imagesLoaded[index]}
              hasError={imageErrors[index]}
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
            />
          </CarouselItem>
        ))}
        
        {/* Show video thumbnail ONLY if video exists and URL is provided */}
        {validVideo && videoThumbnailUrl && (
          <CarouselItem key="video-slide">
            <VideoThumbnail
              thumbnailUrl={videoThumbnailUrl}
              title={title}
              isLoaded={videoThumbnailLoaded}
              hasError={videoThumbnailError}
              onLoad={handleVideoThumbnailLoad}
              onError={handleVideoThumbnailError}
            />
          </CarouselItem>
        )}
      </CarouselContent>
      
      {totalSlides > 1 && (
        <>
          <CarouselPrevious className="focus:ring-2 focus:ring-offset-2 focus:ring-primary" aria-label="Image précédente" />
          <CarouselNext className="focus:ring-2 focus:ring-offset-2 focus:ring-primary" aria-label="Image suivante" />
        </>
      )}
    </Carousel>
  );
};

export default GalleryCarousel;
