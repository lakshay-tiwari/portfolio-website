export type Experience = {
  company: string;
  role: string;
  duration: string;
  location?: string;
  description: string;
  responsibilities?: string[];
  technologies: string[];
};

export const experiences: Experience[] = [
  {
    company: "Cognify Systems",
    role: "Full Stack AI Engineer Intern",
    duration: "April 2026 — November 2026",
    location: "Remote",
    description:
      "Worked on Node.js backend services and Redis-powered asynchronous job processing to support reliable application workflows. Explored MCP servers and advanced RAG approaches, including Adaptive RAG, Corrective RAG, and Hybrid RAG. Built data ingestion and retrieval pipelines connecting backend services with LLM-powered applications, with Docker for containerization and deployment.",
    responsibilities: [
      "Worked on Node.js backend services and Redis-powered asynchronous job processing to support reliable application workflows.",
      "Explored MCP servers and advanced RAG approaches, including Adaptive RAG, Corrective RAG, and Hybrid RAG.",
      "Built data ingestion and retrieval pipelines connecting backend services with LLM-powered applications, with Docker for containerization and deployment.",
    ],
    technologies: [
      "Node.js",
      "Redis",
      "Turborepo",
      "MCP",
      "RAG",
      "Docker",
      "LLMs",
      "TypeScript",
    ],
  },
  {
    company: "Freelancer",
    role: "Software Engineer",
    duration: "January 2026 — Present",
    location: "Remote",
    description:
      "Building responsive websites and full-stack web applications using Next.js, React, and modern web technologies. Developing backend APIs and integrating databases to deliver functional, maintainable web solutions for freelance projects.",
    responsibilities: [
      "Building responsive websites and full-stack web applications using Next.js, React, and modern web technologies.",
      "Developing backend APIs and integrating databases to deliver functional, maintainable web solutions for freelance projects.",
    ],
    technologies: [
      "Next.js",
      "React",
      "Express.js",
      "Prisma",
      "PostgreSQL",
      "Tailwind CSS",
    ],
  },
  // {
  //   company: "Stripe",
  //   role: "Full-Stack Engineer",
  //   duration: "2019 — 2021",
  //   location: "San Francisco, CA",
  //   description:
  //     "Built internal tooling for the payments reliability team. Created dashboards for monitoring payment failures across 47 processors. Automated incident response workflows, reducing MTTR by 40%.",
  //   technologies: ["Ruby", "React", "GraphQL", "PostgreSQL", "AWS"],
  // },
  // {
  //   company: "Personal",
  //   role: "Freelance Developer",
  //   duration: "2017 — 2019",
  //   location: "Remote",
  //   description:
  //     "Delivered 30+ web applications for startups and small businesses. Specialized in React frontends, Node.js APIs, and Stripe integrations. Maintained a 100% client satisfaction rate.",
  //   technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
  // },
];
