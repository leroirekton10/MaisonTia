import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validatePassword, validateName, sanitizeString } from '@/lib/validators';
import { apiClient } from '@/lib/api';


export default function SecretAdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = (val: string) => {
    setUsername(val);
    if (fieldErrors.username) {
      setFieldErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleBlur = (field: 'username' | 'password') => {
    if (field === 'username') {
      const err = validateName(username, "L'identifiant admin");
      if (err) setFieldErrors(prev => ({ ...prev, username: err }));
    }
    if (field === 'password') {
      const err = validatePassword(password);
      if (err) setFieldErrors(prev => ({ ...prev, password: err }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setError('Coffre-fort temporairement verrouillé par mesure de sécurité suite à trop de tentatives.');
      return;
    }

    const cleanUsername = sanitizeString(username);
    const userErr = validateName(cleanUsername, "L'identifiant admin");
    const passErr = validatePassword(password);

    if (userErr || passErr) {
      setFieldErrors({
        username: userErr || undefined,
        password: passErr || undefined
      });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Authenticate via real backend API (sets HttpOnly cookie)
      const data = await apiClient.login({
        username: cleanUsername,
        password: password,
      });

      if (data && (data.status === 'SUCCESS' || data.token)) {
        setError('');
        navigate('/admin');
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err: any) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 4) {
        setIsLocked(true);
        setError('Accès Refusé : Trop de tentatives infructueuses. Verrouillage du coffre-fort pendant 60 secondes.');
        setTimeout(() => { setIsLocked(false); setAttempts(0); setError(''); }, 60000);
      } else if (err.response?.status === 401) {
        setError(`Accès Refusé : Identifiants incorrects. (${4 - nextAttempts} tentatives restantes)`);
      } else if (err.response?.data?.errors) {
        // Server validation error response
        const serverErrors = Object.values(err.response.data.errors).join(', ');
        setError(`Erreur de validation : ${serverErrors}`);
      } else {
        setError('Erreur de connexion au serveur. Vérifiez que le backend est actif.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030303] text-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Subtle Gold Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full luxury-glass border-[#D4AF37]/40 p-8 sm:p-12 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 mx-auto flex items-center justify-center font-serif text-[#D4AF37] text-xl mb-4">
            🔒
          </div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-2">
            Accès Confidentiel Restreint
          </span>
          <h1 className="font-serif text-3xl text-[#FDFBF7] font-light">
            Maison Tia <span className="gold-gradient-text italic font-serif">Vault</span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs text-center rounded-none font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                Identifiant Admin *
              </label>
              {fieldErrors.username && (
                <span className="text-[9px] text-red-400 font-medium">{fieldErrors.username}</span>
              )}
            </div>
            <input
              required
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              onBlur={() => handleBlur('username')}
              disabled={isLocked || isLoading}
              className={`w-full bg-[#030303]/80 border-b py-3 px-4 outline-none transition-colors text-[#FDFBF7] text-sm ${
                fieldErrors.username ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
              }`}
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                Clé du Coffre-Fort / Mot de Passe *
              </label>
              {fieldErrors.password && (
                <span className="text-[9px] text-red-400 font-medium">{fieldErrors.password}</span>
              )}
            </div>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => handleBlur('password')}
              disabled={isLocked || isLoading}
              className={`w-full bg-[#030303]/80 border-b py-3 px-4 outline-none transition-colors text-[#FDFBF7] text-sm ${
                fieldErrors.password ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
              }`}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLocked || isLoading}
            className="luxury-btn-gold w-full text-[11px] py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocked ? 'Verrouillé...' : isLoading ? 'Authentification...' : 'Déverrouiller l\'Administration'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#D4AF37]/15 pt-4 text-[9px] uppercase tracking-[0.2em] text-[#FDFBF7]/40">
          Protection Anti-Attaque • Maison Tia Security Shield
        </div>
      </div>
    </main>
  );
}


