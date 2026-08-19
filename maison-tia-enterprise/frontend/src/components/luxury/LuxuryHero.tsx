import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface LuxuryHeroProps {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
}

export default function LuxuryHero({
  title = "L'Éclat d'une Vision Moderne",
  subtitle = "Maison Tia : L'Essence du Bijou Contemporain",
  videoUrl = "/assets/videos/hero-luxury.mp4"
}: LuxuryHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative h-[92vh] min-h-[650px] w-full overflow-hidden flex items-center justify-center bg-[#030303]">
      {/* 4K Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-75 contrast-110"
        />
        {/* Dark Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/30 to-[#030303]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030303]/40 to-[#030303]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Shimmer Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full luxury-glass border-[#D4AF37]/30 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#FFF6D6]">
            Haute-Joaillerie &amp; Artisanat Beldi
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#FDFBF7] font-light leading-[1.05] mb-6">
          L'Éclat d'une <span className="gold-gradient-text italic font-serif">Vision Moderne</span>
        </h1>

        {/* Subtitle Presentation */}
        <p className="max-w-2xl text-base sm:text-xl font-light text-[#FDFBF7]/80 leading-relaxed mb-10 tracking-wide font-sans">
          {subtitle} — L'alliance entre l'or noble, la pureté éthique des diamants de laboratoire et l'authenticité de l'argent Beldi marocain.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <Link to="/collections" className="luxury-btn-gold">
            Explorer les Collections
          </Link>
          <Link to="/contact" className="luxury-btn-outline">
            Réserver un Essayage Privé
          </Link>
        </div>
      </div>

      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className="absolute bottom-10 right-10 z-20 p-3 rounded-full luxury-glass hover:border-[#D4AF37] text-[#FDFBF7] transition-all duration-300 group"
        title={isMuted ? "Activer le son" : "Désactiver le son"}
      >
        {isMuted ? (
          <svg className="w-5 h-5 text-[#D4AF37]/80 group-hover:text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#FDFBF7]">Découvrir</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#D4AF37] to-transparent animate-bounce" />
      </div>
    </section>
  );
}
