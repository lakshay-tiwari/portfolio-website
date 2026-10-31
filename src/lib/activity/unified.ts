import type { DailyActivity, UnifiedActivityData, ActivitySourceResult } from "@/types/activity";
import { fetchGitHubActivity } from "./github";
import { fetchLeetCodeActivity } from "./leetcode";

/**
 * Returns rolling 365-day range (start and end Dates in UTC).
 */
export function getActivityDateRange(): { fromDate: Date; toDate: Date; dates: string[] } {
  const now = new Date();
  // End of today UTC
  const toDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
  
  // 364 days before today (365 days total, inclusive)
  const fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 364, 0, 0, 0, 0));

  const dates: string[] = [];
  const current = new Date(fromDate);
  while (current <= toDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return { fromDate, toDate, dates };
}

/**
 * Merges activity counts from providers for a single date.
 * If a provider's data is unavailable (null), it is preserved as null rather
 * than 0, while total computes the sum of all known activities.
 */
export function mergeDailyActivity(
  date: string,
  github: number | null,
  leetcode: number | null
): DailyActivity {
  const ghKnown = typeof github === "number";
  const lcKnown = typeof leetcode === "number";
  const total = (ghKnown ? github : 0) + (lcKnown ? leetcode : 0);

  return {
    date,
    github,
    leetcode,
    total,
  };
}

interface CachedSource {
  data: ActivitySourceResult;
  timestamp: number;
}

let cachedGitHub: CachedSource | null = null;
let cachedLeetCode: CachedSource | null = null;

export const DEFAULT_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Resets the in-memory activity cache. Useful for testing failure scenarios.
 */
export function resetActivityCache(): void {
  cachedGitHub = null;
  cachedLeetCode = null;
}

/**
 * Returns current cache status for debugging and test verification.
 */
export function getActivityCacheStatus() {
  return {
    github: cachedGitHub
      ? { timestamp: cachedGitHub.timestamp, total: cachedGitHub.data.total, days: cachedGitHub.data.days.size }
      : null,
    leetcode: cachedLeetCode
      ? { timestamp: cachedLeetCode.timestamp, total: cachedLeetCode.data.total, days: cachedLeetCode.data.days.size }
      : null,
  };
}

/**
 * Aggregates GitHub contributions and LeetCode submissions into a unified 365-day dataset.
 * Server-side only: never exposes API tokens or credentials to client.
 * Features stale-while-revalidate fallback: if an API fails, the last known good
 * cached calendar is served if available. Failures are never cached as empty data.
 */
export async function getUnifiedActivity(options: {
  forceFresh?: boolean;
  cacheTtlMs?: number;
} = {}): Promise<UnifiedActivityData> {
  const { fromDate, toDate, dates } = getActivityDateRange();
  const now = Date.now();
  const ttl = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;

  // 1. Resolve GitHub data (Cache -> Fetch -> Fallback)
  let githubResult: ActivitySourceResult;
  const isGitHubCacheValid = !options.forceFresh && cachedGitHub && (now - cachedGitHub.timestamp) < ttl;

  if (isGitHubCacheValid && cachedGitHub) {
    githubResult = cachedGitHub.data;
  } else {
    githubResult = await fetchGitHubActivity(fromDate, toDate);
    if (githubResult.success) {
      cachedGitHub = { data: githubResult, timestamp: now };
    } else if (cachedGitHub) {
      // Fallback to last successful cached data during provider outage
      githubResult = {
        ...cachedGitHub.data,
        error: `Provider issue: ${githubResult.error} (Serving last cached activity)`,
      };
    }
  }

  // 2. Resolve LeetCode data (Cache -> Fetch -> Fallback)
  let leetcodeResult: ActivitySourceResult;
  const isLeetCodeCacheValid = !options.forceFresh && cachedLeetCode && (now - cachedLeetCode.timestamp) < ttl;

  if (isLeetCodeCacheValid && cachedLeetCode) {
    leetcodeResult = cachedLeetCode.data;
  } else {
    leetcodeResult = await fetchLeetCodeActivity(fromDate, toDate);
    if (leetcodeResult.success) {
      cachedLeetCode = { data: leetcodeResult, timestamp: now };
    } else if (cachedLeetCode) {
      // Fallback to last successful cached data during provider outage
      leetcodeResult = {
        ...cachedLeetCode.data,
        error: `Provider issue: ${leetcodeResult.error} (Serving last cached activity)`,
      };
    }
  }

  let githubTotal = 0;
  let leetcodeTotal = 0;

  const githubAvailable = githubResult.success;
  const leetcodeAvailable = leetcodeResult.success;

  const days: DailyActivity[] = dates.map((date) => {
    const ghCount = githubAvailable ? (githubResult.days.get(date) ?? 0) : null;
    const lcCount = leetcodeAvailable ? (leetcodeResult.days.get(date) ?? 0) : null;

    if (ghCount !== null) githubTotal += ghCount;
    if (lcCount !== null) leetcodeTotal += lcCount;

    return mergeDailyActivity(date, ghCount, lcCount);
  });

  // Calculate longest streak across the unified 365-day window
  let longestStreak = 0;
  let currentStreak = 0;
  let streakCounter = 0;

  for (let i = 0; i < days.length; i++) {
    if (days[i].total > 0) {
      streakCounter++;
      if (streakCounter > longestStreak) {
        longestStreak = streakCounter;
      }
    } else {
      streakCounter = 0;
    }
  }

  // Calculate current streak counting backwards from the most recent day
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].total > 0) {
      currentStreak++;
    } else {
      // If today has no contributions yet, don't break streak if yesterday was active
      if (i === days.length - 1) {
        continue;
      }
      break;
    }
  }

  return {
    days,
    totalContributions: githubTotal + leetcodeTotal,
    githubTotal,
    leetcodeTotal,
    longestStreak,
    currentStreak,
    sources: {
      github: {
        connected: githubResult.success,
        total: githubTotal,
        username: githubResult.username,
        error: githubResult.error,
      },
      leetcode: {
        connected: leetcodeResult.success,
        total: leetcodeTotal,
        username: leetcodeResult.username,
        error: leetcodeResult.error,
      },
    },
    range: {
      start: dates[0] || "",
      end: dates[dates.length - 1] || "",
      totalDays: dates.length,
    },
    updatedAt: new Date().toISOString(),
  };
}
