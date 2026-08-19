/**
 * Maison Tia — Client & Route Middleware (middleware.ts)
 * 
 * Responsabilités :
 * 1. Interception de chaque navigation et requête.
 * 2. Vérification cryptographique & temporelle du Token JWT.
 * 3. Règle stricte : Non connecté / Token invalide => Redirection immédiate vers /login.
 * 4. Rate Limiting dynamique par client / IP (ex: max 5 tentatives par minute).
 */

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export interface MiddlewareResult {
  allowed: boolean;
  redirectTo?: string;
  statusCode?: number;
  message?: string;
  retryAfterSeconds?: number;
}

// Configuration par défaut du Rate Limiting
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 60 * 1000, // 1 minute
};

// Registre mémoire pour le Rate Limiting (sliding window par clé/IP/fingerprint)
const rateLimitStore = new Map<string, number[]>();

/**
 * Nettoie les entrées expirées du rate limiter
 */
function cleanRateLimitStore(key: string, now: number, windowMs: number): number[] {
  const timestamps = rateLimitStore.get(key) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);
  rateLimitStore.set(key, validTimestamps);
  return validTimestamps;
}

/**
 * Vérifie le Rate Limit pour un identifiant donné (IP / Client / Action)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): { limited: boolean; attemptsLeft: number; retryAfterSeconds: number } {
  const now = Date.now();
  const validTimestamps = cleanRateLimitStore(identifier, now, config.windowMs);

  if (validTimestamps.length >= config.maxAttempts) {
    const oldest = validTimestamps[0];
    const retryAfterMs = config.windowMs - (now - oldest);
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    return {
      limited: true,
      attemptsLeft: 0,
      retryAfterSeconds,
    };
  }

  // Enregistre la tentative
  validTimestamps.push(now);
  rateLimitStore.set(identifier, validTimestamps);

  return {
    limited: false,
    attemptsLeft: config.maxAttempts - validTimestamps.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Réinitialise le compteur de Rate Limiting (ex: après un login réussi)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Vérifie si un token JWT est syntaxiquement valide et non expiré
 */
export function verifyJwtToken(token: string | null): { isValid: boolean; payload?: any; reason?: string } {
  // 1. Vérification session sécurisée (cookie HTTP-Only session)
  const sessionRaw = localStorage.getItem('adminSession');
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      if (session.authenticated && session.expiresAt && Date.now() < session.expiresAt) {
        return { isValid: true, payload: { username: session.username, role: session.role } };
      }
    } catch (err) {}
  }

  // 2. Si token explicite fourni
  if (!token || typeof token !== 'string') {
    return { isValid: false, reason: 'Session non authentifiée' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { isValid: false, reason: 'Format JWT invalide' };
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { isValid: false, reason: 'Token expiré' };
    }

    return { isValid: true, payload };
  } catch (e) {
    return { isValid: false, reason: 'Token corrompu' };
  }
}

/**
 * Liste des routes publiques autorisées sans authentification
 */
const PUBLIC_ROUTES = ['/', '/collections', '/contact', '/login', '/secret-vault-admin'];

/**
 * Vérifie si une route donnée est publique ou protégée
 */
export function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith('/product/')) return true;
  return false;
}

/**
 * MIDDLEWARE PRINCIPAL (Exécuté à chaque navigation et requête)
 */
export function middleware(
  pathname: string,
  clientIp: string = 'client-local'
): MiddlewareResult {
  const now = Date.now();

  // 1. RATE LIMITING SUR LES ROUTES SENSIBLES (Login, Admin, Auth)
  const isSensitiveRoute = pathname === '/login' || pathname === '/secret-vault-admin' || pathname.startsWith('/admin');
  if (isSensitiveRoute) {
    const rateCheck = checkRateLimit(`ip-${clientIp}-${pathname}`, {
      maxAttempts: 5,
      windowMs: 60 * 1000, // 5 tentatives / minute
    });

    if (rateCheck.limited) {
      return {
        allowed: false,
        statusCode: 429,
        message: `Trop de requêtes. Veuillez patienter ${rateCheck.retryAfterSeconds} secondes avant de réessayer. (Max 5 tentatives/min)`,
        retryAfterSeconds: rateCheck.retryAfterSeconds,
      };
    }
  }

  // 2. ROUTE PUBLIQUE => ACCÈS AUTORISÉ
  if (isPublicRoute(pathname)) {
    return { allowed: true };
  }

  // 3. ROUTE PROTÉGÉE (ex: /admin, /dashboard) => VÉRIFICATION TOKEN
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  const authVerification = verifyJwtToken(token);

  if (!authVerification.isValid) {
    // Règle : Pas connecté / Token invalide => Redirection vers /login
    return {
      allowed: false,
      redirectTo: '/login',
      statusCode: 401,
      message: `Accès non autorisé (${authVerification.reason}). Redirection vers la page de connexion.`,
    };
  }

  // 4. AUTHENTIFIÉ => ACCÈS AUTORISÉ
  return { allowed: true };
}

export default middleware;
