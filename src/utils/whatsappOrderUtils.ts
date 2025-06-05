
import { OrderFormData } from '@/types/orderForm';

// Numéros WhatsApp par ville
export const getWhatsAppNumberByCity = (city: string): string => {
  const cityNumbers = {
    'Brazzaville': '+242068196522',
    'Pointe-Noire': '+242069596812',
    'Dolisie': '+242069596812',
    'Ouesso': '+242068196522',
    'Nkayi': '+242068196522'
  };

  return cityNumbers[city as keyof typeof cityNumbers] || '+242068196522';
};

export const generateWhatsAppMessage = (orderData: OrderFormData): string => {
  const { customer, items, subtotal, promoDiscount, deliveryFee, total, orderType, bundleDiscount } = orderData;
  
  const isBundle = orderType.includes('bundle');
  const customerName = `${customer.firstName} ${customer.lastName}`;
  
  let message = `🛒 *NOUVELLE COMMANDE COWEMA*\n\n`;
  
  if (isBundle && bundleDiscount) {
    message += `🎁 *COMMANDE LOT* (Remise ${bundleDiscount}%)\n\n`;
  }
  
  message += `👤 *Client:* ${customerName}\n`;
  message += `📱 *Téléphone:* ${customer.phone}\n`;
  message += `📧 *Email:* ${customer.email || 'Non renseigné'}\n`;
  message += `📍 *Adresse:* ${customer.address}\n`;
  message += `🏙️ *Ville:* ${customer.city} - ${customer.neighborhood}\n\n`;
  
  message += `📦 *ARTICLES COMMANDÉS:*\n`;
  
  items.forEach((item, index) => {
    const effectivePrice = item.promoPrice || item.price;
    message += `${index + 1}. ${item.title}\n`;
    message += `   Quantité: ${item.quantity}\n`;
    message += `   Prix unitaire: ${effectivePrice.toLocaleString()} FCFA\n`;
    
    if (isBundle && bundleDiscount) {
      message += `   *Remise LOT appliquée: -${bundleDiscount}%*\n`;
    }
    
    message += `   Sous-total: ${(effectivePrice * item.quantity).toLocaleString()} FCFA\n\n`;
  });
  
  message += `💰 *RÉSUMÉ FINANCIER:*\n`;
  message += `Sous-total articles: ${subtotal.toLocaleString()} FCFA\n`;
  
  if (promoDiscount > 0) {
    message += `Réduction promo: -${promoDiscount.toLocaleString()} FCFA\n`;
  }
  
  message += `Frais de livraison: ${deliveryFee.toLocaleString()} FCFA\n`;
  message += `*TOTAL À PAYER: ${total.toLocaleString()} FCFA*\n\n`;
  
  if (customer.notes) {
    message += `📝 *Notes:* ${customer.notes}\n\n`;
  }
  
  message += `💳 *Paiement:* À la livraison\n\n`;
  message += `Merci de confirmer cette commande et nous traiterons votre demande rapidement! 🚀`;
  
  return message;
};

export const openWhatsAppWithMessage = (orderData: OrderFormData) => {
  const whatsappNumber = getWhatsAppNumberByCity(orderData.customer.city);
  const message = generateWhatsAppMessage(orderData);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};
