"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatTopbarTimestamp } from "@/lib/dashboardTopbar";
import { useDashboardTopbarData } from "@/component/dashboard/useDashboardTopbarData";

interface SearchItem {
  id: string;
  label: string;
  description: string;
  href: string;
  keywords: string;
  section: "Pages" | "Recent activity";
}

const QUICK_LINKS: SearchItem[] = [
  {
    id: "dashboard-link",
    label: "Dashboard",
    description: "Open your main overview and stats.",
    href: "/dashboard",
    keywords: "dashboard home overview stats summary",
    section: "Pages",
  },
  {
    id: "activities-link",
    label: "Activity Studio",
    description: "Verify or submit a new eco activity.",
    href: "/dashboard/activities",
    keywords: "activity studio add verify metro planting credits",
    section: "Pages",
  },
  {
    id: "buy-tree-link",
    label: "Buy Tree",
    description: "Explore tree sellers, recycle items, and nearby centres.",
    href: "/dashboard/buy-tree",
    keywords: "buy tree recycle marketplace centres",
    section: "Pages",
  },
];

function getStatusLabel(status: "pending" | "approved" | "rejected") {
  if (status === "approved") {
    return "Approved";
  }

  if (status === "rejected") {
    return "Rejected";
  }

  return "Pending";
}

export default function DashboardTopbarSearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const topbarQuery = useDashboardTopbarData();
  const normalizedQuery = searchValue.trim().toLowerCase();

  const searchResults = useMemo(() => {
    const activityItems: SearchItem[] = (topbarQuery.data?.recentActivities ?? []).map(
      (activity) => ({
        id: `recent-activity-${activity._id}`,
        label: activity.title,
        description: `${activity.category} - ${getStatusLabel(activity.status)} - ${formatTopbarTimestamp(activity.createdAt)}`,
        href: "/dashboard/activities",
        keywords: `${activity.title} ${activity.category} ${activity.status}`,
        section: "Recent activity",
      })
    );
    const allItems = [...QUICK_LINKS, ...activityItems];

    if (!normalizedQuery) {
      return [];
    }

    return allItems
      .filter((item) => {
        const haystack = `${item.label} ${item.description} ${item.keywords}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [normalizedQuery, topbarQuery.data?.recentActivities]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (window.innerWidth >= 1024) {
          setIsDesktopOpen(true);
          desktopInputRef.current?.focus();
        } else {
          setIsMobileOpen(true);
        }
      }

      if (event.key === "Escape") {
        setIsDesktopOpen(false);
        setIsMobileOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (desktopContainerRef.current && !desktopContainerRef.current.contains(target)) {
        setIsDesktopOpen(false);
      }

      if (mobilePanelRef.current && !mobilePanelRef.current.contains(target)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isMobileOpen]);

  const handleSearchSelect = (href: string) => {
    setIsDesktopOpen(false);
    setIsMobileOpen(false);
    setSearchValue("");
    router.push(href);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchResults[0]) {
      event.preventDefault();
      handleSearchSelect(searchResults[0].href);
    }
  };

  const renderSearchResults = () => {
    if (topbarQuery.isError && searchResults.length === 0) {
      return (
        <div className="dashboard-text-secondary rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500">
          Search links are available, but recent activity could not be loaded right now.
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="dashboard-text-secondary rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500">
          No results found.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {searchResults.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSearchSelect(item.href)}
            className="dashboard-nav-item flex w-full items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-[#D5DBFF] hover:bg-[#F8FAFF]"
          >
            <div className="min-w-0">
              <p className="dashboard-text-primary text-sm font-semibold text-gray-900">
                {item.label}
              </p>
              <p className="dashboard-text-secondary mt-1 text-xs leading-5 text-gray-500">
                {item.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                {item.section}
              </span>
              {pathname === item.href ? (
                <span className="rounded-full bg-[#ECF3FF] px-2.5 py-1 text-[11px] font-medium text-[#465FFF]">
                  Open
                </span>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div ref={desktopContainerRef} className="relative hidden lg:block">
        <label className="dashboard-input-shell relative block rounded-lg border border-gray-200 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
          <span className="dashboard-text-secondary pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Search size={18} />
          </span>
          <input
            ref={desktopInputRef}
            type="text"
            value={searchValue}
            onFocus={() => setIsDesktopOpen(true)}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search or type command..."
            className="dashboard-input-field h-11 w-[340px] xl:w-[430px] rounded-lg border border-transparent bg-transparent py-2.5 pl-11 pr-16 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#465FFF] focus:outline-none focus:ring-4 focus:ring-[#465FFF]/10"
          />
          <span className="dashboard-chip-muted absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-500">
            Ctrl K
          </span>
        </label>

        {isDesktopOpen && normalizedQuery && (
          <div className="dashboard-dropdown absolute left-0 right-0 top-[calc(100%+14px)] z-40 w-[520px] rounded-2xl border border-gray-200 bg-white p-3 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="dashboard-text-primary text-sm font-semibold text-gray-900">
                Results
              </p>
              <span className="dashboard-text-secondary text-xs text-gray-500">
                {topbarQuery.isFetching
                  ? "Refreshing..."
                  : `${searchResults.length} result${searchResults.length === 1 ? "" : "s"}`}
              </span>
            </div>
            {renderSearchResults()}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="dashboard-outline-btn flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition lg:hidden"
        aria-label="Search"
      >
        <Search size={18} />
      </button>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/35 px-4 py-5 lg:hidden">
          <div
            ref={mobilePanelRef}
            className="mx-auto mt-16 max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-[0px_30px_60px_-24px_rgba(15,23,42,0.45)]"
          >
            <div className="flex items-center gap-3">
              <span className="dashboard-text-secondary text-gray-500">
                <Search size={18} />
              </span>
              <input
                ref={mobileInputRef}
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search dashboard..."
                className="dashboard-input-field h-11 flex-1 rounded-lg border border-transparent bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="dashboard-outline-btn flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 max-h-[65vh] overflow-y-auto">{renderSearchResults()}</div>
          </div>
        </div>
      )}
    </>
  );
}
