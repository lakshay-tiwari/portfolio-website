import { Calendar, ExternalLink } from "lucide-react";
import type { Blog } from "@/data/blogs";

type BlogItemProps = {
  blog: Blog;
};

export function BlogItem({ blog }: BlogItemProps) {
  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <a
      href={blog.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-base card-hover group flex flex-col sm:flex-row gap-6 p-5"
    >
      {blog.image && (
        <div className="sm:w-48 h-40 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={blog.image}
            alt={blog.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <time dateTime={blog.date}>{formattedDate}</time>
        </div>
        <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {blog.description}
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400">
          Read article
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}
