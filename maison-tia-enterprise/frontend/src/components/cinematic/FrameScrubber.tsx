import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FrameScrubberProps {
  frameCount?: number;
  imagePath?: string;
}

export default function FrameScrubber({
  frameCount = 100,
  imagePath = "/assets/frames/hero/frame_%d.jpg",
}: FrameScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Smooth lerp frame state
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  // 1. Preload & Decode Image Sequence
  useEffect(() => {
    let isCancelled = false;

    const loadSequence = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let successCounter = 0;

      for (let i = 1; i <= frameCount; i++) {
        if (isCancelled) return;
        const img = new Image();
        img.src = imagePath.replace("%d", i.toString());

        try {
          if (img.decode) {
            await img.decode().catch(() => {});
          } else {
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }
        } catch (e) {
          // Fallback image load
        }

        loadedImages.push(img);
        successCounter++;
        setLoadedCount(successCounter);
      }

      if (!isCancelled) {
        imagesRef.current = loadedImages;
        setIsReady(true);
      }
    };

    loadSequence();

    return () => {
      isCancelled = true;
    };
  }, [frameCount, imagePath]);

  // 2. Continuous 60 FPS Render Loop with Smooth Frame Interpolation (Lerp)
  useEffect(() => {
    if (!isReady || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !container || !sticky) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animFrameId: number;
    let lastRenderedFrame = -1;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      lastRenderedFrame = -1;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawFrame = (frameIdx: number) => {
      const img = imagesRef.current[frameIdx];
      if (!img || !img.naturalWidth) return;

      const cw = canvas.width;
      const ch = canvas.height;

      const hRatio = cw / img.naturalWidth;
      const vRatio = ch / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);

      const drawW = img.naturalWidth * ratio;
      const drawH = img.naturalHeight * ratio;
      const offsetX = (cw - drawW) / 2;
      const offsetY = (ch - drawH) / 2;

      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    // 60 FPS Lerp Loop for butter-smooth frame scrubbing
    const renderLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.15;

      const roundedFrame = Math.min(
        imagesRef.current.length - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      if (roundedFrame !== lastRenderedFrame) {
        drawFrame(roundedFrame);
        lastRenderedFrame = roundedFrame;
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    // ── Non-blocking Native Sticky ScrollTrigger ──
    // Uses natural container scroll range with CSS sticky. Zero wheel hijacking, zero freezing.
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        const progress = self.progress;
        const frameIdx = progress * (imagesRef.current.length - 1);
        targetFrameRef.current = frameIdx;

        // Update progress bar
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${progress})`;
        }

        // Animate overlay text based on progress
        if (overlayRef.current) {
          const children = overlayRef.current.children;

          // Title badge: visible 0–80%
          const badge = children[0] as HTMLElement;
          if (badge) {
            const badgeOpacity =
              progress < 0.1
                ? progress / 0.1
                : progress > 0.85
                ? 1 - (progress - 0.85) / 0.15
                : 1;
            badge.style.opacity = String(Math.max(0, badgeOpacity));
            badge.style.transform = `translateY(${(1 - Math.min(1, progress / 0.1)) * 15}px)`;
          }

          // Main heading: visible 5–90%
          const heading = children[1] as HTMLElement;
          if (heading) {
            const headingOpacity =
              progress < 0.08
                ? (progress - 0.02) / 0.06
                : progress > 0.88
                ? 1 - (progress - 0.88) / 0.12
                : 1;
            heading.style.opacity = String(Math.max(0, headingOpacity));
            heading.style.transform = `translateY(${(1 - Math.min(1, Math.max(0, progress - 0.02) / 0.08)) * 20}px)`;
          }

          // Subtitle: visible 10–92%
          const subtitle = children[2] as HTMLElement;
          if (subtitle) {
            const subOpacity =
              progress < 0.12
                ? (progress - 0.06) / 0.06
                : progress > 0.9
                ? 1 - (progress - 0.9) / 0.1
                : 1;
            subtitle.style.opacity = String(Math.max(0, subOpacity));
            subtitle.style.transform = `translateY(${(1 - Math.min(1, Math.max(0, progress - 0.06) / 0.08)) * 15}px)`;
          }
        }

        // Fade out scroll hint
        if (hintRef.current) {
          hintRef.current.style.opacity = String(Math.max(0, 1 - progress * 4));
        }
      },
    });

    return () => {
      cancelAnimationFrame(animFrameId);
      st.kill();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isReady]);

  return (
    <section ref={containerRef} className="relative w-full h-[220vh] bg-[#030303]">
      {/* Sticky Fullscreen Frame Display */}
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-[#030303]">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{
            opacity: isReady ? 1 : 0.4,
            transition: "opacity 0.7s ease-out",
          }}
        />

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/30 via-transparent to-[#030303]/30 pointer-events-none" />

        {/* Gold progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-30 bg-[#D4AF37]/10">
          <div
            ref={progressBarRef}
            className="h-full origin-left"
            style={{
              background: "linear-gradient(90deg, #D4AF37 0%, #FFF6D6 50%, #D4AF37 100%)",
              transform: "scaleX(0)",
              transition: "none",
              boxShadow: "0 0 12px rgba(212, 175, 55, 0.6)",
            }}
          />
        </div>

        {/* Floating Overlay Text */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center z-10"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-1.5 luxury-glass border-[#D4AF37]/30 mb-6"
            style={{ opacity: 0 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#FFF6D6] font-semibold">
              Cinématique Haute Joaillerie
            </span>
          </div>

          <h2
            className="font-serif text-4xl sm:text-7xl text-[#FDFBF7] font-light max-w-4xl leading-[1.1] mb-4"
            style={{ opacity: 0 }}
          >
            L'Alliance de la <br />
            <span className="gold-gradient-text italic font-serif">Pureté &amp; du Geste</span>
          </h2>

          <p
            className="text-xs sm:text-sm text-[#FDFBF7]/70 font-light tracking-widest uppercase"
            style={{ opacity: 0 }}
          >
            Savoir-faire éco-responsable &amp; orfèvrerie marocaine
          </p>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity pointer-events-none"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/80 font-light">
            Défiler pour explorer
          </span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-[#D4AF37] to-transparent animate-bounce" />
        </div>

        {/* Loading indicator */}
        {!isReady && (
          <div className="absolute bottom-10 right-10 luxury-glass px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] animate-pulse">
            Chargement Cinématique ({Math.round((loadedCount / frameCount) * 100)}%)
          </div>
        )}

        {/* Subtle gold halo */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-[5]"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 70%)",
          }}
        />
      </div>
    </section>
  );
}
