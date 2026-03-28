import Link from "next/link";
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
      return "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20";
    case "rejected":
      return "bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20";
    case "pending":
      return "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20";
    default:
      return "bg-zinc-800 text-zinc-500 ring-1 ring-white/5";
  }
}

export default function RecentHistory({ activities }: RecentHistoryProps) {
  return (
    <div className="h-full rounded-3xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-xl transition-all hover:border-emerald-500/30">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-zinc-100">Recent Activities</h3>
        <Link href="/dashboard/activities" className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-800/30 p-3 transition-all hover:bg-zinc-800/50 hover:border-emerald-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                  {getCategoryIcon(activity.category)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{activity.title}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(activity.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${activity.status === "pending" ? "text-amber-500" : "text-emerald-500"}`}>
                  {activity.status === "pending" ? "Pending" : `+${activity.creditsEarned}`}
                </p>
                <p
                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${getStatusTextClass(activity.status)}`}
                >
                  {activity.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm italic text-zinc-500">
            No recent activities found.
          </div>
        )}
      </div>
    </div>
  );
}
