import {
  siTypescript,
  siPython,
  siJavascript,
  siCplusplus,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siStorybook,
  siNodedotjs,
  siFastapi,
  siSocketdotio,
  siWebrtc,
  siPostgresql,
  siRedis,
  siPrisma,
  siMongoose,
  siMongodb,
  siQdrant,
  siNeo4j,
  siLangchain,
  siLanggraph,
  siDocker,
  siGithubactions,
  siGo,
  siRust,
  siKotlin,
  siVite,
  siExpress,
  siHono,
  siBun,
  siDrizzle,
  siApachekafka,
  siHuggingface,
  siNvidia,
  siKubernetes,
  siTerraform,
  siCloudflare,
  siLinux,
  siNginx,
  siGit,
  siGraphql,
  siClerk,
  siGooglecloud,
  siTensorflow,
  siPytorch,
} from "simple-icons";

type IconDefinition = {
  path: string;
  color?: string;
  isMonochrome?: boolean;
};

// Custom SVG definitions for tools and concepts without Simple Icons entries
const customIcons: Record<string, IconDefinition> = {
  sql: {
    path: "M12 2C6.48 2 2 3.34 2 5v14c0 1.66 4.48 3 10 3s10-1.34 10-3V5c0-1.66-4.48-3-10-3zm0 2c4.42 0 8 .9 8 1.5S16.42 7 12 7 4 6.1 4 5.5 7.58 4 12 4zm0 16c-4.42 0-8-.9-8-1.5V16c1.68.86 4.67 1.4 8 1.4s6.32-.54 8-1.4v2.5c0 .6-3.58 1.5-8 1.5zm0-5c-4.42 0-8-.9-8-1.5V11c1.68.86 4.67 1.4 8 1.4s6.32-.54 8-1.4v2.5c0 .6-3.58 1.5-8 1.5zm0-5c-4.42 0-8-.9-8-1.5V6c1.68.86 4.67 1.4 8 1.4s6.32-.54 8-1.4v2.5c0 .6-3.58 1.5-8 1.5z",
    color: "#336791", // SQL blue
  },
  awsec2: {
    path: "M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8L12 11.8 5.2 8 12 4.2zM5 9.6l6 3.3v6.5l-6-3.3V9.6zm14 6.5l-6 3.3v-6.5l6-3.3v6.5z",
    color: "#FF9900", // AWS Orange
  },
  awss3storage: {
    path: "M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V8h14v10zm0-12H5V6h14v2zm-8 4h6v2h-6v-2zm0 4h6v2h-6v-2z",
    color: "#E05243", // AWS S3 Red/Orange
  },
  llms: {
    path: "M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.627 5.627-12 12-12-6.627 0-12-5.627-12-12z",
    color: "#10A37F", // OpenAI / AI Emerald
  },
  rag: {
    path: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
    color: "#6366F1", // Indigo
  },
  vectordatabases: {
    path: "M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.2L5.2 8 12 11.8 18.8 8 12 4.2zM4 9.6v7.3l7 3.9v-7.3L4 9.6zm16 0l-7 3.9v7.3l7-3.9V9.6z",
    color: "#8B5CF6", // Vector Violet
  },
  componentlibrary: {
    path: "M4 4h16v4H4V4zm0 6h7v10H4V10zm9 0h7v10h-7V10z",
    color: "#FF4785", // Storybook / Component Rose
  },
  websockets: {
    path: "M16 3l5 5-5 5V9H9v6H5V7h11V3z M8 21l-5-5 5-5v4h7v-6h4v8H8v4z",
    color: "#0288D1", // Real-time Blue
  },
};

// Consolidated technology map associating normalized names with authentic Simple Icons or custom paths
const iconMap: Record<string, IconDefinition> = {
  // Programming Languages
  typescript: { path: siTypescript.path, color: `#${siTypescript.hex}` },
  python: { path: siPython.path, color: `#${siPython.hex}` },
  javascript: { path: siJavascript.path, color: `#${siJavascript.hex}` },
  "c++": { path: siCplusplus.path, color: `#${siCplusplus.hex}` },
  sql: customIcons.sql,
  go: { path: siGo.path, color: `#${siGo.hex}` },
  rust: { path: siRust.path, isMonochrome: true },
  kotlin: { path: siKotlin.path, color: `#${siKotlin.hex}` },

  // Frontend
  react: { path: siReact.path, color: `#${siReact.hex}` },
  "next.js": { path: siNextdotjs.path, isMonochrome: true },
  "tailwind css": { path: siTailwindcss.path, color: `#${siTailwindcss.hex}` },
  "component library": customIcons.componentlibrary,
  vite: { path: siVite.path, color: `#${siVite.hex}` },

  // Backend & Real-time
  "node.js": { path: siNodedotjs.path, color: `#${siNodedotjs.hex}` },
  fastapi: { path: siFastapi.path, color: `#${siFastapi.hex}` },
  websockets: customIcons.websockets,
  webrtc: { path: siWebrtc.path, color: "#FF5722" }, // WebRTC brand orange-red for vibrant dark-theme contrast
  postgresql: { path: siPostgresql.path, color: `#${siPostgresql.hex}` },
  redis: { path: siRedis.path, color: `#${siRedis.hex}` },
  prisma: { path: siPrisma.path, color: "#5A67D8" }, // Prisma indigo for visible contrast against dark background
  mongoose: { path: siMongoose.path, color: "#E0234E" }, // Mongoose vibrant brand red
  express: { path: siExpress.path, isMonochrome: true },
  "express.js": { path: siExpress.path, isMonochrome: true },
  expressjs: { path: siExpress.path, isMonochrome: true },
  hono: { path: siHono.path, color: `#${siHono.hex}` },
  bun: { path: siBun.path, isMonochrome: true },

  // Databases & Storage
  mongodb: { path: siMongodb.path, color: `#${siMongodb.hex}` },
  "qdrant db": { path: siQdrant.path, color: `#${siQdrant.hex}` },
  qdrant: { path: siQdrant.path, color: `#${siQdrant.hex}` },
  neo4j: { path: siNeo4j.path, color: `#${siNeo4j.hex}` },
  drizzle: { path: siDrizzle.path, color: `#${siDrizzle.hex}` },
  kafka: { path: siApachekafka.path, isMonochrome: true },

  // AI & Machine Learning
  llms: customIcons.llms,
  rag: customIcons.rag,
  langchain: { path: siLangchain.path, color: "#26D07C" }, // Official LangChain emerald green
  langgraph: { path: siLanggraph.path, color: "#FF8800" }, // Official LangGraph orange
  "vector databases": customIcons.vectordatabases,
  "hugging face": { path: siHuggingface.path, color: `#${siHuggingface.hex}` },
  nvidia: { path: siNvidia.path, color: `#${siNvidia.hex}` },
  tensorflow: { path: siTensorflow.path, color: `#${siTensorflow.hex}` },
  pytorch: { path: siPytorch.path, color: `#${siPytorch.hex}` },

  // DevOps & Cloud
  docker: { path: siDocker.path, color: `#${siDocker.hex}` },
  "aws ec2": customIcons.awsec2,
  "aws s3 storage": customIcons.awss3storage,
  "ci/cd": { path: siGithubactions.path, color: `#${siGithubactions.hex}` },
  kubernetes: { path: siKubernetes.path, color: `#${siKubernetes.hex}` },
  terraform: { path: siTerraform.path, color: `#${siTerraform.hex}` },
  cloudflare: { path: siCloudflare.path, color: `#${siCloudflare.hex}` },
  linux: { path: siLinux.path, color: `#${siLinux.hex}` },
  nginx: { path: siNginx.path, color: `#${siNginx.hex}` },
  git: { path: siGit.path, color: `#${siGit.hex}` },
  "google cloud": { path: siGooglecloud.path, color: `#${siGooglecloud.hex}` },
  gcp: { path: siGooglecloud.path, color: `#${siGooglecloud.hex}` },

  // Additional tools
  clerk: { path: siClerk.path, color: `#${siClerk.hex}` },
  graphql: { path: siGraphql.path, color: `#${siGraphql.hex}` },
};

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

type TechIconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function TechIcon({ name, size = 18, className = "" }: TechIconProps) {
  const key = normalizeName(name);
  const def = iconMap[key];

  if (!def) {
    // Graceful fallback: subtle code bracket / terminal icon
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 text-primary-500 ${className}`}
        aria-hidden="true"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }

  if (def.isMonochrome) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={`shrink-0 text-gray-900 dark:text-white transition-colors ${className}`}
        aria-hidden="true"
      >
        <path d={def.path} />
      </svg>
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={def.color}
      className={`shrink-0 transition-transform ${className}`}
      aria-hidden="true"
    >
      <path d={def.path} />
    </svg>
  );
}
