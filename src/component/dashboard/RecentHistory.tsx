import React from 'react';

const activities = [
  { id: 1, title: "Planted a Tree", date: "2 hours ago", points: "+50", status: "Approved" },
  { id: 2, title: "Used Public Transit", date: "Yesterday", points: "+20", status: "Approved" },
  { id: 3, title: "Recycled Plastic", date: "Feb 28", points: "+15", status: "Pending" },
];

export default function RecentHistory() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
      <h3 className="font-bold text-slate-800 text-lg mb-6">History of Recent Activities</h3>
      <div className="space-y-4 flex-1">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">{activity.title}</p>
              <p className="text-xs text-slate-400">{activity.date}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-emerald-600 block">{activity.points}</span>
              <span className={`text-[10px] font-bold ${activity.status === 'Pending' ? 'text-amber-500' : 'text-slate-400'}`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-3 text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
        View All History
      </button>
    </div>
  );
}