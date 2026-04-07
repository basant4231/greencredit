"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatTopbarTimestamp, type DashboardTopbarResponse } from "@/lib/dashboardTopbar";
import {
  DASHBOARD_TOPBAR_QUERY_KEY,
  useDashboardTopbarData,
} from "@/component/dashboard/useDashboardTopbarData";

export default function DashboardTopbarNotifications() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const topbarQuery = useDashboardTopbarData();
  const notifications = topbarQuery.data?.notifications ?? [];
  const hasUnseenNotifications = notifications.some((notification) => !notification.isSeen);

  const markNotificationsAsSeen = async () => {
    if (!hasUnseenNotifications) {
      return;
    }

    queryClient.setQueryData(
      DASHBOARD_TOPBAR_QUERY_KEY,
      (currentValue: DashboardTopbarResponse | undefined) =>
        currentValue
          ? {
              ...currentValue,
              notifications: currentValue.notifications.map((notification) => ({
                ...notification,
                isSeen: true,
              })),
            }
          : currentValue
    );

    try {
      const response = await fetch("/api/dashboard/topbar", {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Unable to mark notifications as seen.");
      }
    } finally {
      void topbarQuery.refetch();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          const nextValue = !isOpen;
          setIsOpen(nextValue);

          if (nextValue) {
            void markNotificationsAsSeen();
          }
        }}
        className="dashboard-outline-btn relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        {hasUnseenNotifications ? (
          <span className="absolute right-0 top-0.5 flex h-2 w-2 rounded-full bg-yellow-400">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
          </span>
        ) : null}
        <Bell size={18} />
      </button>

      {isOpen && (
        <div className="dashboard-dropdown absolute right-0 mt-[17px] flex w-[360px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="dashboard-text-primary text-sm font-semibold text-gray-900">
                Notifications
              </p>
              <p className="dashboard-text-secondary mt-1 text-xs text-gray-500">
                Login and activity updates from your dashboard.
              </p>
            </div>
            <span className="dashboard-text-secondary text-xs text-gray-500">
              {topbarQuery.isFetching ? "Refreshing..." : `${notifications.length} items`}
            </span>
          </div>

          <div className="dashboard-divider-fill my-4 h-px bg-gray-200" />

          <div className="max-h-[360px] space-y-2 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);

                    if (notification.href) {
                      router.push(notification.href);
                    }
                  }}
                  className="dashboard-nav-item w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-[#D5DBFF] hover:bg-[#F8FAFF]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="dashboard-text-primary text-sm font-semibold text-gray-900">
                        {notification.title}
                      </p>
                      <p className="dashboard-text-secondary mt-1 text-xs leading-5 text-gray-500">
                        {notification.message}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        notification.kind === "login"
                          ? "bg-[#ECF3FF] text-[#465FFF]"
                          : "bg-[#EEF8F1] text-[#2F855A]"
                      }`}
                    >
                      {notification.kind === "login" ? "Login" : "Activity"}
                    </span>
                  </div>
                  <p className="dashboard-text-secondary mt-3 text-xs text-gray-500">
                    {formatTopbarTimestamp(notification.createdAt)}
                  </p>
                </button>
              ))
            ) : (
              <div className="dashboard-text-secondary rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                No notifications yet. New logins and activity updates will appear here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
