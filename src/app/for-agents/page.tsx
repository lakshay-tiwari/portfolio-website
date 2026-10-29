import type { Metadata } from "next";
import { getPortfolioMarkdown, getPortfolioData } from "@/data/agentPortfolio";
import { AgentReader } from "@/components/agents/AgentReader";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `AI Agent & Machine-Readable Profile | ${siteConfig.name}`,
  description:
    "Complete professional portfolio data formatted for autonomous AI agents, LLMs, automated research tools, and search crawlers in structured Markdown and JSON.",
  alternates: {
    canonical: "/for-agents",
  },
  openGraph: {
    title: `AI Agent Profile — ${siteConfig.name}`,
    description:
      "Machine-readable portfolio containing verified projects, experience, technical skills, and public links in structured Markdown.",
    url: "/for-agents",
    type: "website",
  },
};

export default function ForAgentsPage() {
  const markdown = getPortfolioMarkdown();
  const data = getPortfolioData();

  return (
    <main id="main" className="pt-24 sm:pt-28 pb-16 md:pb-20 min-h-screen section-gradient-cool">
      <div className="section-container">
        {/* Breadcrumb / Top link */}
        <div className="mb-6 flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
          <a href="/" className="hover:text-primary-500 transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">for-agents</span>
        </div>

        {/* Interactive Reader with Copy, Download & Formatted/Raw Views */}
        <AgentReader markdown={markdown} data={data} />
      </div>
    </main>
  );
}
