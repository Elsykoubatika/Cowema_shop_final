
// Configuration du domaine personnalisé
const CUSTOM_DOMAIN = 'https://cowema.net';
const FALLBACK_DOMAIN = window.location.origin; // Pour le développement local

// Fonction pour obtenir le domaine approprié
const getBaseDomain = () => {
  // En production, utiliser cowema.net
  if (window.location.hostname === 'cowema.net' || process.env.NODE_ENV === 'production') {
    return CUSTOM_DOMAIN;
  }
  // En développement, utiliser le domaine local
  return FALLBACK_DOMAIN;
};

// Génère un code de parrainage unique
export const generateReferralCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Génère un lien de parrainage avec le domaine personnalisé
export const generateReferralLink = (code: string) => {
  return `${getBaseDomain()}/?ref=${code}`;
};

// Génère un lien court personnalisé avec le prénom de l'influenceur
export const generateShortInfluencerLink = (code: string, firstName: string) => {
  // Nettoyer le prénom: enlever les espaces et caractères spéciaux
  const cleanName = firstName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]/g, '') // Garder uniquement les lettres et chiffres
    .trim();
    
  // Si le nom est vide après nettoyage, utiliser seulement le code
  if (!cleanName) {
    return `${getBaseDomain()}/${code}`;
  }
  
  // Créer un lien court avec le prénom : cowema.net/prenom
  return `${getBaseDomain()}/${cleanName}?ref=${code}`;
};

// Génère un lien de parrainage personnalisé avec le nom de l'influenceur dans l'URL
export const generatePersonalizedReferralLink = (code: string, name: string) => {
  // Nettoyer le nom: enlever les espaces et caractères spéciaux
  const cleanName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]/g, '-') // Remplacer les caractères spéciaux par des tirets
    .replace(/-+/g, '-') // Supprimer les tirets multiples
    .replace(/^-|-$/g, '') // Supprimer les tirets au début et à la fin
    .trim();
    
  // Si le nom est vide après nettoyage, utiliser seulement le code
  if (!cleanName) {
    return generateReferralLink(code);
  }
  
  // Créer un lien avec le nom et le code pour référence
  return `${getBaseDomain()}/?ref=${code}&by=${cleanName}`;
};

// Génère un lien avec des paramètres de tracking personnalisés
export const generateCustomTrackingLink = (
  code: string,
  options: {
    campaign?: string;
    source?: string;
    medium?: string;
    content?: string;
    customParams?: Record<string, string>;
  } = {}
) => {
  const params = new URLSearchParams();
  params.append('ref', code);
  
  if (options.campaign) {
    params.append('utm_campaign', options.campaign);
  }
  
  if (options.source) {
    params.append('utm_source', options.source);
  }
  
  if (options.medium) {
    params.append('utm_medium', options.medium);
  }
  
  if (options.content) {
    params.append('utm_content', options.content);
  }
  
  // Ajouter des paramètres personnalisés
  if (options.customParams) {
    Object.entries(options.customParams).forEach(([key, value]) => {
      params.append(key, value);
    });
  }
  
  return `${getBaseDomain()}/?${params.toString()}`;
};

// Fonction pour créer des liens courts de marque (nécessite une configuration serveur)
export const generateBrandedShortLink = (code: string, alias?: string): string => {
  const baseDomain = getBaseDomain();
  
  if (alias) {
    // Nettoyer l'alias
    const cleanAlias = alias
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
    
    if (cleanAlias) {
      return `${baseDomain}/${cleanAlias}`;
    }
  }
  
  // Fallback vers un lien court avec le code
  return `${baseDomain}/s/${code}`;
};

// Fonction pour analyser les paramètres d'un lien de parrainage
export const parseReferralLink = (url: string) => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    return {
      referralCode: params.get('ref'),
      by: params.get('by'),
      campaign: params.get('utm_campaign'),
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      content: params.get('utm_content'),
      allParams: Object.fromEntries(params.entries())
    };
  } catch (error) {
    console.error('Erreur lors du parsing du lien:', error);
    return null;
  }
};

// Fonction pour valider si un domaine personnalisé est configuré
export const isCustomDomainConfigured = (): boolean => {
  return window.location.hostname === 'cowema.net' || process.env.NODE_ENV === 'production';
};

// Fonction pour obtenir des informations sur le domaine actuel
export const getDomainInfo = () => {
  return {
    isCustomDomain: isCustomDomainConfigured(),
    currentDomain: getBaseDomain(),
    hostname: window.location.hostname,
    isProduction: process.env.NODE_ENV === 'production'
  };
};
