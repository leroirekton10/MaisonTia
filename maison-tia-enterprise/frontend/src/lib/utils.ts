import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes cleanly without conflicts or precedence bugs.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Triggers a luxury golden particle confetti explosion for VIP and booking celebrations.
 */
export function triggerGoldConfetti() {
  import("canvas-confetti").then((confettiModule) => {
    const confetti = confettiModule.default;
    // Gold and ivory luxury palette
    const colors = ["#D4AF37", "#FFF6D6", "#F3E5AB", "#AA7C11", "#FFFFFF"];

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors,
      disableForReducedMotion: true,
      shapes: ["circle", "square"],
      scalar: 1.1,
    });
  }).catch(() => {
    // Fallback silent
  });
}
