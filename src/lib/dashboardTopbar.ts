import type { DashboardRecentActivity } from "@/lib/dashboardSummary";

export type DashboardNotificationKind = "login" | "activity";

export interface DashboardTopbarNotification {
  _id: string;
  kind: DashboardNotificationKind;
  title: string;
  message: string;
  href: string | null;
  isSeen: boolean;
  createdAt: string;
}

export interface DashboardTopbarResponse {
  notifications: DashboardTopbarNotification[];
  recentActivities: DashboardRecentActivity[];
}

export function formatTopbarTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
