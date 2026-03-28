import Image from "next/image";
import { ArrowRight, BookOpen, Quote, Calendar, User } from "lucide-react";

export default function FeaturedArticle() {
  return (
    <section className="relative bg-zinc-950 py-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Image side with decorative elements */}
          <div className="relative lg:w-1/2 w-full">
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-zinc-800 shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
                alt="Green Tech Concept"
                width={1000}
                height={600}
                className="h-[500px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl border border-white/10 backdrop-blur-md">
                 <div className="flex items-center gap-4 text-white/80 text-sm mb-2">
                    <span className="flex items-center gap-1"><Calendar size={14} className="text-emerald-400" /> Oct 24, 2026</span>
                    <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                    <span className="flex items-center gap-1"><User size={14} className="text-emerald-400" /> Research Team</span>
                 </div>
                 <p className="text-white font-semibold line-clamp-1">Technology meets sustainability in the new digital era.</p>
              </div>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
          </div>

          {/* Content side */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6">
              <BookOpen size={14} />
              Deep Dive
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-white mb-8">
              Decentralizing Impact: The Rise of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">&ldquo;Green Citizen&rdquo;</span>
            </h2>

            <div className="relative mb-10 pl-10 border-l-2 border-emerald-500/30">
              <Quote className="absolute -left-3 -top-2 h-8 w-8 text-emerald-500/20" />
              <p className="text-xl italic leading-relaxed text-zinc-300">
                &ldquo;We are moving away from a world where only big corporations can trade
                carbon. Your home solar panel is now a micro-power plant with tradeable
                assets.&rdquo;
              </p>
              <p className="mt-4 font-bold text-emerald-400">— Dr. Aris Thorne, Eco Enthusiast</p>
            </div>

            <p className="text-lg leading-relaxed text-zinc-400 mb-10">
              In this exclusive piece, we explore how the Green Credit Management platform is
              bridging the gap between individual effort and global markets. By using
              blockchain and IoT, your everyday actions like planting trees or using public
              transport become verified credits.
            </p>

            <button className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-zinc-950 font-bold transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95">
              Read the Full Story
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
