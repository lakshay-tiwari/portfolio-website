import assert from "node:assert";
import { getUnifiedActivity, resetActivityCache, getActivityCacheStatus, DEFAULT_CACHE_TTL_MS } from "./unified";
import { fetchGitHubActivity } from "./github";
import { fetchLeetCodeActivity } from "./leetcode";

async function runPhase3Tests() {
  console.log("=================================================");
  console.log("PHASE 3: FAILURE SIMULATION & PRODUCTION TESTING");
  console.log("=================================================");

  const originalGhToken = process.env.GITHUB_TOKEN;
  const originalLcUrl = process.env.LEETCODE_API_BASE_URL;

  // -----------------------------------------------------------------
  // TEST 1: Both APIs working
  // -----------------------------------------------------------------
  console.log("\n--- TEST 1: Both APIs Working ---");
  resetActivityCache();
  const test1 = await getUnifiedActivity({ forceFresh: true });
  console.log("Test 1 Result:", {
    totalContributions: test1.totalContributions,
    githubTotal: test1.githubTotal,
    leetcodeTotal: test1.leetcodeTotal,
    longestStreak: test1.longestStreak,
    currentStreak: test1.currentStreak,
    sources: test1.sources,
  });

  assert.strictEqual(test1.sources.github.connected, true, "GitHub must be connected");
  assert.strictEqual(test1.sources.leetcode.connected, true, "LeetCode must be connected");
  assert.ok(test1.githubTotal > 0, "GitHub total should be > 0");
  assert.ok(test1.leetcodeTotal > 0, "LeetCode total should be > 0");
  assert.strictEqual(test1.totalContributions, test1.githubTotal + test1.leetcodeTotal, "Combined totals must match exactly");
  console.log("✓ TEST 1 PASSED: Both APIs connected and unified correctly.");

  // -----------------------------------------------------------------
  // TEST 2: LeetCode API unavailable (GitHub-only heatmap)
  // -----------------------------------------------------------------
  console.log("\n--- TEST 2: LeetCode API Unavailable ---");
  resetActivityCache();
  // Point to an unreachable port to simulate LeetCode service down
  process.env.LEETCODE_API_BASE_URL = "http://localhost:59999";
  const test2 = await getUnifiedActivity({ forceFresh: true });
  console.log("Test 2 Result (LeetCode down):", {
    totalContributions: test2.totalContributions,
    githubTotal: test2.githubTotal,
    leetcodeTotal: test2.leetcodeTotal,
    sources: test2.sources,
  });

  assert.strictEqual(test2.sources.github.connected, true, "GitHub must still load");
  assert.strictEqual(test2.sources.leetcode.connected, false, "LeetCode should be disconnected");
  assert.strictEqual(test2.leetcodeTotal, 0, "LeetCode total should be 0 when unavailable");
  assert.strictEqual(test2.totalContributions, test2.githubTotal, "Total should equal GitHub-only count");
  // Ensure no fabricated data in days
  for (const day of test2.days) {
    assert.strictEqual(day.leetcode, null, "LeetCode count must be null (unavailable), not a fabricated dummy number");
  }
  console.log("✓ TEST 2 PASSED: GitHub-only activity served gracefully without dummy data.");

  // -----------------------------------------------------------------
  // TEST 3: GitHub API unavailable (LeetCode-only heatmap)
  // -----------------------------------------------------------------
  console.log("\n--- TEST 3: GitHub API Unavailable ---");
  resetActivityCache();
  process.env.LEETCODE_API_BASE_URL = originalLcUrl;
  process.env.GITHUB_TOKEN = "ghp_simulated_invalid_token_for_testing_999999";
  const test3 = await getUnifiedActivity({ forceFresh: true });
  console.log("Test 3 Result (GitHub down):", {
    totalContributions: test3.totalContributions,
    githubTotal: test3.githubTotal,
    leetcodeTotal: test3.leetcodeTotal,
    sources: test3.sources,
  });

  assert.strictEqual(test3.sources.github.connected, false, "GitHub should report disconnected");
  assert.strictEqual(test3.sources.leetcode.connected, true, "LeetCode must still load");
  assert.strictEqual(test3.githubTotal, 0, "GitHub total should be 0 when unavailable");
  assert.strictEqual(test3.totalContributions, test3.leetcodeTotal, "Total should equal LeetCode-only count");
  for (const day of test3.days) {
    assert.strictEqual(day.github, null, "GitHub count must be null (unavailable), not fabricated");
  }
  console.log("✓ TEST 3 PASSED: LeetCode-only activity served gracefully when GitHub is down.");

  // -----------------------------------------------------------------
  // TEST 4: Both APIs unavailable
  // -----------------------------------------------------------------
  console.log("\n--- TEST 4: Both APIs Unavailable ---");
  resetActivityCache();
  process.env.GITHUB_TOKEN = "ghp_simulated_invalid_token_for_testing_999999";
  process.env.LEETCODE_API_BASE_URL = "http://localhost:59999";
  const test4 = await getUnifiedActivity({ forceFresh: true });
  console.log("Test 4 Result (Both down):", {
    totalContributions: test4.totalContributions,
    sources: test4.sources,
  });

  assert.strictEqual(test4.sources.github.connected, false, "GitHub must be disconnected");
  assert.strictEqual(test4.sources.leetcode.connected, false, "LeetCode must be disconnected");
  assert.strictEqual(test4.totalContributions, 0, "Total must be 0 with no fabricated activity");
  for (const day of test4.days) {
    assert.strictEqual(day.github, null, "GitHub must be null");
    assert.strictEqual(day.leetcode, null, "LeetCode must be null");
    assert.strictEqual(day.total, 0, "Total must be 0");
  }
  console.log("✓ TEST 4 PASSED: System did not crash; clean unavailable state returned with zero fabricated data.");

  // Restore valid environment
  process.env.GITHUB_TOKEN = originalGhToken;
  process.env.LEETCODE_API_BASE_URL = originalLcUrl;

  // -----------------------------------------------------------------
  // TEST 5: Slow API response & AbortController timeout
  // -----------------------------------------------------------------
  console.log("\n--- TEST 5: Slow API Response & Timeout ---");
  resetActivityCache();
  // Set timeout to 100ms and point to a slow/blackhole endpoint
  process.env.LEETCODE_TIMEOUT_MS = "150";
  // Point to a non-routable IP in test range (10.255.255.1) which drops packets to simulate lag
  process.env.LEETCODE_API_BASE_URL = "http://10.255.255.1:3000";

  const startTime = Date.now();
  const test5 = await getUnifiedActivity({ forceFresh: true });
  const duration = Date.now() - startTime;
  console.log(`Test 5 completed in ${duration}ms (timeout set to 150ms).`);
  console.log("Test 5 Result:", {
    durationMs: duration,
    githubConnected: test5.sources.github.connected,
    leetcodeConnected: test5.sources.leetcode.connected,
    leetcodeError: test5.sources.leetcode.error,
  });

  assert.strictEqual(test5.sources.github.connected, true, "GitHub must succeed without waiting indefinitely");
  assert.strictEqual(test5.sources.leetcode.connected, false, "LeetCode must abort on timeout");
  assert.ok(duration < 3000, `Duration should be under 3000ms, was ${duration}ms`);
  console.log("✓ TEST 5 PASSED: AbortController timeout fired and GitHub activity was retrieved promptly.");

  // Restore timeout and URL
  delete process.env.LEETCODE_TIMEOUT_MS;
  process.env.LEETCODE_API_BASE_URL = originalLcUrl;

  // -----------------------------------------------------------------
  // TEST 6: Caching & Fallback Behavior
  // -----------------------------------------------------------------
  console.log("\n--- TEST 6: Caching & Fallback Behavior ---");
  resetActivityCache();

  // Initial fetch: populates cache
  const cache1Start = Date.now();
  const cache1 = await getUnifiedActivity();
  const cache1Duration = Date.now() - cache1Start;
  console.log(`Initial fetch duration: ${cache1Duration}ms`);
  assert.strictEqual(cache1.sources.github.connected, true);
  assert.strictEqual(cache1.sources.leetcode.connected, true);

  const status1 = getActivityCacheStatus();
  console.log("Cache status after initial fetch:", status1);
  assert.ok(status1.github !== null, "GitHub should be cached");
  assert.ok(status1.leetcode !== null, "LeetCode should be cached");

  // Second fetch within cache period: should be instantaneous cache hit (<5ms)
  const cache2Start = Date.now();
  const cache2 = await getUnifiedActivity();
  const cache2Duration = Date.now() - cache2Start;
  console.log(`Second fetch (cache hit) duration: ${cache2Duration}ms`);
  assert.ok(cache2Duration < 20, `Cached response must be near-instant, took ${cache2Duration}ms`);
  assert.strictEqual(cache2.totalContributions, cache1.totalContributions, "Cached totals must match");

  // Simulate provider downtime AFTER successful cache:
  // Should serve last successful cached data (Stale-While-Revalidate pattern)
  console.log("Simulating provider downtime while cache has prior successful data...");
  process.env.LEETCODE_API_BASE_URL = "http://localhost:59999";
  // Force a refresh that encounters a network error
  const cache3 = await getUnifiedActivity({ forceFresh: true });
  console.log("Response during provider downtime with prior cache:", {
    totalContributions: cache3.totalContributions,
    leetcodeTotal: cache3.leetcodeTotal,
    sources: cache3.sources,
  });
  assert.strictEqual(cache3.leetcodeTotal, cache1.leetcodeTotal, "Must serve last successful cached data");
  assert.strictEqual(cache3.totalContributions, cache1.totalContributions, "Must preserve total activity");

  // Verify failed responses are NOT cached as empty calendars
  resetActivityCache();
  process.env.LEETCODE_API_BASE_URL = "http://localhost:59999";
  const failedFetch = await getUnifiedActivity({ forceFresh: true });
  const failedStatus = getActivityCacheStatus();
  console.log("Cache status after failed fetch:", failedStatus);
  assert.strictEqual(failedStatus.leetcode, null, "Failed response must NEVER poison the cache as an empty calendar");
  console.log("✓ TEST 6 PASSED: Caching, SWR fallback, and cache poison protection all verified.");

  // Restore URL
  process.env.LEETCODE_API_BASE_URL = originalLcUrl;

  console.log("\n=================================================");
  console.log("ALL PHASE 3 BACKEND & FAILURE TESTS PASSED (6/6)!");
  console.log("=================================================\n");
}

runPhase3Tests().catch((err) => {
  console.error("Phase 3 test failed:", err);
  process.exit(1);
});
