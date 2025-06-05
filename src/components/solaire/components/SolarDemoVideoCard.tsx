
import React from 'react';
import { Play } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { getYouTubeThumbnailUrl, formatYouTubeUrl } from '@/utils/videoUtils';

interface SolarDemoVideoCardProps {
  product: Product;
  isPlaying: boolean;
  onPlay: (productId: string) => void;
  onStop: (productId: string) => void;
}

const SolarDemoVideoCard: React.FC<SolarDemoVideoCardProps> = ({
  product,
  isPlaying,
  onPlay,
  onStop
}) => {
  const videoThumbnail = getYouTubeThumbnailUrl(product.videoUrl || '');
  const embedUrl = formatYouTubeUrl(product.videoUrl || '');

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-[4/3] bg-gray-900 overflow-hidden">
          {isPlaying ? (
            <iframe
              src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={`Démonstration ${product.name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div 
              className="relative cursor-pointer group w-full h-full" 
              onClick={() => onPlay(product.id)}
            >
              {videoThumbnail ? (
                <img 
                  src={videoThumbnail}
                  alt={`Démonstration ${product.name}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Play className="w-12 h-12 text-white/70" />
                </div>
              )}

              {/* Play overlay réduit */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all duration-300">
                <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Play className="w-8 h-8 text-red-600 ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Video badge réduit */}
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                DÉMO
              </div>
            </div>
          )}
        </div>

        {/* Stop video button when playing */}
        {isPlaying && (
          <button
            onClick={() => onStop(product.id)}
            className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold hover:bg-black/90 transition-colors"
          >
            ✕ Fermer
          </button>
        )}
      </div>

      <div className="p-4">
        <h4 className="text-base font-bold text-gray-900 mb-2">
          Démonstration : {product.name}
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          Découvrez comment installer et utiliser ce produit solaire avec notre guide vidéo détaillé.
        </p>
        
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            ⏱️ Tutoriel complet
          </span>
          <span className="flex items-center gap-1">
            📱 Qualité HD
          </span>
          <span className="flex items-center gap-1">
            🎯 Guide pratique
          </span>
        </div>

        {!isPlaying ? (
          <Button 
            onClick={() => onPlay(product.id)}
            className="w-full bg-red-600 hover:bg-red-700 text-sm py-2"
            size="sm"
          >
            <Play size={14} className="mr-2" />
            Regarder la démonstration
          </Button>
        ) : (
          <Button 
            onClick={() => onStop(product.id)}
            variant="outline"
            className="w-full border-red-600 text-red-600 hover:bg-red-50 text-sm py-2"
            size="sm"
          >
            Arrêter la vidéo
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SolarDemoVideoCard;
