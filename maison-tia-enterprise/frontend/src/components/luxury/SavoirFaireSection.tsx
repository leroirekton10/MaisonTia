import React from 'react';
import { Link } from 'react-router-dom';

export default function SavoirFaireSection() {
  return (
    <section className="py-28 px-6 md:px-12 bg-[#030303] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Visual Showcase */}
        <div className="relative">
          <div className="relative h-[500px] w-full border border-[#D4AF37]/30 p-3 luxury-glass">
            <img
              src="/assets/instagram/1000250540.jpg"
              alt="Savoir-Faire Haute Joaillerie"
              className="w-full h-full object-cover filter brightness-90"
            />
          </div>
          {/* Overlapping Badge Card */}
          <div className="absolute -bottom-8 -right-4 sm:right-8 luxury-glass border-[#D4AF37]/40 p-6 max-w-xs shadow-2xl hidden sm:block">
            <div className="text-3xl font-serif gold-gradient-text mb-1">100% Éthique</div>
            <p className="text-xs text-[#FDFBF7]/70 font-light">
              Diamants de synthèse cultivés avec des énergies renouvelables. Même composition atomique et éclat pur.
            </p>
          </div>
        </div>

        {/* Right Column: Narrative Content */}
        <div>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
              L'Art du Geste &amp; la Conscience
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl text-[#FDFBF7] font-light leading-tight mb-6">
            L'Excellence d'une <br />
            <span className="gold-gradient-text italic font-serif">Confection Responsable</span>
          </h2>

          <p className="text-base text-[#FDFBF7]/80 font-light leading-relaxed mb-6">
            Maison Tia privilégie une approche contemporaine où le luxe s’associe au respect de la terre et des hommes. Nos diamants de laboratoire offrent une brillance sans égal, exempte des empreintes écologiques et sociales de l’extraction traditionnelle.
          </p>

          <p className="text-base text-[#FDFBF7]/80 font-light leading-relaxed mb-8">
            Parallèlement, nos collections d'Argent Beldi font vivre un patrimoine vivant marocain. Chaque martelage, chaque incision est le fruit d’heures de passion artisanale à la main.
          </p>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-2 gap-6 mb-10 border-t border-b border-[#D4AF37]/20 py-6">
            <div>
              <span className="block font-serif text-xl text-[#D4AF37] mb-1">Diamants VVS1</span>
              <span className="text-xs text-[#FDFBF7]/60">Transparence &amp; pureté certifiée</span>
            </div>
            <div>
              <span className="block font-serif text-xl text-[#E2E8F0] mb-1">Argent Beldi Pur</span>
              <span className="text-xs text-[#FDFBF7]/60">Artisanat fait main au Maroc</span>
            </div>
          </div>

          <Link
            to="/contact"
            className="luxury-btn-gold text-[10px] py-4 px-8"
          >
            Prendre Rendez-vous en Atelier
          </Link>
        </div>
      </div>
    </section>
  );
}
