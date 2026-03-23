import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const bgImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
const treeImage = "https://images.unsplash.com/photo-1542601906990-b4d3fb77c35a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80";

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

  const projectCta = isLoggedIn
    ? { href: "/dashboard/activities", label: "Log Activity" }
    : { href: "/signup", label: "Join Program" };

  const articleCta = isLoggedIn
    ? { href: "/dashboard", label: "See Your Impact" }
    : { href: "/signup", label: "Create Account" };

  return (
    <div className="relative min-h-screen w-full font-sans">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Green hills with wind turbines"
          fill
          className="object-cover brightness-75"
          priority
        />
      </div>

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2"></div>
        <div></div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 pb-36 pt-20 text-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg md:text-7xl">
          Sustainable Living
          <br />
          Starts Here
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-100 drop-shadow-md md:text-xl">
          Discover eco-friendly solutions and projects to help you reduce your carbon footprint,
          and make a positive impact on the planet without compromising how you live.
        </p>
        <Link
          href={primaryCta.href}
          className="mt-8 flex items-center space-x-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-100"
        >
          <span>{primaryCta.label}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-sm text-emerald-100/90 drop-shadow-sm">{primaryCta.helper}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/3 px-4 pb-14">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <div className="flex space-x-5 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
              <Image
                src={treeImage}
                alt="People planting trees"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between text-white">
              <div>
                <h3 className="text-xl font-bold">Tree Planting Program</h3>
                <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                  Join our global initiative and contribute to reforestation projects that can grow into verified impact.
                </p>
              </div>
              <Link
                href={projectCta.href}
                className="mt-3 inline-flex items-center space-x-1 text-sm font-medium text-lime-400 hover:text-lime-300"
              >
                <span>{projectCta.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                TRENDING ARTICLE
              </span>
            </div>
            <h3 className="mb-2 text-lg font-bold leading-tight text-white">
              The Future of Carbon Markets: Why Individual Credits Matter in 2026
            </h3>
            <p className="mb-4 line-clamp-2 text-xs text-gray-300">
              Climate economist Dr. Aris Thorne explains how small-scale green actions are revolutionizing the global credit system.
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-emerald-700 text-xs font-bold text-white">
                  AT
                </div>
                <span className="text-xs font-medium text-gray-400">Dr. Aris Thorne</span>
              </div>
              <Link
                href={articleCta.href}
                className="inline-flex items-center gap-1 text-xs font-bold text-lime-400 hover:underline"
              >
                {articleCta.label}
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
