import React, { useState } from 'react';
import { MessageTemplate, useMessageTemplates } from '@/hooks/useMessageTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash, MessageSquare, Mail, Phone } from 'lucide-react';

export const MessageTemplateManager: React.FC = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useMessageTemplates();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<MessageTemplate> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const availableVariables = [
    { name: '{{nom}}', description: 'Nom du client' },
    { name: '{{orderNumber}}', description: 'Numéro de commande' },
    { name: '{{titre}}', description: 'Titre du produit' },
    { name: '{{prix}}', description: 'Prix du produit' },
    { name: '{{lien}}', description: 'Lien vers la page du produit' },
  ];

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = currentTemplate?.content || '';
      const newContent = currentContent.substring(0, start) + variable + currentContent.substring(end);
      
      setCurrentTemplate((prev) => ({ ...prev, content: newContent }));
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const handleCreateNew = () => {
    setCurrentTemplate({
      name: '',
      content: '',
      type: 'whatsapp',
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (template: MessageTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (templateId: string) => {
    deleteTemplate(templateId);
    toast({
      title: 'Modèle supprimé',
      description: 'Le modèle de message a été supprimé avec succès.',
    });
  };

  const handleSave = () => {
    if (!currentTemplate?.name || !currentTemplate?.content || !currentTemplate?.type) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive',
      });
      return;
    }

    if (isEditing && currentTemplate.id) {
      updateTemplate(currentTemplate.id, currentTemplate);
      toast({
        title: 'Modèle mis à jour',
        description: 'Le modèle de message a été mis à jour avec succès.',
      });
    } else {
      addTemplate(currentTemplate as Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'>);
      toast({
        title: 'Modèle ajouté',
        description: 'Le nouveau modèle de message a été ajouté avec succès.',
      });
    }
    
    setIsDialogOpen(false);
  };

  const getTypeIcon = (type: MessageTemplate['type']) => {
    switch (type) {
      case 'whatsapp':
        return <Phone size={16} className="text-green-600" />;
      case 'email':
        return <Mail size={16} className="text-blue-600" />;
      case 'sms':
        return <MessageSquare size={16} className="text-purple-600" />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Modèles de messages</h2>
        <Button onClick={handleCreateNew}>
          <Plus size={16} className="mr-2" />
          Nouveau modèle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                {getTypeIcon(template.type)}
                <span className="text-xs text-muted-foreground capitalize">{template.type}</span>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="text-xs">
                Dernière modification: {new Date(template.updatedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="max-h-28 overflow-y-auto bg-muted/20 p-2 rounded-md">
                <p className="text-sm">{template.content}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(template.id)}>
                <Trash size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Modifier le modèle' : 'Créer un nouveau modèle'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Modifiez les détails du modèle de message.'
                : 'Créez un nouveau modèle de message à utiliser dans vos communications.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom du modèle
              </label>
              <Input
                id="name"
                value={currentTemplate?.name || ''}
                onChange={(e) =>
                  setCurrentTemplate((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nom du modèle"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type de message
              </label>
              <Select
                value={currentTemplate?.type || 'whatsapp'}
                onValueChange={(value) =>
                  setCurrentTemplate((prev) => ({
                    ...prev,
                    type: value as MessageTemplate['type'],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenu du message
              </label>
              <Textarea
                id="content"
                value={currentTemplate?.content || ''}
                onChange={(e) =>
                  setCurrentTemplate((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Contenu du message"
                className="min-h-32"
              />
              
              {/* Variables disponibles */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-700 mb-2">Variables disponibles :</p>
                <div className="flex flex-wrap gap-1">
                  {availableVariables.map((variable) => (
                    <Button
                      key={variable.name}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => insertVariable(variable.name)}
                      title={variable.description}
                      type="button"
                    >
                      {variable.name}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Cliquez sur une variable pour l'insérer dans le message à la position du curseur.
                </p>
              </div>
              
              {/* Exemple d'utilisation */}
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-xs font-medium text-blue-700 mb-1">Exemple :</p>
                <p className="text-xs text-blue-600">
                  "Bonjour {'{{'}{'{nom}'}{'}}'}, découvrez notre nouveau produit : {'{{'}{'{titre}'}{'}}'} à seulement {'{{'}{'{prix}'}{'}}'} FCFA. Voir plus : {'{{'}{'{lien}'}{'}}'}'"
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
