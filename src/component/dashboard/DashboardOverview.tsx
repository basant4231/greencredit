"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Target } from "lucide-react";
import { useSyncExternalStore } from "react";
import ActivityGrid from "@/component/dashboard/ActivityGrid";
import RecentHistory from "@/component/dashboard/RecentHistory";
import StatCards from "@/component/dashboard/StatsCards";
import {
  DASHBOARD_CATEGORY_STYLES,
  formatDashboardDateLabel,
  formatDashboardMetric,
  type DashboardSummaryResponse,
} from "@/lib/dashboardSummary";

const DASHBOARD_SUMMARY_CACHE_KEY = "greencredit-dashboard-summary-cache";
const DASHBOARD_SUMMARY_QUERY_KEY = ["dashboard-summary"] as const;

interface DashboardSummaryCacheEntry {
  payload: DashboardSummaryResponse;
  savedAt: number;
}

function noopSubscribe() {
  return () => {};
}

function readDashboardSummaryCacheSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(DASHBOARD_SUMMARY_CACHE_KEY);
  } catch {
    return null;
  }
}

function parseDashboardSummaryCacheSnapshot(snapshot: string | null | undefined) {
  if (!snapshot) {
    return undefined;
  }

  try {
    return JSON.parse(snapshot) as DashboardSummaryCacheEntry;
  } catch {
    return undefined;
  }
}

function writeDashboardSummaryCache(payload: DashboardSummaryResponse) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const cacheEntry: DashboardSummaryCacheEntry = {
      payload,
      savedAt: Date.now(),
    };

    window.localStorage.setItem(DASHBOARD_SUMMARY_CACHE_KEY, JSON.stringify(cacheEntry));
  } catch {
    // Ignore storage write errors and continue using in-memory query data.
  }
}

async function fetchDashboardSummary() {
  const response = await fetch("/api/dashboard/summary", {
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || "Unable to load the dashboard right now.");
  }

  const data = (await response.json()) as DashboardSummaryResponse;
  writeDashboardSummaryCache(data);
  return data;
}

function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`stats-skeleton-${index}`}
            className="dashboard-surface rounded-2xl border border-gray-200 bg-white p-5 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] md:p-6"
          >
            <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-100" />
            <div className="mt-5 space-y-3">
              <div className="h-4 w-24 animate-pulse rounded-full bg-gray-100" />
              <div className="h-9 w-32 animate-pulse rounded-full bg-gray-200" />
              <div className="h-4 w-40 animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <div className="dashboard-surface dashboard-equal-panel rounded-2xl border border-gray-200 bg-white p-6 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]">
          <div className="space-y-4">
            <div className="h-4 w-28 animate-pulse rounded-full bg-gray-100" />
            <div className="h-8 w-52 animate-pulse rounded-full bg-gray-200" />
            <div className="h-40 animate-pulse rounded-2xl bg-gray-50" />
          </div>
        </div>

        <div className="dashboard-surface dashboard-equal-panel rounded-2xl border border-gray-200 bg-white p-6 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]">
          <div className="space-y-4">
            <div className="h-4 w-28 animate-pulse rounded-full bg-gray-100" />
            <div className="h-8 w-40 animate-pulse rounded-full bg-gray-200" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`activity-skeleton-${index}`} className="h-14 animate-pulse rounded-xl bg-gray-50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const isHydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const dashboardSummaryCacheSnapshot = useSyncExternalStore(
    noopSubscribe,
    readDashboardSummaryCacheSnapshot,
    () => null
  );
  const dashboardSummaryCache = parseDashboardSummaryCacheSnapshot(dashboardSummaryCacheSnapshot);
  const dashboardSummaryQuery = useQuery({
    queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
    queryFn: fetchDashboardSummary,
    placeholderData: dashboardSummaryCache?.payload,
    staleTime: 0,
    gcTime: Infinity,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: isHydrated,
  });

  const dashboardData = dashboardSummaryQuery.data;
  const isInitialLoading = dashboardSummaryQuery.isPending && !dashboardData;
  const errorMessage =
    dashboardSummaryQuery.error instanceof Error
      ? dashboardSummaryQuery.error.message
      : "Unable to load the dashboard right now.";

  if (isInitialLoading) {
    return <DashboardOverviewSkeleton />;
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-surface rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <span className="rounded-full bg-[#ECF3FF] px-3 py-1 text-xs font-medium text-[#465FFF]">
          {dashboardSummaryQuery.isFetching ? "Updating..." : "Cached view ready"}
        </span>
      </div>

      <StatCards
        credits={dashboardData.stats.totalCredits}
        co2={dashboardData.stats.totalCo2}
        energy={dashboardData.stats.totalEnergy}
        approvedCount={dashboardData.stats.approvedCount}
        monthlyCredits={dashboardData.stats.monthlyCredits}
        pendingCount={dashboardData.stats.pendingCount}
        totalActivities={dashboardData.stats.totalActivities}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <div className="min-w-0">
          <ActivityGrid
            activityDates={dashboardData.activityDates}
            activeDays={dashboardData.uniqueActivityDays}
            totalActivities={dashboardData.stats.totalActivities}
          />
        </div>
        <div className="min-w-0">
          <RecentHistory
            activities={dashboardData.recentActivities}
            approvalRate={dashboardData.approvalRate}
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
        <div className="dashboard-surface rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_28px_45px_-34px_rgba(15,23,42,0.25)] md:p-8">
          <div className="flex h-full flex-col">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="dashboard-text-secondary flex items-center gap-2 text-sm text-gray-500">
                  <Sparkles size={14} className="text-[#465FFF]" />
                  Activity Studio
                </div>
                <h2 className="dashboard-text-primary mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-gray-900 sm:text-[3.05rem] sm:leading-[1.06]">
                  Choose your next green action.
                </h2>
                <p className="dashboard-text-secondary mt-4 max-w-2xl text-sm leading-7 text-gray-500">
                  Review your latest progress, submit verified eco actions, and keep your Eco Credit rewards growing in one place.
                </p>
              </div>

              <Link
                href="/dashboard/activities"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#465FFF] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#3649d9]"
              >
                Add activity
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#465FFF]">Capture</p>
                <p className="dashboard-text-primary mt-3 text-sm leading-7 text-gray-700">
                  Use a sharp ticket or proof image when required.
                </p>
              </div>
              <div className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#465FFF]">Verify</p>
                <p className="dashboard-text-primary mt-3 text-sm leading-7 text-gray-700">
                  Location and activity type are checked in the flow.
                </p>
              </div>
              <div className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#465FFF]">Earn</p>
                <p className="dashboard-text-primary mt-3 text-sm leading-7 text-gray-700">
                  Approved actions return credits back to your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-surface-alt rounded-2xl border border-gray-200 bg-gray-100 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]">
          <div className="dashboard-surface rounded-2xl bg-white px-5 pb-6 pt-5 sm:px-6 sm:pt-6">
            <div className="dashboard-text-secondary flex items-center gap-2 text-sm text-gray-500">
              <Target size={14} />
              Next milestone
            </div>
            <h3 className="dashboard-text-primary mt-2 text-[30px] font-semibold leading-[38px] text-gray-800">
              {formatDashboardMetric(dashboardData.milestone.creditsRemaining)} credits to reach{" "}
              {dashboardData.milestone.nextMilestone}
            </h3>
            <p className="dashboard-text-secondary mt-2 text-sm text-gray-500">
              Keep submitting strong proofs to move into the next reward tier without breaking your pace.
            </p>

            <div className="dashboard-surface-soft mt-5 h-3 rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-[#465FFF]"
                style={{ width: `${dashboardData.milestone.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
            <div>
              <p className="dashboard-text-secondary mb-1 text-center text-xs text-gray-500 sm:text-sm">Pending</p>
              <p className="dashboard-text-primary text-center text-base font-semibold text-gray-800 sm:text-lg">
                {dashboardData.stats.pendingCount}
              </p>
            </div>

            <div className="dashboard-divider-fill h-7 w-px bg-gray-200"></div>

            <div>
              <p className="dashboard-text-secondary mb-1 text-center text-xs text-gray-500 sm:text-sm">Latest</p>
              <p className="dashboard-text-primary text-center text-base font-semibold text-gray-800 sm:text-lg">
                {formatDashboardDateLabel(dashboardData.latestActivityDate)}
              </p>
            </div>

            <div className="dashboard-divider-fill h-7 w-px bg-gray-200"></div>

            <div>
              <p className="dashboard-text-secondary mb-1 text-center text-xs text-gray-500 sm:text-sm">Category</p>
              <p className="dashboard-text-primary text-center text-base font-semibold text-gray-800 sm:text-lg">
                {dashboardData.topCategory || "None"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-surface rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="dashboard-text-secondary text-sm text-gray-500">Category Mix</p>
            <h3 className="dashboard-text-primary mt-1 text-lg font-semibold text-gray-800">Where your impact comes from</h3>
          </div>
          <span className="rounded-full bg-[#ECF3FF] px-2.5 py-0.5 text-xs font-medium text-[#465FFF]">
            {dashboardData.categorySummary.length} tracked categories
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {dashboardData.categorySummary.length > 0 ? (
            dashboardData.categorySummary.map((category) => {
              const style = DASHBOARD_CATEGORY_STYLES[category.category];
              const width = (category.count / dashboardData.maxCategoryCount) * 100;

              return (
                <div
                  key={category.category}
                  className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="dashboard-text-primary text-sm font-medium text-gray-800">{style.label}</p>
                      <p className="dashboard-text-secondary text-xs text-gray-500">
                        {formatDashboardMetric(category.credits)} credits from {category.count} actions
                      </p>
                    </div>
                    <span className="rounded-full bg-[#ECF3FF] px-2.5 py-0.5 text-xs font-medium text-[#465FFF]">
                      {category.count} entries
                    </span>
                  </div>

                  <div className="dashboard-surface-soft mt-4 h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-[#465FFF]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="dashboard-surface-alt dashboard-text-secondary rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center text-sm text-gray-500">
              Start by verifying your first eco action to unlock category insights.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
