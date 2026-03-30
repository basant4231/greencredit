"use client";

import Link from "next/link";
import { useRef } from "react";
import { oswald, sourceSans } from "@/lib/fonts";
import { useParallaxBackground } from "@/hooks/useParallaxBackground";
import styles from "@/styles/marketing/Hero.module.css";
import backgroundHero from "@/images/background_hero.png";

interface HeroProps {
  isLoggedIn?: boolean;
}

export default function Hero({ isLoggedIn = false }: HeroProps) {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  useParallaxBackground(backgroundRef, { speed: 0.5 });

  const primaryCta = isLoggedIn
    ? {
        href: "/dashboard",
        label: "Open Dashboard",
      }
    : {
        href: "/signup",
        label: "Create Account",
      };

  return (
    <section id="home" className={styles.section}>
      <div
        ref={backgroundRef}
        className={styles.background}
        style={{ backgroundImage: `url(${backgroundHero.src})` }}
        aria-hidden="true"
      />

      <div className={styles.content}>
        <h1 className={`${oswald.className} ${styles.title}`}>Welcome to EcoCredit</h1>
        <p className={`${sourceSans.className} ${styles.subtitle}`}>
          Earn green credits for the revolution
        </p>
        <p className={`${sourceSans.className} ${styles.description}`}>
          Track sustainable actions, verify their impact, and build real environmental value
          through one clean digital platform.
          {!isLoggedIn && (
            <>
              {" "}
              Already have an account?{" "}
              <Link href="/login" className={styles.inlineLink}>
                Sign in
              </Link>
              .
            </>
          )}
        </p>

        <Link href={primaryCta.href} className={`${oswald.className} ${styles.button}`}>
          {primaryCta.label}
        </Link>
      </div>
    </section>
  );
}
