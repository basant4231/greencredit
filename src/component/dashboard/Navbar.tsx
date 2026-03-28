"use client";
import { UserCircle, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 bg-zinc-950/50 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
      <h2 className="text-zinc-500 italic font-medium hidden sm:block">
        &ldquo;Small steps, big impact.&rdquo;
      </h2>

      <div className="flex items-center gap-6 ml-auto">
        <button className="text-zinc-500 hover:text-emerald-500 transition-colors">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-100 tracking-tight">Basant Sharma</p>
            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Eco Warrior</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
            <UserCircle className="text-zinc-500" size={32} />
          </div>
        </div>
      </div>
    </header>
  );
}
