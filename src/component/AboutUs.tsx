"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import bannerImage from "@/images/banner_image.webp";
import { openSans, robotoSlab } from "@/lib/fonts";
import styles from "@/styles/marketing/AboutUs.module.css";

export default function AboutUs() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.95,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section id="about" className={styles.section}>
      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        <div className={styles.banner}>
          <motion.div className={styles.content} variants={itemVariants}>
            <header className={styles.header}>
              <h1 className={`${robotoSlab.className} ${styles.title}`}>
                Welcome to EcoCredit
                <br />
                by Basant Sharma
              </h1>
              <p className={`${robotoSlab.className} ${styles.subtitle}`}>
                A free app to earn credits for the green revolution
              </p>
            </header>

            <p className={`${openSans.className} ${styles.description}`}>
              EcoCredit is a simple platform for people who want their sustainable actions
              to count. It helps users record green activities, understand their impact,
              and earn credits that encourage wider participation in a cleaner and more
              responsible future.
            </p>

            <ul className={styles.actions}>
              <li>
                <Link
                  href="#services"
                  className={`${robotoSlab.className} ${styles.button} ${styles.buttonLarge}`}
                >
                  Learn More
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.span className={styles.image} variants={itemVariants}>
            <Image
              src={bannerImage}
              alt="EcoCredit banner image"
              sizes="(max-width: 980px) 100vw, 50vw"
              className={styles.imageAsset}
            />
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
