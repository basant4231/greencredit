interface ActivityGridProps {
  activityDates: string[];
}

const DAYS_TO_SHOW = 112;
const LEVEL_CLASSES = [
  "bg-slate-100",
  "bg-emerald-200",
  "bg-emerald-400",
  "bg-emerald-600",
];

function getDateKey(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, "0");
  const day = String(normalized.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getIntensity(count: number, maxCount: number) {
  if (count === 0) return 0;

  const ratio = count / maxCount;
  if (ratio >= 0.75) return 3;
  if (ratio >= 0.4) return 2;
  return 1;
}

export default function ActivityGrid({ activityDates }: ActivityGridProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (DAYS_TO_SHOW - 1));

  const countsByDay = new Map<string, number>();
  for (const dateString of activityDates) {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    if (date < startDate || date > today) {
      continue;
    }

    const key = getDateKey(date);
    countsByDay.set(key, (countsByDay.get(key) || 0) + 1);
  }

  const days = Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const key = getDateKey(date);

    return {
      key,
      date,
      count: countsByDay.get(key) || 0,
    };
  });

  const activeDays = days.filter((day) => day.count > 0).length;
  const maxCount = Math.max(...days.map((day) => day.count), 1);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Daily Activity</h3>
          <p className="mt-1 text-xs text-slate-400">
            {activeDays} active day{activeDays === 1 ? "" : "s"} in the last 4 months.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-medium">Last 4 Months</span>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-flow-col auto-cols-max grid-rows-7 gap-1.5 min-w-max">
          {days.map((day) => (
            <div
              key={day.key}
              className={`w-4 h-4 rounded-[2px] cursor-pointer transition-colors ${LEVEL_CLASSES[getIntensity(day.count, maxCount)]}`}
              title={`${day.date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}: ${day.count} activit${day.count === 1 ? "y" : "ies"}`}
            />
          ))}
        </div>
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
