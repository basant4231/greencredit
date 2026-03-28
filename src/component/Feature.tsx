import React from 'react';
import Link from 'next/link';
import { UserPlus, ClipboardCheck, Wallet, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Register Impact",
    description: "Create your profile and log sustainable activities like solar installation, tree planting, or waste reduction.",
    icon: <UserPlus className="w-10 h-10 text-emerald-400" />,
    color: "bg-emerald-500/10 text-emerald-400"
  },
  {
    id: "02",
    title: "Expert Verification",
    description: "Our system uses IoT data and expert review to verify your environmental impact against global standards.",
    icon: <ClipboardCheck className="w-10 h-10 text-emerald-400" />,
    color: "bg-emerald-500/10 text-emerald-400"
  },
  {
    id: "03",
    title: "Receive Credits",
    description: "Once verified, certified Green Credits are issued to your digital wallet, ready to be traded or held.",
    icon: <Wallet className="w-10 h-10 text-emerald-400" />,
    color: "bg-emerald-500/10 text-emerald-400"
  }
];

interface FeaturesProps {
  isLoggedIn?: boolean;
}

const Features = ({ isLoggedIn = false }: FeaturesProps) => {
  const sectionCta = isLoggedIn
    ? {
        title: "Ready to track your next green action?",
        description: "Open your activity workspace and keep building your verified impact history.",
        href: "/dashboard/activities",
        label: "Track Activity",
      }
    : {
        title: "Ready to start your first project?",
        description: "Join 5,000+ eco-enthusiasts making a difference.",
        href: "/signup",
        label: "Create Account",
      };

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-emerald-500">
              Process Flow
            </h2>
            <h3 className="text-4xl font-extrabold leading-tight text-white">
              A Transparent Path to <br />
              <span className="text-emerald-500">Environmental Value</span>
            </h3>
          </div>
          <p className="max-w-sm text-lg text-zinc-400">
            We bridge the gap between individual green actions and the global carbon market.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 top-1/2 hidden h-px w-full -z-0 bg-zinc-900 md:block" />

          {steps.map((step) => (
            <div
              key={step.id}
              className="group relative z-10 rounded-3xl border border-zinc-900 bg-zinc-900/50 backdrop-blur-sm p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30"
            >
              <div className="mb-8 flex items-start justify-between">
                <div className={`${step.color} rounded-2xl border border-white/5 p-4 transition-transform duration-300 group-hover:scale-110`}>
                  {step.icon}
                </div>
                <span className="select-none text-5xl font-black text-zinc-900 transition-colors group-hover:text-zinc-800">
                  {step.id}
                </span>
              </div>

              <h4 className="mb-4 text-2xl font-bold text-white">
                {step.title}
              </h4>
              <p className="mb-6 leading-relaxed text-zinc-400">
                {step.description}
              </p>

              <button className="flex items-center gap-2 text-sm font-bold text-emerald-500 transition-all group-hover:gap-3">
                Learn more <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-8 rounded-3xl border border-zinc-900 bg-gradient-to-r from-zinc-900 to-zinc-900/50 p-8 shadow-xl md:flex-row">
          <div className="text-center text-white md:text-left">
            <p className="mb-1 text-xl font-bold">{sectionCta.title}</p>
            <p className="text-emerald-500/70">{sectionCta.description}</p>
          </div>
          <Link
            href={sectionCta.href}
            className="whitespace-nowrap rounded-xl bg-emerald-500 px-8 py-4 font-black text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
          >
            {sectionCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
