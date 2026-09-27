import { ImageReveal } from "@/components/motion/ImageReveal";
import { ProjectLinks } from "./ProjectLinks";
import type { Project } from "@/data/projects";

type ProjectItemProps = {
  project: Project;
};

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <article className="card-base card-hover group overflow-hidden">
      {project.image && (
        <div className="relative h-48 overflow-hidden">
          <ImageReveal
            src={project.image}
            alt={project.title}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent dark:from-black/60" />
          </ImageReveal>
        </div>
      )}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
          <ProjectLinks project={project} size="sm" />
        </div>
      </div>
    </article>
  );
}
