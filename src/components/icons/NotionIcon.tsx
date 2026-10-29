import type { SVGProps } from "react";
import { siNotion } from "simple-icons";

export function NotionIcon({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`shrink-0 fill-[#000000] dark:fill-white ${className}`}
      {...props}
    >
      <path d={siNotion.path} />
    </svg>
  );
}
