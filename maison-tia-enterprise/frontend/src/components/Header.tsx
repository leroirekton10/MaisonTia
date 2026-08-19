import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/collections?category=gold', label: 'Or & Diamant de Labo' },
    { path: '/collections?category=silver', label: 'Argent 925 & Beldi' },
    { path: '/collections', label: 'Nos Collections' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 pointer-events-auto ${
          scrolled
            ? 'py-4 bg-[#030303]/90 backdrop-blur-2xl border-b border-[#D4AF37]/25 shadow-2xl shadow-black/60'
            : 'py-6 bg-gradient-to-b from-[#030303]/95 via-[#030303]/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo Brand */}
          <Link
            to="/"
            className="group flex items-center gap-3 font-serif text-2xl md:text-3xl tracking-[0.15em] text-[#FDFBF7] hover:text-[#D4AF37] transition-all duration-500"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-gold-pulse group-hover:scale-125 transition-transform" />
            <span className="font-light tracking-[0.2em]">MAISON TIA</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[11px] uppercase tracking-[0.25em] font-medium transition-colors duration-400 py-1 ${
                    isActive
                      ? 'text-[#D4AF37]'
                      : 'text-[#FDFBF7]/75 hover:text-[#FDFBF7]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA - Single Ultra-Exclusive "Consultation Privée" */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/contact"
              className="luxury-btn-gold text-[10px] py-3 px-7 rounded-none border border-[#FFF6D6]/40 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 group"
            >
              <span className="font-serif text-xs text-[#030303] group-hover:rotate-45 transition-transform">✦</span>
              <span>Consultation Privée</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#FDFBF7] p-2 hover:text-[#D4AF37] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-[#030303]/98 backdrop-blur-2xl flex flex-col justify-center items-center p-8 lg:hidden animate-fade-in">
          <nav className="flex flex-col items-center gap-8 text-center mb-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-serif text-2xl text-[#FDFBF7] hover:text-[#D4AF37] tracking-[0.15em] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/contact"
            className="luxury-btn-gold text-xs py-4 px-8 flex items-center gap-2"
          >
            <span className="font-serif">✦</span>
            <span>Consultation Privée</span>
          </Link>
        </div>
      )}
    </>
  );
}
