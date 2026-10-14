export type SiteConfig = {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  profileImage: string;
};

export const siteConfig: SiteConfig = {
  name: "Lakshya Tiwari",
  role: "Full-Stack Engineer & AI Developer",
  tagline: "I build things for the web.",
  bio: "I'm a software engineer specializing in building AI-powered web applications and scalable systems. Currently building tools that make developers more productive. Previously at OpenAI and Stripe.",
  location: "Noida, India",
  email: "imlakshya.tiwari@gmail.com",
  resumeUrl: "https://drive.google.com/file/d/1EX3ICYK5DUUC0tsdHYyrKkIfDdyBLffz/view?usp=drive_link",
  profileImage: "/images/profile_image.webp",
};
