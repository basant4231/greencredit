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
      color: "text-emerald-600",
      icon: Leaf,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "CO2 Offset (kg)",
      value: co2,
      color: "text-sky-600",
      icon: Cloud,
      iconBg: "bg-sky-50 text-sky-600",
    },
    {
      label: "Energy Saved (kWh)",
      value: energy,
      color: "text-amber-600",
      icon: Zap,
      iconBg: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <h3 className={`mt-3 text-3xl font-bold ${card.color}`}>{card.value}</h3>
            </div>
            <div className={`rounded-2xl p-3 ${card.iconBg}`}>
              <card.icon size={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
