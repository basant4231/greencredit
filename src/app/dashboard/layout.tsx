"use client";
export const dynamic = 'force-dynamic';
import Sidebar from "@/component/dashboard/Sidebar";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-800 border-t-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100">
      {session && (
        <div className="hidden md:flex flex-col h-full border-r border-white/5 bg-zinc-900/50 backdrop-blur-xl overflow-y-auto scrollbar-hide">
          <Sidebar />
        </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <main className="w-full max-w-7xl mx-auto px-5 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
