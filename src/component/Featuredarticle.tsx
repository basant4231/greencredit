import Image from "next/image";
import { ArrowRight, BookOpen, Quote } from "lucide-react";

export default function FeaturedArticle() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row">
        <div className="relative lg:w-1/2">
          <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
              alt="Green Tech Concept"
              width={1000}
              height={600}
              className="h-[450px] object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 -z-0 h-48 w-48 rounded-full bg-emerald-100 opacity-60 blur-2xl" />
        </div>

        <div className="lg:w-1/2">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-600">
            <BookOpen size={18} />
            <span className="uppercase tracking-widest">Deep Dive</span>
          </div>

          <h2 className="mb-6 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            Decentralizing Environmental Impact: The Rise of the &ldquo;Green Citizen&rdquo;
          </h2>

          <div className="relative mb-8 pl-8">
            <Quote className="absolute left-0 top-0 h-6 w-6 text-emerald-200" />
            <p className="text-lg italic leading-relaxed text-slate-700">
              &ldquo;We are moving away from a world where only big corporations can trade
              carbon. Your home solar panel is now a micro-power plant with tradeable
              assets.&rdquo;
            </p>
            <p className="mt-2 font-bold text-slate-900">- Dr. Aris Thorne, Eco Enthusiast</p>
          </div>

          <p className="mb-8 leading-relaxed text-slate-600">
            In this exclusive piece, we explore how the Green Credit Management platform is
            bridging the gap between individual effort and global markets. By using
            blockchain and IoT, your everyday actions like planting trees or using public
            transport become verified credits.
          </p>

          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition-all hover:bg-slate-800">
            Read the Full Story
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
