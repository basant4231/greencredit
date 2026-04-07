"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatTopbarTimestamp } from "@/lib/dashboardTopbar";
import { useDashboardTopbarData } from "@/component/dashboard/useDashboardTopbarData";

interface SearchItem {
  id: string;
  label: string;
  description: string;
  href: string;
  searchText: string;
}

const STATIC_ITEMS: SearchItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Open your main overview and stats.",
    href: "/dashboard",
    searchText: "dashboard overview stats summary home",
  },
  {
    id: "activities",
    label: "Activity Studio",
    description: "Verify or submit a new eco activity.",
    href: "/dashboard/activities",
    searchText: "activity studio verify submit metro planting credits",
  },
  {
    id: "buy-tree",
    label: "Buy Tree",
    description: "Open the tree and recycle section.",
    href: "/dashboard/buy-tree",
    searchText: "buy tree recycle marketplace plants centres",
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

function getMatchScore(item: SearchItem, query: string) {
  const label = item.label.toLowerCase();
  const description = item.description.toLowerCase();
  const searchText = item.searchText.toLowerCase();

  if (label.startsWith(query)) {
    return 3;
  }

  if (label.includes(query)) {
    return 2;
  }

  if (description.includes(query) || searchText.includes(query)) {
    return 1;
  }

  return 0;
}

export default function DashboardTopbarSearchFresh() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const desktopWrapperRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const topbarQuery = useDashboardTopbarData();
  const query = value.trim().toLowerCase();

  const items = useMemo<SearchItem[]>(() => {
    const recentActivityItems: SearchItem[] = (topbarQuery.data?.recentActivities ?? []).map(
      (activity) => ({
        id: `activity-${activity._id}`,
        label: activity.title,
        description: `${activity.category} - ${getStatusLabel(activity.status)} - ${formatTopbarTimestamp(activity.createdAt)}`,
        href: "/dashboard/activities",
        searchText: `${activity.title} ${activity.category} ${activity.status}`,
      })
    );

    return [...STATIC_ITEMS, ...recentActivityItems];
  }, [topbarQuery.data?.recentActivities]);

  const results = useMemo(() => {
    if (!query) {
      return [];
    }

    return items
      .map((item) => ({
        item,
        score: getMatchScore(item, query),
      }))
      .filter((entry) => entry.score > 0)
      .sort((first, second) => second.score - first.score || first.item.label.localeCompare(second.item.label))
      .slice(0, 6)
      .map((entry) => entry.item);
  }, [items, query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (window.innerWidth >= 1024) {
          setIsDesktopOpen(true);
          desktopInputRef.current?.focus();
          return;
        }

        setIsMobileOpen(true);
      }

      if (event.key === "Escape") {
        setIsDesktopOpen(false);
        setIsMobileOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (desktopWrapperRef.current && !desktopWrapperRef.current.contains(target)) {
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

    const timeoutId = window.setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isMobileOpen]);

  const openResult = (href: string) => {
    setIsDesktopOpen(false);
    setIsMobileOpen(false);
    setValue("");
    router.push(href);
  };

  const handleKeySelect = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && results[0]) {
      event.preventDefault();
      openResult(results[0].href);
    }
  };

  const renderResults = () => {
    if (results.length === 0) {
      return (
        <div className="dashboard-text-secondary rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500">
          No results found.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {results.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openResult(item.href)}
            className="dashboard-nav-item w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-[#D5DBFF] hover:bg-[#F8FAFF]"
          >
            <p className="dashboard-text-primary text-sm font-semibold text-gray-900">{item.label}</p>
            <p className="dashboard-text-secondary mt-1 text-xs leading-5 text-gray-500">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div ref={desktopWrapperRef} className="relative hidden lg:block">
        <label className="dashboard-input-shell relative block rounded-lg border border-gray-200 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
          <span className="dashboard-text-secondary pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Search size={18} />
          </span>
          <input
            ref={desktopInputRef}
            type="text"
            value={value}
            onFocus={() => setIsDesktopOpen(true)}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeySelect}
            placeholder="Search or type command..."
            className="dashboard-input-field h-11 w-[340px] xl:w-[430px] rounded-lg border border-transparent bg-transparent py-2.5 pl-11 pr-16 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#465FFF] focus:outline-none focus:ring-4 focus:ring-[#465FFF]/10"
          />
          <span className="dashboard-chip-muted absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-500">
            Ctrl K
          </span>
        </label>

        {isDesktopOpen && query ? (
          <div className="dashboard-dropdown absolute left-0 right-0 top-[calc(100%+14px)] z-40 w-[520px] rounded-2xl border border-gray-200 bg-white p-3 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
            {renderResults()}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="dashboard-outline-btn flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition lg:hidden"
        aria-label="Search"
      >
        <Search size={18} />
      </button>

      {isMobileOpen ? (
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
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeySelect}
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

            {query ? <div className="mt-4 max-h-[65vh] overflow-y-auto">{renderResults()}</div> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
