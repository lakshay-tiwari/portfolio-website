import type { Skill } from "@/data/skills";
import { TechIcon } from "./TechIcon";

type SkillItemProps = {
  skill: Skill;
};

export function SkillItem({ skill }: SkillItemProps) {
  return (
    <span className="skill-chip inline-flex items-center gap-2 group/chip">
      <TechIcon
        name={skill.name}
        size={17}
        className="group-hover/chip:scale-110 transition-transform duration-200"
      />
      <span>{skill.name}</span>
    </span>
  );
}

