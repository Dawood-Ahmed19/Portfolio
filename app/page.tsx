"use client";

import { useState } from "react";
import Loader from "@/components/initialLoader";
import HeroSection from "@/components/HeroSection";
import ScrollProgress from "@/components/ScrollProgress";
import AboutSection from "@/components/AboutSection";
import SectionStack from "@/components/SectionStack";
import StackSection from "@/components/StackSection";
import ProjectsSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection";

export default function Page() {
  const [revealed, setRevealed] = useState(false);

  return (
    <main>
      <Loader onReveal={() => setRevealed(true)} />
      <ScrollProgress />
      <SectionStack>
        <HeroSection start={revealed} />
        <AboutSection />
        <StackSection />
        <ProjectsSection />
        <ContactSection />
      </SectionStack>
    </main>
  );
}
