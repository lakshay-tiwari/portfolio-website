export interface DailyActivity {
  date: string; // YYYY-MM-DD
  github: number | null;
  leetcode: number | null;
  total: number;
}

export interface ActivitySourceResult {
  success: boolean;
  total: number;
  days: Map<string, number>; // date -> count
  error?: string;
  username?: string;
}

export interface ActivitySourceStatus {
  connected: boolean;
  total: number;
  username?: string;
  error?: string;
}

export interface UnifiedActivityData {
  days: DailyActivity[];
  totalContributions: number;
  githubTotal: number;
  leetcodeTotal: number;
  longestStreak: number;
  currentStreak: number;
  sources: {
    github: ActivitySourceStatus;
    leetcode: ActivitySourceStatus;
  };
  range: {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
    totalDays: number;
  };
  updatedAt: string;
}
