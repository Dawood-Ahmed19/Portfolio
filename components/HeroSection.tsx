"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

type Props = {
  start?: boolean;
};

const HeroSection = ({ start = true }: Props) => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>(
        "[data-reveal-line]",
        container.current,
      );

      const underline =
        container.current?.querySelector<SVGPathElement>("[data-underline]");

      gsap.set(lines, { yPercent: 110, willChange: "transform" });
      if (underline) gsap.set(underline, { drawSVG: "0%" });

      if (!start) return;

      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.18,
          ease: "power4.out",
        },
      );

      if (underline) {
        tl.to(
          underline,
          { drawSVG: "100%", duration: 0.5, ease: "power2.out" },
          "-=0.1",
        );
      }
    },
    { scope: container, dependencies: [start] },
  );

  return (
    <div ref={container} className="flex w-full flex-col gap-10 py-18">
      <p className="text-mute text-sm font-normal uppercase">
        // Full stack Developer - Based in rawalpindi
      </p>

      <h1 className="text-[clamp(56px,10.5vw,152px)] font-display text-paper leading-35 font-extrabold tracking-tight uppercase">
        <div className="overflow-hidden">
          <span data-reveal-line className="block">
            i build
          </span>
        </div>

        <div className="overflow-hidden">
          <span
            data-reveal-line
            className="block text-transparent [-webkit-text-stroke:2px_var(--color-lime)]"
          >
            The web
          </span>
        </div>

        <div className="overflow-hidden">
          <span data-reveal-line className="block">
            End to End.
          </span>
        </div>

        <svg
          className="mt-2 w-[85%]"
          viewBox="0 0 800 12"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            data-underline
            d="M 2 7 Q 200 1 400 7 T 798 7"
            stroke="var(--color-lime)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </h1>
    </div>
  );
};

export default HeroSection;
