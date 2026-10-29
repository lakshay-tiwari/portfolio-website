"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Download,
  FileText,
  Code2,
  ExternalLink,
  Bot,
  Briefcase,
  Layers,
  Sparkles,
  Mail,
  FolderGit2,
  Database,
  ArrowUpRight,
} from "lucide-react";
import type { PortfolioJson } from "@/data/agentPortfolio";

type AgentReaderProps = {
  markdown: string;
  data: PortfolioJson;
};

export function AgentReader({ markdown, data }: AgentReaderProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lakshya-tiwari-portfolio.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const { profile, skills, projects, experience, contact } = data;

  return (
    <div className="w-full">
      {/* Intro & Machine-Readable Notice Banner */}
      <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 bg-white/70 dark:bg-white/[0.02] backdrop-blur-md mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5 sm:mt-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  Agent Interface
                </span>
                <span className="inline-block px-2 py-0.5 text-[11px] font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Verified Data
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                This page exposes complete professional profile data in structured, machine-readable format.
                Designed for autonomous AI agents, LLM researchers, and search crawlers to retrieve information
                without visual ambiguity.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
            <Link
              href="/for-agents.md"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-primary-500/30 bg-primary-500/10 hover:bg-primary-500/15 text-primary-700 dark:text-primary-300 transition-colors"
              title="Direct Markdown endpoint without HTML"
            >
              <span>/for-agents.md</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
            <Link
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-primary-500/40 text-gray-700 dark:text-gray-300 transition-colors"
              title="Direct Resume PDF"
            >
              <span>/resume.pdf</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
            <Link
              href="/llms.txt"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-primary-500/40 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span>/llms.txt</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
            <Link
              href="/api/portfolio"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-primary-500/40 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span>/api/portfolio</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="sticky top-20 z-30 mb-8 p-3 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-xl shadow-lg shadow-gray-900/5 dark:shadow-black/20 flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
          <button
            onClick={() => setViewMode("formatted")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              viewMode === "formatted"
                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Formatted View</span>
          </button>
          <button
            onClick={() => setViewMode("raw")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              viewMode === "raw"
                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Raw Markdown</span>
          </button>
        </div>

        {/* Primary Action Buttons: Copy & Download */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary-500/50 hover:bg-primary-500/5 dark:hover:bg-primary-500/10 text-gray-800 dark:text-gray-200 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied Markdown</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "raw" ? (
        /* Raw Markdown View */
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-950 p-4 sm:p-6 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-mono text-gray-400">
            <span>lakshya-tiwari-portfolio.md</span>
            <span>{markdown.length} characters</span>
          </div>
          <pre className="font-mono text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap break-words select-all overflow-x-auto">
            <code>{markdown}</code>
          </pre>
        </div>
      ) : (
        /* Formatted View (Clean, structured, matching portfolio aesthetics) */
        <div className="space-y-10">
          {/* Header Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 bg-white/70 dark:bg-white/[0.02]">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
              {profile.name}
            </h1>
            <p className="mt-2 text-lg font-medium text-primary-600 dark:text-primary-400">
              {profile.title}
            </p>
            <p className="mt-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
              {profile.summary}
            </p>
          </div>

          {/* Profile Overview */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-primary-500" />
              <span>Professional Profile</span>
            </h2>
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-white/50 dark:bg-white/[0.02] space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-mono text-xs text-gray-500 uppercase block mb-1">Status</span>
                  <p className="font-medium text-gray-900 dark:text-white">{profile.currentRole}</p>
                </div>
                <div>
                  <span className="font-mono text-xs text-gray-500 uppercase block mb-1">Location</span>
                  <p className="font-medium text-gray-900 dark:text-white">{profile.location}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                <span className="font-mono text-xs text-gray-500 uppercase block mb-1.5">Career Interests</span>
                <div className="flex flex-wrap gap-2">
                  {profile.careerInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 text-xs rounded-md bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Technical Skills */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span>Technical Skills</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(skills).map(([category, items]) => (
                <div
                  key={category}
                  className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 bg-white/50 dark:bg-white/[0.02]"
                >
                  <h3 className="text-sm font-mono font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <FolderGit2 className="w-5 h-5 text-primary-500" />
              <span>Projects</span>
            </h2>
            <div className="space-y-6">
              {projects.map((proj) => (
                <article
                  key={proj.name}
                  className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-white/50 dark:bg-white/[0.02] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                      {proj.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          <span>GitHub</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {proj.documentationUrl && (
                        <a
                          href={proj.documentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:underline"
                        >
                          <span>Docs</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.problem && (
                    <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 block mb-0.5">Problem Solved:</span>
                      {proj.problem}
                    </div>
                  )}

                  {proj.keyFeatures && proj.keyFeatures.length > 0 && (
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-gray-500 block mb-2">Key Features:</span>
                      <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {proj.keyFeatures.map((feat) => (
                          <li key={feat}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-white/5">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-primary-500" />
              <span>Experience</span>
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <article
                  key={`${exp.company}-${exp.role}`}
                  className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-white/50 dark:bg-white/[0.02] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                        {exp.role} <span className="text-primary-500 font-normal">@</span> {exp.company}
                      </h3>
                      {exp.location && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {exp.location}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400 shrink-0">
                      {exp.duration}
                    </span>
                  </div>

                  {exp.responsibilities && exp.responsibilities.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {exp.responsibilities.map((resp) => (
                        <li key={resp}>{resp}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {exp.summary}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-white/5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-primary-500" />
              <span>Education</span>
            </h2>
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 bg-white/50 dark:bg-white/[0.02] text-sm text-gray-600 dark:text-gray-400">
              <p>
                Formal university credential records are omitted as they are not currently documented in the portfolio repository.
                Technical background is demonstrated through production engineering, open-source architectures, and continuous technical learning.
              </p>
            </div>
          </section>

          {/* Contact and Links */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-primary-500" />
              <span>Contact & Verified Links</span>
            </h2>
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-white/50 dark:bg-white/[0.02]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-mono text-xs text-gray-500 uppercase block mb-1">Direct Email</span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
                {contact.github && (
                  <div>
                    <span className="font-mono text-xs text-gray-500 uppercase block mb-1">GitHub Profile</span>
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-900 dark:text-white hover:text-primary-500 hover:underline inline-flex items-center gap-1"
                    >
                      {contact.github}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                {contact.linkedin && (
                  <div>
                    <span className="font-mono text-xs text-gray-500 uppercase block mb-1">LinkedIn</span>
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-900 dark:text-white hover:text-primary-500 hover:underline inline-flex items-center gap-1"
                    >
                      {contact.linkedin}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                  <div>
                    <span className="font-mono text-xs text-gray-500 uppercase block mb-1">Resume</span>
                    <div className="flex flex-col gap-1">
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                      >
                        Direct Resume PDF (/resume.pdf)
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                      {contact.resume && (
                        <a
                          href={contact.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 dark:text-gray-400 hover:underline inline-flex items-center gap-1"
                        >
                          Google Drive Backup Link
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* No-script fallback ensuring content is 100% accessible to simple scrapers/curl without JS */}
      <noscript>
        <div className="mt-10 p-6 rounded-2xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-gray-950">
          <h2 className="text-lg font-bold mb-3">Raw Markdown (No-JS Fallback)</h2>
          <pre className="font-mono text-xs whitespace-pre-wrap">{markdown}</pre>
        </div>
      </noscript>
    </div>
  );
}
