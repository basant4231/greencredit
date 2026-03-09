import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

// Placeholder images - replace with your actual images
// You can use a service like Unsplash for free images
const bgImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
const treeImage = "https://images.unsplash.com/photo-1542601906990-b4d3fb77c35a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80";

export default function Hero() {
  return (
    <div className="relative w-full min-h-screen font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Green hills with wind turbines"
          fill
          className="object-cover brightness-75"
          priority
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center space-x-2">
        
        </div>
        <div>
        
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 text-center pb-36">
        <h1 className="text-5xl font-bold text-white md:text-7xl drop-shadow-lg">
          Sustainable Living<br />Starts Here
        </h1>
        <p className="max-w-2xl mt-6 text-lg text-gray-100 md:text-xl drop-shadow-md">
          Discover eco-friendly solutions and projects to help you reduce your carbon footprint,
          and make a positive impact on the planet—all without compromising.
        </p>
        <Link href="/learn-more" className="flex items-center px-6 py-3 mt-8 space-x-2 text-sm font-semibold text-black transition-all duration-300 bg-white rounded-full hover:bg-gray-100 hover:scale-105">
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Floating Cards */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 transform translate-y-1/3 pb-14">
        <div className="grid gap-6 mx-auto max-w-7xl md:grid-cols-2">
          
          {/* Card 1: Tree Planting Program */}
          <div className="flex p-5 space-x-5 transition-transform duration-300 border backdrop-blur-md bg-black/40 border-white/10 rounded-2xl hover:-translate-y-1">
            <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-xl">
              <Image
                src={treeImage}
                alt="People planting trees"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between flex-1 text-white">
              <div>
                <h3 className="text-xl font-bold">Tree Planting Program</h3>
                <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                  Join our global initiative, contribute to reforestation projects across Indonesia.
                </p>
              </div>
              <Link href="/programs/tree-planting" className="inline-flex items-center mt-3 space-x-1 text-sm font-medium text-lime-400 hover:text-lime-300">
                <span>Read More</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Testimonial */}
        {/* Replace the second card in Hero.tsx with this */}
<div className="flex flex-col justify-between p-6 transition-transform duration-300 border backdrop-blur-md bg-black/40 border-white/10 rounded-2xl hover:-translate-y-1">
  <div className="flex items-center gap-2 mb-2">
    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
      TRENDING ARTICLE
    </span>
  </div>
  <h3 className="text-white font-bold text-lg leading-tight mb-2">
    The Future of Carbon Markets: Why Individual Credits Matter in 2026
  </h3>
  <p className="text-xs text-gray-300 line-clamp-2 mb-4">
    Climate economist Dr. Aris Thorne explains how small-scale green actions are revolutionizing the global credit system...
  </p>
  <div className="flex items-center justify-between mt-auto">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white border border-white/20">
        AT
      </div>
      <span className="text-xs text-gray-400 font-medium">Dr. Aris Thorne</span>
    </div>
    <button className="text-lime-400 text-xs font-bold hover:underline">
      Read Article →
    </button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
