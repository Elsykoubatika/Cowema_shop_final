
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SocialMediaStat {
  network: string;
  count: number;
  averageFollowers: number;
  icon: React.ReactNode;
}

interface SocialMediaStatsProps {
  stats: SocialMediaStat[];
}

const SocialMediaStats: React.FC<SocialMediaStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.network}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {stat.icon}
              <span className="capitalize">{stat.network}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-xs text-muted-foreground">
                Moy. {stat.averageFollowers.toLocaleString()} abonnés
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SocialMediaStats;
