
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Download, 
  Smartphone,
  Share2,
  Eye,
  Palette,
  Settings,
  Info
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QRCodeGeneratorProps {
  referralLink: string;
  influencerName: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  referralLink,
  influencerName
}) => {
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoText, setLogoText] = useState(influencerName);
  const [includeText, setIncludeText] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Génération du QR Code (simulation - en production, utilisez une vraie librairie QR)
  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration du canvas
    canvas.width = qrSize + (includeText ? 60 : 20);
    canvas.height = qrSize + (includeText ? 80 : 20);

    // Fond
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simulation d'un QR Code simple (en production, utilisez qrcode.js ou similar)
    const qrData = `QR Code pour: ${referralLink}`;
    ctx.fillStyle = qrColor;
    ctx.font = '12px monospace';
    
    // Grille QR simulée
    const startX = (canvas.width - qrSize) / 2;
    const startY = 10;
    const cellSize = 8;
    const cells = Math.floor(qrSize / cellSize);

    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        if (Math.random() > 0.5) { // Simulation de pattern QR
          ctx.fillRect(
            startX + col * cellSize,
            startY + row * cellSize,
            cellSize - 1,
            cellSize - 1
          );
        }
      }
    }

    // Coins du QR Code (patterns de détection)
    const drawCorner = (x: number, y: number) => {
      ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
      ctx.fillStyle = bgColor;
      ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
      ctx.fillStyle = qrColor;
      ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
    };

    drawCorner(startX, startY);
    drawCorner(startX + qrSize - cellSize * 7, startY);
    drawCorner(startX, startY + qrSize - cellSize * 7);

    // Texte en bas
    if (includeText) {
      ctx.fillStyle = qrColor;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        logoText || 'Scannez pour accéder',
        canvas.width / 2,
        qrSize + 40
      );
      ctx.font = '10px sans-serif';
      ctx.fillText(
        'Code influenceur inclus',
        canvas.width / 2,
        qrSize + 55
      );
    }
  };

  React.useEffect(() => {
    generateQRCode();
  }, [qrSize, qrColor, bgColor, logoText, includeText, referralLink]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `qr-code-${influencerName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const presetStyles = [
    { name: 'Classique', color: '#000000', bg: '#ffffff' },
    { name: 'Bleu', color: '#1e40af', bg: '#f0f9ff' },
    { name: 'Vert', color: '#16a34a', bg: '#f0fdf4' },
    { name: 'Rouge', color: '#dc2626', bg: '#fef2f2' },
    { name: 'Violet', color: '#9333ea', bg: '#faf5ff' }
  ];

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Comment utiliser vos QR Codes :</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Imprimez-les sur vos supports marketing (flyers, cartes de visite)</li>
            <li>• Partagez-les dans vos stories Instagram ou posts</li>
            <li>• Ajoutez-les à vos présentations ou événements</li>
            <li>• Facilitez l'accès à vos liens depuis mobile</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration du QR Code
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de votre QR Code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Presets de style */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Styles prédéfinis :</Label>
              <div className="flex flex-wrap gap-2">
                {presetStyles.map((preset) => (
                  <Badge
                    key={preset.name}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      setQrColor(preset.color);
                      setBgColor(preset.bg);
                    }}
                  >
                    {preset.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qr-color">Couleur QR</Label>
                <div className="flex gap-2">
                  <Input
                    id="qr-color"
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bg-color">Couleur fond</Label>
                <div className="flex gap-2">
                  <Input
                    id="bg-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="qr-size">Taille ({qrSize}px)</Label>
              <Input
                id="qr-size"
                type="range"
                min="150"
                max="400"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="logo-text">Texte d'accompagnement</Label>
              <Input
                id="logo-text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                placeholder="Nom ou message"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-text"
                checked={includeText}
                onChange={(e) => setIncludeText(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="include-text">Inclure le texte sous le QR Code</Label>
            </div>
          </CardContent>
        </Card>

        {/* Aperçu et actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Aperçu et Téléchargement
            </CardTitle>
            <CardDescription>
              Votre QR Code personnalisé prêt à utiliser
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="border rounded-lg p-4 bg-white">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={downloadQR} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Télécharger en PNG
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={generateQRCode}>
                  <QrCode className="h-4 w-4 mr-2" />
                  Régénérer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (navigator.share && canvasRef.current) {
                      canvasRef.current.toBlob((blob) => {
                        if (blob) {
                          const file = new File([blob], 'qr-code.png', { type: 'image/png' });
                          navigator.share({
                            title: 'Mon QR Code Influenceur',
                            files: [file]
                          });
                        }
                      });
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <p><strong>Lien encodé :</strong></p>
              <p className="break-all">{referralLink}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conseils d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Idées d'utilisation de vos QR Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">📱 Sur mobile :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Stories Instagram</li>
                <li>• Posts Facebook</li>
                <li>• WhatsApp Status</li>
                <li>• TikTok vidéos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🖨️ Support physique :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Cartes de visite</li>
                <li>• Flyers promotionnels</li>
                <li>• Affiches d'événement</li>
                <li>• Autocollants</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💼 Professionnel :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Présentations</li>
                <li>• Signature email</li>
                <li>• Site web personnel</li>
                <li>• Portfolio en ligne</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
