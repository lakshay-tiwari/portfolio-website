import type { Skill } from "@/data/skills";

type SkillItemProps = {
  skill: Skill;
};

export function SkillItem({ skill }: SkillItemProps) {
  return (
    <span className="skill-chip">
      {skill.name}
    </span>
  );
}
