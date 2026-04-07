"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, ClipboardCheck, Wallet, ArrowRight } from "lucide-react";
import layoutStyles from "@/styles/marketing/LandingSection.module.css";

interface FeaturesProps {
  isLoggedIn?: boolean;
}

const smoothEase = [0.22, 1, 0.36, 1] as const;

const Features = ({ isLoggedIn = false }: FeaturesProps) => {
  const steps = [
    {
      id: "01",
      title: "Log Your Green Action",
      desc: "Record eligible work like tree planting, clean energy, recycling, or waste reduction.",
      icon: <UserPlus className="h-6 w-6" />,
      accent: "bg-emerald-600",
      surface: "border-emerald-200 bg-[#f2faf5] text-emerald-700",
    },
    {
      id: "02",
      title: "Verify Every Submission",
      desc: "Eco Credit reviews your evidence and supporting data so each action can be trusted.",
      icon: <ClipboardCheck className="h-6 w-6" />,
      accent: "bg-[#f56a6a]",
      surface: "border-[#f3c7ca] bg-[#fff6f7] text-[#d45757]",
    },
    {
      id: "03",
      title: "Receive Eco Credits",
      desc: "Approved actions are converted into credits that appear directly in your wallet.",
      icon: <Wallet className="h-6 w-6" />,
      accent: "bg-sky-600",
      surface: "border-sky-200 bg-[#f4faff] text-sky-700",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.95, ease: smoothEase },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.22, delayChildren: 0.12 },
    },
  };

  const ctaHref = isLoggedIn ? "/dashboard/activities" : "/signup";
  const ctaLabel = isLoggedIn ? "Open Dashboard" : "Create Account";
  const ctaDescription = isLoggedIn
    ? "Head back to your dashboard and keep your verified impact moving."
    : "Create an account and start building your verified impact record.";

  return (
    <section id="services" className="relative scroll-mt-24 bg-white py-24">
      <div className={layoutStyles.inner}>
        <div className={layoutStyles.separator} aria-hidden="true" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeIn}
          className="mb-20 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#7f888f]">Process Flow</h2>
            <h3 className="text-5xl font-black tracking-tight text-[#3d4449]">
              How Eco Credit turns <br /> action into reward
            </h3>
          </div>
          <p className="max-w-xs text-base leading-relaxed text-[#7f888f]">
            From submission to verification to earned credits, every step is designed to stay simple and transparent.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={fadeIn}
              className="group border border-[#bcc6cc] bg-white p-12 shadow-[0_14px_30px_rgba(61,68,73,0.05)] transition-all hover:-translate-y-1 hover:border-[#adb8c0] hover:bg-[#f6f8fa]"
            >
              <span className={`mb-8 block h-[3px] w-14 rounded-full ${step.accent}`} aria-hidden="true" />
              <div className="mb-10 flex items-center justify-between text-[#3d4449]">
                <span className={`flex h-12 w-12 items-center justify-center border ${step.surface}`}>
                  {step.icon}
                </span>
                <span className="text-sm font-bold tracking-widest text-[#7f888f]">STEP {step.id}</span>
              </div>
              <h4 className="mb-4 text-xl font-bold text-[#3d4449]">{step.title}</h4>
              <p className="text-sm leading-relaxed text-[#7f888f]">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.95, delay: 0.28, ease: smoothEase }}
          className="mt-20 flex flex-col items-center justify-between border border-[#bcc6cc] bg-[#f6f8fa] p-10 shadow-[0_14px_30px_rgba(61,68,73,0.04)] md:flex-row"
        >
          <div className="text-center md:text-left">
            <p className="text-xl font-bold text-[#3d4449]">Ready to earn your first Eco Credits?</p>
            <p className="text-sm text-[#7f888f]">{ctaDescription}</p>
          </div>
          <Link href={ctaHref} className="mt-8 flex items-center gap-3 bg-[#3d4449] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-black md:mt-0">
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
