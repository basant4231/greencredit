import { BadgeCheck, Cloud, Leaf, Zap } from "lucide-react";

interface StatCardsProps {
  credits: number;
  co2: number;
  energy: number;
  approvedCount: number;
  monthlyCredits: number;
  pendingCount: number;
  totalActivities: number;
}

function formatMetric(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(value);
}

export default function StatCards({
  credits,
  co2,
  energy,
  approvedCount,
  monthlyCredits,
  pendingCount,
  totalActivities,
}: StatCardsProps) {
  const cards = [
    {
      label: "Eco Credits",
      value: formatMetric(credits),
      detail: `${formatMetric(monthlyCredits)} earned in the last 30 days`,
      color: "dashboard-text-primary text-gray-800",
      icon: Leaf,
      iconBg: "dashboard-icon-surface bg-gray-100 text-gray-800",
      badgeClass: "bg-[#ECF3FF] text-[#465FFF]",
      badgeText: "Live",
    },
    {
      label: "CO2 Offset (kg)",
      value: formatMetric(co2),
      detail: `${totalActivities} total actions tracked`,
      color: "dashboard-text-primary text-gray-800",
      icon: Cloud,
      iconBg: "dashboard-icon-surface bg-gray-100 text-gray-800",
      badgeClass: "bg-[#ECF3FF] text-[#465FFF]",
      badgeText: "Trend",
    },
    {
      label: "Energy Saved (kWh)",
      value: formatMetric(energy),
      detail: "Calculated from your approved submissions",
      color: "dashboard-text-primary text-gray-800",
      icon: Zap,
      iconBg: "dashboard-icon-surface bg-gray-100 text-gray-800",
      badgeClass: "bg-[#ECF3FF] text-[#465FFF]",
      badgeText: "Usage",
    },
    {
      label: "Approved Actions",
      value: formatMetric(approvedCount),
      detail: pendingCount > 0 ? `${pendingCount} waiting for review` : "Nothing waiting in review",
      color: "dashboard-text-primary text-gray-800",
      icon: BadgeCheck,
      iconBg: "dashboard-icon-surface bg-gray-100 text-gray-800",
      badgeClass: pendingCount > 0 ? "bg-[#FEF3F2] text-[#D92D20]" : "bg-[#ECFDF3] text-[#039855]",
      badgeText: pendingCount > 0 ? "Review" : "Stable",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="dashboard-surface rounded-2xl border border-gray-200 bg-white p-5 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] transition-transform duration-300 hover:-translate-y-0.5 md:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}>
              <card.icon size={20} />
            </div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${card.badgeClass}`}>
              {card.badgeText}
            </span>
          </div>

          <div className="mt-5">
            <p className="dashboard-text-secondary text-sm text-gray-500">{card.label}</p>
            <h3 className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</h3>
            <p className="dashboard-text-secondary mt-2 max-w-[16rem] text-sm text-gray-500">{card.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
