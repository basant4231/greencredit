import React from 'react';

// 1. Define the Interface for the activities array
interface Activity {
  _id: string;
  activityType: string;
  creditsEarned: number;
  status: string;
  createdAt: string | Date;
}

interface RecentHistoryProps {
  activities: Activity[];
}

// 2. Accept the 'activities' prop in the function
export default function RecentHistory({ activities }: RecentHistoryProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 text-lg mb-6">Recent Activities</h3>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity._id.toString()} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  {/* You can add dynamic icons based on activityType here */}
                  🌱
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 capitalize">
                    {activity.activityType}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">+{activity.creditsEarned}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  {activity.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm italic">
            No recent activities found.
          </div>
        )}
      </div>
    </div>
  );
}