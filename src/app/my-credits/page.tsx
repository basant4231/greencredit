export default function CreditsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">My Credits</h1>
        <p className="mt-2 text-zinc-500 font-medium italic">Your contribution to a better world, quantified.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-[2rem] border border-white/5 bg-zinc-900/50 p-10 backdrop-blur-xl">
           <h3 className="text-xl font-bold text-white mb-6">Credit Balance</h3>
           <p className="text-6xl font-black text-emerald-500 mb-4 tracking-tight">1,240 <span className="text-2xl text-zinc-500 font-bold uppercase tracking-widest ml-2">EcoPoints</span></p>
           <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-sm">
             Your current balance reflects your consistent commitment to the planet. Continue with green actions to earn more.
           </p>
           <button className="w-full rounded-2xl bg-zinc-800 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-700">
             View Transaction History
           </button>
        </div>

        <div className="rounded-[2rem] border border-white/5 bg-zinc-900/50 p-10 backdrop-blur-xl relative overflow-hidden">
           <h3 className="text-xl font-bold text-white mb-6">Recent Earnings</h3>
           <div className="space-y-6">
             {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <p className="font-bold text-white">Action Reward #{i}</p>
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Completed Today</p>
                  </div>
                  <span className="text-emerald-500 font-black">+50</span>
                </div>
             ))}
           </div>
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
