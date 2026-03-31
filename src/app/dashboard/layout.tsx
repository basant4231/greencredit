"use client";
export const dynamic = 'force-dynamic';
import Navbar from "@/component/dashboard/Navbar";
import Sidebar from "@/component/dashboard/Sidebar";
import { outfit } from "@/lib/fonts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "greencredit-dashboard-theme";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      return storedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((currentValue) => !currentValue);
  };

  if (status === "loading") {
    return (
      <div className="dashboard-page flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#DDE9FF] border-t-[#465FFF]"></div>
          <p className="dashboard-text-secondary text-sm font-medium text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const hasSession = Boolean(session);
  const mainOffset = hasSession
    ? isCollapsed
      ? "lg:pl-[90px]"
      : "lg:pl-[290px]"
    : "";

  return (
    <div
      data-theme={isDarkMode ? "dark" : "light"}
      className={`${outfit.className} dashboard-shell dashboard-page min-h-screen bg-gray-50 text-gray-900 transition-colors`}
    >
      {hasSession && (
        <>
          <Sidebar
            mobileOpen={isMobileOpen}
            isCollapsed={isCollapsed}
            onClose={() => setIsMobileOpen(false)}
          />
          {isMobileOpen && (
            <button
              type="button"
              aria-label="Close sidebar overlay"
              className="dashboard-overlay fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
        </>
      )}

      <div className={`min-h-screen transition-[padding] duration-300 ${mainOffset}`}>
        {hasSession && (
          <Navbar
            userName={session?.user?.name || "Eco User"}
            userEmail={session?.user?.email || ""}
            userImage={session?.user?.image || null}
            isDarkMode={isDarkMode}
            onOpenSidebar={() => setIsMobileOpen(true)}
            onToggleCollapse={() => setIsCollapsed((value) => !value)}
            onToggleTheme={toggleTheme}
          />
        )}

        <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
