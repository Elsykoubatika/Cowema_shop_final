
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Video, PackageCheck, Package } from 'lucide-react';

interface YaBaBosserStatsProps {
  total: number;
  yaBaBoss: number;
  withVideo: number;
  active: number;
  selected: number;
}

const YaBaBosserStats: React.FC<YaBaBosserStatsProps> = ({
  total,
  yaBaBoss,
  withVideo,
  active,
  selected
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      <Card>
        <CardContent className="flex items-center p-4">
          <Package className="h-8 w-8 text-primary mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Total produits</p>
            <h3 className="text-2xl font-bold">{total.toLocaleString()}</h3>
            <p className="text-xs text-muted-foreground">Tous les produits disponibles</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <Star className="h-8 w-8 text-yellow-500 mr-4" fill="currentColor" />
          <div>
            <p className="text-sm text-muted-foreground">YA BA BOSS</p>
            <h3 className="text-2xl font-bold">{yaBaBoss.toLocaleString()}</h3>
            {total > 0 && (
              <p className="text-xs text-muted-foreground">{((yaBaBoss / total) * 100).toFixed(1)}% du total</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <Video className="h-8 w-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Avec vidéo</p>
            <h3 className="text-2xl font-bold">{withVideo.toLocaleString()}</h3>
            {total > 0 && (
              <p className="text-xs text-muted-foreground">{((withVideo / total) * 100).toFixed(1)}% du total</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <PackageCheck className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Actifs (en stock)</p>
            <h3 className="text-2xl font-bold">{active.toLocaleString()}</h3>
            {total > 0 && (
              <p className="text-xs text-muted-foreground">{((active / total) * 100).toFixed(1)}% du total</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className={selected > 0 ? "border-primary bg-primary/5" : ""}>
        <CardContent className="flex items-center p-4">
          <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center text-primary mr-4 font-bold">
            {selected}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sélectionnés</p>
            <h3 className="text-2xl font-bold">{selected.toLocaleString()}</h3>
            {total > 0 && (
              <p className="text-xs text-muted-foreground">{((selected / total) * 100).toFixed(1)}% du total</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YaBaBosserStats;
