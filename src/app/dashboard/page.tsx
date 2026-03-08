import StatCards from "@/component/dashboard/StatsCards";
import ActivityGrid from "@/component/dashboard/ActivityGrid";
import RecentHistory from "@/component/dashboard/RecentHistory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/Activity";
import User from "@/models/User";
export default async function DashboardPage() {
const session = await getServerSession(authOptions);

  if (!session) return <div>Please log in</div>;

  await dbConnect();

  // 1. Find the actual user in DB using their email
  const userInDb = await User.findOne({ email: session.user.email });
  
  if (!userInDb) return <div>User not found</div>;

  // 2. Now use the REAL MongoDB _id for the queries
  const userId = userInDb._id;

  // 3. Fetch Aggregated Stats
  const stats = await Activity.aggregate([
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

  // 4. Fetch Recent Activities
  const recentActivities = await Activity.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const dashboardStats = stats[0] || { totalCredits: 0, totalCo2: 0, totalEnergy: 0 };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {session.user.name}</h1>
        <p className="text-slate-500 italic">"Your actions today define our planet tomorrow."</p>
      </div>

      {/* 3. Passing real data to the destructured components */}
      <StatCards 
        credits={dashboardStats.totalCredits} 
        co2={dashboardStats.totalCo2} 
        energy={dashboardStats.totalEnergy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* GitHub-style grid using activity dates */}
          <ActivityGrid userId={session.user.id} />
        </div>
        <div className="lg:col-span-1">
          <RecentHistory activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}

