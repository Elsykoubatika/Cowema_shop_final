
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RequestLog {
  timestamp: number;
  count: number;
}

export const useRateLimiter = (config: RateLimitConfig) => {
  const requestLog = useRef<Map<string, RequestLog>>(new Map());
  const [isBlocked, setIsBlocked] = useState(false);

  const checkRateLimit = useCallback((key: string = 'default'): boolean => {
    const now = Date.now();
    const log = requestLog.current.get(key);

    // Si pas de log ou si la fenêtre est expirée, créer un nouveau log
    if (!log || now - log.timestamp > config.windowMs) {
      requestLog.current.set(key, { timestamp: now, count: 1 });
      setIsBlocked(false);
      return true;
    }

    // Si on est dans la fenêtre, vérifier le nombre de requêtes
    if (log.count >= config.maxRequests) {
      setIsBlocked(true);
      toast.error(
        config.message || 
        `Trop de requêtes. Veuillez attendre ${Math.ceil(config.windowMs / 1000)} secondes.`,
        { duration: 5000 }
      );
      return false;
    }

    // Incrémenter le compteur
    log.count++;
    requestLog.current.set(key, log);
    return true;
  }, [config]);

  const executeWithRateLimit = useCallback(async <T>(
    action: () => Promise<T>,
    key?: string
  ): Promise<T | null> => {
    if (!checkRateLimit(key)) {
      return null;
    }

    try {
      return await action();
    } catch (error) {
      throw error; // Laisser l'erreur remonter pour être gérée par useErrorHandler
    }
  }, [checkRateLimit]);

  const resetRateLimit = useCallback((key: string = 'default') => {
    requestLog.current.delete(key);
    setIsBlocked(false);
  }, []);

  return {
    checkRateLimit,
    executeWithRateLimit,
    resetRateLimit,
    isBlocked
  };
};

// Configurations prédéfinies pour différents types d'actions
export const RATE_LIMIT_CONFIGS = {
  // Connexion/inscription - 5 tentatives par 15 minutes
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    message: 'Trop de tentatives de connexion. Veuillez attendre 15 minutes.'
  },
  
  // Création de commandes - 10 par 5 minutes
  ORDER_CREATION: {
    maxRequests: 10,
    windowMs: 5 * 60 * 1000,
    message: 'Trop de commandes créées. Veuillez attendre 5 minutes.'
  },
  
  // Messages de contact - 3 par 10 minutes
  CONTACT: {
    maxRequests: 3,
    windowMs: 10 * 60 * 1000,
    message: 'Trop de messages envoyés. Veuillez attendre 10 minutes.'
  },
  
  // Recherche - 50 par minute
  SEARCH: {
    maxRequests: 50,
    windowMs: 60 * 1000,
    message: 'Trop de recherches. Veuillez attendre une minute.'
  },
  
  // API générale - 100 par minute
  GENERAL: {
    maxRequests: 100,
    windowMs: 60 * 1000,
    message: 'Trop de requêtes. Veuillez ralentir.'
  }
};
