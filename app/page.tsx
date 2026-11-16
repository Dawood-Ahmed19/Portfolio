"use client";

import { useState } from "react";
import InitialLoader from "@/components/initialLoader";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StackSection from "@/components/StackSection";
import ProjectsSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection";

export default function Page() {
  const [revealed, setRevealed] = useState(false);

  return (
    <main>
      <InitialLoader onReveal={() => setRevealed(true)} />
      <ScrollProgress />
      <Cursor />
      <HeroSection start={revealed} />
      <AboutSection />
      <StackSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
