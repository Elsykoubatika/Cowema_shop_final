
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import PWAInstallDialog from './PWAInstallDialog';

const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setJustInstalled(true);
      setShowInstructions(true);
    } else {
      setShowManualInstructions(true);
      setShowInstructions(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleInstall}
        variant="outline"
        size="sm"
        className="group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 text-xs sm:text-sm px-2 sm:px-4 transition-all duration-300 hover:scale-105 hover:shadow-md"
      >
        <Download className="h-3 w-3 sm:h-4 sm:w-4 group-hover:animate-bounce" />
        <span className="hidden sm:inline font-medium">Installer l'app</span>
        <span className="sm:hidden font-medium">App</span>
        <Badge variant="secondary" className="ml-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold border-green-200">
          PWA
        </Badge>
      </Button>

      <PWAInstallDialog
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
        justInstalled={justInstalled}
        showManualInstructions={showManualInstructions}
        setShowManualInstructions={setShowManualInstructions}
        setJustInstalled={setJustInstalled}
      />
    </>
  );
};

export default PWAInstallButton;
