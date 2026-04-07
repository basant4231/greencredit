export interface DashboardStats {
  totalCredits: number;
  totalCo2: number;
  totalEnergy: number;
  approvedCount: number;
  monthlyCredits: number;
  pendingCount: number;
  totalActivities: number;
}

export type DashboardActivityCategory =
  | "Transportation"
  | "Waste"
  | "Energy"
  | "Planting";

export type DashboardActivityStatus = "pending" | "approved" | "rejected";

export interface DashboardRecentActivity {
  _id: string;
  title: string;
  category: DashboardActivityCategory;
  creditsEarned: number;
  status: DashboardActivityStatus;
  createdAt: string;
}

export interface DashboardCategorySummary {
  category: DashboardActivityCategory;
  count: number;
  credits: number;
}

export interface DashboardMilestone {
  nextMilestone: number;
  creditsRemaining: number;
  progress: number;
}

export interface DashboardSummaryResponse {
  stats: DashboardStats;
  activityDates: string[];
  recentActivities: DashboardRecentActivity[];
  approvalRate: number;
  uniqueActivityDays: number;
  milestone: DashboardMilestone;
  latestActivityDate: string | null;
  topCategory: DashboardActivityCategory | null;
  categorySummary: DashboardCategorySummary[];
  maxCategoryCount: number;
}

export function getMilestoneProgress(totalCredits: number): DashboardMilestone {
  const step = 100;
  const nextMilestone = Math.max(step, Math.ceil((totalCredits + 1) / step) * step);
  const previousMilestone = Math.max(0, nextMilestone - step);
  const progress = ((totalCredits - previousMilestone) / step) * 100;

  return {
    nextMilestone,
    creditsRemaining: Math.max(0, nextMilestone - totalCredits),
    progress: Math.max(0, Math.min(100, progress)),
  };
}

export function formatDashboardMetric(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDashboardDateLabel(value?: string | null) {
  if (!value) {
    return "No submissions yet";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export const DASHBOARD_CATEGORY_STYLES: Record<DashboardActivityCategory, { label: string }> = {
  Transportation: { label: "Transportation" },
  Waste: { label: "Waste" },
  Energy: { label: "Energy" },
  Planting: { label: "Planting" },
};
