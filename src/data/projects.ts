export type Project = {
  title: string;
  description: string;
  problem?: string;
  keyFeatures?: string[];
  image?: string;
  technologies: string[];
  github: string;
  notion: string;
  live?: string;
  featured?: boolean;
  layout?: "image-left" | "image-right";
};

export const projects: Project[] = [
  {
    title: "Cortex",
    description:
      "An AI-powered knowledge assistant that uses retrieval-augmented generation to answer questions from your documents. Supports multi-turn conversations, source citations, and streaming responses.",
    problem:
      "Developers and engineering teams lose significant time navigating large codebases and complex documentation, often receiving ungrounded or hallucinated answers from generic AI assistants.",
    keyFeatures: [
      "Multi-turn conversational context with persistent chat history",
      "Retrieval-Augmented Generation (RAG) with verifiable line-by-line source citations",
      "Low-latency streaming responses for real-time interaction",
      "Hybrid vector retrieval with Qdrant DB and relationship graph modeling with Neo4j",
      "Production-ready authentication and session management with Clerk",
    ],
    image: "/images/projects/cortex-preview.png",
    technologies: ["Next.js", "FastAPI", "LangGraph", "PostgreSQL", "Qdrant DB", "Neo4j", "LangChain", "Clerk"],
    github: "https://github.com/lakshay-tiwari/github-code-review",
    notion: "https://app.notion.com/p/Cortex-GitHub-Repository-RAG-Platform-40773296e25c80f99667e1bdb8422f21?source=copy_link",
    // live: "https://example.com",
    featured: true,
    layout: "image-left",
  },
  {
    title: "KeyCrypt",
    description:
      "A zero-knowledge password manager with end-to-end encryption. Stores credentials locally with client-side crypto, syncs across devices, and includes a built-in breach checker.",
    problem:
      "Traditional password management solutions store secrets or encryption keys on centralized servers where vulnerabilities can lead to critical credential compromises.",
    keyFeatures: [
      "Zero-knowledge architecture ensuring plaintext credentials never touch servers",
      "Client-side cryptographic operations leveraging browser WebCrypto APIs",
      "Encrypted cross-device credential synchronization",
      "Integrated automated breach checker evaluating credential integrity",
    ],
    image: "/images/projects/keycrypt-preview.png",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "WebCrypto"],
    github: "https://github.com/lakshay-tiwari/keycrypt",
    notion: "https://app.notion.com/p/KeyCrypt-Store-your-secrets-33073296e25c80e39055c6e2b2da14a9?source=copy_link",
    live: "https://keycrypt.lakshya-tiwari.dev/",
    featured: true,
    layout: "image-left",
  },
  // {
  //   title: "Droply",
  //   description:
  //     "A real-time food delivery platform with live order tracking, driver dispatch, and a restaurant management dashboard. Handles thousands of concurrent connections via WebSocket.",
  //   image:
  //     "https://images.pexels.com/photos/4392044/pexels-photo-4392044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  //   technologies: ["Next.js", "Socket.io", "Redis", "PostgreSQL"],
  //   github: "https://github.com",
  //   notion: "https://notion.so",
  //   live: "https://example.com",
  //   featured: true,
  //   layout: "image-right",
  // },
  // {
  //   title: "Pulse Analytics",
  //   description:
  //     "A self-hosted web analytics dashboard with real-time event tracking, funnel analysis, and custom report builder. Privacy-first, GDPR-compliant, no cookies required.",
  //   image:
  //     "https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  //   technologies: ["React", "D3.js", "ClickHouse", "Node.js"],
  //   github: "https://github.com",
  //   notion: "https://notion.so",
  //   layout: "image-left",
  // },
  // {
  //   title: "NeuralCanvas",
  //   description:
  //     "A browser-based generative art studio that lets you create, remix, and export AI-generated artwork using layered prompts and style transfer.",
  //   image:
  //     "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  //   technologies: ["React", "Canvas API", "TensorFlow.js", "WebGL"],
  //   github: "https://github.com",
  //   notion: "https://notion.so",
  //   live: "https://example.com",
  //   layout: "image-right",
  // },
  // {
  //   title: "DevBoard",
  //   description:
  //     "A collaborative whiteboard for engineering teams with real-time cursor tracking, sticky notes, diagram tools, and GitHub issue integration.",
  //   image:
  //     "https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  //   technologies: ["React", "tRPC", "Yjs", "PostgreSQL"],
  //   github: "https://github.com",
  //   notion: "https://notion.so",
  //   layout: "image-left",
  // },
];
