import Link from "next/link";
import { Leaf, Recycle, TrainFront, Zap } from "lucide-react";

type ActivityCategory = "Transportation" | "Waste" | "Energy" | "Planting";
type ActivityStatus = "pending" | "approved" | "rejected";

interface Activity {
  _id: string;
  title: string;
  category: ActivityCategory;
  creditsEarned: number;
  status: ActivityStatus;
  createdAt: string | Date;
}

interface RecentHistoryProps {
  activities: Activity[];
  approvalRate: number;
}

function getCategoryIcon(category: ActivityCategory) {
  switch (category) {
    case "Transportation":
      return <TrainFront size={16} />;
    case "Waste":
      return <Recycle size={16} />;
    case "Energy":
      return <Zap size={16} />;
    case "Planting":
      return <Leaf size={16} />;
    default:
      return <Leaf size={16} />;
  }
}

function getStatusTextClass(status: ActivityStatus) {
  switch (status) {
    case "approved":
      return "bg-[#ECFDF3] text-[#039855]";
    case "rejected":
      return "bg-[#FEF3F2] text-[#D92D20]";
    case "pending":
      return "bg-[#FFFAEB] text-[#DC6803]";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

export default function RecentHistory({ activities, approvalRate }: RecentHistoryProps) {
  return (
    <div className="dashboard-surface dashboard-equal-panel min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-4 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] sm:px-6">
      <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
        <div>
          <p className="dashboard-text-secondary text-sm text-gray-500">Recent Activity</p>
          <h3 className="dashboard-text-primary mt-1 text-lg font-semibold text-gray-800">Recent Orders Style</h3>
        </div>
        <div className="rounded-full bg-[#ECFDF3] px-2.5 py-0.5 text-xs font-medium text-[#039855]">
          {approvalRate}% approval rate
        </div>
      </div>

      <div className="mb-4 flex flex-col items-start gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="dashboard-text-secondary text-sm text-gray-500">Latest submissions and their current verification state.</p>
        <Link
          href="/dashboard/activities"
          className="dashboard-outline-btn inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-gray-50"
        >
          View all
        </Link>
      </div>

      <div className="dashboard-scroll-region dashboard-no-scrollbar space-y-4 xl:pr-1">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity._id}
              className="dashboard-divider flex items-center justify-between gap-3 border-t border-gray-100 py-3 first:border-t-0 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="dashboard-icon-surface flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                  {getCategoryIcon(activity.category)}
                </div>
                <div>
                  <p className="dashboard-text-primary text-sm font-medium text-gray-800">{activity.title}</p>
                  <p className="dashboard-text-secondary text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="dashboard-text-primary text-sm font-medium text-gray-800">
                  {activity.status === "pending" ? "Pending" : `+${activity.creditsEarned}`}
                </p>
                <p
                  className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusTextClass(activity.status)}`}
                >
                  {activity.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="dashboard-surface-alt dashboard-text-secondary rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm italic text-gray-500">
            No recent activities found yet.
          </div>
        )}
      </div>
    </div>
  );
}
