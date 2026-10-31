"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Reveal } from "@/components/motion/Reveal";
import type { DailyActivity, UnifiedActivityData } from "@/types/activity";

const WEEKDAYS = [
  { label: "", index: 0 },
  { label: "Mon", index: 1 },
  { label: "", index: 2 },
  { label: "Wed", index: 3 },
  { label: "", index: 4 },
  { label: "Fri", index: 5 },
  { label: "", index: 6 },
];

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-gray-200/70 dark:bg-white/5 border border-transparent";
  if (count <= 2) return "bg-primary-200 dark:bg-primary-900/60 border border-primary-300/40 dark:border-primary-800/40";
  if (count <= 5) return "bg-primary-400 dark:bg-primary-700/70 border border-primary-500/40 dark:border-primary-600/40";
  if (count <= 9) return "bg-primary-500 dark:bg-primary-500 border border-primary-600/40 dark:border-primary-400/40";
  return "bg-primary-600 dark:bg-primary-400 border border-primary-700/40 dark:border-primary-300/40";
}

function formatDateDisplay(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateStr;
  }
}

export function CodingActivity() {
  const [data, setData] = useState<UnifiedActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hoveredDay, setHoveredDay] = useState<DailyActivity | null>(null);
  const [selectedDay, setSelectedDay] = useState<DailyActivity | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchActivity() {
      try {
        const res = await fetch("/api/activity");
        if (!res.ok) {
          throw new Error(`Failed to load activity (HTTP ${res.status})`);
        }
        const json: UnifiedActivityData = await res.json();
        if (isMounted) {
          setData(json);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error loading activity");
          setIsLoading(false);
        }
      }
    }

    fetchActivity();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll to current week on mobile devices only
  useEffect(() => {
    if (!isLoading && scrollContainerRef.current) {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
      }
    }
  }, [isLoading]);

  // Transform 365 days into 53 weekly columns aligned by Sunday (row 0) to Saturday (row 6)
  const { columns, monthLabels } = useMemo(() => {
    if (!data || !data.days || data.days.length === 0) {
      return { columns: [], monthLabels: [] };
    }

    const firstDateStr = data.days[0].date;
    const [y, m, d] = firstDateStr.split("-").map(Number);
    const firstDate = new Date(Date.UTC(y, m - 1, d));
    const startDayOfWeek = firstDate.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    const cols: (DailyActivity | null)[][] = [];
    let currentCol: (DailyActivity | null)[] = [];

    // Pad beginning of first week
    for (let i = 0; i < startDayOfWeek; i++) {
      currentCol.push(null);
    }

    for (const day of data.days) {
      currentCol.push(day);
      if (currentCol.length === 7) {
        cols.push(currentCol);
        currentCol = [];
      }
    }

    if (currentCol.length > 0) {
      while (currentCol.length < 7) {
        currentCol.push(null);
      }
      cols.push(currentCol);
    }

    // Determine month labels based on where each month first appears in columns
    const labels: { colIndex: number; name: string }[] = [];
    let lastMonth = "";

    cols.forEach((col, colIdx) => {
      const firstValidDay = col.find((item): item is DailyActivity => item !== null);
      if (firstValidDay) {
        const [dy, dm, dd] = firstValidDay.date.split("-").map(Number);
        const dateObj = new Date(Date.UTC(dy, dm - 1, dd));
        const monthName = dateObj.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
        if (monthName !== lastMonth) {
          labels.push({ colIndex: colIdx, name: monthName });
          lastMonth = monthName;
        }
      }
    });

    return { columns: cols, monthLabels: labels };
  }, [data]);

  const activeDay = selectedDay || hoveredDay;

  const handleCellClick = (day: DailyActivity, e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedDay?.date === day.date) {
      setSelectedDay(null);
      setTooltipPos(null);
    } else {
      setSelectedDay(day);
      if (cardContainerRef.current) {
        const cardRect = cardContainerRef.current.getBoundingClientRect();
        const cellRect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({
          x: cellRect.left - cardRect.left + cellRect.width / 2,
          y: cellRect.top - cardRect.top,
        });
      }
    }
  };

  const handleCellMouseEnter = (day: DailyActivity, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredDay(day);
    if (!selectedDay && cardContainerRef.current) {
      const cardRect = cardContainerRef.current.getBoundingClientRect();
      const cellRect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({
        x: cellRect.left - cardRect.left + cellRect.width / 2,
        y: cellRect.top - cardRect.top,
      });
    }
  };

  const handleCellMouseLeave = () => {
    setHoveredDay(null);
    if (!selectedDay) {
      setTooltipPos(null);
    }
  };

  return (
    <section id="activity" className="py-10 md:py-16 relative">
      <div className="section-container">
        <Reveal>
          <div className="mb-6 sm:mb-8">
            <span className="text-xs font-mono font-semibold tracking-wider uppercase text-primary-600 dark:text-primary-400">
              Activity
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Coding Activity
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div
            ref={cardContainerRef}
            className="relative rounded-3xl border border-dashed border-gray-300/90 dark:border-white/15 p-4 sm:p-6 md:p-8 bg-white/40 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm"
          >
            {/* Top Stat Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
                  {isLoading ? "..." : (data?.totalContributions ?? 0).toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Total Contributions
                </p>
                {data && !isLoading && (
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {data.sources.github.connected && data.sources.leetcode.connected
                      ? `GH: ${data.githubTotal} · LC: ${data.leetcodeTotal}`
                      : data.sources.github.connected
                      ? `GitHub: ${data.githubTotal}`
                      : data.sources.leetcode.connected
                      ? `LeetCode: ${data.leetcodeTotal}`
                      : ""}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
                  {isLoading ? "..." : (data?.longestStreak ?? 0)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Longest Streak (days)
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
                  {isLoading ? "..." : (data?.currentStreak ?? 0)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Current Streak (days)
                </p>
              </div>
            </div>

            {data && !data.sources.github.connected && !data.sources.leetcode.connected ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm font-medium">Activity data is temporarily unavailable.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Synced activity will appear automatically once connection is restored.
                </p>
              </div>
            ) : (
              <>
                {/* Heatmap Grid Container with Pinned Weekday Labels */}
                <div className="flex select-none">
              {/* Weekday Labels (Mon, Wed, Fri) aligned to 7 rows - Pinned outside scroll container */}
              <div className="flex flex-col gap-1 pr-2 pt-[21px] shrink-0">
                {WEEKDAYS.map((wd) => (
                  <span
                    key={wd.index}
                    className="text-[10px] text-gray-400 dark:text-gray-500 h-3 flex items-center leading-none"
                  >
                    {wd.label}
                  </span>
                ))}
              </div>

              {/* Scrollable Calendar Columns and Month Header */}
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto pb-2 scrollbar-none sm:scrollbar-thin flex-1 min-w-0"
              >
                <div className="min-w-max">
                  {/* Month Labels Header */}
                  <div className="flex gap-1 mb-1 h-4 relative">
                    {monthLabels.map((mItem, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-gray-400 dark:text-gray-500 absolute whitespace-nowrap"
                        style={{ left: `${mItem.colIndex * 16}px` }}
                      >
                        {mItem.name}
                      </span>
                    ))}
                  </div>

                  {/* 53 Columns */}
                  <div className="flex gap-1 pt-1">
                    {isLoading ? (
                      // Skeleton loader with exact matching grid dimensions
                      Array.from({ length: 53 }).map((_, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-1">
                          {Array.from({ length: 7 }).map((_, rowIdx) => (
                            <div
                              key={rowIdx}
                              className="w-3 h-3 rounded-sm bg-gray-200/50 dark:bg-white/5 animate-pulse"
                            />
                          ))}
                        </div>
                      ))
                    ) : (
                      columns.map((col, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-1">
                          {col.map((day, rowIdx) => {
                            if (!day) {
                              return (
                                <div
                                  key={`empty-${colIdx}-${rowIdx}`}
                                  className="w-3 h-3 rounded-sm opacity-0 pointer-events-none"
                                />
                              );
                            }

                            const isSelected = selectedDay?.date === day.date;
                            const isHovered = hoveredDay?.date === day.date;

                            return (
                              <div
                                key={day.date}
                                onClick={(e) => handleCellClick(day, e)}
                                onMouseEnter={(e) => handleCellMouseEnter(day, e)}
                                onMouseLeave={handleCellMouseLeave}
                                className={`w-3 h-3 rounded-sm ${getIntensityClass(day.total)} ${
                                  isSelected || isHovered
                                    ? "ring-2 ring-primary-500 dark:ring-primary-400 scale-125 z-10"
                                    : "hover:ring-1 hover:ring-primary-400/60"
                                } transition-all cursor-pointer`}
                                role="button"
                                tabIndex={0}
                                aria-label={`${day.date}: ${day.total} activities`}
                              />
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Floating Tooltip */}
            {activeDay && tooltipPos && (
              <div
                className="hidden sm:block absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-2 transition-all duration-150"
                style={{
                  left: `${Math.max(100, Math.min(tooltipPos.x, (cardContainerRef.current?.clientWidth || 600) - 100))}px`,
                  top: `${tooltipPos.y}px`,
                }}
              >
                <div className="bg-gray-900/95 dark:bg-gray-800/95 text-white backdrop-blur-md rounded-xl p-2.5 shadow-xl border border-white/10 text-xs min-w-[170px]">
                  <p className="font-semibold text-gray-200 mb-1">
                    {formatDateDisplay(activeDay.date)}
                  </p>
                  <p className="font-bold text-primary-400 mb-1.5">
                    {activeDay.total} {activeDay.total === 1 ? "contribution" : "contributions"}
                  </p>
                  <div className="flex flex-col gap-0.5 text-[11px] text-gray-300 border-t border-white/10 pt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">GitHub:</span>
                      <span className="font-mono">
                        {activeDay.github === null ? "Unavailable" : `${activeDay.github}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">LeetCode:</span>
                      <span className="font-mono">
                        {activeDay.leetcode === null ? "Unavailable" : `${activeDay.leetcode}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile / Tap Interactive Info Card */}
            {activeDay && (
              <div className="sm:hidden mt-4 p-3 rounded-2xl bg-gray-100/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-xs animate-in fade-in duration-200">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatDateDisplay(activeDay.date)}
                  </span>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                    aria-label="Close details"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                  <span>
                    Total: <strong className="text-primary-600 dark:text-primary-400">{activeDay.total}</strong>
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    GitHub: {activeDay.github === null ? "N/A" : activeDay.github} · LeetCode: {activeDay.leetcode === null ? "N/A" : activeDay.leetcode}
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Legend and Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-5 md:mt-6 gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span>Past 12 months</span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {data?.sources.github.connected && data?.sources.leetcode.connected
                    ? "GitHub & LeetCode unified"
                    : data?.sources.github.connected
                    ? "GitHub contributions"
                    : data?.sources.leetcode.connected
                    ? "LeetCode submissions"
                    : "Activity timeline"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 dark:text-gray-500">Less</span>
                {[0, 2, 5, 8, 12].map((c) => (
                  <div key={c} className={`w-3 h-3 rounded-sm ${getIntensityClass(c)}`} />
                ))}
                <span className="text-xs text-gray-400 dark:text-gray-500">More</span>
              </div>
            </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
