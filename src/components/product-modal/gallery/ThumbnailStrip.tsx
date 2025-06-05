
import React from 'react';
import VideoDisplay from '../../product-detail/VideoDisplay';

interface ThumbnailStripProps {
  images: string[];
  title: string;
  selectedImage: string;
  showVideo: boolean;
  videoUrl?: string;
  onThumbnailClick: (img: string, index: number) => void;
  onVideoThumbnailClick: () => void;
}

const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({ 
  images, 
  title, 
  selectedImage, 
  showVideo, 
  videoUrl,
  onThumbnailClick,
  onVideoThumbnailClick
}) => {
  return (
    <div className="flex gap-2 overflow-auto">
      {images.map((img, index) => (
        <div 
          key={index}
          className={`h-16 w-16 overflow-hidden rounded-md cursor-pointer border-2 ${selectedImage === img && !showVideo ? 'border-primary' : 'border-gray-200'}`}
          onClick={() => onThumbnailClick(img, index)}
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
        <VideoDisplay
          videoUrl={videoUrl}
          title={title}
          asThumbnail={true}
          onThumbnailClick={onVideoThumbnailClick}
        />
      )}
    </div>
  );
};

export default ThumbnailStrip;
