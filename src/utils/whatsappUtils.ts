
export const generateWhatsAppLink = (phone: string, message?: string) => {
  // Nettoyer le numéro de téléphone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Ajouter le code pays si nécessaire (Congo +242)
  const formattedPhone = cleanPhone.startsWith('242') ? cleanPhone : `242${cleanPhone}`;
  
  // Encoder le message pour l'URL de manière plus robuste
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  // Construire le lien WhatsApp
  const baseUrl = 'https://wa.me/';
  return encodedMessage 
    ? `${baseUrl}${formattedPhone}?text=${encodedMessage}`
    : `${baseUrl}${formattedPhone}`;
};

export const formatPhoneForWhatsApp = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.startsWith('242') ? cleanPhone : `242${cleanPhone}`;
};

// Numéros WhatsApp par ville - CORRIGES
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

// Interface pour les données de commande WhatsApp
export interface WhatsAppOrderData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    promoPrice?: number | null;
    quantity: number;
    image?: string;
    category?: string;
  }>;
  total: number;
  notes?: string;
  deliveryFee?: number;
  discount?: number;
  promoCode?: string;
}

// Nettoyer et simplifier le texte pour WhatsApp
const cleanTextForWhatsApp = (text: string): string => {
  return text
    // Remplacer les caractères problématiques par des alternatives simples
    .replace(/[^\w\s\-.,!?()\[\]]/g, ' ') // Garder seulement les caractères alphanumériques et ponctuation de base
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .trim();
};

// Générer le message WhatsApp formaté - VERSION SIMPLIFIÉE
export const generateWhatsAppMessage = (orderData: WhatsAppOrderData): string => {
  const { customerName, phone, address, city, items, total, notes, deliveryFee = 1500, discount = 0, promoCode } = orderData;
  
  let message = `NOUVELLE COMMANDE COWEMA\n\n`;
  
  message += `Client: ${customerName}\n`;
  message += `Telephone: ${phone}\n`;
  message += `Adresse: ${address}\n`;
  message += `Ville: ${city}\n\n`;
  
  message += `ARTICLES COMMANDES:\n`;
  
  items.forEach((item, index) => {
    const effectivePrice = item.promoPrice || item.price;
    message += `${index + 1}. ${item.title}\n`;
    message += `   Quantite: ${item.quantity}\n`;
    message += `   Prix unitaire: ${effectivePrice.toLocaleString()} FCFA\n`;
    message += `   Sous-total: ${(effectivePrice * item.quantity).toLocaleString()} FCFA\n\n`;
  });
  
  const subtotal = items.reduce((sum, item) => {
    const price = item.promoPrice || item.price;
    return sum + (price * item.quantity);
  }, 0);
  
  message += `RESUME FINANCIER:\n`;
  message += `Sous-total articles: ${subtotal.toLocaleString()} FCFA\n`;
  
  if (discount > 0) {
    message += `Reduction: -${discount.toLocaleString()} FCFA\n`;
  }
  
  if (promoCode) {
    message += `Code promo: ${promoCode}\n`;
  }
  
  message += `Frais de livraison: ${deliveryFee.toLocaleString()} FCFA\n`;
  message += `TOTAL A PAYER: ${total.toLocaleString()} FCFA\n\n`;
  
  if (notes) {
    message += `Notes: ${notes}\n\n`;
  }
  
  message += `Paiement: A la livraison\n\n`;
  message += `Merci de confirmer cette commande et nous traiterons votre demande rapidement!`;
  
  // Nettoyer le message avant de le retourner
  return cleanTextForWhatsApp(message);
};

// Formater l'URL WhatsApp avec encodage correct
export const formatWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('242') ? cleanPhone : `242${cleanPhone}`;
  
  // Nettoyer le message d'abord
  const cleanedMessage = cleanTextForWhatsApp(message);
  
  // Utiliser un encodage simple et compatible
  const encodedMessage = encodeURIComponent(cleanedMessage)
    // Corrections spécifiques pour WhatsApp
    .replace(/%20/g, '%20') // Garder les espaces encodés
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};

// Ouvrir WhatsApp avec une commande
export const openWhatsApp = (orderData: WhatsAppOrderData): void => {
  const whatsappNumber = getWhatsAppNumberByCity(orderData.city);
  const message = generateWhatsAppMessage(orderData);
  const whatsappUrl = formatWhatsAppUrl(whatsappNumber, message);
  
  console.log(`Ouverture de WhatsApp pour ${orderData.city} - Numero: ${whatsappNumber}`);
  console.log('Message genere (nettoye):', message);
  console.log('URL WhatsApp:', whatsappUrl);
  
  window.open(whatsappUrl, '_blank');
};

// Valider un numéro de téléphone
export const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 8 && cleanPhone.length <= 15;
};

// Envoyer une demande de review via WhatsApp
export const sendWhatsAppReviewRequest = (order: any): boolean => {
  try {
    const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Client';
    const customerCity = order.customer?.city || 'Brazzaville';
    const customerPhone = order.customer?.phone || '';
    
    if (!customerPhone) {
      console.warn('Pas de numero de telephone pour envoyer la demande de review');
      return false;
    }
    
    const reviewMessage = `Bonjour ${customerName}!\n\n` +
      `Merci d'avoir choisi COWEMA pour votre commande #${order.id?.slice(0, 8) || 'XXX'}!\n\n` +
      `Nous esperons que vous etes satisfait(e) de vos achats. ` +
      `Votre avis nous aiderait enormement a ameliorer nos services.\n\n` +
      `Pourriez-vous prendre quelques instants pour nous laisser un avis?\n\n` +
      `En echange, vous recevrez un code de reduction de 10% pour votre prochaine commande!\n\n` +
      `Merci beaucoup!\n\n` +
      `L'equipe COWEMA`;

    const whatsappUrl = formatWhatsAppUrl(customerPhone, reviewMessage);
    window.open(whatsappUrl, '_blank');
    
    console.log(`Demande de review envoyee a ${customerName} (${customerPhone})`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande de review:', error);
    return false;
  }
};
