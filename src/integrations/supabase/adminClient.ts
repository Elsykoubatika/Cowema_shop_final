
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hvrlcwfbujadozdhwvon.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cmxjd2ZidWphZG96ZGh3dm9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTY3NTc5OSwiZXhwIjoyMDYxMjUxNzk5fQ.kLMk9ZXGNmPpStIZiJYWOWZI-bTJe-b7ARvWsJkQHHQ";

// Validation de la configuration
const validateAdminConfig = () => {
  if (!SUPABASE_URL) {
    throw new Error('URL Supabase manquante');
  }
  
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Clé service role manquante');
  }
  
  if (!SUPABASE_SERVICE_ROLE_KEY.startsWith('eyJ')) {
    throw new Error('Format de clé service role invalide');
  }

  return true;
};

// Client administrateur Supabase avec configuration améliorée
export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
    }
  }
});

// Test de connexion simple avec retry
export const testAdminConnection = async (retries = 3): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      validateAdminConfig();
      
      console.log(`🔍 Test de connexion admin (tentative ${i + 1}/${retries})...`);
      
      // Test simple avec listUsers mais limité à 1 utilisateur
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1
      });
      
      if (error) {
        console.error(`❌ Erreur test connexion (tentative ${i + 1}):`, error);
        if (i === retries - 1) return false; // Dernier essai
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Délai exponentiel
        continue;
      }
      
      console.log('✅ Connexion admin réussie');
      return true;
      
    } catch (error) {
      console.error(`❌ Erreur validation config (tentative ${i + 1}):`, error);
      if (i === retries - 1) return false;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
};

// Diagnostic complet avec plus de détails
export const diagnosisAdminClient = async () => {
  console.log('🩺 Diagnostic admin client complet...');
  
  try {
    // Étape 1: Validation de la configuration
    console.log('1️⃣ Validation de la configuration...');
    validateAdminConfig();
    console.log('✅ Configuration valide');
    
    // Étape 2: Test de connexion avec retry
    console.log('2️⃣ Test de connexion...');
    const connectionTest = await testAdminConnection(2);
    console.log(`${connectionTest ? '✅' : '❌'} Test connexion: ${connectionTest ? 'OK' : 'ÉCHEC'}`);
    
    // Étape 3: Test d'accès aux profils (fallback)
    console.log('3️⃣ Test d\'accès aux données...');
    let dataAccess = false;
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, nom, role')
        .limit(1);
      
      if (!error && data) {
        dataAccess = true;
        console.log('✅ Accès aux données OK');
      } else {
        console.log('⚠️ Accès aux données limité:', error?.message);
      }
    } catch (err) {
      console.log('❌ Erreur accès aux données:', err);
    }
    
    return {
      configValid: true,
      connectionTest,
      dataAccess,
      error: null,
      recommendations: connectionTest ? [] : [
        'Vérifier les permissions du service role key',
        'Contrôler les politiques RLS sur les tables',
        'Vérifier la configuration réseau'
      ]
    };
  } catch (error: any) {
    console.error('❌ Diagnostic échoué:', error);
    return {
      configValid: false,
      connectionTest: false,
      dataAccess: false,
      error: error.message,
      recommendations: [
        'Régénérer le service role key',
        'Vérifier l\'URL du projet Supabase',
        'Contrôler les variables d\'environnement'
      ]
    };
  }
};
