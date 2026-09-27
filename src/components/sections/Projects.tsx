import { Reveal } from "@/components/motion/Reveal";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectItem } from "@/components/projects/ProjectItem";
import { projects } from "@/data/projects";

export function Projects() {
  if (projects.length === 0) return null;

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="section-padding section-gradient-cool">
      <div className="section-container">
        <Reveal>
          <div className="mb-10 md:mb-16">
            <span className="text-xs sm:text-sm font-mono font-semibold tracking-wider uppercase text-primary-600 dark:text-primary-400">
              02. What I've Built
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Projects
            </h2>
          </div>
        </Reveal>

        {featured.length > 0 && (
          <div className="space-y-14 md:space-y-24 mb-14 md:mb-20">
            {featured.map((project, i) => (
              <Reveal key={project.title} delay={i * 100}>
                <FeaturedProject project={project} index={i} />
              </Reveal>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <>
            {featured.length > 0 && (
              <Reveal>
                <h3 className="text-xl font-display font-semibold text-gray-700 dark:text-gray-300 mb-6">
                  Other Projects
                </h3>
              </Reveal>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((project, i) => (
                <Reveal key={project.title} delay={i * 80}>
                  <ProjectItem project={project} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
