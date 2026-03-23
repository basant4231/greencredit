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
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Leaf size={20} className="text-white" />
        </div>
        <div>
          <span className="block font-bold text-xl text-white tracking-tight">EcoCredit</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Dashboard
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${
                isActive
                ? "bg-emerald-600/10 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.15)]"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 p-3 w-full text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
