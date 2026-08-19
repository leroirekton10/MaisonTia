import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    category: string;
    featuredImage: string;
    price?: string | number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-90
                 block transition-all duration-700 ease-out"
    >
      {/* Image Container */}
      <div className="absolute inset-0">
        <img
          src={product.featuredImage}
          alt={product.name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-[2000ms] ease-out"
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-8 w-full z-10">
        <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          {product.category}
        </p>
        <h3 className="font-serif text-2xl md:text-3xl text-ivory leading-tight mb-4 group-hover:translate-y-[-4px] transition-transform duration-500">
          {product.name}
        </h3>

        <div className="overflow-hidden h-0 group-hover:h-auto transition-all duration-500 ease-in-out">
           <span className="text-gold/70 text-[10px] uppercase tracking-widest">
             Découvrir la pièce &rarr;
           </span>
        </div>
      </div>

      {/* Subtle Border on Hover */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-gold/20 transition-colors duration-700 pointer-events-none" />
    </Link>
  );
}
