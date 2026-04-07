"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardTopbarResponse } from "@/lib/dashboardTopbar";

export const DASHBOARD_TOPBAR_QUERY_KEY = ["dashboard-topbar"] as const;

async function fetchDashboardTopbarData() {
  const response = await fetch("/api/dashboard/topbar", {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      return { notifications: [], recentActivities: [] } satisfies DashboardTopbarResponse;
    }

    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || "Unable to load dashboard controls right now.");
  }

  return (await response.json()) as DashboardTopbarResponse;
}

export function useDashboardTopbarData() {
  return useQuery({
    queryKey: DASHBOARD_TOPBAR_QUERY_KEY,
    queryFn: fetchDashboardTopbarData,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30000,
  });
}
