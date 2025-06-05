
import React from 'react';
import { useAdminCategoriesLoader } from '@/hooks/admin/useAdminCategoriesLoader';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import CategoriesStats from '@/components/admin/categories/CategoriesStats';
import CategoriesSearchBar from '@/components/admin/categories/CategoriesSearchBar';
import CategoriesPagination from '@/components/admin/categories/CategoriesPagination';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import SubcategoryForm from '@/components/admin/categories/SubcategoryForm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Tag, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CategoriesManager: React.FC = () => {
  const {
    categories,
    selectedCategory,
    isLoading,
    lastRefresh,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCategories,
    itemsPerPage,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    isSubcategoryModalOpen,
    searchQuery,
    setSelectedCategory,
    setIsAddModalOpen,
    setIsEditModalOpen,
    setIsDeleteDialogOpen,
    setIsSubcategoryModalOpen,
    setSearchQuery,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleAddSubcategory,
    handleDeleteSubcategory,
    refreshCategories,
    totalCategoriesCount,
    totalSubcategories,
    totalProducts
  } = useAdminCategoriesLoader();

  return (
    <AdminPageLayout>
      <AdminPageHeader title="Gestion des Catégories" />

      <div className="container-cowema space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Gérez les catégories et sous-catégories de votre boutique. Vous pouvez ajouter, modifier et supprimer des catégories.
          </p>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshCategories}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            {lastRefresh && (
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Dernière MAJ: {lastRefresh.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <CategoriesStats 
          totalCategories={totalCategoriesCount}
          totalSubcategories={totalSubcategories}
          totalProducts={totalProducts}
        />

        <div className="flex gap-4 mb-4 items-center">
          {/* Barre de recherche */}
          <div className="flex-1">
            <CategoriesSearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
          </div>

          {/* Bouton d'ajout */}
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Nouvelle catégorie
          </Button>
        </div>

        {isLoading && categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <span className="text-lg font-medium mb-2">Chargement des catégories...</span>
          </div>
        ) : (
          <>
            {categories.length === 0 ? (
              <div className="text-center p-8 border rounded">
                <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Aucune catégorie trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Aucune catégorie ne correspond à votre recherche' : 'Commencez par ajouter votre première catégorie'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Ajouter une catégorie
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Sous-catégories</TableHead>
                        <TableHead>Produits</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            {category.name}
                            {category.image && (
                              <div className="w-8 h-8 rounded overflow-hidden mt-1">
                                <img 
                                  src={category.image} 
                                  alt={category.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="subcategories">
                                <AccordionTrigger className="text-sm">
                                  <Badge variant="outline">
                                    {category.subcategories.length} sous-catégories
                                  </Badge>
                                </AccordionTrigger>
                                <AccordionContent>
                                  {category.subcategories.length > 0 ? (
                                    <div className="space-y-2">
                                      {category.subcategories.map((subcat, index) => (
                                        <div key={index} className="flex items-center justify-between p-1 rounded hover:bg-gray-50">
                                          <span className="text-sm">{subcat}</span>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDeleteSubcategory(category.id, subcat)}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full mt-2"
                                        onClick={() => {
                                          setSelectedCategory(category);
                                          setIsSubcategoryModalOpen(true);
                                        }}
                                      >
                                        <Plus className="w-3 h-3 mr-1" /> Ajouter
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-center py-2">
                                      <p className="text-xs text-gray-500">Aucune sous-catégorie</p>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-2"
                                        onClick={() => {
                                          setSelectedCategory(category);
                                          setIsSubcategoryModalOpen(true);
                                        }}
                                      >
                                        <Plus className="w-3 h-3 mr-1" /> Ajouter
                                      </Button>
                                    </div>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </TableCell>
                          <TableCell>
                            <Badge>
                              {category.productCount} produits
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {category.description || 
                              <span className="text-gray-400 italic text-sm">Aucune description</span>
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <CategoriesPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={totalCategories}
                  itemsPerPage={itemsPerPage}
                />
              </>
            )}
          </>
        )}

        {/* Modal d'ajout */}
        <Dialog 
          open={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen}
        >
          <DialogContent>
            <DialogTitle className="text-xl font-bold mb-4">Ajouter une catégorie</DialogTitle>
            <CategoryForm
              onSubmit={handleAddCategory}
            />
          </DialogContent>
        </Dialog>

        {/* Modal d'édition */}
        <Dialog 
          open={isEditModalOpen && selectedCategory !== null} 
          onOpenChange={setIsEditModalOpen}
        >
          <DialogContent>
            <DialogTitle className="text-xl font-bold mb-4">
              Modifier {selectedCategory?.name}
            </DialogTitle>
            {selectedCategory && (
              <CategoryForm
                category={selectedCategory}
                onSubmit={handleEditCategory}
                isEdit
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <AlertDialog
          open={isDeleteDialogOpen && selectedCategory !== null}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
              <AlertDialogDescription>
                Vous êtes sur le point de supprimer la catégorie "{selectedCategory?.name}".
                Cette action est irréversible et supprimera également toutes les sous-catégories associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => selectedCategory && handleDeleteCategory(selectedCategory.id)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal d'ajout de sous-catégorie */}
        <Dialog 
          open={isSubcategoryModalOpen && selectedCategory !== null} 
          onOpenChange={setIsSubcategoryModalOpen}
        >
          <DialogContent>
            <DialogTitle className="text-xl font-bold mb-4">
              Ajouter une sous-catégorie à {selectedCategory?.name}
            </DialogTitle>
            {selectedCategory && (
              <SubcategoryForm
                categoryId={selectedCategory.id}
                onSubmit={handleAddSubcategory}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
};

export default CategoriesManager;
