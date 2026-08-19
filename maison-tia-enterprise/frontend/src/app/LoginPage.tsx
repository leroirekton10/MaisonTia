import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data || 'Erreur de connexion');
    }
  };

  return (
    <div className="bg-obsidian min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-neutral-900 border border-gold/20 p-10 rounded-sm shadow-2xl">
        <h1 className="font-serif text-3xl text-ivory text-center mb-8">Accès Administrateur</h1>
        {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gold mb-2 ml-1">Utilisateur</label>
            <input
              className="w-full bg-transparent border-b border-ivory/20 py-3 focus:border-gold outline-none transition-colors text-ivory"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gold mb-2 ml-1">Mot de passe</label>
            <input
              type="password"
              className="w-full bg-transparent border-b border-ivory/20 py-3 focus:border-gold outline-none transition-colors text-ivory"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="w-full py-4 bg-gold text-obsidian uppercase text-xs tracking-[0.2em] font-bold hover:bg-ivory transition-all duration-500">
            S'authentifier
          </button>
        </form>
      </div>
    </div>
  );
}
