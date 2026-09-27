import type { Experience } from "@/data/experience";
import { MapPin } from "lucide-react";

type ExperienceItemProps = {
  experience: Experience;
  isLast: boolean;
};

export function ExperienceItem({ experience, isLast }: ExperienceItemProps) {
  return (
    <div className="relative pl-10 sm:pl-12 pb-10 sm:pb-12 last:pb-0 group">
      <div className="absolute left-0 top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-primary-500 bg-[#f8fafc] dark:bg-[#0a0a0f] z-10 transition-transform duration-300 group-hover:scale-125" />
      {!isLast && (
        <div className="absolute left-[6px] sm:left-[7px] top-5 sm:top-6 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/40 to-transparent" />
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base sm:text-lg font-display font-semibold text-gray-900 dark:text-white">
            {experience.role}
          </h3>
          <span className="text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-400">
            {experience.duration}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-primary-600 dark:text-primary-400 font-medium">
            {experience.company}
          </span>
          {experience.location && (
            <span className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              {experience.location}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-2 max-w-2xl">
          {experience.description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
