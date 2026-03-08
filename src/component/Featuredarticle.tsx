// src/components/FeaturedArticle.tsx
import Image from 'next/image';
import { ArrowRight, BookOpen, Quote } from 'lucide-react';

export default function FeaturedArticle() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Article Image & Visuals */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                alt="Green Tech Concept" 
                width={1000} 
                height={600}
                className="object-cover h-[450px]"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-100 rounded-full -z-0 blur-2xl opacity-60" />
          </div>

          {/* Article Content */}
          <div className="lg:w-1/2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
              <BookOpen size={18} />
              <span className="tracking-widest uppercase">Deep Dive</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Decentralizing Environmental Impact: The Rise of the "Green Citizen"
            </h2>

            <div className="relative pl-8 mb-8">
              <Quote className="absolute left-0 top-0 text-emerald-200 w-6 h-6" />
              <p className="text-lg text-slate-700 italic leading-relaxed">
                "We are moving away from a world where only big corporations can trade carbon. Your home solar panel is now a micro-power plant with tradeable assets."
              </p>
              <p className="mt-2 font-bold text-slate-900">— Dr. Aris Thorne, Eco Enthusiast</p>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed">
              In this exclusive piece, we explore how the **Green Credit Management** platform is bridging the gap between individual effort and global markets. By using blockchain and IoT, your everyday actions—like planting trees or using public transport—become verified credits.
            </p>

            <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
              Read the Full Story
              <ArrowRight size={18} />
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}