
import React from 'react';
import { Product } from '../../../types/product';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  const [name, setName] = React.useState(product?.name || '');
  const [description, setDescription] = React.useState(product?.description || '');
  const [images, setImages] = React.useState(product?.images?.join(', ') || '');
  const [price, setPrice] = React.useState(product?.price || 0);
  const [promoPrice, setPromoPrice] = React.useState(product?.promoPrice || undefined);
  const [category, setCategory] = React.useState(product?.category || '');
  const [stock, setStock] = React.useState(product?.stock || 0);
  const [isYaBaBoss, setIsYaBaBoss] = React.useState(product?.isYaBaBoss || false);
  const [isActive, setIsActive] = React.useState(product?.isActive !== false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      id: product?.id || `product-${Date.now()}`,
      name,
      title: name, // For backward compatibility
      description: description || '',
      images: images ? images.split(',').map(img => img.trim()) : [],
      price,
      promoPrice,
      category,
      subcategory: product?.subcategory,
      stock,
      city: product?.city,
      location: product?.location,
      supplierName: product?.supplierName,
      videoUrl: product?.videoUrl,
      keywords: product?.keywords || [],
      isYaBaBoss,
      isFlashOffer: product?.isFlashOffer || false,
      isActive,
      rating: product?.rating,
      loyaltyPoints: product?.loyaltyPoints,
      sold: product?.sold
    };

    onSubmit(newProduct);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom du produit
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Images (URLs séparées par des virgules)
        </label>
        <input
          type="text"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Prix
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Prix promo (optionnel)
        </label>
        <input
          type="number"
          value={promoPrice || ''}
          onChange={(e) => setPromoPrice(e.target.value === '' ? undefined : Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Catégorie
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Stock
        </label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ya Ba Boss
        </label>
        <input
          type="checkbox"
          checked={isYaBaBoss}
          onChange={(e) => setIsYaBaBoss(e.target.checked)}
          className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          value={isActive ? 'active' : 'inactive'}
          onChange={(e) => setIsActive(e.target.value === 'active')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>
      
      <div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
