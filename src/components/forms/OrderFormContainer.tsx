
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';

interface OrderFormContainerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  isSubmitting: boolean;
  itemsCount: number;
  submitButtonText: string;
  submitButtonColor?: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

const OrderFormContainer: React.FC<OrderFormContainerProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  isSubmitting,
  itemsCount,
  submitButtonText,
  submitButtonColor = "bg-blue-600 hover:bg-blue-700",
  onSubmit,
  children
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] sm:w-full overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {title}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {itemsCount} {itemsCount > 1 ? 'articles' : 'article'} à commander
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={onSubmit} className="space-y-6 p-1">
            <div className="space-y-6">
              {children}
            </div>

            {/* Boutons d'action */}
            <div className="sticky bottom-0 bg-white border-t pt-6 mt-8 flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 sm:flex-none sm:min-w-[120px]"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || itemsCount === 0}
                className={`flex-1 sm:flex-none sm:min-w-[200px] ${submitButtonColor} text-white font-medium`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFormContainer;
