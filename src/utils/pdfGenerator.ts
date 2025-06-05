
import jsPDF from 'jspdf';
import { OrderFormData } from '@/types/orderForm';

export const generateOrderReceiptPDF = (orderData: OrderFormData, orderId: string) => {
  const { customer, items, subtotal, promoDiscount, deliveryFee, total, orderType, bundleDiscount } = orderData;
  const isBundle = orderType.includes('bundle');
  
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text('COWEMA', 20, 30);
  
  pdf.setFontSize(14);
  pdf.text('REÇU DE COMMANDE', 20, 45);
  
  pdf.setFontSize(10);
  pdf.setTextColor(255, 0, 0);
  pdf.text('COMMANDE NON PAYÉE - PAIEMENT À LA LIVRAISON', 20, 55);
  
  // Order info
  pdf.setFontSize(12);
  pdf.setTextColor(40, 40, 40);
  pdf.text(`Numéro de commande: ${orderId.slice(0, 8).toUpperCase()}`, 20, 70);
  pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 80);
  
  if (isBundle && bundleDiscount) {
    pdf.setTextColor(0, 128, 0);
    pdf.text(`COMMANDE LOT - Remise ${bundleDiscount}% appliquée`, 20, 90);
    pdf.setTextColor(40, 40, 40);
  }
  
  // Customer info
  let yPos = isBundle ? 105 : 95;
  pdf.setFontSize(14);
  pdf.text('INFORMATIONS CLIENT', 20, yPos);
  
  yPos += 15;
  pdf.setFontSize(10);
  pdf.text(`Nom: ${customer.firstName} ${customer.lastName}`, 20, yPos);
  pdf.text(`Téléphone: ${customer.phone}`, 20, yPos + 10);
  pdf.text(`Email: ${customer.email || 'Non renseigné'}`, 20, yPos + 20);
  pdf.text(`Adresse: ${customer.address}`, 20, yPos + 30);
  pdf.text(`Ville: ${customer.city} - ${customer.neighborhood}`, 20, yPos + 40);
  
  // Items
  yPos += 60;
  pdf.setFontSize(14);
  pdf.text('ARTICLES COMMANDÉS', 20, yPos);
  
  yPos += 15;
  pdf.setFontSize(9);
  
  items.forEach((item, index) => {
    const effectivePrice = item.promoPrice || item.price;
    const itemTotal = effectivePrice * item.quantity;
    
    pdf.text(`${index + 1}. ${item.title}`, 20, yPos);
    pdf.text(`Qté: ${item.quantity}`, 120, yPos);
    pdf.text(`Prix: ${effectivePrice.toLocaleString()} FCFA`, 140, yPos);
    pdf.text(`Total: ${itemTotal.toLocaleString()} FCFA`, 170, yPos);
    
    yPos += 10;
    
    if (yPos > 250) {
      pdf.addPage();
      yPos = 30;
    }
  });
  
  // Totals
  yPos += 20;
  pdf.setFontSize(10);
  pdf.text(`Sous-total: ${subtotal.toLocaleString()} FCFA`, 120, yPos);
  
  if (promoDiscount > 0) {
    yPos += 10;
    pdf.text(`Réduction: -${promoDiscount.toLocaleString()} FCFA`, 120, yPos);
  }
  
  yPos += 10;
  pdf.text(`Frais de livraison: ${deliveryFee.toLocaleString()} FCFA`, 120, yPos);
  
  yPos += 15;
  pdf.setFontSize(12);
  pdf.setTextColor(255, 0, 0);
  pdf.text(`TOTAL À PAYER: ${total.toLocaleString()} FCFA`, 120, yPos);
  
  // Footer
  yPos += 30;
  pdf.setFontSize(9);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Paiement à effectuer lors de la livraison', 20, yPos);
  pdf.text('Merci de votre confiance!', 20, yPos + 10);
  
  return pdf;
};

export const downloadOrderReceipt = (orderData: OrderFormData, orderId: string) => {
  const pdf = generateOrderReceiptPDF(orderData, orderId);
  const fileName = `commande-${orderId.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
