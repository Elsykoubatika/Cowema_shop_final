
import React, { useState } from 'react';
import { Download, Smartphone, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const AppDownloadSection: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="container-cowema relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Header section */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Smartphone size={32} className="text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Téléchargez Notre App
          </h2>
          
          <p className="text-xl opacity-90 mb-12 leading-relaxed max-w-2xl mx-auto">
            Marketplace africaine avec livraisons rapides - Disponible sur iOS et Android
          </p>
          
          {/* Centered Video Section */}
          <div className="mb-12 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl max-w-md w-full">
              <div className="relative group cursor-pointer" onClick={openVideo}>
                {/* Video thumbnail - Centered and optimized */}
                <div className="aspect-video bg-black/30 rounded-2xl overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://img.youtube.com/vi/MggCXhaTRJ4/hqdefault.jpg"
                    alt="Aperçu de l'app Cowema"
                    className="w-full h-full object-cover"
                  />
                  {/* Enhanced play button overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                      <Play className="w-12 h-12 text-primary ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                {/* Video duration badge */}
                <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-3 py-1 rounded-full font-medium">
                  2:15
                </div>
              </div>
              
              {/* Video call to action */}
              <div className="mt-4 text-center">
                <Button
                  onClick={openVideo}
                  className="group bg-white/20 hover:bg-white/30 border-2 border-white/30 backdrop-blur-sm text-white h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Voir la démo vidéo
                </Button>
                <p className="text-sm opacity-80 mt-2">Découvrez l'interface en action</p>
              </div>
            </div>
          </div>
          
          {/* Download Buttons - Enhanced UX */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            {/* Google Play Store */}
            <Button 
              asChild
              className="group bg-black hover:bg-gray-800 text-white h-16 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[280px] transform hover:scale-105"
            >
              <a 
                href="https://play.google.com/store/apps/details?id=com.ksprogramming.cowema" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-80">Disponible sur</div>
                  <div className="font-bold text-lg">Google Play</div>
                </div>
              </a>
            </Button>
            
            {/* Apple App Store */}
            <Button 
              asChild
              className="group bg-black hover:bg-gray-800 text-white h-16 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[280px] transform hover:scale-105"
            >
              <a 
                href="https://apps.apple.com/us/app/cowema-vec/id6683309566" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-80">Télécharger sur</div>
                  <div className="font-bold text-lg">App Store</div>
                </div>
              </a>
            </Button>
          </div>

          {/* Stats and benefits */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">10,000+ téléchargements</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-medium">4.8/5 étoiles</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium">Livraison rapide</span>
            </div>
          </div>

          {/* Enhanced call to action */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Download className="w-6 h-6" />
              <span className="text-lg">Gratuit et sans engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border-0">
          <div className="relative">
            <Button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 w-10 h-10"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/MggCXhaTRJ4?autoplay=1&rel=0"
                title="Démo de l'app Cowema"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AppDownloadSection;
