"use client";

import { motion } from "framer-motion";
import layoutStyles from "@/styles/marketing/LandingSection.module.css";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const StatsRibbon = () => {
  const stats = [
    {
      value: "12,450",
      label: "Carbon Impact",
      subtitle: "Tons of CO2e linked to verified actions *",
      accent: "bg-emerald-600",
      surface: "from-[#f3fbf5]",
    },
    {
      value: "582",
      label: "Verified Submissions",
      subtitle: "Activities and projects reviewed on Eco Credit *",
      accent: "bg-[#f56a6a]",
      surface: "from-[#fff6f6]",
    },
    {
      value: "8,900+",
      label: "Community Members",
      subtitle: "People tracking their green actions with us *",
      accent: "bg-sky-600",
      surface: "from-[#f4faff]",
    },
    {
      value: "25.2k",
      label: "Eco Credits Earned",
      subtitle: "Reward units issued to user wallets *",
      accent: "bg-emerald-600",
      surface: "from-[#f6fbf4]",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.22, delayChildren: 0.16 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: smoothEase },
    },
  };

  return (
    <motion.section
      id="impact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="w-full bg-white py-24"
    >
      <div className={layoutStyles.inner}>
        <div className={layoutStyles.separator} aria-hidden="true" />

        <motion.h2
          variants={itemVariants}
          className="mb-14 text-center text-4xl font-black tracking-tight text-[#3d4449]"
        >
          Eco Credit at a glance
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`flex flex-col items-center justify-center border border-[#bcc6cc] bg-gradient-to-b ${stat.surface} to-white px-6 py-16 text-center shadow-[0_14px_30px_rgba(61,68,73,0.05)] transition-all hover:-translate-y-1 hover:border-[#adb8c0] hover:bg-[#f6f8fa]`}
            >
              <span className={`mb-6 block h-[3px] w-14 rounded-full ${stat.accent}`} aria-hidden="true" />
              <span className="mb-2 text-6xl font-extrabold tracking-tight text-[#3d4449]">{stat.value}</span>
              <span className="mb-1 text-lg font-bold text-[#3d4449]">{stat.label}</span>
              <span className="text-sm text-[#7f888f]">{stat.subtitle}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatsRibbon;
