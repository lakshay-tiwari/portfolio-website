import { useState } from "react";
import { Mail, Copy, Check, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { socialLinks } from "@/data/social";
import { siteConfig } from "@/data/site";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = siteConfig.email;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 max-w-5xl mx-auto">
          <Reveal delay={100} className="lg:col-span-2">
            <div className="space-y-4 lg:space-y-6">
              <div className="p-4 sm:p-5 card-base card-hover flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Email me at</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all block select-all cursor-text text-sm sm:text-base mt-0.5"
                      title="Click to compose email"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-gray-200 dark:border-white/10 hover:border-primary-400 dark:hover:border-primary-500/40 bg-gray-50 dark:bg-white/5 hover:bg-primary-50 dark:hover:bg-primary-500/10 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-success-500" />
                        <span className="text-success-600 dark:text-success-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${siteConfig.email}`}
                    aria-label="Send email via mail client"
                    title="Send email"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>

              <div className="p-4 sm:p-5 card-base">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">Find me on</p>
                <div className="flex flex-wrap gap-2.5">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="p-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all hover:-translate-y-0.5"
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
