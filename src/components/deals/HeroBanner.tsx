
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Timer, TrendingUp, Crown, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="container-cowema py-16 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>

        {/* Main Hero Content */}
        <div className="text-center mb-12">
          {/* Flash indicator */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-75"></div>
              <div className="relative bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                <Flame size={16} className="animate-pulse" />
                DEALS EXCLUSIFS EN COURS
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-6 leading-tight">
            NOS TOP DEALS
            <br />
            <span className="text-4xl md:text-6xl bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              CHARISMATIQUES 242
            </span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
              🔥 Les opportunités les plus HOT du Congo ! 🔥
            </p>
            <p className="text-lg text-white/70">
              Sélection ultra-exclusive de nos meilleurs deals. Quantités limitées, prix cassés !
            </p>
          </div>

          {/* Call to Action Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm px-4 py-2">
              <Timer size={14} className="mr-2" />
              Stocks Limités
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white text-sm px-4 py-2">
              <TrendingUp size={14} className="mr-2" />
              Prix Imbattables
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm px-4 py-2">
              <Crown size={14} className="mr-2" />
              Sélection VIP
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
