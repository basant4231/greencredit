"use client";
import { UserCircle, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
      <h2 className="text-slate-500 italic hidden sm:block">
        "Small steps, big impact."
      </h2>
      
      <div className="flex items-center gap-6 ml-auto">
        <button className="text-slate-400 hover:text-emerald-600 transition-colors">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="text-right">
            {/* Using the user's name from context */}
            <p className="text-sm font-bold text-slate-800">Basant Sharma</p>
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Eco Warrior</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
            <UserCircle className="text-slate-400" size={32} />
          </div>
        </div>
      </div>
    </header>
  );
}