import { Train, TreeDeciduous, ArrowRight } from "lucide-react";
import ActivityCard from "@/component/dashboard/ActivityCard";

export default function ActivitiesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <section className="relative overflow-hidden bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
            Choose your next <br/>
            <span className="text-emerald-500">green action.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Contributing to the environment isn&apos;t a massive task. You can simply integrate small,
            meaningful actions into your daily life that lead to a sustainable future for everyone.
          </p>
          <div className="flex items-center gap-4 text-emerald-500 font-bold">
            <span className="uppercase text-xs tracking-widest">Scroll to explore activities</span>
            <ArrowRight className="animate-bounce-x" size={20} />
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </section>

      <div className="space-y-8">
        <ActivityCard
          type="Metro"
          title="Taking the Metro"
          icon={<Train size={24} />}
          description="From the first tracks laid in Delhi's expanding suburbs to the bustling, tech-powered networks now weaving over 20 Indian cities, the metro is a symbol of urban awakening. Choosing the metro reduces city congestion and reshapes our skylines into cleaner environments."
          image="https://images.unsplash.com/photo-1568992688065-536aad8a12f6?auto=format&fit=crop&q=80&w=800"
          accentColor="bg-zinc-900/40"
          borderColor="border-white/5"
          buttonColor="bg-emerald-500 hover:bg-emerald-600"
        />

        <ActivityCard
          type="Planting"
          title="Home Plantation"
          icon={<TreeDeciduous size={24} />}
          description="Transform your living space into a micro-oxygen hub. Maintaining a small plantation area helps in natural air purification and significantly increases local biodiversity. It's a lifeline pulsing through the heart of your home, contributing daily to the global ecosystem."
          image="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800"
          accentColor="bg-zinc-900/40"
          borderColor="border-white/5"
          buttonColor="bg-emerald-500 hover:bg-emerald-600"
        />
      </div>
    </div>
  );
}
