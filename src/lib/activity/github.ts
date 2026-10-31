import type { ActivitySourceResult } from "@/types/activity";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const GITHUB_CONTRIBUTIONS_QUERY = `
  query GitHubContributions($from: DateTime!, $to: DateTime!) {
    viewer {
      login
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

interface GitHubGraphQLResponse {
  data?: {
    viewer?: {
      login: string;
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              contributionCount: number;
              contributionLevel: string;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Fetches GitHub contributions for the authenticated viewer using GitHub GraphQL API.
 * Uses a GitHub Classic Personal Access Token with `read:user` scope to retrieve
 * both public and private contributions securely without retrieving repository code or commits.
 */
export async function fetchGitHubActivity(
  fromDate: Date,
  toDate: Date
): Promise<ActivitySourceResult> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const configuredUsername = process.env.GITHUB_USERNAME?.trim();

  if (!token) {
    return {
      success: false,
      total: 0,
      days: new Map(),
      error: "GITHUB_TOKEN is not configured in environment variables.",
      username: configuredUsername,
    };
  }

  const timeoutMs = Number(process.env.GITHUB_TIMEOUT_MS) || 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-website-activity-service",
      },
      body: JSON.stringify({
        query: GITHUB_CONTRIBUTIONS_QUERY,
        variables: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
      }),
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        total: 0,
        days: new Map(),
        error: `GitHub API HTTP ${response.status}: ${errorText.slice(0, 200)}`,
        username: configuredUsername,
      };
    }

    const payload: GitHubGraphQLResponse = await response.json();

    if (payload.errors && payload.errors.length > 0) {
      const errorMessage = payload.errors.map((e) => e.message).join(", ");
      return {
        success: false,
        total: 0,
        days: new Map(),
        error: `GitHub GraphQL error: ${errorMessage}`,
        username: configuredUsername,
      };
    }

    const calendar = payload.data?.viewer?.contributionsCollection?.contributionCalendar;
    const actualUsername = payload.data?.viewer?.login || configuredUsername;

    if (!calendar) {
      return {
        success: false,
        total: 0,
        days: new Map(),
        error: "GitHub contribution calendar data missing in response.",
        username: actualUsername,
      };
    }

    const daysMap = new Map<string, number>();

    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        daysMap.set(day.date, day.contributionCount);
      }
    }

    return {
      success: true,
      total: calendar.totalContributions,
      days: daysMap,
      username: actualUsername,
    };
  } catch (error) {
    return {
      success: false,
      total: 0,
      days: new Map(),
      error: error instanceof Error ? error.message : "Unknown error fetching GitHub activity",
      username: configuredUsername,
    };
  }
}
