import React, { useState } from 'react';
import { validateContactForm, validateEmail, validateName, validateMessage, validatePhone } from '@/lib/validators';
import { apiClient } from '@/lib/api';
import { triggerGoldConfetti } from '@/lib/utils';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Or & Diamant de Laboratoire',
    message: ''
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear specific field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleBlur = (field: string) => {
    let error: string | null = null;
    if (field === 'name') error = validateName(formData.name, "Le nom complet");
    if (field === 'email') error = validateEmail(formData.email);
    if (field === 'phone' && formData.phone) error = validatePhone(formData.phone);
    if (field === 'message') error = validateMessage(formData.message);

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error as string }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    // Comprehensive client-side validation
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const sanitized = validation.data!;
      await apiClient.submitPublicRequest({
        customerName: sanitized.name,
        email: sanitized.email,
        phone: sanitized.phone,
        requestedService: sanitized.service,
        message: sanitized.message
      });

      setSubmitted(true);
      triggerGoldConfetti();
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Or & Diamant de Laboratoire',
        message: ''
      });
      setErrors({});
    } catch (err: any) {
      setGlobalError("Une erreur est survenue lors de l'enregistrement de votre demande. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030303] text-[#FDFBF7] py-20 px-6 md:px-12 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Brand Invitation */}
        <div>
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-4">
            Rendez-vous &amp; sur-mesure
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl text-[#FDFBF7] font-light leading-tight mb-8">
            Une Invitation à <br />
            <span className="gold-gradient-text italic font-serif">l'Exception</span>
          </h1>

          <p className="text-lg font-serif italic text-[#D4AF37] leading-relaxed mb-8">
            "Chaque création est un dialogue précieux entre votre histoire et nos maîtres artisans. Nous vous accueillons pour concevoir la pièce sur-mesure de vos rêves."
          </p>

          <div className="space-y-6 text-xs text-[#FDFBF7]/70 border-t border-[#D4AF37]/20 pt-8">
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full luxury-glass border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 font-serif">✦</span>
              <div>
                <strong className="block text-[#FDFBF7] text-sm font-serif">Salon Privé &amp; Consultation Ateliers</strong>
                <span>Paris • Marrakech • Présentation Visioconférence Internationale</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full luxury-glass border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 font-serif">✦</span>
              <div>
                <strong className="block text-[#FDFBF7] text-sm font-serif">Deux Univers d'Excellence</strong>
                <span>Or 18K &amp; Diamants de Laboratoire • Argent 925 &amp; Beldi Fait Main</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Luxury Appointment Form */}
        <div className="luxury-glass p-8 sm:p-12 border-[#D4AF37]/30 shadow-2xl relative">
          <div className="absolute -top-3 left-8 px-4 py-1 bg-[#030303] border border-[#D4AF37]/40 text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
            Demande de Consultation Privée
          </div>

          {globalError && (
            <div className="mb-6 p-3 bg-red-950/50 border border-red-500/40 text-red-300 text-xs text-center">
              {globalError}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                    Nom Complet *
                  </label>
                  {errors.name && <span className="text-[10px] text-red-400 font-medium">{errors.name}</span>}
                </div>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full bg-[#030303]/60 border-b py-3 px-4 outline-none transition-colors text-[#FDFBF7] placeholder:text-[#FDFBF7]/30 text-sm ${
                    errors.name ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                  }`}
                  placeholder="Madame, Monsieur..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                      Email Officiel *
                    </label>
                  </div>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full bg-[#030303]/60 border-b py-3 px-4 outline-none transition-colors text-[#FDFBF7] placeholder:text-[#FDFBF7]/30 text-sm ${
                      errors.email ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                    }`}
                    placeholder="email@domaine.com"
                  />
                  {errors.email && <span className="text-[9px] text-red-400 font-medium block mt-1">{errors.email}</span>}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                      Téléphone / WhatsApp
                    </label>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full bg-[#030303]/60 border-b py-3 px-4 outline-none transition-colors text-[#FDFBF7] placeholder:text-[#FDFBF7]/30 text-sm ${
                      errors.phone ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                    }`}
                    placeholder="+33 6 00 00 00 00"
                  />
                  {errors.phone && <span className="text-[9px] text-red-400 font-medium block mt-1">{errors.phone}</span>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] mb-2 font-semibold">
                  Axe de Création Souhaité
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => handleFieldChange('service', e.target.value)}
                  className="w-full bg-[#030303] border-b border-[#D4AF37]/30 py-3 px-4 focus:border-[#D4AF37] outline-none transition-colors text-[#FDFBF7] text-sm cursor-pointer"
                >
                  <option value="Or & Diamant de Laboratoire">Or &amp; Diamant de Laboratoire Éthique</option>
                  <option value="Argent 925 & Beldi">Argent 925 &amp; Argent Beldi Fait Main Marocain</option>
                  <option value="Création Haute-Joaillerie Sur-Mesure">Création Haute-Joaillerie Sur-Mesure</option>
                  <option value="Conseil & Essayage Général">Conseil &amp; Essayage Général</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                    Votre Projet / Message *
                  </label>
                  {errors.message && <span className="text-[10px] text-red-400 font-medium">{errors.message}</span>}
                </div>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  className={`w-full bg-[#030303]/60 border-b py-3 px-4 outline-none transition-colors text-[#FDFBF7] placeholder:text-[#FDFBF7]/30 text-sm resize-none ${
                    errors.message ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                  }`}
                  placeholder="Décrivez vos préférences (bague de fiançailles, gravure Beldi, pendentif...)..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="luxury-btn-gold w-full text-[11px] py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Transmission en cours...' : 'Transmettre la Demande Privée'}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full luxury-glass border-[#D4AF37] mx-auto flex items-center justify-center text-2xl text-[#D4AF37]">
                ✓
              </div>
              <h3 className="font-serif text-3xl text-[#FDFBF7]">Votre Demande est Enregistrée</h3>
              <p className="text-sm text-[#FDFBF7]/80 font-light italic max-w-sm mx-auto leading-relaxed">
                Notre concierge Maison Tia prendra contact avec vous sous 24 heures pour convenir du rendez-vous privé.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] hover:underline"
              >
                Nouvelle Demande
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

