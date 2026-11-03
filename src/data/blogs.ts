export type Blog = {
  title: string;
  date: string;
  description: string;
  image: string;
  url: string;
};

export const blogs: Blog[] = [
  {
    title: "Understanding Memory in AI",
    date: "2026-11-04",
    description:
      "LLMs forget everything between messages. Here are 3 ways to give them memory: plain Python, LangChain, and Mem0.",
    image: "/images/blogs/ai_memory_blog_cover.webp",
    url: "https://medium.com/@imlakshya.tiwari/understanding-memory-in-ai-e630b40ca3a8",
  },
  // {
  //   title: "Why I Stopped Using Redux and Started Using Zustand",
  //   date: "2024-06-02",
  //   description:
  //     "After years of Redux boilerplate, I switched to Zustand. Here's what I learned about state management simplicity and when you actually need Redux.",
  //   image:
  //     "https://images.pexels.com/photos/374559/pexels-photo-374559.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  //   url: "https://medium.com",
  // },
  // {
  //   title: "Edge-First Architecture: A Practical Guide",
  //   date: "2024-03-20",
  //   description:
  //     "How to design web applications that run at the edge, the trade-offs involved, and why the edge isn't always the right answer.",
  //   image:
  //     "https://images.pexels.com/photos/5473299/pexels-photo-5473299.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  //   url: "https://medium.com",
  // },
  // {
  //   title: "The Hidden Cost of Microservices Nobody Talks About",
  //   date: "2023-11-10",
  //   description:
  //     "Microservices solve problems but create new ones. This article covers the operational complexity, debugging nightmares, and when to stay monolithic.",
  //   image:
  //     "https://images.pexels.com/photos/34803969/pexels-photo-34803969.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  //   url: "https://medium.com",
  // },
];
