
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DeliveryFormModal from './DeliveryFormModal';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, User, Package } from 'lucide-react';

export type ProductModalData = {
  id: number;
  title: string;
  price: number;
  promoPrice: number | null;
  description: string;
  images: string[];
  city: string;
  stock: number;
  sold: number;
};

export type CartItem = {
  id: number;
  title: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string;
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalType = 'product' | 'delivery' | 'cart' | 'login' | 'register' | 'account' | 'address' | 'leadCapture' | 'cartAbandon';

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  
  // Custom state for each modal
  const [productModalData, setProductModalData] = useState<ProductModalData | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('profile');
  
  // Function to open specific modal with data if needed
  const openModal = (modalType: ModalType, data?: any) => {
    setActiveModal(modalType);
    
    if (modalType === 'product' && data) {
      setProductModalData(data);
      setSelectedImage(data.images[0]);
    }

    if (modalType === 'cart' && data) {
      setCartItems(data);
    }
  };
  
  // Function to close modal
  const closeModal = () => {
    setActiveModal(null);
  };
  
  // Function to handle delivery form submit
  const handleDeliverySubmit = (formData: any) => {
    console.log('Delivery form submitted', formData);
    closeModal();
    // Here you would process the delivery info
  };
  
  // Function to skip delivery form and go to WhatsApp
  const handleSkipDelivery = () => {
    console.log('Skipping to WhatsApp');
    closeModal();
    // Here you would open WhatsApp with prefilled message
  };

  // Function to handle account tab change
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  // Function to calculate total price from cart items
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.promoPrice !== null ? item.promoPrice : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  // Product Modal
  const ProductModal = () => (
    <Dialog open={activeModal === 'product'} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{productModalData?.title}</DialogTitle>
        </DialogHeader>
        
        {productModalData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-md h-80 flex items-center justify-center">
                <img src={selectedImage} alt={productModalData.title} className="max-h-full max-w-full object-contain" />
              </div>
              
              <div className="flex gap-2 overflow-auto">
                {productModalData.images.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${productModalData.title} - ${index + 1}`} 
                    className={`h-16 w-16 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-primary' : 'border-gray-200'}`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-baseline gap-2 mb-4">
                {productModalData.promoPrice ? (
                  <>
                    <span className="text-2xl font-bold text-primary">{productModalData.promoPrice.toLocaleString()} FCFA</span>
                    <span className="text-gray-400 line-through">{productModalData.price.toLocaleString()} FCFA</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary">{productModalData.price.toLocaleString()} FCFA</span>
                )}
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex">
                  <span className="font-medium w-32 text-gray-500">Ville:</span>
                  <span>{productModalData.city}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-500">Stock disponible:</span>
                  <span>{productModalData.stock}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-500">Déjà vendus:</span>
                  <span>{productModalData.sold}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Description:</h3>
                <p className="text-gray-700">{productModalData.description}</p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button className="flex-1 flex items-center gap-2">
                  <Package size={16} />
                  Acheter maintenant
                </Button>
                <Button variant="secondary" className="flex items-center gap-2">
                  Ajouter au panier
                </Button>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="bg-[#25D366] hover:bg-[#128C7E] text-white hover:text-white border-none">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                  </svg>
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm" className="bg-[#3b5998] hover:bg-[#2d4373] text-white hover:text-white border-none">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z"></path>
                  </svg>
                  Partager
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Login Modal
  const LoginModal = () => (
    <Dialog open={activeModal === 'login'} onOpenChange={closeModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn size={18} /> Connexion
          </DialogTitle>
        </DialogHeader>
        
        <form className="space-y-4 py-2">
          <div>
            <label htmlFor="loginEmail" className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              id="loginEmail"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="loginPassword" className="block mb-1 font-medium">Mot de passe</label>
            <input
              type="password"
              id="loginPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="flex justify-between pt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                closeModal();
                openModal('register');
              }}
              className="flex items-center gap-1"
            >
              <UserPlus size={16} /> Créer un compte
            </Button>
            
            <Button type="submit" className="flex items-center gap-1">
              <LogIn size={16} /> Se connecter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  // Register Modal
  const RegisterModal = () => (
    <Dialog open={activeModal === 'register'} onOpenChange={closeModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus size={18} /> Créer un compte
          </DialogTitle>
        </DialogHeader>
        
        <form className="space-y-4 py-2">
          <div>
            <label htmlFor="registerName" className="block mb-1 font-medium">Nom complet</label>
            <input
              type="text"
              id="registerName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="registerEmail" className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              id="registerEmail"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="registerPhone" className="block mb-1 font-medium">Téléphone</label>
            <input
              type="tel"
              id="registerPhone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="registerPassword" className="block mb-1 font-medium">Mot de passe</label>
            <input
              type="password"
              id="registerPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="registerConfirmPassword" className="block mb-1 font-medium">Confirmer le mot de passe</label>
            <input
              type="password"
              id="registerConfirmPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="flex justify-between pt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                closeModal();
                openModal('login');
              }}
              className="flex items-center gap-1"
            >
              <LogIn size={16} /> Déjà un compte? Se connecter
            </Button>
            
            <Button type="submit" className="flex items-center gap-1">
              <UserPlus size={16} /> S'inscrire
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  // Cart Modal
  const CartModal = () => (
    <Dialog open={activeModal === 'cart'} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Votre Panier
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Votre panier est vide</p>
              <Button className="mt-4" onClick={closeModal}>Continuer les achats</Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[40vh] overflow-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-md" />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-primary text-sm">
                          {item.promoPrice ? item.promoPrice.toLocaleString() : item.price.toLocaleString()} FCFA × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <button className="text-danger hover:text-danger-hover">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="text-right font-bold text-lg py-4">
                Total: {calculateTotal().toLocaleString()} FCFA
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Vider le panier
                </Button>
                <Button className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Commander
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {children}
      
      {/* Render modals */}
      {activeModal === 'product' && <ProductModal />}
      {activeModal === 'login' && <LoginModal />}
      {activeModal === 'register' && <RegisterModal />}
      {activeModal === 'cart' && <CartModal />}
      {activeModal === 'delivery' && (
        <DeliveryFormModal 
          isOpen={activeModal === 'delivery'}
          onClose={closeModal}
          onSubmit={handleDeliverySubmit}
          onSkip={handleSkipDelivery}
        />
      )}
    </>
  );
};

export const useModal = () => {
  // This would be a custom hook that connects to context
  // Simplified implementation for example
  return {
    openModal: (modalType: ModalType, data?: any) => {
      // This would dispatch the actual action to open modals
      console.log(`Opening ${modalType} modal with data:`, data);
    }
  };
};

export default ModalProvider;
