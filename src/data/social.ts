import { Github, Linkedin, Twitter, BookOpen, Mail, type LucideIcon, Code2 } from "lucide-react";

export type SocialLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/lakshay-tiwari/",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/lakshyatiwari1/",
    icon: Linkedin,
  },
  {
    name: "X",
    href: "https://x.com/Lakshya_tiwari_/",
    icon: Twitter,
  },
  {
    name: "Medium",
    href: "https://medium.com",
    icon: BookOpen,
  },
  {
    name: "Email",
    href: "mailto:imlakshya.tiwari@gmail.com",
    icon: Mail,
  },
  {
    name: "Leetcode",
    href: "https://leetcode.com/u/lakshya_tiwari/",
    icon: Code2,
  }
];
