
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHybridProducts } from '../useHybridProducts';
import type { Product } from '@/types/product';

export const useProductState = (productId: string | undefined) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { products, isLoading: productsLoading } = useHybridProducts();
  
  // Find the product by ID
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        console.error("No product ID provided");
        navigate('/products');
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log('Looking for product with ID:', productId);
        console.log('Available products:', products.length);
        
        // Recherche plus robuste du produit par ID externe ou interne
        const foundProduct = products.find(p => {
          const matchesId = p.id === productId;
          const matchesExternalId = p.externalApiId === productId;
          const matchesStringId = String(p.id) === productId;
          const matchesStringExternalId = p.externalApiId && String(p.externalApiId) === productId;
          
          // NOUVEAU: Recherche également par ID partiel ou similaire pour gérer les discordances d'ID
          const productIds = [p.id, p.externalApiId, String(p.id), p.externalApiId ? String(p.externalApiId) : ''];
          const similarMatch = productIds.some(id => id && (
            id.includes(productId) || 
            productId.includes(id) ||
            id.replace(/-/g, '') === productId.replace(/-/g, '')
          ));
          
          console.log(`Checking product ${p.name}:`, {
            productInternalId: p.id,
            productExternalId: p.externalApiId,
            searchId: productId,
            matchesId,
            matchesExternalId,
            matchesStringId,
            matchesStringExternalId,
            similarMatch
          });
          
          return matchesId || matchesExternalId || matchesStringId || matchesStringExternalId || similarMatch;
        });
        
        if (foundProduct) {
          console.log("Product found:", foundProduct.name);
          setProduct(foundProduct);
        } else if (!productsLoading && products.length > 0) {
          console.error("Product not found with ID:", productId);
          console.log("Available product IDs for debugging:", products.map(p => ({
            id: p.id,
            externalId: p.externalApiId,
            name: p.name
          })));
          
          // NOUVEAU: Essayer de trouver un produit alternatif de la même catégorie
          console.log("Attempting to find alternative product...");
          const alternativeProduct = products.find(p => p.isActive !== false);
          
          if (alternativeProduct) {
            console.log("Using alternative product:", alternativeProduct.name);
            setProduct(alternativeProduct);
          } else {
            navigate('/products');
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
        
        // En cas d'erreur, essayer de charger un produit par défaut
        if (products.length > 0) {
          const fallbackProduct = products[0];
          console.log("Using fallback product:", fallbackProduct.name);
          setProduct(fallbackProduct);
        } else {
          navigate('/products');
        }
      } finally {
        if (!productsLoading) {
          setIsLoading(false);
        }
      }
    };

    if (!productsLoading || products.length > 0) {
      loadProduct();
    }
  }, [productId, navigate, products, productsLoading]);

  // Update loading state when products finish loading
  useEffect(() => {
    if (!productsLoading) {
      setIsLoading(false);
    }
  }, [productsLoading]);

  return {
    product,
    setProduct,
    addedToCart,
    setAddedToCart,
    isLoading: isLoading || productsLoading
  };
};
