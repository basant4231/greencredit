import React from 'react';
import { Leaf, Globe, Users, Award } from 'lucide-react';

const stats = [
  { label: "CO2 Offset (Tons)", value: "12,450", icon: <Leaf className="w-5 h-5 text-emerald-400" /> },
  { label: "Verified Projects", value: "582", icon: <Globe className="w-5 h-5 text-blue-400" /> },
  { label: "Active Users", value: "8,900+", icon: <Users className="w-5 h-5 text-purple-400" /> },
  { label: "Credits Issued", value: "25.2k", icon: <Award className="w-5 h-5 text-lime-400" /> },
];

const StatsRibbon = () => {
  return (
    <div className="w-full bg-slate-900 border-y border-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-3 p-3 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                {stat.icon}
              </div>
              <span className="text-3xl font-black text-white mb-1">
                {stat.value}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsRibbon;