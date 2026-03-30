"use client";

import { ReactNode, useRef } from "react";
import backgroundHero from "@/images/background_hero.png";
import { useParallaxBackground } from "@/hooks/useParallaxBackground";
import styles from "@/styles/auth/AuthHero.module.css";

interface AuthHeroProps {
  children: ReactNode;
}

export default function AuthHero({ children }: AuthHeroProps) {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  useParallaxBackground(backgroundRef, { speed: 0.2 });

  return (
    <section className={styles.section}>
      <div
        ref={backgroundRef}
        className={styles.background}
        style={{ backgroundImage: `url(${backgroundHero.src})` }}
        aria-hidden="true"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>{children}</div>
    </section>
  );
}
