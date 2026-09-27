import { Reveal } from "@/components/motion/Reveal";
import { ExperienceItem } from "@/components/experience/ExperienceItem";
import { experiences } from "@/data/experience";

export function Experience() {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section-padding section-gradient-warm">
      <div className="section-container">
        <Reveal>
          <div className="mb-10 md:mb-16">
            <span className="text-xs sm:text-sm font-mono font-semibold tracking-wider uppercase text-primary-600 dark:text-primary-400">
              01. Where I've Worked
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Experience
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="max-w-3xl max-w-full">
            {experiences.map((exp, i) => (
              <ExperienceItem
                key={`${exp.company}-${exp.role}`}
                experience={exp}
                isLast={i === experiences.length - 1}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
