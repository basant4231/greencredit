export const dynamic = 'force-dynamic';
import StatCards from "@/component/dashboard/StatsCards";
import ActivityGrid from "@/component/dashboard/ActivityGrid";
import RecentHistory from "@/component/dashboard/RecentHistory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/Activity";
import User, { IUser } from "@/models/User"; // Import your User interface

// 1. Define the shape of your Aggregated Stats
interface AggregatedStats {
  totalCredits: number;
  totalCo2: number;
  totalEnergy: number;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // 2. Strong Session Check: Ensures session and user email exist
  if (!session || !session.user?.email) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Please log in to view your dashboard</p>
      </div>
    );
  }

  await dbConnect();

  // 3. Type the user result using your IUser interface
  const userInDb = await User.findOne({ email: session.user.email }) as IUser | null;
  
  if (!userInDb) {
    return <div className="p-8">User profile not found in database.</div>;
  }

  const userId = userInDb._id;

  // 4. Run Aggregation with typed results
  const statsResult = await Activity.aggregate<AggregatedStats>([
    { $match: { userId: userId, status: "approved" } },
    {
      $group: {
        _id: null,
        totalCredits: { $sum: "$creditsEarned" },
        totalCo2: { $sum: "$co2Offset" },
        totalEnergy: { $sum: "$energySaved" },
      },
    },
  ]);

  // 5. Fetch Recent Activities with lean() for better performance
  const recentActivities = await Activity.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const dashboardStats = statsResult[0] || { totalCredits: 0, totalCo2: 0, totalEnergy: 0 };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {session.user.name || "User"}
        </h1>
        <p className="text-slate-500 italic">"Your actions today define our planet tomorrow."</p>
      </header>

      <StatCards 
        credits={dashboardStats.totalCredits} 
        co2={dashboardStats.totalCo2} 
        energy={dashboardStats.totalEnergy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Ensure session.user.id exists or fallback to DB id */}
          <ActivityGrid userId={userInDb._id.toString()} />
        </div>
        <div className="lg:col-span-1">
          <RecentHistory activities={JSON.parse(JSON.stringify(recentActivities))} />
        </div>
      </div>
    </div>
  );
}