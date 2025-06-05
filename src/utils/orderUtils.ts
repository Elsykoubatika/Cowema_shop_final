
import { Order } from '../types/order';
import { sendWhatsAppReviewRequest } from './whatsappUtils';

// Cette fonction simule la génération d'un PDF (dans une app réelle, utiliser jsPDF ou PDFKit)
export const generateReceiptPDF = (order: Order): string => {
  // Dans une implémentation réelle, nous générerions un vrai PDF ici
  // Pour l'instant, nous simulons simplement et retournons un chemin fictif
  
  // Créer un ID de reçu court pour le nom du fichier
  const shortId = order.id.slice(0, 8);
  
  // Dans une implémentation réelle:
  // 1. Créer un nouveau document PDF
  // 2. Ajouter les détails de la commande
  // 3. Ajouter les articles et les prix
  // 4. Ajouter une mention "NON PAYÉ - PAIEMENT À LA LIVRAISON"
  // 5. Enregistrer dans un dossier public comme /receipts/
  
  console.log(`Simulation: PDF de reçu généré pour la commande ${shortId}`);
  
  return `/receipts/commande_${order.id}.pdf`;
};

// Cette fonction simule l'envoi d'un SMS de rappel (à intégrer avec un vrai service SMS)
export const sendOrderReminder = (order: Order): boolean => {
  // Dans une implémentation réelle, nous utiliserions une API SMS comme Twilio, Vonage, etc.
  
  console.log(`Simulation: SMS de rappel envoyé au client ${order.customer.firstName} au ${order.customer.phone}`);
  
  // On suppose que l'envoi a réussi
  return true;
};

// Cette fonction programmable vérifie les commandes en attente pour envoyer des rappels
export const checkPendingOrdersForReminders = (orders: Order[], processReminder: (order: Order) => void): void => {
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
  orders.forEach(order => {
    if (
      order.status === 'pending' && 
      !order.reminderSent && 
      new Date(order.createdAt) < oneHourAgo
    ) {
      processReminder(order);
    }
  });
};

// Nouvelle fonction: envoyer une demande de revue lorsqu'une commande est livrée
export const sendReviewRequest = (order: Order): boolean => {
  console.log(`Envoi d'une demande de revue pour la commande ${order.id}`);
  
  // Utiliser l'utilitaire WhatsApp pour envoyer la demande
  return sendWhatsAppReviewRequest(order);
};
