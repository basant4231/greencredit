export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Marketplace</h1>
        <p className="mt-2 text-zinc-500 font-medium italic">Exchange your credits for sustainable products and services.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-xl transition-all hover:border-emerald-500/20">
            <div className="aspect-video mb-6 overflow-hidden rounded-2xl bg-zinc-800">
              <div className="flex h-full w-full items-center justify-center text-zinc-700 font-bold uppercase tracking-widest">Product Image</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sustainable Item #{i}</h3>
            <p className="text-zinc-400 text-sm mb-6">High-quality eco-friendly product to help you maintain a green lifestyle.</p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-500 font-bold">{i * 100} Credits</span>
              <button className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 transition-all hover:bg-emerald-400">
                Redeem
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
