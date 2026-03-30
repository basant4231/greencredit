export const dynamic = 'force-dynamic';
import Link from "next/link";
import { ArrowUpRight, Sparkles, Target } from "lucide-react";
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

interface StatusSummaryRaw {
  _id: ActivityStatus;
  count: number;
}

interface CategorySummaryRaw {
  _id: ActivityCategory;
  count: number;
  credits: number;
}

interface MonthlyCreditsRaw {
  _id: null;
  credits: number;
}

const categoryStyles: Record<ActivityCategory, { label: string }> = {
  Transportation: { label: "Transportation" },
  Waste: { label: "Waste" },
  Energy: { label: "Energy" },
  Planting: { label: "Planting" },
};

function formatMetric(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(value);
}

function getMilestoneProgress(totalCredits: number) {
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

function formatDateLabel(value?: string) {
  if (!value) {
    return "No submissions yet";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="dashboard-text-secondary text-gray-500">Please log in to view your dashboard</p>
      </div>
    );
  }

  await dbConnect();
  const userInDb = (await User.findOne({ email: session.user.email })) as IUser | null;

  if (!userInDb) {
    return <div className="dashboard-text-primary p-8">User profile not found in database.</div>;
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
    Activity.find({ userId: userId })
      .select("createdAt")
      .lean<ActivityDateRaw[]>(),
    Activity.aggregate<StatusSummaryRaw>([
      { $match: { userId: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Activity.aggregate<CategorySummaryRaw>([
      { $match: { userId: userId } },
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
          userId: userId,
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

  const dashboardStats = statsResult[0] || { totalCredits: 0, totalCo2: 0, totalEnergy: 0 };
  const monthlyCredits = monthlyCreditsRaw[0]?.credits || 0;

  const statusSummary = statusSummaryRaw.reduce(
    (acc, item) => {
      acc[item._id] = item.count;
      return acc;
    },
    { approved: 0, pending: 0, rejected: 0 } as Record<ActivityStatus, number>
  );

  const totalActivities =
    statusSummary.approved + statusSummary.pending + statusSummary.rejected;
  const approvalRate =
    totalActivities > 0 ? Math.round((statusSummary.approved / totalActivities) * 100) : 0;
  const uniqueActivityDays = new Set(
    activityDates.map((activityDate) => activityDate.slice(0, 10))
  ).size;
  const milestone = getMilestoneProgress(dashboardStats.totalCredits);
  const latestActivityDate = recentActivities[0]?.createdAt;
  const topCategory = categorySummaryRaw[0]?._id;
  const maxCategoryCount = Math.max(...categorySummaryRaw.map((item) => item.count), 1);

  return (
    <div className="space-y-6">
      <StatCards
        credits={dashboardStats.totalCredits}
        co2={dashboardStats.totalCo2}
        energy={dashboardStats.totalEnergy}
        approvedCount={statusSummary.approved}
        monthlyCredits={monthlyCredits}
        pendingCount={statusSummary.pending}
        totalActivities={totalActivities}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <div className="min-w-0">
          <ActivityGrid
            activityDates={activityDates}
            activeDays={uniqueActivityDays}
            totalActivities={totalActivities}
          />
        </div>
        <div className="min-w-0">
          <RecentHistory activities={recentActivities} approvalRate={approvalRate} />
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
                  This page now follows the same admin-template direction as your main dashboard, while keeping the GreenCredit verification flow simple and focused.
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
              {formatMetric(milestone.creditsRemaining)} credits to reach {milestone.nextMilestone}
            </h3>
            <p className="dashboard-text-secondary mt-2 text-sm text-gray-500">
              Keep submitting strong proofs to move into the next reward tier without breaking your pace.
            </p>

            <div className="dashboard-surface-soft mt-5 h-3 rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-[#465FFF]"
                style={{ width: `${milestone.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
            <div>
              <p className="dashboard-text-secondary mb-1 text-center text-xs text-gray-500 sm:text-sm">Pending</p>
              <p className="dashboard-text-primary text-center text-base font-semibold text-gray-800 sm:text-lg">
                {statusSummary.pending}
              </p>
            </div>

            <div className="dashboard-divider-fill h-7 w-px bg-gray-200"></div>

            <div>
              <p className="dashboard-text-secondary mb-1 text-center text-xs text-gray-500 sm:text-sm">Latest</p>
              <p className="dashboard-text-primary text-center text-base font-semibold text-gray-800 sm:text-lg">
                {formatDateLabel(latestActivityDate)}
              </p>
            </div>

            <div className="dashboard-divider-fill h-7 w-px bg-gray-200"></div>

            <div>
              <p className="dashboard-text-secondary mb-1 text-center text-xs text-gray-500 sm:text-sm">Category</p>
              <p className="dashboard-text-primary text-center text-base font-semibold text-gray-800 sm:text-lg">
                {topCategory || "None"}
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
            {categorySummaryRaw.length} tracked categories
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {categorySummaryRaw.length > 0 ? (
            categorySummaryRaw.map((category) => {
              const style = categoryStyles[category._id];
              const width = (category.count / maxCategoryCount) * 100;

              return (
                <div
                  key={category._id}
                  className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="dashboard-text-primary text-sm font-medium text-gray-800">{style.label}</p>
                      <p className="dashboard-text-secondary text-xs text-gray-500">
                        {formatMetric(category.credits)} credits from {category.count} actions
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
