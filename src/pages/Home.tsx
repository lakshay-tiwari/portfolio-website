import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { CodingActivity } from "@/components/sections/CodingActivity";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      {/* <CodingActivity /> */}
      <Contact />
    </main>
  );
}
