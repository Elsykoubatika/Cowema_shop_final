
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category: string;
  tags: string[];
  status: string;
  author_id?: string;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}

const BlogManager: React.FC = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    status: 'draft'
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    meta_title: '',
    meta_description: ''
  });

  // Récupérer les articles
  const { data: posts = [], refetch: refetchPosts } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  // Récupérer les catégories
  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as BlogCategory[];
    }
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleCreatePost = async () => {
    try {
      const slug = generateSlug(postForm.title);
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('blog_posts')
        .insert([{
          title: postForm.title,
          slug,
          content: postForm.content,
          excerpt: postForm.excerpt,
          category: postForm.category,
          tags: postForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          featured_image: postForm.featured_image,
          meta_title: postForm.meta_title || postForm.title,
          meta_description: postForm.meta_description || postForm.excerpt,
          status: postForm.status,
          author_id: user.user?.id,
          published_at: postForm.status === 'published' ? new Date().toISOString() : null
        }]);

      if (error) throw error;

      toast.success('Article créé avec succès');
      setIsCreatePostOpen(false);
      setPostForm({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        featured_image: '',
        meta_title: '',
        meta_description: '',
        status: 'draft'
      });
      refetchPosts();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: postForm.title,
          slug: generateSlug(postForm.title),
          content: postForm.content,
          excerpt: postForm.excerpt,
          category: postForm.category,
          tags: postForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          featured_image: postForm.featured_image,
          meta_title: postForm.meta_title,
          meta_description: postForm.meta_description,
          status: postForm.status,
          published_at: postForm.status === 'published' && !editingPost.published_at 
            ? new Date().toISOString() 
            : editingPost.published_at
        })
        .eq('id', editingPost.id);

      if (error) throw error;

      toast.success('Article mis à jour avec succès');
      setEditingPost(null);
      refetchPosts();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleCreateCategory = async () => {
    try {
      const slug = generateSlug(categoryForm.name);
      
      const { error } = await supabase
        .from('blog_categories')
        .insert([{
          name: categoryForm.name,
          slug,
          description: categoryForm.description,
          meta_title: categoryForm.meta_title || categoryForm.name,
          meta_description: categoryForm.meta_description || categoryForm.description
        }]);

      if (error) throw error;

      toast.success('Catégorie créée avec succès');
      setIsCreateCategoryOpen(false);
      setCategoryForm({
        name: '',
        description: '',
        meta_title: '',
        meta_description: ''
      });
      refetchCategories();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast.success('Article supprimé avec succès');
      refetchPosts();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category,
      tags: post.tags.join(', '),
      featured_image: post.featured_image || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      status: post.status
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion du Blog</h1>
          <p className="text-gray-600">Créez et gérez vos articles de blog</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle catégorie
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel article
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">Articles ({posts.length})</TabsTrigger>
          <TabsTrigger value="categories">Catégories ({categories.length})</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.created_at), 'dd/MM/yyyy', { locale: fr })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {post.category}
                        </span>
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Publié le {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: fr })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {post.excerpt && (
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {post.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      {posts.filter(p => p.category === category.name).length} articles
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{posts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Publiés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {posts.filter(p => p.status === 'published').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Brouillons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {posts.filter(p => p.status === 'draft').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Catégories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal création/édition d'article */}
      <Dialog open={isCreatePostOpen || !!editingPost} onOpenChange={(open) => {
        if (!open) {
          setIsCreatePostOpen(false);
          setEditingPost(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Modifier l\'article' : 'Créer un nouvel article'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                value={postForm.title}
                onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                placeholder="Titre de l'article"
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Extrait</Label>
              <Textarea
                value={postForm.excerpt}
                onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                placeholder="Court résumé de l'article"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                value={postForm.content}
                onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                placeholder="Contenu de l'article"
                rows={10}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={postForm.category} onValueChange={(value) => setPostForm({...postForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={postForm.status} onValueChange={(value) => setPostForm({...postForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                value={postForm.tags}
                onChange={(e) => setPostForm({...postForm, tags: e.target.value})}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <Label htmlFor="featured_image">Image à la une (URL)</Label>
              <Input
                value={postForm.featured_image}
                onChange={(e) => setPostForm({...postForm, featured_image: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meta_title">Titre SEO</Label>
                <Input
                  value={postForm.meta_title}
                  onChange={(e) => setPostForm({...postForm, meta_title: e.target.value})}
                  placeholder="Titre pour les moteurs de recherche"
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Description SEO</Label>
                <Input
                  value={postForm.meta_description}
                  onChange={(e) => setPostForm({...postForm, meta_description: e.target.value})}
                  placeholder="Description pour les moteurs de recherche"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsCreatePostOpen(false);
                setEditingPost(null);
              }}>
                Annuler
              </Button>
              <Button onClick={editingPost ? handleUpdatePost : handleCreatePost}>
                {editingPost ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal création de catégorie */}
      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                placeholder="Nom de la catégorie"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                placeholder="Description de la catégorie"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateCategory}>
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
