import React from 'react';
import { COMMERCIAL_PRESENTATION } from '@/data/mockProducts';

export default function CommercialManifesto() {
  return (
    <section className="relative py-28 px-6 md:px-12 bg-[#030303] overflow-hidden border-t border-b border-[#D4AF37]/15">
      {/* Background Diamond Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 font-serif text-[18vw] text-[#D4AF37] select-none whitespace-nowrap">
        MAISON TIA
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="h-[1px] w-12 bg-[#D4AF37]/60" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">
            Présentation Officielle
          </span>
          <span className="h-[1px] w-12 bg-[#D4AF37]/60" />
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl text-[#FDFBF7] font-light leading-tight mb-8">
          {COMMERCIAL_PRESENTATION.title}
        </h2>

        <p className="text-xl sm:text-2xl font-serif italic text-[#D4AF37] font-light leading-relaxed mb-12 max-w-3xl mx-auto">
          "{COMMERCIAL_PRESENTATION.subtitle}"
        </p>

        {/* Story Paragraphs in Glass Card */}
        <div className="luxury-glass p-8 sm:p-14 text-left space-y-6 shadow-2xl relative">
          <div className="absolute -top-3 left-10 px-4 py-1 bg-[#030303] border border-[#D4AF37]/30 text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
            Le Manifeste Maison Tia
          </div>

          {COMMERCIAL_PRESENTATION.paragraphs.map((p, idx) => (
            <p key={idx} className="text-base sm:text-lg text-[#FDFBF7]/85 font-light leading-relaxed tracking-wide">
              {p}
            </p>
          ))}

          {/* Pillars Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#D4AF37]/20 text-center">
            <div className="p-4">
              <h4 className="font-serif text-2xl text-[#D4AF37] mb-2">Or &amp; Diamant de Labo</h4>
              <p className="text-xs text-[#FDFBF7]/60 leading-normal">Alternative durable et éco-responsable sans compromis sur la brillance.</p>
            </div>
            <div className="p-4 border-y md:border-y-0 md:border-x border-[#D4AF37]/20">
              <h4 className="font-serif text-2xl text-[#E2E8F0] mb-2">Argent Beldi 925</h4>
              <p className="text-xs text-[#FDFBF7]/60 leading-normal">Fait main au Maroc par nos maîtres orfèvres dans le respect du geste traditionnel.</p>
            </div>
            <div className="p-4">
              <h4 className="font-serif text-2xl text-[#FFF6D6] mb-2">Signature Inaltérable</h4>
              <p className="text-xs text-[#FDFBF7]/60 leading-normal">Des lignes épurées et intemporelles qui traversent le temps avec grâce.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
