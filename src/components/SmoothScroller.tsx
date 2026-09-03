"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function SmoothScroller() {
  useEffect(() => {
    // Lenis is loaded via global Script tag
    const initLenis = () => {
      if (typeof window !== "undefined" && (window as any).Lenis) {
        const lenis = new (window as any).Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: "vertical",
          gestureDirection: "vertical",
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 2,
        });

        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
          lenis.destroy();
        };
      }
    };

    // Retry initialization until the script is fully loaded
    const interval = setInterval(() => {
      if ((window as any).Lenis) {
        initLenis();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Script 
      src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js" 
      strategy="afterInteractive" 
    />
  );
}
