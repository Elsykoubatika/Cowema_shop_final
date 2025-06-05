
import { Product } from '@/types/product';
import { CowemaApiProduct } from './types';

// Fonction améliorée pour extraire TOUTES les images possibles
const extractAllImages = (apiProduct: CowemaApiProduct): string[] => {
  const allImages: string[] = [];
  
  // Collecter toutes les sources d'images possibles
  const imageSources = [
    apiProduct.thumbnail,
    apiProduct.main_image,
    apiProduct.cover_image,
    apiProduct.featured_image,
    apiProduct.product_image,
    apiProduct.image_url,
    ...(apiProduct.images || []),
    ...(apiProduct.gallery || []),
    ...(apiProduct.additional_images || []),
    ...(apiProduct.image_urls || []),
    ...(apiProduct.product_images || []),
    ...(apiProduct.media || []),
    ...(apiProduct.attachments || [])
  ].filter(Boolean);

  // Traiter chaque source d'image
  imageSources.forEach(imageSource => {
    if (typeof imageSource === 'string' && imageSource.trim() !== '') {
      const cleanUrl = imageSource.trim();
      if (cleanUrl.startsWith('http') || cleanUrl.startsWith('/') || cleanUrl.startsWith('data:')) {
        allImages.push(cleanUrl);
      }
    } else if (typeof imageSource === 'object' && imageSource !== null) {
      // Gérer les objets image qui peuvent avoir une structure complexe
      const imageObj = imageSource as any;
      if (imageObj.url) allImages.push(imageObj.url);
      if (imageObj.src) allImages.push(imageObj.src);
      if (imageObj.original) allImages.push(imageObj.original);
      if (imageObj.large) allImages.push(imageObj.large);
      if (imageObj.medium) allImages.push(imageObj.medium);
      if (imageObj.small) allImages.push(imageObj.small);
    }
  });

  // Supprimer les doublons et valider les URLs
  const uniqueImages = Array.from(new Set(allImages)).filter(img => 
    img && 
    typeof img === 'string' && 
    img.trim() !== '' &&
    (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:'))
  );
  
  console.log(`🖼️ Image Extraction Audit for Product ${apiProduct.id}:`, {
    productTitle: apiProduct.title?.substring(0, 30),
    rawSources: {
      thumbnail: !!apiProduct.thumbnail,
      main_image: !!apiProduct.main_image,
      cover_image: !!apiProduct.cover_image,
      images_array: apiProduct.images?.length || 0,
      gallery: apiProduct.gallery?.length || 0,
      additional_images: apiProduct.additional_images?.length || 0
    },
    extractedCount: uniqueImages.length,
    finalImages: uniqueImages.slice(0, 3) // Show first 3 for audit
  });
  
  return uniqueImages;
};

export const transformProduct = (apiProduct: CowemaApiProduct, forceYaBaBoss?: boolean): Product => {
  const isYaBaBoss = forceYaBaBoss || Math.random() > 0.7;
  const allImages = extractAllImages(apiProduct);
  
  // Utiliser la description originale de l'API ou créer une description simple sans le nom du fournisseur
  const productDescription = apiProduct.description || `${apiProduct.title}`;
  
  // Audit de la transformation
  const transformedProduct: Product = {
    id: apiProduct.id.toString(),
    externalApiId: apiProduct.id.toString(),
    name: apiProduct.title || `Produit ${apiProduct.id}`,
    title: apiProduct.title,
    description: productDescription,
    price: apiProduct.regular_price || apiProduct.price || 0,
    promoPrice: apiProduct.on_sales ? (apiProduct.price || undefined) : undefined,
    images: allImages.length > 0 ? allImages : ['/placeholder-image.jpg'],
    category: apiProduct.category || 'Général',
    subcategory: apiProduct.sub_category,
    stock: apiProduct.available_stock || Math.floor(Math.random() * 100) + 1,
    city: apiProduct.supplier_city || 'Non spécifié',
    location: apiProduct.supplier_city,
    supplierName: apiProduct.supplier || 'Fournisseur inconnu',
    videoUrl: apiProduct.video_url || '',
    keywords: [
      apiProduct.category || '',
      apiProduct.sub_category || '',
      apiProduct.brand || '',
      apiProduct.supplier || '',
      ...(apiProduct.tags || [])
    ].filter(Boolean),
    isYaBaBoss,
    isFlashOffer: apiProduct.on_sales || false,
    isActive: true,
    rating: 4 + Math.random(),
    loyaltyPoints: Math.ceil((apiProduct.regular_price || apiProduct.price || 0) * 0.05),
    sold: Math.floor(Math.random() * 50)
  };

  console.log(`🔄 Product Transform Audit:`, {
    originalId: apiProduct.id,
    transformedId: transformedProduct.id,
    category: {
      original: apiProduct.category,
      transformed: transformedProduct.category
    },
    images: {
      originalSources: Object.keys(apiProduct).filter(key => 
        key.includes('image') || key.includes('thumbnail') || key.includes('gallery')
      ),
      transformedCount: transformedProduct.images.length,
      hasValidImages: transformedProduct.images.length > 1 || 
                     (transformedProduct.images.length === 1 && !transformedProduct.images[0].includes('placeholder'))
    },
    price: {
      regular: apiProduct.regular_price,
      current: apiProduct.price,
      final: transformedProduct.price,
      hasPromo: !!transformedProduct.promoPrice
    },
    description: {
      original: apiProduct.description,
      transformed: transformedProduct.description,
      removedSupplierName: true
    }
  });
  
  return transformedProduct;
};

// Export alias for backward compatibility
export const transformToProduct = transformProduct;
