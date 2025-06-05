import { Promotion } from '../../../hooks/usePromotionStore';
import { PromotionMetric } from './types';

// Fonction pour exporter les métriques des promotions en CSV
export const exportMetricsToCSV = (metrics: Record<string, PromotionMetric>, dateRange: string) => {
  // En-têtes CSV
  const headers = [
    'ID',
    'Code',
    'Vues',
    'Utilisations',
    'Taux de conversion (%)',
    'CA Total (FCFA)',
    'Valeur moyenne (FCFA)',
    'Période'
  ].join(',');
  
  // Lignes de données
  const rows = Object.entries(metrics).map(([id, metric]) => {
    return [
      id,
      metric.code || 'N/A',
      metric.views,
      metric.usageCount,
      metric.conversionRate,
      metric.totalRevenue,
      metric.avgOrderValue,
      dateRange
    ].join(',');
  });
  
  // Assembler le CSV complet
  const csv = [headers, ...rows].join('\n');
  
  // Déclencher le téléchargement
  downloadCSV(csv, `metriques-promotions-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`);
};

// Fonction pour exporter les promotions en CSV
export const exportPromotionsToCSV = (
  promotions: Promotion[],
  metrics?: Record<string, PromotionMetric>
) => {
  // En-têtes CSV
  const headers = [
    'ID',
    'Code',
    'Remise',
    'Type',
    'Montant minimum',
    'Date d\'expiration',
    'Statut',
    'Cible',
    'Description',
    'Date de création',
    'Vues',
    'Utilisations',
    'Taux de conversion (%)'
  ].join(',');
  
  // Lignes de données
  const rows = promotions.map(promo => {
    const metric = metrics ? metrics[promo.id] : null;
    return [
      promo.id,
      promo.code,
      promo.discount,
      promo.discountType,
      promo.minPurchaseAmount,
      promo.expiryDate,
      promo.isActive ? 'Actif' : 'Inactif',
      promo.target === 'all' ? 'Tous les produits' : 'Ya Ba Boss',
      `"${promo.description.replace(/"/g, '""')}"`, // Échapper les guillemets dans le CSV
      promo.createdAt,
      metric ? metric.views : 'N/A',
      metric ? metric.usageCount : 'N/A',
      metric ? metric.conversionRate : 'N/A'
    ].join(',');
  });
  
  // Assembler le CSV complet
  const csv = [headers, ...rows].join('\n');
  
  // Déclencher le téléchargement
  downloadCSV(csv, `promotions-${new Date().toISOString().split('T')[0]}.csv`);
};

// Fonction pour importer des promotions depuis un CSV
export const importPromotionsFromCSV = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(Boolean);
        const headers = lines[0].split(',');
        
        const promotions = lines.slice(1).map(line => {
          const values = line.split(',');
          const promo: any = {};
          
          headers.forEach((header, index) => {
            promo[header.trim()] = values[index]?.trim();
          });
          
          return promo;
        });
        
        // Instead of returning the promotions array, we'll just resolve with void
        // The caller is expected to handle the promotions
        console.log('Parsed promotions:', promotions);
        resolve();
      } catch (error) {
        reject(new Error('Erreur lors de l\'analyse du fichier CSV'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsText(file);
  });
};

// Fonction utilitaire pour déclencher un téléchargement
const downloadCSV = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
