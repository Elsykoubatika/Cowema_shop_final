
import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Calendar, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from '@/utils/videoUtils';

interface TelevisionSalesVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  duration: string;
  date: string;
  viewers?: string;
  description?: string;
}

// Téléventes réelles de Cowema
const televisionSalesVideos: TelevisionSalesVideo[] = [
  {
    id: '1',
    title: 'Télévente Spéciale Beauté & Mode',
    youtubeUrl: 'https://www.youtube.com/watch?v=x7BQt2Vfo50',
    duration: '45:30',
    date: 'Mars 2024',
    viewers: '15K+',
    description: 'Découvrez notre gamme complète de produits beauté et mode en direct'
  },
  {
    id: '2',
    title: 'Télévente Cuisine & Maison',
    youtubeUrl: 'https://www.youtube.com/watch?v=4uyzHOjan3s',
    duration: '38:15',
    date: 'Février 2024',
    viewers: '12K+',
    description: 'Ustensiles et accessoires cuisine à prix exceptionnels'
  },
  {
    id: '3',
    title: 'Télévente High-Tech & Gadgets',
    youtubeUrl: 'https://www.youtube.com/watch?v=kA6QONBByRs',
    duration: '52:20',
    date: 'Janvier 2024',
    viewers: '18K+',
    description: 'Gadgets et accessoires technologiques innovants'
  },
  {
    id: '4',
    title: 'Télévente Santé & Bien-être',
    youtubeUrl: 'https://www.youtube.com/watch?v=3a7rmskgruU',
    duration: '41:45',
    date: 'Décembre 2023',
    viewers: '22K+',
    description: 'Produits pour votre bien-être et votre santé'
  },
  {
    id: '5',
    title: 'Télévente Sport & Fitness',
    youtubeUrl: 'https://www.youtube.com/watch?v=7u7dztffWsU',
    duration: '36:30',
    date: 'Novembre 2023',
    viewers: '14K+',
    description: 'Équipements sportifs et accessoires fitness'
  },
  {
    id: '6',
    title: 'Télévente Spéciale Enfants',
    youtubeUrl: 'https://www.youtube.com/watch?v=x7BQt2Vfo50',
    duration: '29:15',
    date: 'Octobre 2023',
    viewers: '11K+',
    description: 'Jouets éducatifs et vêtements pour enfants'
  },
  {
    id: '7',
    title: 'Télévente Électroménager',
    youtubeUrl: 'https://www.youtube.com/watch?v=4uyzHOjan3s',
    duration: '44:20',
    date: 'Septembre 2023',
    viewers: '16K+',
    description: 'Appareils électroménagers à prix imbattables'
  },
  {
    id: '8',
    title: 'Télévente Bijoux & Montres',
    youtubeUrl: 'https://www.youtube.com/watch?v=kA6QONBByRs',
    duration: '55:10',
    date: 'Août 2023',
    viewers: '20K+',
    description: 'Bijoux tendance et montres élégantes'
  },
  {
    id: '9',
    title: 'Télévente Mobilier & Déco',
    youtubeUrl: 'https://www.youtube.com/watch?v=3a7rmskgruU',
    duration: '33:45',
    date: 'Juillet 2023',
    viewers: '13K+',
    description: 'Meubles et accessoires de décoration'
  },
  {
    id: '10',
    title: 'Télévente Mode Homme',
    youtubeUrl: 'https://www.youtube.com/watch?v=7u7dztffWsU',
    duration: '47:25',
    date: 'Juin 2023',
    viewers: '17K+',
    description: 'Collection exclusive de vêtements masculins'
  }
];

const TelevisionSalesSection: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<TelevisionSalesVideo | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = (video: TelevisionSalesVideo) => {
    setSelectedVideo(video);
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    setSelectedVideo(null);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-cowema">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 bg-red-100 text-red-600 px-6 py-3 rounded-full font-medium mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-bold">TÉLÉVENTES EN DIRECT</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Découvrez Nos Téléventes Passées
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transparence totale : revivez nos événements télévente et découvrez la qualité 
            de nos produits présentés en direct devant des milliers de spectateurs.
          </p>
        </div>

        {/* Statistics */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">150K+</div>
            <div className="text-gray-600">Spectateurs totaux</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">25+</div>
            <div className="text-gray-600">Téléventes organisées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">5000+</div>
            <div className="text-gray-600">Produits présentés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-gray-600">Satisfaction client</div>
          </div>
        </div>

        {/* Videos Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {televisionSalesVideos.map((video) => (
                <CarouselItem key={video.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="group cursor-pointer" onClick={() => openVideo(video)}>
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform group-hover:scale-105">
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video bg-gray-200 overflow-hidden">
                        <img 
                          src={getYouTubeThumbnailUrl(video.youtubeUrl)}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                            <Play className="w-8 h-8 text-red-600 ml-1" fill="currentColor" />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-2 py-1 rounded font-medium">
                          {video.duration}
                        </div>

                        {/* Live Badge */}
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          TÉLÉVENTE
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                          {video.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{video.date}</span>
                          </div>
                          {video.viewers && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{video.viewers} vues</span>
                            </div>
                          )}
                        </div>

                        {video.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <Play className="w-6 h-6" />
            <span className="text-lg">Voir toutes nos téléventes</span>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Plus de 25 téléventes disponibles en replay
          </p>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogContent className="max-w-6xl w-full p-0 bg-black border-0">
            <div className="relative">
              <Button
                onClick={closeVideo}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 w-10 h-10"
              >
                <X className="w-4 h-4" />
              </Button>
              
              {/* Video Info Header */}
              <div className="absolute top-4 left-4 z-50 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                <h3 className="font-bold text-lg">{selectedVideo.title}</h3>
                <p className="text-sm opacity-90">{selectedVideo.date} • {selectedVideo.viewers} vues</p>
              </div>

              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo.youtubeUrl)}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default TelevisionSalesSection;
