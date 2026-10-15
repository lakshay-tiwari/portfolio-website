import { GreetingIntro } from "@/components/layout/GreetingIntro";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { siteConfig } from "@/data/site";
import { socialLinks } from "@/data/social";

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        jobTitle: siteConfig.role,
        description: siteConfig.bio,
        url: siteConfig.url,
        image: `${siteConfig.url}${siteConfig.profileImage}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Noida",
          addressCountry: "IN",
        },
        sameAs: socialLinks
          .filter((s) => s.href.startsWith("http"))
          .map((s) => s.href),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: `${siteConfig.name} — Portfolio`,
        description: siteConfig.bio,
        publisher: {
          "@id": `${siteConfig.url}/#person`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GreetingIntro />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
