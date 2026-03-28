import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Shield, Globe, ArrowUpRight } from 'lucide-react';

const bgImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

interface HeroProps {
  isLoggedIn?: boolean;
}

export default function Hero({ isLoggedIn = false }: HeroProps) {
  const primaryCta = isLoggedIn
    ? {
        href: "/dashboard",
        label: "Open Dashboard",
        helper: "Pick up where you left off and review your latest verified impact.",
      }
    : {
        href: "/signup",
        label: "Create Account",
        helper: "Start logging eco actions and turn them into verified green credits.",
      };

  return (
    <div className="relative min-h-screen w-full font-sans overflow-hidden bg-zinc-950">
      {/* Visual Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Green hills with wind turbines"
          fill
          className="object-cover opacity-20 grayscale brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-emerald-500/10 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-48 text-center max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Global Carbon Network 2026</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[1.1] mb-8">
          Sustainable Living <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Starts With You</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed mb-12">
          Bridge the gap between individual green actions and the global carbon market.
          Verified impacts, real credits, one platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link
            href={primaryCta.href}
            className="group relative flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20"
          >
            <span>{primaryCta.label}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/marketplace"
            className="group flex items-center gap-3 px-8 py-4 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/10"
          >
            Explore Market
            <ArrowUpRight size={20} className="text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <p className="mt-8 text-sm text-zinc-500 font-medium italic">
          {primaryCta.helper}
        </p>
      </div>

      {/* Feature Grid Floating at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/4 px-6 z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Leaf />, title: "Verified Action", desc: "Every tree planted, every kWh saved is verified." },
            { icon: <Shield />, title: "Blockchain Trust", desc: "Immutable records for your environmental assets." },
            { icon: <Globe />, title: "Global Reach", desc: "Trade credits in a worldwide carbon economy." }
          ].map((item, i) => (
            <div key={i} className="glass p-8 rounded-3xl group hover:border-emerald-500/50 transition-all duration-500">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 w-fit mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
