import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import {
  getMilestoneProgress,
  type DashboardActivityCategory,
  type DashboardActivityStatus,
  type DashboardSummaryResponse,
} from "@/lib/dashboardSummary";
import Activity from "@/models/Activity";
import User, { type IUser } from "@/models/User";

export const dynamic = "force-dynamic";

interface AggregatedStats {
  totalCredits: number;
  totalCo2: number;
  totalEnergy: number;
}

interface RecentActivityRaw {
  _id: { toString(): string } | string;
  title: string;
  category: DashboardActivityCategory;
  creditsEarned: number;
  status: DashboardActivityStatus;
  createdAt: Date | string;
}

interface ActivityDateRaw {
  createdAt: Date | string;
}

interface StatusSummaryRaw {
  _id: DashboardActivityStatus;
  count: number;
}

interface CategorySummaryRaw {
  _id: DashboardActivityCategory;
  count: number;
  credits: number;
}

interface MonthlyCreditsRaw {
  _id: null;
  credits: number;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const userInDb = (await User.findOne({ email: session.user.email })) as IUser | null;

  if (!userInDb) {
    return NextResponse.json({ error: "User profile not found in database." }, { status: 404 });
  }

  const userId = userInDb._id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    statsResult,
    recentActivitiesRaw,
    activityDatesRaw,
    statusSummaryRaw,
    categorySummaryRaw,
    monthlyCreditsRaw,
  ] = await Promise.all([
    Activity.aggregate<AggregatedStats>([
      { $match: { userId, status: "approved" } },
      {
        $group: {
          _id: null,
          totalCredits: { $sum: "$creditsEarned" },
          totalCo2: { $sum: "$co2Offset" },
          totalEnergy: { $sum: "$energySaved" },
        },
      },
    ]),
    Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id title category creditsEarned status createdAt")
      .lean<RecentActivityRaw[]>(),
    Activity.find({ userId }).select("createdAt").lean<ActivityDateRaw[]>(),
    Activity.aggregate<StatusSummaryRaw>([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Activity.aggregate<CategorySummaryRaw>([
      { $match: { userId } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          credits: { $sum: "$creditsEarned" },
        },
      },
      { $sort: { count: -1 } },
    ]),
    Activity.aggregate<MonthlyCreditsRaw>([
      {
        $match: {
          userId,
          status: "approved",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          credits: { $sum: "$creditsEarned" },
        },
      },
    ]),
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

  const stats = statsResult[0] || { totalCredits: 0, totalCo2: 0, totalEnergy: 0 };
  const monthlyCredits = monthlyCreditsRaw[0]?.credits || 0;

  const statusSummary = statusSummaryRaw.reduce(
    (acc, item) => {
      acc[item._id] = item.count;
      return acc;
    },
    { approved: 0, pending: 0, rejected: 0 } as Record<DashboardActivityStatus, number>
  );

  const totalActivities =
    statusSummary.approved + statusSummary.pending + statusSummary.rejected;
  const approvalRate =
    totalActivities > 0 ? Math.round((statusSummary.approved / totalActivities) * 100) : 0;
  const uniqueActivityDays = new Set(
    activityDates.map((activityDate) => activityDate.slice(0, 10))
  ).size;
  const milestone = getMilestoneProgress(stats.totalCredits);
  const latestActivityDate = recentActivities[0]?.createdAt || null;
  const topCategory = categorySummaryRaw[0]?._id || null;
  const maxCategoryCount = Math.max(...categorySummaryRaw.map((item) => item.count), 1);

  const response: DashboardSummaryResponse = {
    stats: {
      totalCredits: stats.totalCredits,
      totalCo2: stats.totalCo2,
      totalEnergy: stats.totalEnergy,
      approvedCount: statusSummary.approved,
      monthlyCredits,
      pendingCount: statusSummary.pending,
      totalActivities,
    },
    activityDates,
    recentActivities,
    approvalRate,
    uniqueActivityDays,
    milestone,
    latestActivityDate,
    topCategory,
    categorySummary: categorySummaryRaw.map((category) => ({
      category: category._id,
      count: category.count,
      credits: category.credits,
    })),
    maxCategoryCount,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
