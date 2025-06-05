
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MessageTemplate = {
  id: string;
  name: string;
  content: string;
  type: 'whatsapp' | 'email' | 'sms';
  createdAt: string;
  updatedAt: string;
};

type MessageTemplatesState = {
  templates: MessageTemplate[];
  addTemplate: (template: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, content: Partial<MessageTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplatesByType: (type: MessageTemplate['type']) => MessageTemplate[];
};

export const useMessageTemplates = create<MessageTemplatesState>()(
  persist(
    (set, get) => ({
      templates: [
        {
          id: '1',
          name: 'Bienvenue',
          content: 'Bonjour {{nom}}, merci pour votre commande #{{orderNumber}}. Nous la préparons actuellement. Pour toute question, n\'hésitez pas à nous contacter.',
          type: 'whatsapp',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Confirmation de livraison',
          content: 'Bonjour {{nom}}, votre commande #{{orderNumber}} a été livrée. Merci de votre confiance!',
          type: 'whatsapp',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Rappel commande',
          content: 'Bonjour {{nom}}, nous n\'avons pas reçu de confirmation pour votre commande #{{orderNumber}}. Souhaitez-vous toujours la recevoir?',
          type: 'whatsapp',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      addTemplate: (template) => {
        const now = new Date().toISOString();
        set((state) => ({
          templates: [
            ...state.templates,
            {
              ...template,
              id: `template-${Date.now()}`,
              createdAt: now,
              updatedAt: now,
            },
          ],
        }));
      },
      updateTemplate: (id, content) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, ...content, updatedAt: new Date().toISOString() }
              : template
          ),
        }));
      },
      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },
      getTemplatesByType: (type) => {
        return get().templates.filter((template) => template.type === type);
      },
    }),
    {
      name: 'cowema-message-templates',
    }
  )
);
