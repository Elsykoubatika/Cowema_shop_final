
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMessageTemplates, MessageTemplate } from '@/hooks/useMessageTemplates';
import { Mail, MessageCircle, Phone, Eye } from 'lucide-react';

interface MessageTemplateSelectorProps {
  onTemplateSelect: (template: MessageTemplate) => void;
  selectedChannel: 'email' | 'whatsapp';
}

export const MessageTemplateSelector: React.FC<MessageTemplateSelectorProps> = ({
  onTemplateSelect,
  selectedChannel
}) => {
  const { templates } = useMessageTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const getChannelIcon = (type: MessageTemplate['type']) => {
    switch (type) {
      case 'email':
        return <Mail size={14} className="text-blue-600" />;
      case 'whatsapp':
        return <MessageCircle size={14} className="text-green-600" />;
      case 'sms':
        return <Phone size={14} className="text-purple-600" />;
      default:
        return <MessageCircle size={14} />;
    }
  };

  const filteredTemplates = templates.filter(template => 
    template.type === selectedChannel || template.type === 'sms'
  );

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template.id);
    onTemplateSelect(template);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Modèles de messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredTemplates.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun modèle disponible pour {selectedChannel === 'email' ? 'email' : 'WhatsApp'}
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(template.type)}
                    <span className="font-medium text-sm">{template.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateSelect(template);
                    }}
                  >
                    <Eye size={14} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.content}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {template.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
