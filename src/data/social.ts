import type { ComponentType, SVGProps } from "react";
import { Linkedin, Mail, type LucideIcon } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { XIcon } from "@/components/icons/XIcon";
import { LeetCodeIcon } from "@/components/icons/LeetCodeIcon";
import { MediumIcon } from "@/components/icons/MediumIcon";

export type SocialLink = {
  name: string;
  href: string;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
};

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/lakshay-tiwari/",
    icon: GitHubIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/lakshyatiwari1/",
    icon: Linkedin,
  },
  {
    name: "X",
    href: "https://x.com/Lakshya_tiwari_/",
    icon: XIcon,
  },
  {
    name: "Medium",
    href: "https://medium.com",
    icon: MediumIcon,
  },
  {
    name: "Email",
    href: "mailto:imlakshya.tiwari@gmail.com",
    icon: Mail,
  },
  {
    name: "Leetcode",
    href: "https://leetcode.com/u/lakshya_tiwari/",
    icon: LeetCodeIcon,
  }
];
