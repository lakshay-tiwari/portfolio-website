import { Reveal } from "@/components/motion/Reveal";
import { BlogItem } from "@/components/blogs/BlogItem";
import { blogs } from "@/data/blogs";

export default function Blogs() {
  return (
    <main className="pt-24 sm:pt-28 pb-16 md:pb-20 min-h-screen section-gradient-cool">
      <div className="section-container">
        <Reveal>
          <div className="mb-10 md:mb-16">
            <span className="text-xs sm:text-sm font-mono font-semibold tracking-wider uppercase text-primary-600 dark:text-primary-400">
              Writing
            </span>
            <h1 className="mt-2 text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Blog
            </h1>
            <p className="mt-3 md:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl">
              Thoughts on AI, web development, and software engineering.
            </p>
          </div>
        </Reveal>

        {blogs.length === 0 ? (
          <Reveal>
            <div className="card-base p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No blog posts yet. Check back soon!
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {blogs.map((blog, i) => (
              <Reveal key={blog.url} delay={i * 80}>
                <BlogItem blog={blog} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
