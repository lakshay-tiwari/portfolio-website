export type ThemeMode = "dark" | "light" | "system";

export const DEFAULT_THEME: ThemeMode = "dark";

export function resolveTheme(stored: string | null, prefersDark: boolean): boolean {
  if (stored === "dark") return true;
  if (stored === "light") return false;
  if (DEFAULT_THEME === "system") return prefersDark;
  return DEFAULT_THEME === "dark";
}
