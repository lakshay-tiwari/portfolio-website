export type Experience = {
  company: string;
  role: string;
  duration: string;
  location?: string;
  description: string;
  technologies: string[];
};

export const experiences: Experience[] = [
  {
    company: "Adnecto Technologies",
    role: "Junior Software Engineer",
    duration: "June 2026 — August 2026 ",
    location: "Remote",
    description:
      "Leading development of the analytics and observability platform. Built real-time event ingestion pipelines handling 2B+ events per day. Drove migration to edge-first architecture, cutting p99 latency by 60%.",
    technologies: ["Next.js", "TypeScript", "React", "Expressjs", "MongoDB"],
  },
  {
    company: "Freelancer",
    role: "Software Engineer",
    duration: "January 2026 — Present",
    location: "Remote",
    description:
      "Worked on the ChatGPT web application and the API platform. Designed and implemented streaming response infrastructure, conversation memory, and tool-use orchestration. Shipped the plugins system used by millions of users.",
    technologies: ["Nextjs", "React", "Express.js", "Prisma", "PostgreSQL", "TailwindCSS"],
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
