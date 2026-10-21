"use client";

import { useState } from "react";
import Loader from "../components/initialLoader";
import HeroSection from "../components/HeroSection";

export default function Page() {
  const [revealed, setRevealed] = useState(false);

  return (
    <main>
      <Loader onReveal={() => setRevealed(true)} />
      <HeroSection start={revealed} />
    </main>
  );
}
