"use client";
import Sidebar from "@/component/dashboard/Sidebar";
import { useSession } from "next-auth/react"; // Import the hook to check login status

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession(); // Get session and loading status

  // Optional: Prevent layout jumping by showing a subtle loading state
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      
      {/* 1. CONDITIONAL SIDEBAR */}
      {/* This only renders if the user is authenticated */}
      {session && (
        <div className="hidden md:flex flex-col h-full border-r border-slate-800 bg-slate-900 overflow-y-auto scrollbar-hide">
          <Sidebar />
        </div>
      )}

      {/* 2. INDEPENDENT MAIN AREA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <main className="p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}