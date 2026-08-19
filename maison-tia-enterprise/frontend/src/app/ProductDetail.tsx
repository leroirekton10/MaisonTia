import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { type Product } from '@/data/mockProducts';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiClient.getProductById(id)
        .then((data) => {
          if (data) {
            setProduct(data);
            setActiveImage(data.featuredImage);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center font-serif text-2xl text-[#D4AF37]">
        Chargement de la création...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-4xl text-[#FDFBF7] mb-6">Création Non Trouvée</h1>
        <Link to="/collections" className="luxury-btn-gold text-[10px] py-3 px-6">
          Retourner aux Collections
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#030303] text-[#FDFBF7] py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] hover:underline mb-12"
        >
          ← Retour aux collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Gallery Showcase */}
          <div>
            <div className="h-[480px] sm:h-[560px] w-full border border-[#D4AF37]/30 luxury-glass overflow-hidden mb-4">
              <img
                src={activeImage || product.featuredImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-4">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`h-24 w-24 border ${
                      activeImage === imgUrl ? 'border-[#D4AF37]' : 'border-[#D4AF37]/20'
                    } overflow-hidden transition-all`}
                  >
                    <img src={imgUrl} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Specs */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-3">
              {product.categoryLabel}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#FDFBF7] mb-4">
              {product.name}
            </h1>

            <div className="font-serif text-3xl gold-gradient-text mb-8">
              {product.price}
            </div>

            <p className="text-base text-[#FDFBF7]/80 font-light leading-relaxed mb-8">
              {product.longDescription}
            </p>

            <div className="luxury-glass p-6 border-[#D4AF37]/20 space-y-4 mb-10 text-xs">
              <h4 className="font-serif text-lg text-[#D4AF37] border-b border-[#D4AF37]/20 pb-2">
                Fiche d'Exception &amp; Spécifications
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#D4AF37]">Matières Nobles</span>
                  <span className="text-[#FDFBF7]/80">{product.materials.join(', ')}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#D4AF37]">Origine / Atelier</span>
                  <span className="text-[#FDFBF7]/80">{product.origin || 'Fait Main au Maroc & Ateliers'}</span>
                </div>
              </div>

              {product.diamondCarat && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#D4AF37]/10">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#D4AF37]">Diamant de Synthèse</span>
                    <span className="text-[#FDFBF7]/80">{product.diamondCarat}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#D4AF37]">Taille du Diamant</span>
                    <span className="text-[#FDFBF7]/80">{product.diamondCut}</span>
                  </div>
                </div>
              )}

              {product.craftsmanship && (
                <div className="pt-2 border-t border-[#D4AF37]/10">
                  <span className="block text-[10px] uppercase tracking-wider text-[#D4AF37]">Savoir-faire Artisanal</span>
                  <span className="text-[#FDFBF7]/80">{product.craftsmanship}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="luxury-btn-gold text-[10px] py-4 px-8 text-center flex-1"
              >
                Demander un Essayage Sur-Mesure
              </Link>
              <a
                href="https://www.instagram.com/maisontia/"
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-btn-outline text-[10px] py-4 px-6 text-center"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
