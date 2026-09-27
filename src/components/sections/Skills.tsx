import { Reveal } from "@/components/motion/Reveal";
import { SkillCategory } from "@/components/skills/SkillCategory";
import { skillCategories } from "@/data/skills";

export function Skills() {
  if (skillCategories.length === 0) return null;

  return (
    <section id="skills" className="section-padding section-gradient-cool">
      <div className="section-container">
        <Reveal>
          <div className="mb-10 md:mb-16">
            <span className="text-xs sm:text-sm font-mono font-semibold tracking-wider uppercase text-primary-600 dark:text-primary-400">
              03. What I Use
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Skills & Tools
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {skillCategories.map((category, i) => (
            <Reveal key={category.name} delay={i * 80}>
              <SkillCategory category={category} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
