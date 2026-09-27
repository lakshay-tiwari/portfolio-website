export type Project = {
  title: string;
  description: string;
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
    image:
      "https://images.pexels.com/photos/17483871/pexels-photo-17483871.png?auto=compress&cs=tinysrgb&h=650&w=940",
    technologies: ["Next.js", "FastAPI", "LangGraph", "PostgreSQL", "Pinecone"],
    github: "https://github.com",
    notion: "https://notion.so",
    live: "https://example.com",
    featured: true,
    layout: "image-right",
  },
  {
    title: "KeyCrypt",
    description:
      "A zero-knowledge password manager with end-to-end encryption. Stores credentials locally with client-side crypto, syncs across devices, and includes a built-in breach checker.",
    image:
      "https://images.pexels.com/photos/30885763/pexels-photo-30885763.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "WebCrypto"],
    github: "https://github.com",
    notion: "https://notion.so",
    featured: true,
    layout: "image-left",
  },
  {
    title: "Droply",
    description:
      "A real-time food delivery platform with live order tracking, driver dispatch, and a restaurant management dashboard. Handles thousands of concurrent connections via WebSocket.",
    image:
      "https://images.pexels.com/photos/4392044/pexels-photo-4392044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    technologies: ["Next.js", "Socket.io", "Redis", "PostgreSQL"],
    github: "https://github.com",
    notion: "https://notion.so",
    live: "https://example.com",
    featured: true,
    layout: "image-right",
  },
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
