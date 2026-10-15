import { GreetingIntro } from "@/components/layout/GreetingIntro";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <GreetingIntro />
      <main>
        <Hero />
        {/* <CodingActivity /> */}
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
