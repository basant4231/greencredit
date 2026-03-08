import React from 'react';

// 1. Define the Interface to tell TypeScript what props to expect
interface ActivityGridProps {
  userId: string;
}

// 2. Accept the props in the function arguments
export default function ActivityGrid({ userId }: ActivityGridProps) {
  // Mocking 112 days of data
  const days = Array.from({ length: 112 });

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Daily Activity</h3>
          {/* Optional: Show who this data belongs to for debugging */}
          <p className="text-[10px] text-slate-400">User ID: {userId.substring(0, 8)}...</p>
        </div>
        <span className="text-xs text-slate-400 font-medium">Last 4 Months</span>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {days.map((_, i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-[2px] transition-colors cursor-pointer ${
              i % 7 === 0 ? 'bg-emerald-500' : 
              i % 10 === 0 ? 'bg-emerald-300' : 
              'bg-slate-100 hover:bg-slate-200'
            }`}
            title={`Activity on Day ${i + 1}`}
          />
        ))}
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
        <span>Less</span>
        <div className="w-3 h-3 bg-slate-100 rounded-[2px]" />
        <div className="w-3 h-3 bg-emerald-200 rounded-[2px]" />
        <div className="w-3 h-3 bg-emerald-400 rounded-[2px]" />
        <div className="w-3 h-3 bg-emerald-600 rounded-[2px]" />
        <span>More</span>
      </div>
    </div>
  );
}