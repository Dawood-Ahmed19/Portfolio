"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ScrollProgress = () => {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(bar.current, { scaleY: 0, transformOrigin: "top center" });

    const setScale = gsap.quickTo(bar.current, "scaleY", {
      duration: 0.3,
      ease: "power2.out",
    });

    ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      invalidateOnRefresh: true,
      refreshPriority: -1,
      onUpdate: (self) => setScale(self.progress),
    });
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-6 z-50 h-screen w-[1px] bg-white/10 hidden md:block md:left-10"
    >
      <div ref={bar} className="h-full w-full bg-[var(--color-lime)]" />
    </div>
  );
};

export default ScrollProgress;
