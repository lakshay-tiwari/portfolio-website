import { Mail } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { socialLinks } from "@/data/social";
import { siteConfig } from "@/data/site";

export function Contact() {
  return (
    <section id="contact" className="section-padding section-gradient-warm">
      <div className="section-container">
        <Reveal>
          <div className="mb-10 md:mb-16 text-center">
            <span className="text-xs sm:text-sm font-mono font-semibold tracking-wider uppercase text-primary-600 dark:text-primary-400">
              05. Get In Touch
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Let's Connect
            </h2>
            <p className="mt-3 md:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Have a project in mind or just want to chat? My inbox is always open.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-12 max-w-5xl mx-auto">
          <Reveal delay={100} className="lg:col-span-2">
            <div className="space-y-4 lg:space-y-6">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 p-4 card-base card-hover"
              >
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email me at</p>
                  <p className="font-medium text-gray-900 dark:text-white">{siteConfig.email}</p>
                </div>
              </a>

              <div className="p-4 card-base">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Find me on</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="p-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/40 transition-all"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-3">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
