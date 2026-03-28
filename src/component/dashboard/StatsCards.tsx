import { Leaf, Cloud, Zap } from "lucide-react";

interface StatCardsProps {
  credits: number;
  co2: number;
  energy: number;
}

export default function StatCards({ credits, co2, energy }: StatCardsProps) {
  const cards = [
    {
      label: "Total Credits",
      value: credits,
      color: "text-emerald-500",
      icon: Leaf,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: "CO2 Offset (kg)",
      value: co2,
      color: "text-emerald-500",
      icon: Cloud,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: "Energy Saved (kWh)",
      value: energy,
      color: "text-emerald-500",
      icon: Zap,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-xl transition-all hover:border-emerald-500/30"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{card.label}</p>
              <h3 className={`mt-3 text-3xl font-bold tracking-tight ${card.color}`}>{card.value}</h3>
            </div>
            <div className={`rounded-2xl p-3 ring-1 ring-white/5 ${card.iconBg}`}>
              <card.icon size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
