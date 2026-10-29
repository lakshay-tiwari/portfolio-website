import { siteConfig } from "@/data/site";
import { socialLinks } from "@/data/social";
import { skillCategories } from "@/data/skills";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";

export type PortfolioJson = {
  profile: {
    name: string;
    title: string;
    roles: string[];
    tagline: string;
    summary: string;
    currentRole: string;
    location: string;
    careerInterests: string[];
    availableForOpportunities: boolean;
  };
  skills: Record<string, string[]>;
  projects: Array<{
    name: string;
    description: string;
    problem?: string;
    keyFeatures?: string[];
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    documentationUrl?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    location?: string;
    summary: string;
    responsibilities?: string[];
    technologies: string[];
  }>;
  education: {
    status: string;
    note: string;
  };
  contact: {
    email: string;
    github: string;
    linkedin: string;
    twitter?: string;
    leetcode?: string;
    resume: string;
    resumePdfUrl?: string;
    portfolioUrl: string;
  };
  meta: {
    generatedAt: string;
    schema: string;
    llmsTxtUrl: string;
    agentsPageUrl: string;
    agentsMarkdownUrl: string;
    apiUrl: string;
    resumePdfUrl: string;
  };
};

export function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  return siteConfig.url.replace(/\/$/, "");
}

export function getPortfolioData(): PortfolioJson {
  const baseUrl = getBaseUrl();

  const getLinkHref = (name: string): string => {
    const link = socialLinks.find((s) => s.name.toLowerCase() === name.toLowerCase());
    return link ? link.href : "";
  };

  const skillsMap: Record<string, string[]> = {};
  for (const cat of skillCategories) {
    skillsMap[cat.name] = cat.skills.map((s) => s.name);
  }

  return {
    profile: {
      name: siteConfig.name,
      title: siteConfig.role,
      roles: siteConfig.roles || [siteConfig.role],
      tagline: siteConfig.tagline,
      summary: siteConfig.bio,
      currentRole: "Software Engineer & AI Developer (Available for opportunities)",
      location: siteConfig.location,
      careerInterests: [
        "AI-powered web applications",
        "LLM agent orchestration and RAG pipelines",
        "High-performance distributed backend systems",
        "Full-stack software engineering",
      ],
      availableForOpportunities: true,
    },
    skills: skillsMap,
    projects: projects.map((p) => ({
      name: p.title,
      description: p.description,
      problem: p.problem,
      keyFeatures: p.keyFeatures,
      technologies: p.technologies,
      githubUrl: p.github,
      liveUrl: p.live,
      documentationUrl: p.notion,
    })),
    experience: experiences.map((e) => ({
      company: e.company,
      role: e.role,
      duration: e.duration.trim(),
      location: e.location,
      summary: e.description,
      responsibilities: e.responsibilities,
      technologies: e.technologies,
    })),
    education: {
      status: "Not specified in public portfolio",
      note: "Formal degree records omitted to prevent unverified assumptions. Practical focus in computer science, distributed web systems, and modern AI engineering.",
    },
    contact: {
      email: siteConfig.email,
      github: getLinkHref("GitHub"),
      linkedin: getLinkHref("LinkedIn"),
      twitter: getLinkHref("X"),
      leetcode: getLinkHref("Leetcode"),
      resume: siteConfig.resumeUrl,
      resumePdfUrl: `${baseUrl}/resume.pdf`,
      portfolioUrl: baseUrl,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      schema: "https://schema.org/Person",
      llmsTxtUrl: `${baseUrl}/llms.txt`,
      agentsPageUrl: `${baseUrl}/for-agents`,
      agentsMarkdownUrl: `${baseUrl}/for-agents.md`,
      apiUrl: `${baseUrl}/api/portfolio`,
      resumePdfUrl: `${baseUrl}/resume.pdf`,
    },
  };
}

export function getPortfolioMarkdown(): string {
  const baseUrl = getBaseUrl();
  const data = getPortfolioData();
  const { profile, skills, projects: projs, experience: exps, contact } = data;

  let md = `# ${profile.name}\n\n`;
  md += `> ${profile.title} — ${profile.summary}\n\n`;

  md += `## Professional Profile\n\n`;
  md += `- **Name:** ${profile.name}\n`;
  md += `- **Professional Title:** ${profile.title}\n`;
  md += `- **Current Role:** ${profile.currentRole}\n`;
  md += `- **Location:** ${profile.location}\n`;
  md += `- **Short Summary:** ${profile.summary}\n`;
  md += `- **Career Interests:** ${profile.careerInterests.join(", ")}\n\n`;

  md += `## Technical Skills\n\n`;
  for (const [category, skillList] of Object.entries(skills)) {
    md += `### ${category}\n`;
    for (const skill of skillList) {
      md += `- ${skill}\n`;
    }
    md += `\n`;
  }

  md += `## Projects\n\n`;
  for (const project of projs) {
    md += `### ${project.name}\n\n`;
    md += `**Description:** ${project.description}\n\n`;
    if (project.problem) {
      md += `**Problem:** ${project.problem}\n\n`;
    }
    if (project.keyFeatures && project.keyFeatures.length > 0) {
      md += `**Key Features:**\n`;
      for (const feat of project.keyFeatures) {
        md += `- ${feat}\n`;
      }
      md += `\n`;
    }
    md += `**Tech Stack:** ${project.technologies.join(", ")}\n\n`;
    if (project.githubUrl) {
      md += `**GitHub:** ${project.githubUrl}\n\n`;
    }
    if (project.liveUrl) {
      md += `**Live Demo:** ${project.liveUrl}\n\n`;
    }
    if (project.documentationUrl) {
      md += `**Documentation:** ${project.documentationUrl}\n\n`;
    }
  }

  md += `## Experience\n\n`;
  for (const exp of exps) {
    md += `### ${exp.role} — ${exp.company}\n\n`;
    md += `- **Duration:** ${exp.duration}\n`;
    if (exp.location) {
      md += `- **Location:** ${exp.location}\n`;
    }
    if (exp.responsibilities && exp.responsibilities.length > 0) {
      md += `- **Key Responsibilities & Contributions:**\n`;
      for (const resp of exp.responsibilities) {
        md += `  - ${resp}\n`;
      }
    } else {
      md += `- **Description:** ${exp.summary}\n`;
    }
    md += `- **Technologies:** ${exp.technologies.join(", ")}\n\n`;
  }

  md += `## Education\n\n`;
  md += `- Formal university credential records are omitted as they are not currently documented in the portfolio repository. Background is demonstrated through practical software engineering, open-source architectures, and continuous technical research.\n\n`;

  md += `## Contact & Direct Links\n\n`;
  md += `- **Email:** ${contact.email}\n`;
  md += `- **Direct Resume (PDF):** ${baseUrl}/resume.pdf\n`;
  if (contact.resume) md += `- **Google Drive Resume:** ${contact.resume}\n`;
  if (contact.github) md += `- **GitHub:** ${contact.github}\n`;
  if (contact.linkedin) md += `- **LinkedIn:** ${contact.linkedin}\n`;
  if (contact.twitter) md += `- **X (Twitter):** ${contact.twitter}\n`;
  if (contact.leetcode) md += `- **LeetCode:** ${contact.leetcode}\n`;
  md += `- **Portfolio Website:** ${contact.portfolioUrl}\n`;
  md += `- **Direct Markdown Profile:** ${baseUrl}/for-agents.md\n`;
  md += `- **Structured JSON API:** ${baseUrl}/api/portfolio\n`;
  md += `- **llms.txt Overview:** ${baseUrl}/llms.txt\n\n`;

  md += `---\n\n`;
  md += `*Machine-readable portfolio generated dynamically for AI agents, research crawlers, and automated indexing tools from the portfolio single source of truth.*`;

  return md;
}

export function getLlmsTxt(): string {
  const baseUrl = getBaseUrl();
  const data = getPortfolioData();
  const { profile, contact, projects: projs, experience: exps, skills } = data;

  let text = `# ${profile.name}\n\n`;
  text += `> ${profile.title} — ${profile.summary}\n\n`;

  text += `## Profile\n`;
  text += `- Website: ${contact.portfolioUrl}\n`;
  text += `- Direct Markdown Profile: ${baseUrl}/for-agents.md\n`;
  text += `- AI Agents Page (Full HTML): ${data.meta.agentsPageUrl}\n`;
  text += `- Portfolio API (Structured JSON): ${data.meta.apiUrl}\n`;
  text += `- Direct Resume (PDF): ${baseUrl}/resume.pdf\n`;
  if (contact.resume) text += `- Resume (Google Drive): ${contact.resume}\n`;
  text += `- Location: ${profile.location}\n`;
  text += `- Email: ${contact.email}\n`;
  if (contact.github) text += `- GitHub: ${contact.github}\n`;
  if (contact.linkedin) text += `- LinkedIn: ${contact.linkedin}\n`;
  if (contact.twitter) text += `- X (Twitter): ${contact.twitter}\n`;
  text += `\n`;

  text += `## Professional Summary\n`;
  text += `${profile.summary} Core capabilities include engineering full-stack web applications, designing RAG pipelines with vector databases and knowledge graphs, and creating resilient edge-first microservices.\n\n`;

  text += `## Featured Projects\n`;
  for (const project of projs) {
    text += `- [${project.name}](${project.githubUrl || project.liveUrl || contact.portfolioUrl}): ${project.description} Tech: ${project.technologies.join(", ")}.\n`;
  }
  text += `\n`;

  text += `## Experience Highlights\n`;
  for (const exp of exps) {
    text += `- ${exp.company} (${exp.role}, ${exp.duration}): ${exp.summary} [Tech: ${exp.technologies.join(", ")}]\n`;
  }
  text += `\n`;

  text += `## Core Skills\n`;
  for (const [catName, skillList] of Object.entries(skills)) {
    text += `- ${catName}: ${skillList.join(", ")}\n`;
  }
  text += `\n`;

  text += `## Additional Resources\n`;
  text += `- [Direct Markdown Profile](${baseUrl}/for-agents.md)\n`;
  text += `- [Direct Resume (PDF)](${baseUrl}/resume.pdf)\n`;
  text += `- [Interactive AI Agents Page](${data.meta.agentsPageUrl})\n`;
  text += `- [Structured JSON API](${data.meta.apiUrl})\n`;

  return text;
}
