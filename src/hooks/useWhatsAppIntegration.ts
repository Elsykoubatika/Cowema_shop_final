
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Order } from '@/types/order';
import { getWhatsAppNumberByCity, generateWhatsAppMessage, formatWhatsAppUrl, WhatsAppOrderData } from '@/utils/whatsappUtils';

interface WhatsAppConfig {
  messageTemplate: string;
  autoSend: boolean;
}

export const useWhatsAppIntegration = () => {
  const [config, setConfig] = useState<WhatsAppConfig>({
    messageTemplate: 'Bonjour! Voici les détails de votre commande:',
    autoSend: false
  });

  // Generate WhatsApp link for order using new message format
  const generateOrderLink = useCallback((order: Order) => {
    const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
    const customerCity = order.customer.city || 'Brazzaville';
    const businessPhone = getWhatsAppNumberByCity(customerCity);
    
    // Calculer les frais de livraison (simulation - devrait venir de la commande)
    const deliveryFee = 1500; // Valeur par défaut
    
    // Préparer les données pour le nouveau format avec message pré-défini
    const orderData: WhatsAppOrderData = {
      customerName,
      phone: order.customer.phone,
      address: order.customer.address,
      city: customerCity,
      items: order.items,
      total: order.totalAmount,
      notes: order.customer.notes,
      deliveryFee,
      discount: 0, // À calculer selon les promotions appliquées
      promoCode: undefined
    };
    
    // Générer le message pré-défini
    const message = generateWhatsAppMessage(orderData);
    const whatsappUrl = formatWhatsAppUrl(businessPhone, message);
    
    console.log(`Commande dirigée vers ${businessPhone} pour la ville: ${customerCity}`);
    console.log('Message pré-défini généré:', message);
    
    return whatsappUrl;
  }, []);

  // Send order confirmation via WhatsApp
  const sendOrderConfirmation = useCallback(async (order: Order) => {
    try {
      const whatsappLink = generateOrderLink(order);
      
      if (config.autoSend) {
        window.open(whatsappLink, '_blank');
        toast.success('Message WhatsApp envoyé avec les détails de la commande');
      } else {
        await navigator.clipboard.writeText(whatsappLink);
        toast.success('Lien WhatsApp copié dans le presse-papiers');
      }
      
      return whatsappLink;
    } catch (error) {
      console.error('Error generating WhatsApp link:', error);
      toast.error('Erreur lors de la génération du lien WhatsApp');
      return null;
    }
  }, [generateOrderLink, config.autoSend]);

  // Send custom message via WhatsApp
  const sendCustomMessage = useCallback(async (phone: string, message: string, city?: string) => {
    try {
      // Si une ville est fournie, utiliser le bon numéro d'affaires
      const targetPhone = city ? getWhatsAppNumberByCity(city) : phone;
      const whatsappUrl = formatWhatsAppUrl(targetPhone, message);
      
      window.open(whatsappUrl, '_blank');
      toast.success('Message WhatsApp envoyé');
      
      return whatsappUrl;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      toast.error('Erreur lors de l\'envoi du message WhatsApp');
      return null;
    }
  }, []);

  // Send review request via WhatsApp
  const sendReviewRequest = useCallback(async (order: Order) => {
    const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
    const customerCity = order.customer.city || 'Brazzaville';
    
    const reviewMessage = `Bonjour ${customerName}! 👋\n\n` +
      `Merci d'avoir choisi COWEMA pour votre commande #${order.id.slice(0, 8)}!\n\n` +
      `Nous espérons que vous êtes satisfait(e) de vos achats. ` +
      `Votre avis nous aiderait énormément à améliorer nos services.\n\n` +
      `📝 Pourriez-vous prendre quelques instants pour nous laisser un avis?\n\n` +
      `En échange, vous recevrez un code de réduction de 10% pour votre prochaine commande! 🎁\n\n` +
      `Merci beaucoup! 💙\n\n` +
      `L'équipe COWEMA`;

    return sendCustomMessage(order.customer.phone, reviewMessage, customerCity);
  }, [sendCustomMessage]);

  const updateConfig = useCallback((newConfig: Partial<WhatsAppConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  return {
    config,
    updateConfig,
    generateOrderLink,
    sendOrderConfirmation,
    sendCustomMessage,
    sendReviewRequest
  };
};
