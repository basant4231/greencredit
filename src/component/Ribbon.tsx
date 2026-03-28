import React from 'react';
import { Leaf, Globe, Users, Award } from 'lucide-react';

const stats = [
  { label: "CO2 Offset (Tons)", value: "12,450", icon: <Leaf className="w-5 h-5 text-emerald-400" /> },
  { label: "Verified Projects", value: "582", icon: <Globe className="w-5 h-5 text-blue-400" /> },
  { label: "Active Users", value: "8,900+", icon: <Users className="w-5 h-5 text-emerald-400" /> },
  { label: "Credits Issued", value: "25.2k", icon: <Award className="w-5 h-5 text-blue-400" /> },
];

const StatsRibbon = () => {
  return (
    <div className="w-full bg-zinc-950 border-y border-zinc-900/50 py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-4 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 group-hover:border-emerald-500/30 transition-all duration-300 group-hover:scale-110">
                {stat.icon}
              </div>
              <div className="space-y-1">
                <span className="text-4xl font-bold text-white tracking-tight block">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsRibbon;
