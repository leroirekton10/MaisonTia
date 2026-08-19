import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { middleware, type MiddlewareResult } from '@/middleware';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackPath = '/login',
}) => {
  const location = useLocation();
  const [result, setResult] = useState<MiddlewareResult | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    // Exécute le middleware pour la route courante
    const check = middleware(location.pathname);
    setResult(check);

    if (check.retryAfterSeconds && check.retryAfterSeconds > 0) {
      setCountdown(check.retryAfterSeconds);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Re-vérifie après la fin du décompte
            setResult(middleware(location.pathname));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [location.pathname]);

  if (!result) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center font-serif text-[#D4AF37] text-lg animate-pulse">
        Vérification de sécurité Maison Tia...
      </div>
    );
  }

  // 1. Si Rate Limit atteint (429)
  if (!result.allowed && result.statusCode === 429) {
    return (
      <main className="min-h-screen bg-[#030303] text-[#FDFBF7] flex items-center justify-center p-6">
        <div className="max-w-md w-full luxury-glass border-red-500/40 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full border border-red-500/50 mx-auto flex items-center justify-center text-red-400 text-2xl font-serif">
            ⏱️
          </div>
          <h2 className="font-serif text-2xl text-red-300">Limite de Requêtes Atteinte</h2>
          <p className="text-xs text-[#FDFBF7]/70 leading-relaxed">
            {result.message}
          </p>
          {countdown > 0 && (
            <div className="py-3 px-6 luxury-glass border-[#D4AF37]/30 text-sm font-mono text-[#D4AF37] tracking-widest">
              Réessai autorisé dans : {countdown}s
            </div>
          )}
        </div>
      </main>
    );
  }

  // 2. Si Non Connecté ou Token Invalide => Redirection vers /login
  if (!result.allowed) {
    return <Navigate to={result.redirectTo || fallbackPath} state={{ from: location }} replace />;
  }

  // 3. Connecté et autorisé => Affiche la page
  return <>{children}</>;
};

export default ProtectedRoute;
