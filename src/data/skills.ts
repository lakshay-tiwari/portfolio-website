export type Skill = {
  name: string;
  icon?: string;
};

export type SkillCategory = {
  name: string;
  icon: string;
  description: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    icon: "Code2",
    description: "Core languages I write production code in",
    skills: [
      { name: "TypeScript" },
      { name: "Python" },
      { name: "JavaScript" },
      { name: "C++" },
      { name: "SQL" },
    ],
  },
  {
    name: "Frontend",
    icon: "Layout",
    description: "Building responsive, accessible interfaces",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    name: "Backend",
    icon: "Server",
    description: "APIs, services, and server architecture",
    skills: [
      { name: "Node.js" },
      { name: "FastAPI" },
      { name: "PostgreSQL" },
      { name: "Redis" },
      // { name: "GraphQL" },
      // { name: "tRPC" },
    ],
  },
  {
    name: "Databases",
    icon: "Database",
    description: "Data storage, caching, and search",
    skills: [
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "Redis" },
      { name: "Qdrant DB" },
      { name: "Neo4j" },
    ],
  },
  {
    name: "AI / ML",
    icon: "BrainCircuit",
    description: "LLM apps, RAG pipelines, and model training",
    skills: [
      { name: "LLMs" },
      { name: "RAG" },
      { name: "LangChain" },
      { name: "LangGraph" },
      // { name: "TensorFlow" },
      // { name: "PyTorch" },
      { name: "Vector Databases" },
    ],
  },
  {
    name: "DevOps & Cloud",
    icon: "Cloud",
    description: "Infrastructure, deployment, and monitoring",
    skills: [
      { name: "Docker" },
      // { name: "Kubernetes" },
      { name: "AWS" },
      // { name: "GCP" },
      { name: "CI/CD" },
      // { name: "Terraform" },
    ],
  },
];
