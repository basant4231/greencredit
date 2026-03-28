"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, History, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Activity Log", href: "/dashboard/activities", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-white/5 h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
          <Leaf size={20} className="text-zinc-950" />
        </div>
        <div>
          <span className="block font-bold text-xl text-zinc-100 tracking-tight">EcoCredit</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">
            Platform
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-2xl font-bold transition-all ${
                isActive
                ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/10"
                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-100"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 p-3 w-full text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all font-bold"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
