"use client";

import { useRef } from "react";
import { gsap, EASE, HOVER_FINE } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";

type Props = {
  children: string;
  className?: string;
};

/**
 * Text that rolls upward to reveal a copy of itself on hover.
 * The hover target is the nearest ancestor marked `data-roll-host`
 * (falls back to the text itself), so a whole link or button reacts.
 */
const Roll = ({ children, className = "" }: Props) => {
  const root = useRef<HTMLSpanElement>(null);

  useMotion(
    (contextSafe) => {
      const el = root.current;
      if (!el) return;

      const host = el.closest<HTMLElement>("[data-roll-host]") ?? el;
      const copies = el.querySelectorAll("[data-roll-a], [data-roll-b]");

      const mm = gsap.matchMedia();
      mm.add(HOVER_FINE, () => {
        const tl = gsap
          .timeline({ paused: true, defaults: { duration: 0.6, ease: EASE.out } })
          .to(copies, { yPercent: -100 });

        const on = contextSafe(() => tl.play());
        const off = contextSafe(() => tl.reverse());

        host.addEventListener("mouseenter", on);
        host.addEventListener("mouseleave", off);
        host.addEventListener("focus", on);
        host.addEventListener("blur", off);

        return () => {
          host.removeEventListener("mouseenter", on);
          host.removeEventListener("mouseleave", off);
          host.removeEventListener("focus", on);
          host.removeEventListener("blur", off);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <span
      ref={root}
      className={`relative inline-block overflow-hidden align-bottom leading-[1.25] ${className}`}
    >
      <span data-roll-a className="block">
        {children}
      </span>
      <span
        data-roll-b
        aria-hidden="true"
        className="absolute inset-x-0 top-full block"
      >
        {children}
      </span>
    </span>
  );
};

export default Roll;
