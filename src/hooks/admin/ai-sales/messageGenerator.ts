
import { AICustomerScore } from './types';

export const generateAdvancedWhatsAppMessage = (
  customer: AICustomerScore, 
  actionDetails: any
): string => {
  const firstName = customer.customer_name.split(' ')[0];
  const { type: actionType, products } = actionDetails;
  
  let message = `Bonjour ${firstName}! 👋\n\n`;

  // Messages personnalisés selon le type d'action et le profil
  switch (actionType) {
    case 'reactivation':
      message += `Ça fait ${customer.last_activity_days} jours qu'on ne s'est pas parlé ! 😊 J'ai pensé à vous en voyant ces offres spéciales :\n\n`;
      break;
    case 'upsell':
      message += `🌟 En tant que client VIP (${customer.total_spent.toLocaleString()} FCFA d'achats), vous méritez le meilleur !\n\nDécouvrez nos produits premium :\n\n`;
      break;
    case 'cross_sell':
      message += `Suite à vos ${customer.order_frequency} commandes, j'ai sélectionné ces compléments parfaits :\n\n`;
      break;
    case 'retention':
      message += `🎯 Offre spéciale fidélité ! Continuons ensemble cette belle relation commerciale :\n\n`;
      break;
    case 'loyalty':
      message += `🙏 Merci pour votre confiance ! Voici une sélection exclusive pour vous :\n\n`;
      break;
    default:
      message += `🔥 Nouveautés exclusives ! Voici les tendances du moment :\n\n`;
  }

  // Ajouter les produits avec probabilité de conversion
  products.forEach((product: any, index: number) => {
    message += `${index + 1}. *${product.name}*\n`;
    message += `💰 ${product.price.toLocaleString()} FCFA\n`;
    message += `💡 ${product.reason}\n`;
    message += `📊 ${Math.round(product.conversion_probability * 100)}% de match avec votre profil\n\n`;
  });

  // Call-to-action personnalisé
  if (customer.engagement_score >= 70) {
    message += `⚡ Réservation prioritaire disponible ! Répondez-moi rapidement.\n\n`;
  } else {
    message += `😊 Intéressé(e) ? Contactez-moi pour plus d'infos !\n\n`;
  }

  message += `COWEMA - Excellence & Innovation 💙\n`;
  message += `Score de compatibilité : ${Math.round(customer.purchase_probability * 100)}%`;

  return message;
};
