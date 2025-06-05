import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUserSegments } from '@/hooks/useMessageSegments';
import { useMessageCampaigns } from '@/hooks/useMessageCampaigns';
import { CreateCampaignData } from '@/types/messageCampaigns';
import { MessagePreview } from './MessagePreview';
import { VariableInserter } from './VariableInserter';
import { EmojiPicker } from './EmojiPicker';
import { FileUploader } from './FileUploader';
import { MessageTemplateSelector } from './MessageTemplateSelector';
import { AIClientRecommendations } from './AIClientRecommendations';
import { MessageSendConfirmation } from './MessageSendConfirmation';
import { RichTextEditor } from './RichTextEditor';
import { EmailTemplateBuilder } from './EmailTemplateBuilder';
import { EmailPreviewModal } from './EmailPreviewModal';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCustomerPermissions } from '@/hooks/useCustomerPermissions';
import { 
  Send, 
  Eye, 
  Users, 
  Mail, 
  MessageCircle, 
  Image as ImageIcon, 
  Paperclip,
  Smile,
  Brain,
  CheckCircle,
  Palette
} from 'lucide-react';

interface MessageData {
  subject: string;
  content: string;
  channel: 'email' | 'whatsapp';
  segments: string[];
  attachments: File[];
  images: File[];
}

interface EmailTemplate {
  name: string;
  subject: string;
  content: string;
  style: 'modern' | 'classic' | 'minimal' | 'colorful';
}

export const MessageComposer: React.FC = () => {
  const { toast } = useToast();
  const { segments } = useUserSegments();
  const { user } = useAuthStore();
  const { filterCustomersByAccess } = useCustomerPermissions();
  const { createCampaign, getCampaignSends } = useMessageCampaigns();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [messageData, setMessageData] = useState<MessageData>({
    subject: '',
    content: '',
    channel: 'whatsapp',
    segments: [],
    attachments: [],
    images: []
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedAIClients, setSelectedAIClients] = useState<string[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<any>(null);
  const [campaignSends, setCampaignSends] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const availableVariables = [
    { name: '{{nom}}', description: 'Nom du client' },
    { name: '{{titre}}', description: 'Titre du produit' },
    { name: '{{prix}}', description: 'Prix du produit' },
    { name: '{{lien}}', description: 'Lien vers la page du produit' },
    { name: '{{remise}}', description: 'Pourcentage de remise' },
    { name: '{{ville}}', description: 'Ville du client' },
    { name: '{{total_commandes}}', description: 'Nombre total de commandes' },
    { name: '{{total_depense}}', description: 'Montant total dépensé' }
  ];

  const handleTemplateSelect = (template: any) => {
    setMessageData(prev => ({
      ...prev,
      content: template.content,
      channel: template.type === 'email' ? 'email' : 'whatsapp'
    }));
    
    toast({
      title: "Modèle appliqué",
      description: `Le modèle "${template.name}" a été appliqué au message.`
    });
  };

  const handleEmailTemplateSelect = (template: EmailTemplate) => {
    setMessageData(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content,
      channel: 'email'
    }));
    
    toast({
      title: "Template email appliqué",
      description: `Le template "${template.name}" a été appliqué.`
    });
  };

  const handleEmailTemplatePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setShowEmailPreview(true);
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('message-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = messageData.content.substring(0, start) + variable + messageData.content.substring(end);
      
      setMessageData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const insertEmoji = (emoji: string) => {
    setMessageData(prev => ({ 
      ...prev, 
      content: prev.content + emoji 
    }));
  };

  const handleFileUpload = (type: 'attachment' | 'image', files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setMessageData(prev => ({
      ...prev,
      [type === 'attachment' ? 'attachments' : 'images']: [
        ...prev[type === 'attachment' ? 'attachments' : 'images'],
        ...fileArray
      ]
    }));
  };

  const removeFile = (type: 'attachment' | 'image', index: number) => {
    setMessageData(prev => ({
      ...prev,
      [type === 'attachment' ? 'attachments' : 'images']: prev[type === 'attachment' ? 'attachments' : 'images'].filter((_, i) => i !== index)
    }));
  };

  const handleSegmentToggle = (segmentId: string) => {
    setMessageData(prev => ({
      ...prev,
      segments: prev.segments.includes(segmentId)
        ? prev.segments.filter(id => id !== segmentId)
        : [...prev.segments, segmentId]
    }));
  };

  const getRecipientCount = () => {
    const segmentCount = messageData.segments.reduce((total, segmentId) => {
      const segment = segments.find(s => s.id === segmentId);
      return total + (segment?.customerCount || 0);
    }, 0);
    
    return segmentCount + selectedAIClients.length;
  };

  const canSendToAllCustomers = () => {
    return user?.role === 'admin' || user?.role === 'sales_manager';
  };

  const generateRecipientsList = () => {
    const recipients: Array<{ phone: string; name?: string }> = [];
    
    // Ajouter les clients des segments sélectionnés
    messageData.segments.forEach(segmentId => {
      const segment = segments.find(s => s.id === segmentId);
      if (segment) {
        // Simulation - dans un vrai système, vous récupéreriez les vrais clients
        for (let i = 0; i < segment.customerCount; i++) {
          recipients.push({
            phone: `+243${Math.random().toString().substr(2, 9)}`,
            name: `Client ${i + 1} - ${segment.name}`
          });
        }
      }
    });

    // Ajouter les clients recommandés par l'IA
    selectedAIClients.forEach((clientId, index) => {
      recipients.push({
        phone: `+243${Math.random().toString().substr(2, 9)}`,
        name: `Client IA ${index + 1}`
      });
    });

    return recipients;
  };

  const handleSendMessage = async () => {
    if (!messageData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Le contenu du message est requis.",
        variant: "destructive"
      });
      return;
    }

    if (messageData.segments.length === 0 && selectedAIClients.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un segment ou un client recommandé.",
        variant: "destructive"
      });
      return;
    }

    // Vérification des permissions
    if (!canSendToAllCustomers()) {
      const hasUnauthorizedSegments = messageData.segments.some(segmentId => {
        const segment = segments.find(s => s.id === segmentId);
        if (!segment) return false;
        return segment.criteria.vendorId && segment.criteria.vendorId !== user?.id;
      });

      if (hasUnauthorizedSegments) {
        toast({
          title: "Erreur de permission",
          description: "Vous ne pouvez envoyer des messages qu'à vos propres clients.",
          variant: "destructive"
        });
        return;
      }
    }

    setIsSending(true);
    try {
      const recipients = generateRecipientsList();
      const title = messageData.subject || `Message ${messageData.channel} - ${new Date().toLocaleDateString()}`;
      
      const campaign = await createCampaign({
        title,
        content: messageData.content,
        channel: messageData.channel,
        segments: messageData.segments.map(id => segments.find(s => s.id === id)).filter(Boolean),
        attachments: messageData.attachments.map(file => ({ name: file.name, size: file.size })),
        recipients
      });

      if (campaign) {
        setCurrentCampaign(campaign);
        const sends = await getCampaignSends(campaign.id);
        setCampaignSends(sends);
        setShowConfirmation(true);

        toast({
          title: "Campagne créée",
          description: `Campagne créée avec ${recipients.length} destinataires. Vous pouvez maintenant confirmer les envois.`
        });

        // Reset form
        setMessageData({
          subject: '',
          content: '',
          channel: 'whatsapp',
          segments: [],
          attachments: [],
          images: []
        });
        setSelectedAIClients([]);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la campagne.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const updateCampaignSends = async () => {
    if (currentCampaign) {
      const sends = await getCampaignSends(currentCampaign.id);
      setCampaignSends(sends);
    }
  };

  if (showConfirmation && currentCampaign) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              Campagne créée : {currentCampaign.title}
            </h3>
            <p className="text-muted-foreground">
              Confirmez l'envoi de chaque message individuellement
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowConfirmation(false);
              setCurrentCampaign(null);
              setCampaignSends([]);
            }}
          >
            Retour à la composition
          </Button>
        </div>

        <MessageSendConfirmation
          campaignId={currentCampaign.id}
          sends={campaignSends}
          onUpdate={updateCampaignSends}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Information sur les permissions */}
      {!canSendToAllCustomers() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> En tant que {user?.role === 'seller' ? 'vendeur' : 'chef d\'équipe'}, 
            vous ne pouvez envoyer des messages qu'à vos propres clients.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composition du message */}
        <div className="lg:col-span-2 space-y-4">
          {/* Canal et sujet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Canal d'envoi</Label>
              <Select value={messageData.channel} onValueChange={(value: 'email' | 'whatsapp') => setMessageData(prev => ({ ...prev, channel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} className="text-green-600" />
                      WhatsApp
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-600" />
                      Email
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {messageData.channel === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet de l'email</Label>
                <Input
                  id="subject"
                  value={messageData.subject}
                  onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Sujet de votre email"
                />
              </div>
            )}
          </div>

          {/* Contenu du message */}
          <div className="space-y-2">
            <Label htmlFor="message-content">Contenu du message</Label>
            {messageData.channel === 'email' ? (
              <RichTextEditor
                value={messageData.content}
                onChange={(content) => setMessageData(prev => ({ ...prev, content }))}
                placeholder="Rédigez votre email avec mise en forme..."
              />
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <VariableInserter variables={availableVariables} onInsert={(variable) => {
                    setMessageData(prev => ({ ...prev, content: prev.content + variable }));
                  }} />
                  <EmojiPicker onSelect={(emoji) => {
                    setMessageData(prev => ({ ...prev, content: prev.content + emoji }));
                  }} />
                </div>
                <textarea
                  id="message-content"
                  value={messageData.content}
                  onChange={(e) => setMessageData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Tapez votre message WhatsApp ici..."
                  className="w-full min-h-40 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Outils pour WhatsApp */}
          {messageData.channel === 'whatsapp' && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon size={16} className="mr-2" />
                Images
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={16} className="mr-2" />
                Fichiers
              </Button>
            </div>
          )}

          {/* Fichiers joints */}
          {(messageData.images.length > 0 || messageData.attachments.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Fichiers joints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {messageData.images.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <span className="text-sm">📷 {file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('image', index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {messageData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">📎 {file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('attachment', index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Inputs cachés pour les fichiers */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload('image', e.target.files)}
          />
          <input
            type="file"
            ref={fileInputRef}
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload('attachment', e.target.files)}
          />
        </div>

        {/* Panneau latéral */}
        <div className="space-y-4">
          <Tabs defaultValue="segments" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="segments">Segments</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
              <TabsTrigger value="email-builder">Email</TabsTrigger>
              <TabsTrigger value="ai">IA</TabsTrigger>
            </TabsList>

            <TabsContent value="segments" className="space-y-4">
              {/* Sélection des segments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users size={16} />
                    Segments ({messageData.segments.reduce((total, segmentId) => {
                      const segment = segments.find(s => s.id === segmentId);
                      return total + (segment?.customerCount || 0);
                    }, 0)} clients)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {segments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun segment disponible
                    </p>
                  ) : (
                    segments.map((segment) => (
                      <div
                        key={segment.id}
                        className={`p-2 rounded border cursor-pointer transition-colors ${
                          messageData.segments.includes(segment.id)
                            ? 'bg-blue-50 border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleSegmentToggle(segment.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{segment.name}</span>
                          <Badge variant="secondary">{segment.customerCount}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{segment.description}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <MessageTemplateSelector 
                onTemplateSelect={handleTemplateSelect}
                selectedChannel={messageData.channel}
              />
            </TabsContent>

            <TabsContent value="email-builder">
              {messageData.channel === 'email' ? (
                <EmailTemplateBuilder
                  onTemplateSelect={handleEmailTemplateSelect}
                  onPreview={handleEmailTemplatePreview}
                />
              ) : (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Palette className="mx-auto mb-2 text-muted-foreground" size={32} />
                    <p className="text-sm text-muted-foreground">
                      Les templates email ne sont disponibles qu'en mode Email
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="ai">
              <AIClientRecommendations 
                onClientsSelect={setSelectedAIClients}
                selectedClients={selectedAIClients}
              />
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Total: {getRecipientCount()} destinataires
            </div>
            
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="w-full"
              disabled={!messageData.content.trim()}
            >
              <Eye size={16} className="mr-2" />
              Prévisualiser
            </Button>
            
            <Button
              onClick={handleSendMessage}
              className="w-full"
              disabled={!messageData.content.trim() || (messageData.segments.length === 0 && selectedAIClients.length === 0) || isSending}
            >
              <Send size={16} className="mr-2" />
              {isSending ? 'Création en cours...' : `Créer campagne (${getRecipientCount()} clients)`}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de prévisualisation */}
      {showPreview && (
        <MessagePreview
          messageData={messageData}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Modal d'aperçu email */}
      {showEmailPreview && previewTemplate && (
        <EmailPreviewModal
          template={previewTemplate}
          isOpen={showEmailPreview}
          onClose={() => setShowEmailPreview(false)}
        />
      )}
    </div>
  );
};
