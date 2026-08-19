"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function DualUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: true,
      });

      gsap.from(".universe-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        stagger: 0.3,
        duration: 1.5,
        ease: "power4.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent, side: 'left' | 'right') => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 30;
    const yPos = (clientY / window.innerHeight - 0.5) * 30;

    if (side === 'left') {
      gsap.to(leftPanelRef.current, { x: xPos, y: yPos, duration: 0.8, ease: "power2.out" });
      gsap.to(rightPanelRef.current, { x: -xPos * 0.5, y: -yPos * 0.5, duration: 1.2, ease: "power2.out" });
    } else {
      gsap.to(rightPanelRef.current, { x: -xPos, y: -yPos, duration: 0.8, ease: "power2.out" });
      gsap.to(leftPanelRef.current, { x: xPos * 0.5, y: yPos * 0.5, duration: 1.2, ease: "power2.out" });
    }
  };

  const goldProd = products.find(p => p.category?.toLowerCase() === 'gold');
  const silverProd = products.find(p => p.category?.toLowerCase() === 'silver');

  if (loading) return <div className="h-screen w-full bg-obsidian" />;

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-obsidian flex">
      <div
        ref={leftPanelRef}
        onMouseMove={(e) => handleMouseMove(e, 'left')}
        className="relative w-1/2 h-full group overflow-hidden border-r border-gold/20 transition-all duration-500 ease-out"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian/20 to-obsidian z-10" />
        <img
          src={goldProd?.featuredImage || "https://via.placeholder.com/1920x1080?text=Gold+Universe"}
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-[3s] ease-out"
          alt="Or et Diamants"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-12 text-center">
          <h3 className="universe-card font-serif text-5xl md:text-7xl text-gold mb-6 tracking-tight">{goldProd?.name || "L'éclat éternel"}</h3>
          <p className="universe-card text-ivory/60 max-w-xs font-light leading-relaxed mb-12 italic">
            {goldProd?.description || "La pureté absolue du diamant de laboratoire."}
          </p>
          {goldProd && goldProd.id ? (
            <Link to={`/product/${goldProd.id}`} className="universe-card px-8 py-3 border border-gold text-gold uppercase text-[10px] tracking-[0.3em] hover:bg-gold hover:text-obsidian transition-all duration-700 inline-block">
              Entrer dans l'éclat
            </Link>
          ) : (
            <span className="text-gold/30 text-xs uppercase tracking-[0.3em]">Collection en cours...</span>
          )}
        </div>
      </div>

      <div
        ref={rightPanelRef}
        onMouseMove={(e) => handleMouseMove(e, 'right')}
        className="relative w-1/2 h-full group overflow-hidden transition-all duration-500 ease-out"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian/20 to-obsidian z-10" />
        <img
          src={silverProd?.featuredImage || "https://via.placeholder.com/1920x1080?text=Silver+Universe"}
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-[3s] ease-out"
          alt="Argent Beldi"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-12 text-center">
          <h3 className="universe-card font-serif text-5xl md:text-7xl text-ivory mb-6 tracking-tight">{silverProd?.name || "L'âme artisanale"}</h3>
          <p className="universe-card text-muted max-w-xs font-light leading-relaxed mb-12 italic">
            {silverProd?.description || "L'héritage du Beldi marocain."}
          </p>
          {silverProd ? (
            <Link to={`/product/${silverProd.id}`} className="universe-card px-8 py-3 border border-ivory/30 text-ivory uppercase text-[10px] tracking-[0.3em] hover:bg-ivory hover:text-obsidian transition-all duration-700 inline-block">
              Découvrir l'héritage
            </Link>
          ) : (
            <span className="text-ivory/30 text-xs uppercase tracking-[0.3em]">Collection en cours...</span>
          )}
        </div>
      </div>
    </section>
  );
}
