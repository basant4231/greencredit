import React from 'react';
import { Cloud, Coins, Zap, Trophy } from "lucide-react";



export default function StatCards({ credits, co2, energy }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-500">Total Credits</p>
        <h3 className="text-2xl font-bold text-emerald-600">{credits}</h3>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-500">CO2 Offset (kg)</p>
        <h3 className="text-2xl font-bold text-blue-600">{co2}</h3>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-500">Energy Saved (kWh)</p>
        <h3 className="text-2xl font-bold text-amber-600">{energy}</h3>
      </div>
    </div>
  );
}