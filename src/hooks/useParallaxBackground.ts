"use client";

import { RefObject, useEffect } from "react";

interface UseParallaxBackgroundOptions {
  cullOffset?: number;
  mobileBreakpoint?: number;
  speed?: number;
}

export function useParallaxBackground(
  ref: RefObject<HTMLDivElement | null>,
  {
    cullOffset = 300,
    mobileBreakpoint = 768,
    speed = 0.35,
  }: UseParallaxBackgroundOptions = {}
) {
  useEffect(() => {
    const background = ref.current;

    if (!background) {
      return;
    }

    const isMobile = () => window.innerWidth <= mobileBreakpoint;
    let ticking = false;

    const updateParallax = () => {
      const hero = background.parentElement;

      if (!hero || isMobile()) {
        background.style.transform = "translate3d(0,0,0)";
        ticking = false;
        return;
      }

      const rect = hero.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom < -cullOffset || rect.top > windowHeight + cullOffset) {
        ticking = false;
        return;
      }

      const sectionCenterY = rect.top + rect.height / 2;
      const viewportCenterY = windowHeight / 2;
      const offset = sectionCenterY - viewportCenterY;
      const totalTravel = windowHeight + rect.height;
      const normalized = Math.max(-1, Math.min(1, offset / (totalTravel / 2)));
      const translateY = normalized * windowHeight * speed;

      background.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    updateParallax();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateParallax);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateParallax);
    };
  }, [cullOffset, mobileBreakpoint, ref, speed]);
}
