import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/for-agents") {
    const accept = request.headers.get("accept") || "";
    // If an AI agent or automated client explicitly asks for markdown or plain text
    if (
      accept.includes("text/markdown") ||
      (accept.includes("text/plain") && !accept.includes("text/html"))
    ) {
      return NextResponse.rewrite(new URL("/for-agents.md", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/for-agents"],
};
