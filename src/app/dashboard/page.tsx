export const dynamic = 'force-dynamic';
import Link from "next/link";
import StatCards from "@/component/dashboard/StatsCards";
import ActivityGrid from "@/component/dashboard/ActivityGrid";
import RecentHistory from "@/component/dashboard/RecentHistory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/Activity";
import User, { IUser } from "@/models/User";

interface AggregatedStats {
  totalCredits: number;
  totalCo2: number;
  totalEnergy: number;
}

type ActivityCategory = "Transportation" | "Waste" | "Energy" | "Planting";
type ActivityStatus = "pending" | "approved" | "rejected";

interface RecentActivityRaw {
  _id: { toString(): string } | string;
  title: string;
  category: ActivityCategory;
  creditsEarned: number;
  status: ActivityStatus;
  createdAt: Date | string;
}

interface ActivityDateRaw {
  createdAt: Date | string;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Please log in to view your dashboard</p>
      </div>
    );
  }

  await dbConnect();
  const userInDb = await User.findOne({ email: session.user.email }) as IUser | null;

  if (!userInDb) {
    return <div className="p-8">User profile not found in database.</div>;
  }

  const userId = userInDb._id;

  // ⚡ Bolt: Calculate the cutoff date for the 112-day ActivityGrid
  const gridStartDate = new Date();
  gridStartDate.setDate(gridStartDate.getDate() - 111); // Last 112 days including today
  gridStartDate.setHours(0, 0, 0, 0);

  const [statsResult, recentActivitiesRaw, activityDatesRaw] = await Promise.all([
    Activity.aggregate<AggregatedStats>([
      { $match: { userId: userId, status: "approved" } },
      {
        $group: {
          _id: null,
          totalCredits: { $sum: "$creditsEarned" },
          totalCo2: { $sum: "$co2Offset" },
          totalEnergy: { $sum: "$energySaved" },
        },
      },
    ]),
    Activity.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id title category creditsEarned status createdAt")
      .lean<RecentActivityRaw[]>(),
    // ⚡ Bolt: Only fetch dates for the last 112 days since ActivityGrid only renders that timeframe
    // This reduces unbounded payload growth from O(N_total) to O(N_recent)
    Activity.find({ userId: userId, createdAt: { $gte: gridStartDate } })
      .select("createdAt")
      .lean<ActivityDateRaw[]>(),
  ]);

  const recentActivities = recentActivitiesRaw.map((activity) => ({
    _id: activity._id.toString(),
    title: activity.title,
    category: activity.category,
    creditsEarned: activity.creditsEarned,
    status: activity.status,
    createdAt:
      activity.createdAt instanceof Date
        ? activity.createdAt.toISOString()
        : new Date(activity.createdAt).toISOString(),
  }));

  const activityDates = activityDatesRaw.map((activity) =>
    activity.createdAt instanceof Date
      ? activity.createdAt.toISOString()
      : new Date(activity.createdAt).toISOString()
  );

  const dashboardStats = statsResult[0] || { totalCredits: 0, totalCo2: 0, totalEnergy: 0 };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {session.user.name || "User"}
          </h1>
          <p className="mt-2 text-slate-500 italic">&ldquo;Your actions today define our planet tomorrow.&rdquo;</p>
        </div>
        <Link
          href="/dashboard/activities"
          className="inline-flex w-fit items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Add Activity
        </Link>
      </header>

      <StatCards
        credits={dashboardStats.totalCredits}
        co2={dashboardStats.totalCo2}
        energy={dashboardStats.totalEnergy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityGrid activityDates={activityDates} />
        </div>
        <div className="lg:col-span-1">
          <RecentHistory activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
