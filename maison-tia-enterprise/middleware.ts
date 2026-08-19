/**
 * Maison Tia — Global Edge & Application Middleware (middleware.ts)
 * 
 * Intercepte chaque requête :
 * 1. Vérification du token JWT
 * 2. Redirection vers /login si non connecté
 * 3. Rate limiting (max 5 tentatives par minute par IP)
 */

export { middleware, default } from './frontend/src/middleware';
