export type ActivityDay = {
  date: string;
  count: number;
};

export type ActivityData = {
  days: ActivityDay[];
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
};

function generateActivityData(): ActivityData {
  const days: ActivityDay[] = [];
  const today = new Date();
  let total = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const seed = (date.getDate() + date.getMonth() * 31) % 7;
    const count = seed === 0 ? 0 : seed <= 2 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 8) + 2;

    days.push({ date: dateStr, count });
    total += count;

    if (count > 0) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
  }

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) currentStreak++;
    else break;
  }

  return { days, totalContributions: total, longestStreak, currentStreak };
}

export const activityData: ActivityData = generateActivityData();
