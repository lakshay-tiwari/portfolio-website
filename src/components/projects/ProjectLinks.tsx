import { ExternalLink, Github, FileText } from "lucide-react";
import type { Project } from "@/data/projects";

type ProjectLinksProps = {
  project: Project;
  size?: "sm" | "md";
};

export function ProjectLinks({ project, size = "md" }: ProjectLinksProps) {
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize = size === "sm" ? "p-2" : "p-2.5";

  return (
    <div className="flex items-center gap-2">
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} on GitHub`}
        className={`${btnSize} rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors`}
      >
        <Github className={sizeClasses} />
      </a>
      <a
        href={project.notion}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} documentation`}
        className={`${btnSize} rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors`}
      >
        <FileText className={sizeClasses} />
      </a>
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} live demo`}
          className={`${btnSize} rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors`}
        >
          <ExternalLink className={sizeClasses} />
        </a>
      )}
    </div>
  );
}
