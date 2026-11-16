"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import Preloader from "./Preloader";
import Navbar from "./Navbar";
import ScrollProgress from "./ScrollProgress";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectSection";
import ContactSection from "./ContactSection";

/**
 * Page shell. Owns the single piece of cross-section state: whether the
 * preloader has lifted, which is when the hero and nav begin animating.
 */
export default function Home() {
  const [revealed, setRevealed] = useState(false);

  // Web fonts change text metrics; re-measure triggers once they land.
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Preloader onReveal={() => setRevealed(true)} />
      <ScrollProgress />
      <Navbar start={revealed} />
      <main>
        <HeroSection start={revealed} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
