
import React from 'react';

export interface ImageDisplayProps {
  imageUrl?: string;
  altText?: string;
  height?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  imageUrl, 
  altText = "Image du produit",
  height = "h-full"
}) => {
  return (
    <div className={`absolute inset-0 ${height}`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={altText} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-sm">Pas d'image</span>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
