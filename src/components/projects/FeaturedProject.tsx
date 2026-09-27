import { ImageReveal } from "@/components/motion/ImageReveal";
import { ProjectLinks } from "./ProjectLinks";
import type { Project } from "@/data/projects";

type FeaturedProjectProps = {
  project: Project;
  index: number;
};

export function FeaturedProject({ project, index }: FeaturedProjectProps) {
  return (
    <article className="grid md:grid-cols-5 gap-4 sm:gap-6 md:gap-10 items-center group">
      <div className="md:col-span-2">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
          {project.image ? (
            <ImageReveal
              src={project.image}
              alt={project.title}
              className="w-full h-full"
              delay={index * 100}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 to-transparent" />
            </ImageReveal>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
          )}
        </div>
      </div>

      <div className="md:col-span-3">
        <span className="inline-block text-xs font-mono font-semibold tracking-wider uppercase text-primary-600 dark:text-primary-400 mb-3">
          Featured Project
        </span>
        <h3 className="text-xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
          {project.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 md:mb-6">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}
