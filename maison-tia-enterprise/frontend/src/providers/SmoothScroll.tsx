"use client";

import { type ReactNode, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // ── Critical integration: sync Lenis → GSAP ScrollTrigger ──
    // On every Lenis scroll tick, tell ScrollTrigger to re-evaluate
    // all triggers. Without this, pinned sections consume wheel events
    // via Lenis but GSAP never sees them → the scroll appears "stuck".
    lenis.on("scroll", ScrollTrigger.update);

    // Let GSAP's ticker drive Lenis instead of a raw rAF loop.
    // This ensures both systems share the exact same frame timing.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP gives seconds, Lenis expects ms
    });

    // Disable GSAP's internal lag-smoothing so it doesn't fight Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(lenis.raf as any);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
