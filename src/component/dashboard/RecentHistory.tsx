import { Car, Leaf, Recycle, Zap } from "lucide-react";

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
}

function getCategoryIcon(category: ActivityCategory) {
  switch (category) {
    case "Transportation":
      return <Car size={16} />;
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
      return "text-emerald-600";
    case "rejected":
      return "text-rose-500";
    case "pending":
      return "text-amber-500";
    default:
      return "text-slate-400";
  }
}

export default function RecentHistory({ activities }: RecentHistoryProps) {
  return (
    <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-slate-800">Recent Activities</h3>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  {getCategoryIcon(activity.category)}
                </div>
                <div>
                  <p className="text-sm font-semibold capitalize text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">+{activity.creditsEarned}</p>
                <p
                  className={`text-[10px] font-medium uppercase tracking-wider ${getStatusTextClass(activity.status)}`}
                >
                  {activity.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm italic text-slate-400">
            No recent activities found.
          </div>
        )}
      </div>
    </div>
  );
}
