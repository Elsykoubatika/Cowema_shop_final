
import React from 'react';
import { ExternalLink, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductLinkCellProps {
  product: {
    id?: string;
    title: string;
    image?: string;
    product_id?: string;
  };
}

const ProductLinkCell: React.FC<ProductLinkCellProps> = ({ product }) => {
  const handleProductClick = () => {
    if (product.product_id) {
      // Ouvrir la page produit dans un nouvel onglet
      window.open(`/product/${product.product_id}`, '_blank');
    }
  };

  const handleImagePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.image) {
      // Créer une modal simple pour prévisualiser l'image
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
      `;
      
      const img = document.createElement('img');
      img.src = product.image;
      img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain;';
      
      modal.appendChild(img);
      document.body.appendChild(modal);
      
      modal.onclick = () => document.body.removeChild(modal);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {product.image && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleImagePreview}
          className="h-8 w-8 p-0"
          title="Voir l'image"
        >
          <Image className="h-4 w-4" />
        </Button>
      )}
      
      {product.product_id && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleProductClick}
          className="h-8 px-2"
          title="Voir le produit"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Voir
        </Button>
      )}
      
      {!product.product_id && (
        <span className="text-gray-500 text-xs">Lien indisponible</span>
      )}
    </div>
  );
};

export default ProductLinkCell;
