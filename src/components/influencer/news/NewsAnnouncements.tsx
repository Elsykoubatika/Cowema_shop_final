
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Megaphone, 
  Star, 
  TrendingUp, 
  Gift, 
  AlertCircle, 
  Calendar,
  ExternalLink,
  Eye
} from 'lucide-react';

interface Announcement {
  id: string;
  type: 'news' | 'promotion' | 'update' | 'alert' | 'achievement';
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  featured: boolean;
  actionUrl?: string;
  actionText?: string;
  tags: string[];
}

const NewsAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [readItems, setReadItems] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('influencer_read_news') || '[]'))
  );

  // Données de test (en production, cela viendrait de Supabase)
  useEffect(() => {
    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        type: 'promotion',
        title: 'Nouveau programme de bonus de fin d\'année !',
        content: `Nous sommes ravis d'annoncer notre nouveau programme de bonus de fin d'année ! 
        
        **Détails du programme :**
        - Bonus de 20% sur toutes les commissions en décembre
        - Concours entre influenceurs avec des prix allant jusqu'à 100 000 FCFA
        - Nouveaux produits exclusifs pour vos promotions
        
        **Comment participer :**
        1. Continuez à promouvoir nos produits normalement
        2. Le bonus sera automatiquement ajouté à vos commissions
        3. Les gagnants du concours seront annoncés le 31 décembre
        
        Ne manquez pas cette opportunité de maximiser vos revenus !`,
        excerpt: 'Bonus de 20% sur toutes les commissions + concours avec des prix jusqu\'à 100 000 FCFA',
        author: 'Équipe COWEMA',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        read: readItems.has('1'),
        featured: true,
        actionUrl: '/influencer/dashboard?tab=commissions',
        actionText: 'Voir mes commissions',
        tags: ['bonus', 'promotion', 'concours']
      },
      {
        id: '2',
        type: 'update',
        title: 'Nouveaux outils marketing disponibles',
        content: `De nouveaux outils marketing sont maintenant disponibles dans votre tableau de bord !
        
        **Nouvelles fonctionnalités :**
        - Générateur de QR codes personnalisés
        - Templates de contenu pour réseaux sociaux
        - Statistiques de performance avancées
        - Liens de tracking améliorés
        
        Rendez-vous dans la section "Outils Marketing" pour découvrir ces nouveautés.`,
        excerpt: 'QR codes, templates sociaux, statistiques avancées et plus encore !',
        author: 'Équipe Technique',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        read: readItems.has('2'),
        featured: false,
        actionUrl: '/influencer/dashboard',
        actionText: 'Découvrir les outils',
        tags: ['outils', 'marketing', 'mise à jour']
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Félicitations ! Vous avez atteint un nouveau niveau',
        content: `Bravo ! Grâce à vos excellentes performances, vous avez atteint le niveau "Influenceur Gold".
        
        **Avantages de votre nouveau niveau :**
        - Taux de commission augmenté à 12%
        - Accès prioritaire aux nouveaux produits
        - Support client dédié
        - Bonus de performance trimestriel
        
        Continuez comme ça !`,
        excerpt: 'Niveau Gold atteint ! Commission à 12% et avantages exclusifs',
        author: 'Système de récompenses',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        read: readItems.has('3'),
        featured: true,
        tags: ['niveau', 'récompense', 'commission']
      },
      {
        id: '4',
        type: 'alert',
        title: 'Maintenance programmée du système',
        content: `Une maintenance technique est programmée ce weekend.
        
        **Détails :**
        - Date : Samedi 25 novembre de 2h à 6h du matin
        - Services affectés : Dashboard influenceur (lecture seule)
        - Tracking des commissions : Non affecté
        
        Nous nous excusons pour la gêne occasionnée.`,
        excerpt: 'Maintenance samedi 25/11 de 2h à 6h - Dashboard en lecture seule',
        author: 'Équipe Infrastructure',
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        read: readItems.has('4'),
        featured: false,
        tags: ['maintenance', 'technique']
      },
      {
        id: '5',
        type: 'news',
        title: 'Nouveau partenariat avec une marque premium',
        content: `Nous avons le plaisir d'annoncer notre nouveau partenariat avec TechnoPlus, une marque premium d'électronique.
        
        **Ce que cela signifie pour vous :**
        - Nouveaux produits haut de gamme à promouvoir
        - Commissions attractives (jusqu'à 15%)
        - Matériel marketing exclusif
        - Formation produit gratuite
        
        Les premiers produits seront disponibles la semaine prochaine.`,
        excerpt: 'Partenariat TechnoPlus - Produits premium avec commissions jusqu\'à 15%',
        author: 'Direction commerciale',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        read: readItems.has('5'),
        featured: false,
        tags: ['partenariat', 'premium', 'formation']
      }
    ];

    setAnnouncements(mockAnnouncements);
  }, [readItems]);

  const markAsRead = (announcementId: string) => {
    const newReadItems = new Set(readItems);
    newReadItems.add(announcementId);
    setReadItems(newReadItems);
    localStorage.setItem('influencer_read_news', JSON.stringify([...newReadItems]));
    
    setAnnouncements(prev =>
      prev.map(a => a.id === announcementId ? { ...a, read: true } : a)
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion':
        return <Gift className="h-4 w-4" />;
      case 'update':
        return <TrendingUp className="h-4 w-4" />;
      case 'achievement':
        return <Star className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string, priority: string) => {
    const colors = {
      promotion: 'bg-green-100 text-green-800',
      update: 'bg-blue-100 text-blue-800',
      achievement: 'bg-yellow-100 text-yellow-800',
      alert: 'bg-red-100 text-red-800',
      news: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || colors.news}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !announcement.read;
    if (filter === 'featured') return announcement.featured;
    return announcement.type === filter;
  });

  const unreadCount = announcements.filter(a => !a.read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Actualités & Annonces
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} non lues</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Restez informé des dernières actualités, promotions et mises à jour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="unread">Non lues</TabsTrigger>
            <TabsTrigger value="featured">À la une</TabsTrigger>
            <TabsTrigger value="promotion">Promos</TabsTrigger>
            <TabsTrigger value="update">Mises à jour</TabsTrigger>
            <TabsTrigger value="news">Actualités</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-6">
            <ScrollArea className="h-[500px]">
              {filteredAnnouncements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune annonce dans cette catégorie</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAnnouncements.map(announcement => (
                    <Card 
                      key={announcement.id}
                      className={`${!announcement.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''} 
                                 ${announcement.featured ? 'ring-1 ring-yellow-200' : ''}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getTypeBadge(announcement.type, announcement.priority)}
                              {announcement.featured && (
                                <Badge variant="outline" className="bg-yellow-50 border-yellow-200">
                                  <Star className="h-3 w-3 mr-1" />
                                  À la une
                                </Badge>
                              )}
                              {!announcement.read && (
                                <Badge variant="destructive" className="text-xs">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                            <CardDescription className="mt-2">
                              {announcement.excerpt}
                            </CardDescription>
                          </div>
                          {!announcement.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(announcement.id)}
                              title="Marquer comme lu"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none mb-4">
                          {announcement.content.split('\n').map((line, index) => (
                            <p key={index} className="mb-2">
                              {line.startsWith('**') && line.endsWith('**') ? (
                                <strong>{line.slice(2, -2)}</strong>
                              ) : line.startsWith('- ') ? (
                                <span className="block ml-4">• {line.slice(2)}</span>
                              ) : line.match(/^\d+\./) ? (
                                <span className="block ml-4">{line}</span>
                              ) : (
                                line
                              )}
                            </p>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(announcement.publishedAt).toLocaleDateString('fr-FR')}
                            </span>
                            <span>Par {announcement.author}</span>
                          </div>
                          
                          {announcement.actionUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={announcement.actionUrl}>
                                {announcement.actionText || 'En savoir plus'}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        {announcement.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {announcement.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NewsAnnouncements;
