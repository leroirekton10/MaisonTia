import React, { useState } from 'react';
import { INSTAGRAM_MEDIA } from '@/data/mockProducts';

export default function InstagramGallery() {
  const [activeTab, setActiveTab] = useState<'all' | 'gold' | 'silver'>('all');
  const [selectedMedia, setSelectedMedia] = useState<typeof INSTAGRAM_MEDIA[0] | null>(null);

  const filteredMedia = INSTAGRAM_MEDIA.filter((item) => {
    if (activeTab === 'gold') return item.caption.toLowerCase().includes('or') || item.caption.toLowerCase().includes('diamant');
    if (activeTab === 'silver') return item.caption.toLowerCase().includes('argent') || item.caption.toLowerCase().includes('beldi');
    return true;
  });

  return (
    <section className="py-24 px-6 md:px-12 bg-[#030303] border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-3">
          Instagram @maisontia
        </span>
        <h2 className="font-serif text-4xl md:text-6xl text-[#FDFBF7] font-light mb-6">
          L'Univers Médias &amp; <span className="gold-gradient-text italic">Créations Instagram</span>
        </h2>
        <p className="max-w-xl mx-auto text-sm text-[#FDFBF7]/70 font-light leading-relaxed mb-8">
          Explorez nos dernières inspirations, pièces façonnées à la main et vidéos exclusives tirées du fil officiel.
        </p>

        {/* Category Tabs */}
        <div className="inline-flex p-1.5 luxury-glass rounded-full border-[#D4AF37]/20 gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all ${
              activeTab === 'all' ? 'bg-[#D4AF37] text-[#030303] font-semibold' : 'text-[#FDFBF7]/70 hover:text-[#FDFBF7]'
            }`}
          >
            Toutes les Photos (12)
          </button>
          <button
            onClick={() => setActiveTab('gold')}
            className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all ${
              activeTab === 'gold' ? 'bg-[#D4AF37] text-[#030303] font-semibold' : 'text-[#FDFBF7]/70 hover:text-[#FDFBF7]'
            }`}
          >
            Or &amp; Diamant
          </button>
          <button
            onClick={() => setActiveTab('silver')}
            className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all ${
              activeTab === 'silver' ? 'bg-[#D4AF37] text-[#030303] font-semibold' : 'text-[#FDFBF7]/70 hover:text-[#FDFBF7]'
            }`}
          >
            Argent Beldi
          </button>
        </div>
      </div>

      {/* Grid of 12 Instagram Assets */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedMedia(item)}
            className="group relative h-72 sm:h-80 rounded-none overflow-hidden cursor-pointer border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-500"
          >
            <img
              src={item.url}
              alt={item.caption}
              className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-2">
                ♥ {item.likes} mentions j'aime
              </span>
              <p className="text-xs text-[#FDFBF7] font-serif line-clamp-2 italic">
                "{item.caption}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Direct Instagram Link CTA */}
      <div className="mt-16 text-center">
        <a
          href="https://www.instagram.com/maisontia/"
          target="_blank"
          rel="noopener noreferrer"
          className="luxury-btn-outline inline-flex items-center gap-3 text-[10px] py-3.5 px-8"
        >
          <span>Suivre @maisontia sur Instagram</span>
          <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-[120] bg-[#030303]/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full luxury-glass border-[#D4AF37]/40 p-6 sm:p-8 rounded-none flex flex-col md:flex-row gap-8 items-center"
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 text-[#FDFBF7]/60 hover:text-[#D4AF37] text-2xl font-light"
            >
              ✕
            </button>
            <div className="w-full md:w-1/2 h-80 sm:h-96">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.caption}
                className="w-full h-full object-cover rounded-none"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-3">
                Publication Instagram Officielle
              </span>
              <p className="font-serif text-xl sm:text-2xl text-[#FDFBF7] italic mb-6 leading-relaxed">
                "{selectedMedia.caption}"
              </p>
              <div className="flex items-center gap-4 text-xs text-[#FDFBF7]/60 border-t border-[#D4AF37]/20 pt-4">
                <span>♥ {selectedMedia.likes} J'aime</span>
                <span>• Maison Tia Collection</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
