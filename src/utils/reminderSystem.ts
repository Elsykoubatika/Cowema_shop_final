
import { checkPendingOrdersForReminders, sendOrderReminder } from './orderUtils';

// Create a function that takes the order store methods as parameters
export const setupReminderSystem = (getAllOrders, markReminderSent) => {
  console.log('Initialisation du système de relance automatique');
  
  // Vérifier les commandes non confirmées toutes les heures
  const hourlyCheck = setInterval(() => {
    console.log('Vérification des commandes en attente...');
    
    checkPendingOrdersForReminders(getAllOrders(), (order) => {
      // Envoyer un SMS et marquer comme "rappel envoyé"
      if (sendOrderReminder(order)) {
        markReminderSent(order.id);
        console.log(`Rappel envoyé pour la commande ${order.id}`);
      }
    });
  }, 3600000); // 1 heure en millisecondes
  
  // Fonction pour nettoyer l'intervalle
  return () => {
    clearInterval(hourlyCheck);
  };
};

// Note: Dans une application réelle, cette fonction serait remplacée par:
// 1. Un cron job sur le serveur
// 2. Une fonction de backend appelée régulièrement par une tâche planifiée
// 3. Un service worker qui s'exécute en arrière-plan
