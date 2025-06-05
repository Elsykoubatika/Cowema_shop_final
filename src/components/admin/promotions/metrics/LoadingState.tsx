
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Loader2, Activity } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <span>Métriques des promotions</span>
        </CardTitle>
        <CardDescription>
          Chargement des données...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};

export default LoadingState;
