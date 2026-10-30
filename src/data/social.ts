import type { ComponentType, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";
import {
  GitHubIcon,
  LinkedInIcon,
  XIcon,
  MediumIcon,
  MailIcon,
  LeetCodeIcon,
} from "@/components/icons";

export type SocialLink = {
  name: string;
  href: string;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
  hoverBorder?: string;
  hoverBg?: string;
};

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/lakshay-tiwari/",
    icon: GitHubIcon,
    hoverBorder: "hover:border-gray-400 dark:hover:border-white/40",
    hoverBg: "hover:bg-gray-100 dark:hover:bg-white/10",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/lakshyatiwari1/",
    icon: LinkedInIcon,
    hoverBorder: "hover:border-[#0A66C2]/60",
    hoverBg: "hover:bg-[#0A66C2]/10",
  },
  {
    name: "X",
    href: "https://x.com/Lakshya_tiwari_/",
    icon: XIcon,
    hoverBorder: "hover:border-gray-400 dark:hover:border-white/40",
    hoverBg: "hover:bg-gray-100 dark:hover:bg-white/10",
  },
  {
    name: "Medium",
    href: "https://medium.com/@imlakshya.tiwari",
    icon: MediumIcon,
    hoverBorder: "hover:border-[#00AB6C]/60",
    hoverBg: "hover:bg-[#00AB6C]/10",
  },
  {
    name: "Email",
    href: "mailto:imlakshya.tiwari@gmail.com",
    icon: MailIcon,
    hoverBorder: "hover:border-[#EA4335]/60",
    hoverBg: "hover:bg-[#EA4335]/10",
  },
  {
    name: "Leetcode",
    href: "https://leetcode.com/u/lakshya_tiwari/",
    icon: LeetCodeIcon,
    hoverBorder: "hover:border-[#FFA116]/60",
    hoverBg: "hover:bg-[#FFA116]/10",
  }
];
