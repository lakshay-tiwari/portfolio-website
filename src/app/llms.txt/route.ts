import { getLlmsTxt } from "@/data/agentPortfolio";

export const dynamic = "force-static";

export function GET() {
  const content = getLlmsTxt();
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
