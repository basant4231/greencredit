export default function AnalyticsPage() {
  return (
    <div className="space-y-12 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Analytics Dashboard</h1>
        <p className="mt-2 text-zinc-500 font-medium italic">Visualize your impact on the environment over time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'CO2 Offset', value: '45.2 kg', trend: '+12%', color: 'text-emerald-500' },
          { label: 'Energy Saved', value: '124 kWh', trend: '+8%', color: 'text-blue-500' },
          { label: 'Water Conserved', value: '1.2k L', trend: '+15%', color: 'text-cyan-500' },
          { label: 'Active Days', value: '12 Days', trend: '+20%', color: 'text-zinc-500' }
        ].map((stat, i) => (
          <div key={i} className="rounded-[2rem] border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-xl">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-4">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color} mb-2`}>{stat.value}</p>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-widest">{stat.trend}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-[2.5rem] border border-white/5 bg-zinc-900/50 p-10 backdrop-blur-xl relative overflow-hidden h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Growth Over Time</h3>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-full h-1/2 flex items-end justify-around px-10">
                {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
                  <div key={i} className="w-6 rounded-t-xl bg-zinc-800 transition-all duration-1000" style={{ height: `${h}%` }}>
                     <div className="w-full h-full bg-emerald-500/20 rounded-t-xl border-t-2 border-emerald-500" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-1 rounded-[2.5rem] border border-white/5 bg-zinc-900/50 p-10 backdrop-blur-xl relative overflow-hidden flex flex-col justify-center">
          <h3 className="text-xl font-bold text-white mb-10 text-center">Efficiency Score</h3>
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border-[16px] border-zinc-800" />
             <div className="absolute inset-0 rounded-full border-[16px] border-emerald-500/20 border-t-emerald-500 animate-spin-slow rotate-[45deg]" />
             <span className="text-4xl font-black text-white">88%</span>
          </div>
          <p className="text-zinc-500 text-sm text-center mt-10 font-medium">You are outperforming 82% of other green contributors this month.</p>
        </div>
      </div>
    </div>
  );
}
