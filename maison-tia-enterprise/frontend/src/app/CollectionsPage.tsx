import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { type Product } from '@/data/mockProducts';

export default function CollectionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryParam = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    apiClient.getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => {
    if (activeCategoryParam === 'gold') return p.category === 'gold';
    if (activeCategoryParam === 'silver') return p.category === 'silver';
    return true;
  });

  return (
    <main className="min-h-screen bg-[#030303] text-[#FDFBF7] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-3">
            Haute-Joaillerie &amp; Beldi
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-6">
            Nos <span className="gold-gradient-text italic font-serif">Collections d'Exception</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-[#FDFBF7]/70 font-light leading-relaxed">
            Chaque créations Maison Tia est façonnée à la main en alliage noble d'Or 18K, Diamants de laboratoire éthiques ou Argent Beldi traditionnel marocain.
          </p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
          <button
            onClick={() => setSearchParams({})}
            className={`px-7 py-3 text-[10px] uppercase tracking-[0.25em] font-medium transition-all ${
              activeCategoryParam === 'all'
                ? 'luxury-btn-gold text-[#030303]'
                : 'luxury-btn-outline text-[#FDFBF7]'
            }`}
          >
            Toutes les Pièces
          </button>

          <button
            onClick={() => setSearchParams({ category: 'gold' })}
            className={`px-7 py-3 text-[10px] uppercase tracking-[0.25em] font-medium transition-all ${
              activeCategoryParam === 'gold'
                ? 'luxury-btn-gold text-[#030303]'
                : 'luxury-btn-outline text-[#FDFBF7]'
            }`}
          >
            Or &amp; Diamants de Labo
          </button>

          <button
            onClick={() => setSearchParams({ category: 'silver' })}
            className={`px-7 py-3 text-[10px] uppercase tracking-[0.25em] font-medium transition-all ${
              activeCategoryParam === 'silver'
                ? 'luxury-btn-gold text-[#030303]'
                : 'luxury-btn-outline text-[#FDFBF7]'
            }`}
          >
            Argent 925 &amp; Beldi 🇲🇦
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 text-center font-serif text-xl text-[#D4AF37] animate-pulse">
            Chargement du catalogue précieux...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group luxury-glass border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-700 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-80 w-full overflow-hidden bg-[#0a0a0a]">
                    <img
                      src={product.featuredImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-105 transition-all duration-700"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-[#030303]/80 border border-[#D4AF37]/30 text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">
                        {product.categoryLabel}
                      </span>
                    </div>

                    {product.diamondCarat && (
                      <div className="absolute bottom-4 right-4 z-10">
                        <span className="px-3 py-1 bg-[#D4AF37] text-[#030303] font-bold text-[9px] uppercase tracking-[0.2em]">
                          {product.diamondCarat}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors mb-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#FDFBF7]/60 font-light line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex justify-between items-center border-t border-[#D4AF37]/10 mt-auto">
                  <span className="font-serif text-xl gold-gradient-text">{product.price}</span>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] hover:underline font-semibold"
                  >
                    Aperçu Privé →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-[130] bg-[#030303]/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full luxury-glass border-[#D4AF37]/40 p-8 sm:p-12 rounded-none flex flex-col md:flex-row gap-10 cursor-default"
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 text-[#FDFBF7]/60 hover:text-[#D4AF37] text-2xl font-light"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 h-80 sm:h-[420px]">
              <img
                src={selectedProduct.featuredImage}
                alt={selectedProduct.name}
                className="w-full h-full object-cover rounded-none border border-[#D4AF37]/30"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-2">
                  {selectedProduct.categoryLabel}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#FDFBF7] mb-3">
                  {selectedProduct.name}
                </h2>
                <div className="font-serif text-2xl gold-gradient-text mb-6">
                  {selectedProduct.price}
                </div>

                <p className="text-xs sm:text-sm text-[#FDFBF7]/80 font-light leading-relaxed mb-6">
                  {selectedProduct.longDescription}
                </p>

                <div className="space-y-2 text-xs text-[#FDFBF7]/70 mb-8 border-t border-[#D4AF37]/20 pt-4">
                  <div><strong className="text-[#D4AF37] uppercase tracking-wider text-[10px]">Matériaux :</strong> {selectedProduct.materials.join(', ')}</div>
                  <div><strong className="text-[#D4AF37] uppercase tracking-wider text-[10px]">Savoir-faire :</strong> {selectedProduct.craftsmanship}</div>
                  {selectedProduct.diamondCarat && (
                    <div><strong className="text-[#D4AF37] uppercase tracking-wider text-[10px]">Diamant de Labo :</strong> {selectedProduct.diamondCarat} ({selectedProduct.diamondCut})</div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  to="/contact"
                  className="luxury-btn-gold text-[10px] py-3.5 px-6 flex-1 text-center"
                >
                  Réserver cet essayage
                </Link>
                <Link
                  to={`/product/${selectedProduct.id}`}
                  className="luxury-btn-outline text-[10px] py-3.5 px-6 text-center"
                >
                  Voir Fiche Complète
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
