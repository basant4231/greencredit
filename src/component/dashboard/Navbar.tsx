"use client";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  Search,
  Settings,
  Sun,
  UserCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  userName: string;
  userEmail: string;
  userImage: string | null;
  isDarkMode: boolean;
  onOpenSidebar: () => void;
  onToggleCollapse: () => void;
  onToggleTheme: () => void;
}

export default function Navbar({
  userName,
  userEmail,
  userImage,
  isDarkMode,
  onOpenSidebar,
  onToggleCollapse,
  onToggleTheme,
}: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const firstLetter = userName.trim().charAt(0).toUpperCase() || "G";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      onToggleCollapse();
      return;
    }

    onOpenSidebar();
  };

  return (
    <header className="dashboard-topbar-surface sticky top-0 z-30 flex w-full border-b border-gray-200 bg-white transition-colors">
      <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="dashboard-topbar-surface flex w-full items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6 lg:w-auto lg:flex-1 lg:border-b-0 lg:border-b-transparent lg:px-0 lg:py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSidebarToggle}
              className="dashboard-outline-btn flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition lg:h-11 lg:w-11"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>

            <label className="dashboard-input-shell relative hidden rounded-lg border border-gray-200 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] lg:block">
              <span className="dashboard-text-secondary pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Search size={18} />
              </span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search or type command..."
                className="dashboard-input-field h-11 w-[430px] rounded-lg border border-transparent bg-transparent py-2.5 pl-11 pr-16 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#465FFF] focus:outline-none focus:ring-4 focus:ring-[#465FFF]/10"
              />
              <span className="dashboard-chip-muted absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-500">
                Ctrl K
              </span>
            </label>
          </div>

          <button
            type="button"
            className="dashboard-outline-btn flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition lg:hidden"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-4 sm:px-6 lg:px-0 lg:py-4">
          <button
            type="button"
            onClick={onToggleTheme}
            className="dashboard-outline-btn relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            className="dashboard-outline-btn relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition"
            aria-label="Notifications"
          >
            <span className="absolute right-0 top-0.5 flex h-2 w-2 rounded-full bg-orange-400">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
            </span>
            <Bell size={18} />
          </button>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((value) => !value)}
              className="dashboard-text-primary flex items-center gap-3 text-gray-700"
              aria-label="Open profile menu"
              aria-expanded={isProfileOpen}
            >
              <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-semibold uppercase text-white">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  firstLetter
                )}
              </span>

              <span className="hidden text-left sm:block">
                <span className="dashboard-text-primary block text-sm font-medium text-gray-800">{userName}</span>
                <span className="dashboard-text-secondary block max-w-[180px] truncate text-xs text-gray-500">{userEmail}</span>
              </span>

              <ChevronDown
                size={18}
                className={`dashboard-text-secondary hidden text-gray-500 transition-transform sm:block ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isProfileOpen && (
              <div className="dashboard-dropdown absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                <div>
                  <span className="dashboard-text-primary block text-sm font-medium text-gray-700">{userName}</span>
                  <span className="dashboard-text-secondary mt-0.5 block text-xs text-gray-500">{userEmail}</span>
                </div>

                <div className="dashboard-divider-fill my-4 h-px bg-gray-200" />

                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="dashboard-nav-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    <UserCircle2 size={18} className="dashboard-text-secondary text-gray-500" />
                    Account overview
                  </Link>
                  <Link
                    href="/dashboard/activities"
                    onClick={() => setIsProfileOpen(false)}
                    className="dashboard-nav-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    <PlusCircle size={18} className="dashboard-text-secondary text-gray-500" />
                    Add activity
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleTheme();
                      setIsProfileOpen(false);
                    }}
                    className="dashboard-nav-item flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    {isDarkMode ? (
                      <Sun size={18} className="dashboard-text-secondary text-gray-500" />
                    ) : (
                      <Moon size={18} className="dashboard-text-secondary text-gray-500" />
                    )}
                    {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="dashboard-nav-item flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    <Settings size={18} className="dashboard-text-secondary text-gray-500" />
                    Preferences
                  </button>
                </div>

                <div className="dashboard-divider-fill my-3 h-px bg-gray-200" />

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="dashboard-nav-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <LogOut size={18} className="dashboard-text-secondary text-gray-500" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
