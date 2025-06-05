
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Info, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { getOSInstructions } from './utils/osDetection';
import InstallationSteps from './InstallationSteps';
import BenefitsCard from './BenefitsCard';

interface PWAInstallDialogProps {
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
  justInstalled: boolean;
  showManualInstructions: boolean;
  setShowManualInstructions: (show: boolean) => void;
  setJustInstalled: (installed: boolean) => void;
}

const PWAInstallDialog: React.FC<PWAInstallDialogProps> = ({
  showInstructions,
  setShowInstructions,
  justInstalled,
  showManualInstructions,
  setShowManualInstructions,
  setJustInstalled
}) => {
  const instructions = getOSInstructions(showManualInstructions);
  
  // Get the appropriate icon based on device type
  const getDeviceIcon = () => {
    const userAgent = navigator.userAgent;
    const isMobile = userAgent.includes('Android') || userAgent.includes('iPhone') || userAgent.includes('iPad');
    return isMobile ? <Smartphone className="h-6 w-6" /> : <Monitor className="h-6 w-6" />;
  };

  const closeDialog = () => {
    setShowInstructions(false);
    setShowManualInstructions(false);
    setJustInstalled(false);
  };

  return (
    <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            {justInstalled && !showManualInstructions ? (
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            ) : showManualInstructions ? (
              <div className="p-2 bg-blue-100 rounded-full">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
            ) : (
              <div className="p-2 bg-purple-100 rounded-full">
                {getDeviceIcon()}
              </div>
            )}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {justInstalled && !showManualInstructions ? "Installation réussie !" : instructions.title}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {justInstalled && !showManualInstructions && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                <p className="text-green-800 font-semibold">
                  🎉 Cowema a été installé avec succès !
                </p>
              </div>
              <p className="text-green-700 text-sm">
                Maintenant, épinglez-le pour un accès ultra-rapide :
              </p>
            </div>
          )}

          {showManualInstructions && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800 font-semibold">
                  📱 Installation manuelle
                </p>
              </div>
              <p className="text-blue-700 text-sm">
                Suivez ces étapes pour installer Cowema sur votre appareil :
              </p>
            </div>
          )}

          <InstallationSteps instructions={instructions} />

          <BenefitsCard />

          <Button 
            onClick={closeDialog}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            J'ai compris, merci !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallDialog;
