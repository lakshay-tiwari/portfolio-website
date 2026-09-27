import {
  Code2,
  Layout,
  Server,
  Database,
  BrainCircuit,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import { SkillItem } from "./SkillItem";
import type { SkillCategory as SkillCategoryType } from "@/data/skills";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Layout,
  Server,
  Database,
  BrainCircuit,
  Cloud,
};

type SkillCategoryProps = {
  category: SkillCategoryType;
};

export function SkillCategory({ category }: SkillCategoryProps) {
  const Icon = iconMap[category.icon] ?? Code2;

  return (
    <div className="skill-card p-5 sm:p-6 group">
      <div className="flex items-start gap-3.5 mb-5">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/15 dark:to-accent-500/15 border border-primary-200/60 dark:border-primary-500/20 text-primary-600 dark:text-primary-400 transition-all duration-300 group-hover:from-primary-500/15 group-hover:to-accent-500/15 dark:group-hover:from-primary-500/20 dark:group-hover:to-accent-500/20 group-hover:scale-105">
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-display font-semibold text-gray-900 dark:text-white tracking-tight">
            {category.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
}
