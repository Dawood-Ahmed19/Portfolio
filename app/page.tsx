"use client";

import { useState } from "react";
import Loader from "@/components/initialLoader";
import HeroSection from "@/components/HeroSection";
import ScrollProgress from "@/components/ScrollProgress";
import AboutSection from "@/components/AboutSection";
import SectionStack from "@/components/SectionStack";

export default function Page() {
  const [revealed, setRevealed] = useState(false);

  return (
    <main>
      <Loader onReveal={() => setRevealed(true)} />
      <ScrollProgress />
      <SectionStack>
        <HeroSection start={revealed} />
        <AboutSection />
      </SectionStack>
    </main>
  );
}
