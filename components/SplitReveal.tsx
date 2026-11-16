"use client";

import { useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Seconds before the reveal starts. */
  delay?: number;
  /** ScrollTrigger start position. */
  start?: string;
  /** Per-word stagger in seconds. */
  stagger?: number;
};

/**
 * Word-by-word masked rise. Reveals when scrolled into view.
 * Content stays fully visible when reduced motion is requested.
 */
const SplitReveal = ({
  text,
  as: Tag = "p",
  className = "",
  delay = 0,
  start = "top 88%",
  stagger = 0.045,
}: Props) => {
  const root = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-w]", root.current);
        gsap.set(items, { yPercent: 115 });
        gsap.to(items, {
          yPercent: 0,
          duration: 1,
          delay,
          stagger,
          ease: "power4.out",
          scrollTrigger: {
            trigger: root.current,
            start,
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <Tag ref={root} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="mask">
            <span data-w className="inline-block will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
};

export default SplitReveal;
