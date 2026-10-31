import { getActivityDateRange, mergeDailyActivity } from "./unified";
import assert from "node:assert";

console.log("=========================================");
console.log("PHASE 2 - TEST 1: Date Generation Tests");
console.log("=========================================");

const { fromDate, toDate, dates } = getActivityDateRange();

// 1. Exactly 365 calendar dates generated
console.log(`1. Total dates generated: ${dates.length}`);
assert.strictEqual(dates.length, 365, "Expected exactly 365 dates");
console.log("   ✓ PASS: Exactly 365 calendar dates generated.");

// 2. Today must be included
const now = new Date();
const todayUTC = now.toISOString().split("T")[0];
const lastDate = dates[dates.length - 1];
console.log(`2. Today (UTC): ${todayUTC}, Last date in array: ${lastDate}`);
assert.strictEqual(lastDate, todayUTC, "Today must be the last date in the generated range");
console.log("   ✓ PASS: Today is included as the last date.");

// 3. No duplicate dates
const uniqueDates = new Set(dates);
console.log(`3. Unique dates count: ${uniqueDates.size}`);
assert.strictEqual(uniqueDates.size, 365, "Expected no duplicate dates");
console.log("   ✓ PASS: No duplicate dates.");

// 4. No future dates
for (const d of dates) {
  if (d > todayUTC) {
    throw new Error(`Found future date: ${d} > ${todayUTC}`);
  }
}
console.log("4. Future dates check: None found.");
console.log("   ✓ PASS: No future dates.");

// 5. Dates must be in chronological order
for (let i = 1; i < dates.length; i++) {
  const prev = new Date(dates[i - 1]);
  const curr = new Date(dates[i]);
  const diffMs = curr.getTime() - prev.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  assert.strictEqual(diffDays, 1, `Dates not consecutive: ${dates[i - 1]} -> ${dates[i]}`);
  assert.ok(dates[i] > dates[i - 1], `Dates not sorted: ${dates[i - 1]} >= ${dates[i]}`);
}
console.log("5. Chronological order & 1-day step check: All strictly consecutive.");
console.log("   ✓ PASS: Dates are in strictly increasing chronological order.");

// 6. Handle year boundaries correctly
const yearsInDates = Array.from(new Set(dates.map((d) => d.slice(0, 4))));
console.log(`6. Year boundaries represented in dates: ${yearsInDates.join(" -> ")}`);
assert.ok(yearsInDates.length >= 1, "Expected at least one year represented");
const dec31 = dates.find((d) => d.endsWith("-12-31"));
const jan01 = dates.find((d) => d.endsWith("-01-01"));
if (dec31 && jan01) {
  const dec31Index = dates.indexOf(dec31);
  const jan01Index = dates.indexOf(jan01);
  assert.strictEqual(jan01Index, dec31Index + 1, "Jan 01 must directly follow Dec 31");
  console.log(`   Year transition verified: ${dates[dec31Index]} followed by ${dates[jan01Index]}`);
}
console.log("   ✓ PASS: Year boundaries handled seamlessly without skips or shifts.");

console.log("\n=========================================");
console.log("PHASE 2 - TEST 2: Data Merging Scenarios");
console.log("=========================================");

// Scenario A: Both providers have activity on the same date
// GitHub: 5, LeetCode: 3 => Expected total: 8
const scenarioA = mergeDailyActivity("2026-05-10", 5, 3);
console.log("Scenario A (Both active):", scenarioA);
assert.strictEqual(scenarioA.github, 5);
assert.strictEqual(scenarioA.leetcode, 3);
assert.strictEqual(scenarioA.total, 8);
console.log("   ✓ PASS: Scenario A merged correctly (5 + 3 = 8).");

// Scenario B: GitHub-only activity
// GitHub: 5, LeetCode: 0 => Expected total: 5
const scenarioB = mergeDailyActivity("2026-05-11", 5, 0);
console.log("Scenario B (GitHub only):", scenarioB);
assert.strictEqual(scenarioB.github, 5);
assert.strictEqual(scenarioB.leetcode, 0);
assert.strictEqual(scenarioB.total, 5);
console.log("   ✓ PASS: Scenario B merged correctly (5 + 0 = 5).");

// Scenario C: LeetCode-only activity
// GitHub: 0, LeetCode: 4 => Expected total: 4
const scenarioC = mergeDailyActivity("2026-05-12", 0, 4);
console.log("Scenario C (LeetCode only):", scenarioC);
assert.strictEqual(scenarioC.github, 0);
assert.strictEqual(scenarioC.leetcode, 4);
assert.strictEqual(scenarioC.total, 4);
console.log("   ✓ PASS: Scenario C merged correctly (0 + 4 = 4).");

// Scenario D: Neither provider has activity
// GitHub: 0, LeetCode: 0 => Expected total: 0
const scenarioD = mergeDailyActivity("2026-05-13", 0, 0);
console.log("Scenario D (Neither active):", scenarioD);
assert.strictEqual(scenarioD.github, 0);
assert.strictEqual(scenarioD.leetcode, 0);
assert.strictEqual(scenarioD.total, 0);
console.log("   ✓ PASS: Scenario D merged correctly (0 + 0 = 0).");

// Scenario E: One provider has unavailable data
// GitHub: 5, LeetCode: null => Expected: GitHub: 5, LeetCode: unavailable (null), Total known activity: 5
const scenarioE = mergeDailyActivity("2026-05-14", 5, null);
console.log("Scenario E (LeetCode unavailable):", scenarioE);
assert.strictEqual(scenarioE.github, 5);
assert.strictEqual(scenarioE.leetcode, null);
assert.strictEqual(scenarioE.total, 5);
console.log("   ✓ PASS: Scenario E handled correctly (GitHub: 5, LeetCode: null, Total: 5).");

// Extra Scenario E2: GitHub unavailable, LeetCode: 7 => Total: 7
const scenarioE2 = mergeDailyActivity("2026-05-15", null, 7);
console.log("Scenario E2 (GitHub unavailable):", scenarioE2);
assert.strictEqual(scenarioE2.github, null);
assert.strictEqual(scenarioE2.leetcode, 7);
assert.strictEqual(scenarioE2.total, 7);
console.log("   ✓ PASS: Scenario E2 handled correctly (GitHub: null, LeetCode: 7, Total: 7).");

console.log("\n>>> ALL TEST 1 & TEST 2 CHECKS PASSED SUCCESSFULLY! <<<\n");
