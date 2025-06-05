
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Loader2, Check, Trash2, Edit3 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface VideoInsertProps {
  productId: number;
  currentUrl?: string;
  onSave: (productId: number, url: string) => Promise<void>;
}

const VideoInsert: React.FC<VideoInsertProps> = ({
  productId,
  currentUrl = '',
  onSave
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const isValidYouTubeUrl = (urlToCheck: string) => {
    if (!urlToCheck || typeof urlToCheck !== 'string') return false;
    const trimmed = urlToCheck.trim();
    return trimmed.includes('youtube.com/watch') || 
           trimmed.includes('youtu.be/') || 
           trimmed.includes('youtube.com/embed/');
  };

  const handleSave = async () => {
    const trimmedUrl = url.trim();
    
    if (trimmedUrl && !isValidYouTubeUrl(trimmedUrl)) {
      toast({
        variant: "destructive",
        title: "URL invalide",
        description: "Veuillez entrer une URL YouTube valide",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await onSave(productId, trimmedUrl);
      
      toast({
        title: trimmedUrl ? "✅ Vidéo ajoutée" : "Vidéo supprimée",
        description: trimmedUrl ? 
          "La vidéo YouTube a été ajoutée avec succès" : 
          "La vidéo a été supprimée avec succès",
      });
      
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la vidéo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setUrl('');
    setIsLoading(true);
    
    try {
      await onSave(productId, '');
      toast({
        title: "Vidéo supprimée",
        description: "La vidéo a été supprimée avec succès",
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error removing video:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la vidéo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasVideo = currentUrl && currentUrl.trim() && isValidYouTubeUrl(currentUrl.trim());

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasVideo ? "default" : "outline"}
          size="sm" 
          className={`transition-all duration-200 ${
            hasVideo 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "hover:bg-gray-100"
          }`}
          onClick={() => {
            setUrl(currentUrl);
            setIsOpen(true);
          }}
        >
          <Video size={16} className="mr-1" />
          {hasVideo ? (
            <>
              <Check size={16} className="mr-1" />
              Vidéo ajoutée
            </>
          ) : (
            "Insérer vidéo"
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-red-500" />
            Insérer une vidéo YouTube
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Collez l'URL d'une vidéo YouTube pour l'ajouter à ce produit.
            <br />
            Exemple: https://www.youtube.com/watch?v=TvdaAG183qo
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`
                transition-all duration-200
                ${url.trim() && isValidYouTubeUrl(url.trim()) ? "border-green-500" : ""}
                ${url.trim() && !isValidYouTubeUrl(url.trim()) ? "border-red-500" : ""}
              `}
            />
            
            {url.trim() && !isValidYouTubeUrl(url.trim()) && (
              <p className="text-red-500 text-xs">URL YouTube invalide</p>
            )}
            
            {url.trim() && isValidYouTubeUrl(url.trim()) && (
              <p className="text-green-500 text-xs flex items-center gap-1">
                <Check className="h-3 w-3" />
                URL YouTube valide
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {hasVideo && (
            <Button 
              variant="outline" 
              onClick={handleRemove}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Supprimer
            </Button>
          )}
          
          <div className="flex gap-2 ml-auto">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={isLoading || (url.trim() && !isValidYouTubeUrl(url.trim()))}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoInsert;
