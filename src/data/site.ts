export type SiteConfig = {
  name: string;
  role: string;
  roles?: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  profileImage: string;
  bannerImage: string;
  url: string;
};

export const siteConfig: SiteConfig = {
  name: "Lakshya Tiwari",
  role: "Full-Stack Engineer & AI Developer",
  roles: [
    "Full-Stack Engineer",
    "AI Developer",
    "Software Engineer",
  ],
  tagline: "I build things for the web.",
  bio: "I'm a software engineer specializing in building AI-powered web applications and scalable systems. Currently building applications in AI Harness.",
  location: "Noida, India",
  email: "imlakshya.tiwari@gmail.com",
  resumeUrl: "https://drive.google.com/file/d/1EX3ICYK5DUUC0tsdHYyrKkIfDdyBLffz/view?usp=drive_link",
  profileImage: "/images/profile_image.webp",
  bannerImage: "/images/banner-image.jpeg",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lakshyatiwari.com",
};

