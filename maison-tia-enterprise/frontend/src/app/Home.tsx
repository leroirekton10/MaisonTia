import React, { useState } from 'react';
import LuxuryHero from '@/components/luxury/LuxuryHero';
import CommercialManifesto from '@/components/luxury/CommercialManifesto';
import DualUniverseSplit from '@/components/luxury/DualUniverseSplit';
import SavoirFaireSection from '@/components/luxury/SavoirFaireSection';
import FrameScrubber from '@/components/cinematic/FrameScrubber';
import InstagramGallery from '@/components/social/InstagramGallery';
import LegalNoticeModal from '@/components/luxury/LegalNoticeModal';
import { Link } from 'react-router-dom';

export default function Home() {
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  return (
    <main className="relative bg-[#030303] text-[#FDFBF7] overflow-x-hidden">
      {/* 1. Hero Video Section */}
      <LuxuryHero />

      {/* 2. Commercial Presentation / Brand Manifesto */}
      <CommercialManifesto />

      {/* 3. Dual Universe Showcase (The 2 Core Axes) */}
      <DualUniverseSplit />

      {/* 4. Ultra-Smooth Cinematic Frame Scrubber */}
      <FrameScrubber />

      {/* 5. Savoir-Faire & Craftsmanship Story */}
      <SavoirFaireSection />

      {/* 6. Instagram & Video Gallery */}
      <InstagramGallery />

      {/* 7. Grand Finale VIP Call to Action */}
      <section className="relative py-32 px-6 bg-[#030303] text-center border-t border-[#D4AF37]/20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl animate-gold-pulse" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-4">
            Expérience Sur-Mesure
          </span>
          <h2 className="font-serif text-5xl sm:text-7xl text-[#FDFBF7] font-light mb-6">
            Prêt pour <span className="gold-gradient-text italic font-serif">l'Exception ?</span>
          </h2>
          <p className="text-base sm:text-xl font-light text-[#FDFBF7]/80 italic max-w-xl mx-auto mb-10">
            Prenez rendez-vous dans nos ateliers ou sollicitez une présentation privée de nos créations en Or, Diamants de laboratoire et Argent Beldi.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              to="/contact"
              className="luxury-btn-gold text-[11px] py-4 px-10 flex items-center gap-2"
            >
              <span className="font-serif">✦</span>
              <span>Réserver une Consultation Privée</span>
            </Link>
            <Link
              to="/collections"
              className="luxury-btn-outline text-[11px] py-4 px-10"
            >
              Voir Tout le Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#020202] border-t border-[#D4AF37]/15 text-center text-xs text-[#FDFBF7]/50 font-light">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-serif text-lg tracking-[0.2em] text-[#FDFBF7]">
            MAISON TIA
          </div>
          <div>
            © 2026 Maison Tia. Tous droits réservés. L’essence du bijou contemporain.
          </div>
          <div className="flex flex-wrap gap-6 uppercase text-[9px] tracking-[0.2em] text-[#D4AF37]">
            <Link to="/collections?category=gold">Or &amp; Diamant</Link>
            <Link to="/collections?category=silver">Argent Beldi</Link>
            <button
              onClick={() => setIsLegalModalOpen(true)}
              className="hover:underline text-[#D4AF37]/80"
            >
              Mentions Légales &amp; Droits
            </button>
          </div>
        </div>
      </footer>

      <LegalNoticeModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </main>
  );
}
