
import jsPDF from 'jspdf';

interface OrderPDFData {
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    neighborhood: string;
    notes: string;
  };
  items: Array<{
    title: string;
    price: number;
    promoPrice: number | null;
    quantity: number;
  }>;
  subtotal: number;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
  appliedPromo?: { code: string; discount: number } | null;
}

export const generateOrderPDF = async (orderData: OrderPDFData): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Configuration des couleurs
  const primaryColor = [59, 130, 246]; // blue-600
  const textColor = [31, 41, 55]; // gray-800
  const grayColor = [107, 114, 128]; // gray-500
  const redColor = [220, 38, 38]; // red-600
  
  // En-tête avec logo et informations entreprise
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 35, 'F');
  
  // Logo et nom de l'entreprise
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('COWEMA', 20, 22);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('N°1 de la vente en ligne au Congo!', 20, 30);
  
  // Informations de contact
  doc.setFontSize(8);
  doc.text('WhatsApp: +242 XX XXX XXXX | Email: contact@cowema.com', 120, 22);
  doc.text('Brazzaville, République du Congo', 120, 28);
  
  // Titre du document
  doc.setTextColor(redColor[0], redColor[1], redColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('REÇU DE COMMANDE - NON PAYÉE', 20, 50);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('⚠️ PAIEMENT À LA LIVRAISON', 20, 58);
  
  // Informations de commande
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Détails de la commande', 20, 75);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Numéro de commande: #${orderData.orderId.slice(0, 8).toUpperCase()}`, 20, 85);
  doc.text(`Date de commande: ${new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 20, 92);
  
  // Statut de paiement en rouge
  doc.setTextColor(redColor[0], redColor[1], redColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Statut: COMMANDE NON PAYÉE', 20, 99);
  
  // Informations client
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations client', 20, 115);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom: ${orderData.customer.firstName} ${orderData.customer.lastName}`, 20, 125);
  doc.text(`Téléphone: ${orderData.customer.phone}`, 20, 132);
  if (orderData.customer.email) {
    doc.text(`Email: ${orderData.customer.email}`, 20, 139);
  }
  
  // Adresse de livraison
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Adresse de livraison', 20, 155);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${orderData.customer.address}`, 20, 165);
  doc.text(`${orderData.customer.city}, ${orderData.customer.neighborhood}`, 20, 172);
  if (orderData.customer.notes) {
    doc.text(`Notes: ${orderData.customer.notes}`, 20, 179);
  }
  
  // Articles commandés
  let yPosition = 195;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Articles commandés', 20, yPosition);
  
  yPosition += 10;
  
  // En-tête du tableau
  doc.setFillColor(248, 250, 252); // gray-50
  doc.rect(20, yPosition, 170, 8, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Article', 25, yPosition + 5);
  doc.text('Prix unit.', 120, yPosition + 5);
  doc.text('Qté', 145, yPosition + 5);
  doc.text('Total', 165, yPosition + 5);
  
  yPosition += 12;
  
  // Articles
  doc.setFont('helvetica', 'normal');
  orderData.items.forEach((item) => {
    const price = item.promoPrice || item.price;
    const itemTotal = price * item.quantity;
    
    doc.text(item.title.substring(0, 40), 25, yPosition);
    doc.text(`${price.toLocaleString()} FCFA`, 120, yPosition);
    doc.text(item.quantity.toString(), 150, yPosition);
    doc.text(`${itemTotal.toLocaleString()} FCFA`, 165, yPosition);
    
    yPosition += 7;
    
    // Nouvelle page si nécessaire
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 30;
    }
  });
  
  // Ligne de séparation
  yPosition += 5;
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // Récapitulatif des coûts
  doc.setFont('helvetica', 'normal');
  doc.text('Sous-total:', 120, yPosition);
  doc.text(`${orderData.subtotal.toLocaleString()} FCFA`, 165, yPosition);
  yPosition += 7;
  
  if (orderData.promoDiscount > 0) {
    doc.setTextColor(34, 197, 94); // green-500
    doc.text(`Réduction (${orderData.appliedPromo?.code}):`, 120, yPosition);
    doc.text(`-${orderData.promoDiscount.toLocaleString()} FCFA`, 165, yPosition);
    yPosition += 7;
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  }
  
  doc.text('Frais de livraison:', 120, yPosition);
  doc.text(`${orderData.deliveryFee.toLocaleString()} FCFA`, 165, yPosition);
  yPosition += 7;
  
  // Total en rouge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(redColor[0], redColor[1], redColor[2]);
  doc.text('TOTAL À PAYER:', 120, yPosition);
  doc.text(`${orderData.total.toLocaleString()} FCFA`, 165, yPosition);
  
  // Note de paiement
  yPosition += 20;
  doc.setFillColor(254, 243, 199); // yellow-100
  doc.rect(20, yPosition, 170, 25, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // yellow-700
  doc.text('💰 PAIEMENT À LA LIVRAISON', 25, yPosition + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(146, 64, 14); // yellow-800
  doc.text('Vous payerez en espèces lors de la réception de votre commande', 25, yPosition + 16);
  doc.text(`Montant exact à préparer: ${orderData.total.toLocaleString()} FCFA`, 25, yPosition + 22);
  
  // Instructions de livraison
  yPosition += 35;
  doc.setFillColor(239, 246, 255); // blue-50
  doc.rect(20, yPosition, 170, 20, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('📞 Prochaines étapes:', 25, yPosition + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(29, 78, 216); // blue-700
  doc.text('• Notre équipe vous contactera pour confirmer la livraison', 25, yPosition + 14);
  doc.text('• Livraison prévue sous 24-48h ouvrables', 25, yPosition + 18);
  
  // Pied de page
  yPosition += 30;
  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Merci pour votre confiance ! - COWEMA', 20, yPosition);
  doc.text('Pour toute question, contactez-nous via WhatsApp', 20, yPosition + 5);
  doc.text(`Document généré le ${new Date().toLocaleString('fr-FR')}`, 20, yPosition + 10);
  
  // Convertir en blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};
