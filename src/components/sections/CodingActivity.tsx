import { Reveal } from "@/components/motion/Reveal";
import { activityData } from "@/data/activity";

const DAYS = ["Mon", "Wed", "Fri"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-gray-100 dark:bg-white/5";
  if (count <= 2) return "bg-primary-200 dark:bg-primary-900";
  if (count <= 4) return "bg-primary-400 dark:bg-primary-700";
  if (count <= 6) return "bg-primary-500 dark:bg-primary-500";
  return "bg-primary-600 dark:bg-primary-400";
}

export function CodingActivity() {
  const { days, totalContributions, longestStreak, currentStreak } = activityData;
  const weeks: typeof days[] = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <section id="activity" className="section-padding section-ambient">
      <div className="section-container">
        <Reveal>
          <div className="mb-10 md:mb-16">
            <span className="text-xs sm:text-sm font-mono font-semibold tracking-wider uppercase text-primary-600 dark:text-primary-400">
              04. What I've Done
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Coding Activity
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="card-base p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
                  {totalContributions.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Total Contributions
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
                  {longestStreak}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Longest Streak (days)
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
                  {currentStreak}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Current Streak (days)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1 min-w-max">
                <div className="flex flex-col gap-1 mr-1 justify-around pt-5">
                  {DAYS.map((d) => (
                    <span key={d} className="text-[10px] text-gray-400 dark:text-gray-500 h-3 flex items-center">
                      {d}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: Math.ceil(weeks.length / 7) }).map((_, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-gray-400 dark:text-gray-500 w-[52px] text-left"
                      >
                        {MONTHS[(i * 7) % 12]}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            className={`w-3 h-3 rounded-sm ${getIntensityClass(day.count)} hover:ring-2 hover:ring-primary-400/50 transition-all cursor-pointer`}
                            title={`${day.date}: ${day.count} contributions`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-5 md:mt-6 gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Past 12 months</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 dark:text-gray-500">Less</span>
                {[0, 2, 4, 6, 8].map((c) => (
                  <div key={c} className={`w-3 h-3 rounded-sm ${getIntensityClass(c)}`} />
                ))}
                <span className="text-xs text-gray-400 dark:text-gray-500">More</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
