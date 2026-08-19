import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DualUniverseSplit() {
  const [activeUniverse, setActiveUniverse] = useState<'gold' | 'silver' | null>(null);

  return (
    <section className="relative py-24 px-6 md:px-12 bg-[#030303]">
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-3">
          Deux Axes de Création d'Exception
        </span>
        <h2 className="font-serif text-4xl md:text-6xl text-[#FDFBF7] font-light">
          Deux Univers, <span className="gold-gradient-text italic">Une Seule Signature</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* AXE 1 : Or & Diamants de Laboratoire */}
        <div
          onMouseEnter={() => setActiveUniverse('gold')}
          onMouseLeave={() => setActiveUniverse(null)}
          className={`relative group rounded-none overflow-hidden transition-all duration-700 border ${
            activeUniverse === 'gold' ? 'border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20 scale-[1.01]' : 'border-[#D4AF37]/30'
          }`}
        >
          <div className="relative h-[560px] w-full overflow-hidden">
            <img
              src="/assets/instagram/photo acceuil 1.jpg"
              alt="Or et Diamant de Laboratoire"
              className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-110 group-hover:brightness-105 transition-all duration-1000"
            />
            {/* Gold Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent" />

            <div className="absolute top-6 left-6 z-10">
              <span className="px-4 py-1.5 luxury-glass text-[9px] uppercase tracking-[0.3em] text-[#FFF6D6] font-semibold border-[#D4AF37]/40">
                Axe Premier • Luxe Éthique
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 z-20 flex flex-col items-start">
              <h3 className="font-serif text-3xl sm:text-5xl text-[#FDFBF7] mb-4 group-hover:text-[#D4AF37] transition-colors">
                Or &amp; Diamant <br />
                <span className="italic font-serif">de Laboratoire</span>
              </h3>
              <p className="text-sm text-[#FDFBF7]/80 font-light leading-relaxed mb-8 max-w-md">
                La noblesse de l’or 18 carats alliée à la pureté éthique des diamants de laboratoire. Des gemmes cultivées de manière responsable offrant une brillance absolue sans compromis.
              </p>
              <Link
                to="/collections?category=gold"
                className="luxury-btn-gold text-[10px] py-3 px-8"
              >
                Découvrir la Collection Or &amp; Diamants
              </Link>
            </div>
          </div>
        </div>

        {/* AXE 2 : Argent 925 & Argent Beldi Hand Made Marocain */}
        <div
          onMouseEnter={() => setActiveUniverse('silver')}
          onMouseLeave={() => setActiveUniverse(null)}
          className={`relative group rounded-none overflow-hidden transition-all duration-700 border ${
            activeUniverse === 'silver' ? 'border-[#E2E8F0] shadow-2xl shadow-[#E2E8F0]/20 scale-[1.01]' : 'border-[#E2E8F0]/30'
          }`}
        >
          <div className="relative h-[560px] w-full overflow-hidden">
            <img
              src="/assets/instagram/photo acceuil 3.jpg"
              alt="Argent Beldi Marocain Fait Main"
              className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-110 group-hover:brightness-105 transition-all duration-1000"
            />
            {/* Silver Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent" />

            <div className="absolute top-6 left-6 z-10">
              <span className="px-4 py-1.5 luxury-glass-silver text-[9px] uppercase tracking-[0.3em] text-[#E2E8F0] font-semibold">
                Axe Second • Artisanat Beldi 🇲🇦
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 z-20 flex flex-col items-start">
              <h3 className="font-serif text-3xl sm:text-5xl text-[#FDFBF7] mb-4 group-hover:text-[#E2E8F0] transition-colors">
                Argent 925 &amp; <br />
                <span className="italic font-serif">Argent Beldi Fait Main</span>
              </h3>
              <p className="text-sm text-[#FDFBF7]/80 font-light leading-relaxed mb-8 max-w-md">
                L’expression authentique de l’artisanat traditionnel marocain. Chaque bijou est façonné et ciselé à la main, honorant le geste ancestral et la patine noble de l'argent.
              </p>
              <Link
                to="/collections?category=silver"
                className="luxury-btn-outline text-[10px] py-3 px-8 hover:border-[#E2E8F0] hover:text-[#E2E8F0]"
              >
                Découvrir la Collection Beldi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
