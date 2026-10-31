import type { ActivitySourceResult } from "@/types/activity";

interface AlfaLeetCodeCalendarResponse {
  submissionCalendar?: string | Record<string, number>;
  totalActiveDays?: number;
  streak?: number;
  error?: string;
  errors?: Array<{ message: string }>;
}

/**
 * Fetches LeetCode submission activity using the Alfa LeetCode API.
 * Configured via LEETCODE_API_BASE_URL and LEETCODE_USERNAME environment variables.
 * Handles parsing of JSON-encoded string submissionCalendar and multi-year spans
 * covering the rolling 365-day window.
 */
export async function fetchLeetCodeActivity(
  fromDate: Date,
  toDate: Date
): Promise<ActivitySourceResult> {
  const baseUrl = (process.env.LEETCODE_API_BASE_URL || "").trim().replace(/\/$/, "");
  const username = (process.env.LEETCODE_USERNAME || "").trim();

  if (!baseUrl) {
    return {
      success: false,
      total: 0,
      days: new Map(),
      error: "LEETCODE_API_BASE_URL is not configured in environment variables.",
      username,
    };
  }

  if (!username) {
    return {
      success: false,
      total: 0,
      days: new Map(),
      error: "LEETCODE_USERNAME is not configured in environment variables.",
      username,
    };
  }

  const fromDateStr = fromDate.toISOString().split("T")[0];
  const toDateStr = toDate.toISOString().split("T")[0];

  // Determine all calendar years overlapping the rolling window
  const startYear = fromDate.getUTCFullYear();
  const endYear = toDate.getUTCFullYear();
  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  const daysMap = new Map<string, number>();
  let totalCount = 0;
  let anyYearSucceeded = false;
  const errors: string[] = [];

  // Fetch all overlapping years in parallel with a timeout
  await Promise.all(
    years.map(async (year) => {
      const endpoint = `${baseUrl}/${encodeURIComponent(username)}/calendar?year=${year}`;
      const timeoutMs = Number(process.env.LEETCODE_TIMEOUT_MS) || 4000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "portfolio-website-activity-service",
          },
          signal: controller.signal,
          next: { revalidate: 3600 },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          errors.push(`Year ${year}: HTTP ${response.status}`);
          return;
        }

        const data: AlfaLeetCodeCalendarResponse = await response.json();

        if (data.errors && data.errors.length > 0) {
          errors.push(`Year ${year}: ${data.errors.map((e) => e.message).join(", ")}`);
          return;
        }

        if (data.error) {
          errors.push(`Year ${year}: ${data.error}`);
          return;
        }

        anyYearSucceeded = true;

        // Parse submissionCalendar (may be a stringified JSON object)
        let calendarMap: Record<string, number> = {};
        if (typeof data.submissionCalendar === "string") {
          try {
            calendarMap = JSON.parse(data.submissionCalendar);
          } catch {
            calendarMap = {};
          }
        } else if (typeof data.submissionCalendar === "object" && data.submissionCalendar !== null) {
          calendarMap = data.submissionCalendar;
        }

        for (const [timestampStr, countVal] of Object.entries(calendarMap)) {
          const timestampSeconds = parseInt(timestampStr, 10);
          if (isNaN(timestampSeconds)) continue;

          // Convert Unix timestamp in seconds to YYYY-MM-DD in UTC
          const date = new Date(timestampSeconds * 1000).toISOString().split("T")[0];

          // Filter only dates falling inside the rolling window
          if (date >= fromDateStr && date <= toDateStr) {
            const count = Number(countVal) || 0;
            const existing = daysMap.get(date) || 0;
            daysMap.set(date, existing + count);
          }
        }
      } catch (err) {
        clearTimeout(timeoutId);
        const message = err instanceof Error ? err.message : "Unknown error";
        errors.push(`Year ${year}: ${message}`);
      }
    })
  );

  // Recalculate total across mapped days in range
  for (const count of daysMap.values()) {
    totalCount += count;
  }

  if (!anyYearSucceeded) {
    return {
      success: false,
      total: 0,
      days: new Map(),
      error: `Failed to fetch LeetCode calendar from ${baseUrl}: ${errors.join("; ") || "No response"}`,
      username,
    };
  }

  return {
    success: true,
    total: totalCount,
    days: daysMap,
    username,
  };
}
