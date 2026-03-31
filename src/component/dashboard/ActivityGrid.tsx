interface ActivityGridProps {
  activityDates: string[];
  activeDays: number;
  totalActivities: number;
}

const DAYS_TO_SHOW = 112;
const LEVEL_CLASSES = [
  "dashboard-surface-soft bg-gray-100",
  "bg-[#DDE9FF]",
  "bg-[#9CB9FF]",
  "bg-[#465FFF]",
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

export default function ActivityGrid({
  activityDates,
  activeDays,
  totalActivities,
}: ActivityGridProps) {
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

  const visibleActiveDays = days.filter((day) => day.count > 0).length;
  const maxCount = Math.max(...days.map((day) => day.count), 1);

  return (
    <div className="dashboard-surface dashboard-equal-panel min-w-0 rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-4 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] sm:px-6 sm:pb-5 sm:pt-6">
      <div>
        <p className="dashboard-text-secondary text-sm text-gray-500">Consistency Map</p>
        <h3 className="dashboard-text-primary mt-1 text-lg font-semibold text-gray-800">Activity Grid</h3>
        <p className="dashboard-text-secondary mt-1 max-w-[44rem] text-sm text-gray-500">
          Each square marks a day you submitted activity. Brighter blocks mean more actions logged on that date.
          {` ${visibleActiveDays} active day${visibleActiveDays === 1 ? "" : "s"} are visible in this four-month window.`}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:mt-6 xl:grid-cols-[minmax(0,1fr)_190px] xl:items-start xl:gap-5">
        <div className="overflow-x-auto pb-1">
          <div className="dashboard-surface-alt grid w-max min-w-max grid-flow-col auto-cols-max grid-rows-7 gap-1 rounded-xl bg-gray-50 p-3 sm:gap-1.5 sm:p-4">
            {days.map((day) => (
              <div
                key={day.key}
                className={`h-3.5 w-3.5 rounded-[4px] border border-white transition-colors sm:h-4 sm:w-4 ${LEVEL_CLASSES[getIntensity(day.count, maxCount)]}`}
                title={`${day.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}: ${day.count} activit${day.count === 1 ? "y" : "ies"}`}
              />
            ))}
          </div>
          <div className="dashboard-text-secondary mt-5 flex items-center gap-2 text-xs font-medium text-gray-500 sm:mt-6">
            <span>Less</span>
            <div className="dashboard-surface-soft h-3 w-3 rounded-[2px] bg-gray-100" />
            <div className="h-3 w-3 rounded-[2px] bg-[#DDE9FF]" />
            <div className="h-3 w-3 rounded-[2px] bg-[#9CB9FF]" />
            <div className="h-3 w-3 rounded-[2px] bg-[#465FFF]" />
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-1">
          <div className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
            <p className="dashboard-text-secondary text-xs font-medium text-gray-500">Active Days</p>
            <p className="dashboard-text-primary mt-2 text-2xl font-semibold text-gray-800">{activeDays}</p>
          </div>
          <div className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
            <p className="dashboard-text-secondary text-xs font-medium text-gray-500">Submissions</p>
            <p className="dashboard-text-primary mt-2 text-2xl font-semibold text-gray-800">{totalActivities}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
