
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Clock, CheckCircle, User, Shield } from 'lucide-react';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderType: 'influencer' | 'admin';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'system';
}

interface Conversation {
  id: string;
  subject: string;
  lastMessage: string;
  lastMessageTime: string;
  status: 'open' | 'resolved' | 'pending';
  unreadCount: number;
  messages: Message[];
}

const DirectMessaging: React.FC = () => {
  const { currentUserInfluencer } = useInfluencerStore();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Données de test (en production, cela viendrait de Supabase)
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        subject: 'Question sur les commissions',
        lastMessage: 'Merci pour votre question, nous vérifions les détails.',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        unreadCount: 1,
        messages: [
          {
            id: 'm1',
            senderId: currentUserInfluencer?.id || 'inf1',
            senderType: 'influencer',
            senderName: currentUserInfluencer?.firstName || 'Vous',
            content: 'Bonjour, j\'ai une question concernant le calcul de mes commissions du mois dernier.',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            read: true,
            type: 'text'
          },
          {
            id: 'm2',
            senderId: 'admin1',
            senderType: 'admin',
            senderName: 'Support COWEMA',
            content: 'Merci pour votre question, nous vérifions les détails.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: false,
            type: 'text'
          }
        ]
      },
      {
        id: '2',
        subject: 'Nouveau matériel marketing',
        lastMessage: 'Les nouveaux visuels sont maintenant disponibles dans votre espace marketing.',
        lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'resolved',
        unreadCount: 0,
        messages: [
          {
            id: 'm3',
            senderId: 'admin1',
            senderType: 'admin',
            senderName: 'Support COWEMA',
            content: 'Les nouveaux visuels sont maintenant disponibles dans votre espace marketing.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            read: true,
            type: 'system'
          }
        ]
      }
    ];

    setConversations(mockConversations);
  }, [currentUserInfluencer]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: currentUserInfluencer?.id || 'inf1',
      senderType: 'influencer',
      senderName: currentUserInfluencer?.firstName || 'Vous',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text'
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
              status: 'pending' as const
            }
          : conv
      )
    );

    setNewMessage('');
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé à l'équipe support.",
    });
  };

  const createNewConversation = () => {
    if (!newSubject.trim() || !newMessage.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir le sujet et le message.",
      });
      return;
    }

    const conversationId = `conv_${Date.now()}`;
    const message: Message = {
      id: `m${Date.now()}`,
      senderId: currentUserInfluencer?.id || 'inf1',
      senderType: 'influencer',
      senderName: currentUserInfluencer?.firstName || 'Vous',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text'
    };

    const newConversation: Conversation = {
      id: conversationId,
      subject: newSubject.trim(),
      lastMessage: message.content,
      lastMessageTime: message.timestamp,
      status: 'open',
      unreadCount: 0,
      messages: [message]
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(conversationId);
    setNewSubject('');
    setNewMessage('');
    setShowNewConversation(false);

    toast({
      title: "Conversation créée",
      description: "Votre message a été envoyé à l'équipe support.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default">Ouvert</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'resolved':
        return <Badge variant="outline">Résolu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Liste des conversations */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowNewConversation(true)}
            >
              Nouveau
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                  selectedConversation === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm truncate">
                    {conversation.subject}
                  </h4>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate mb-2">
                  {conversation.lastMessage}
                </p>
                <div className="flex items-center justify-between">
                  {getStatusBadge(conversation.status)}
                  <span className="text-xs text-muted-foreground">
                    {new Date(conversation.lastMessageTime).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Zone de conversation */}
      <Card className="lg:col-span-2">
        {showNewConversation ? (
          <>
            <CardHeader>
              <CardTitle>Nouvelle conversation</CardTitle>
              <CardDescription>
                Contactez l'équipe support pour toute question
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Sujet de votre message"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <Textarea
                placeholder="Votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={6}
              />
              <div className="flex gap-2">
                <Button onClick={createNewConversation}>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowNewConversation(false);
                    setNewSubject('');
                    setNewMessage('');
                  }}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </>
        ) : selectedConv ? (
          <>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {selectedConv.subject}
                {getStatusBadge(selectedConv.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                {selectedConv.messages.map(message => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.senderType === 'influencer' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.senderType === 'influencer'
                          ? 'bg-primary text-primary-foreground'
                          : message.type === 'system'
                          ? 'bg-blue-100 border border-blue-200'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.senderType === 'admin' ? (
                          <Shield className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="text-xs font-medium">
                          {message.senderName}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                        <Clock className="h-3 w-3" />
                        {new Date(message.timestamp).toLocaleString('fr-FR')}
                        {message.read && <CheckCircle className="h-3 w-3 ml-1" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              {selectedConv.status !== 'resolved' && (
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez une conversation ou créez-en une nouvelle</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default DirectMessaging;
