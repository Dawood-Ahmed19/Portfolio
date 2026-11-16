"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  tone?: "ink" | "paper";
};

/** Pill button: an accent fill sweeps in from the side the cursor entered. */
const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
  tone = "ink",
}: Props) => {
  const btn = useRef<HTMLButtonElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = btn.current;
      const f = fill.current;
      if (!el || !f || !contextSafe) return;

      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine)", () => {
        gsap.set(f, { yPercent: 101, autoAlpha: 1 });

        const side = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          return e.clientY < r.top + r.height / 2 ? -101 : 101;
        };

        const onEnter = contextSafe((e: MouseEvent) => {
          gsap.set(f, { yPercent: side(e) });
          gsap.to(f, {
            yPercent: 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: true,
          });
        });
        const onLeave = contextSafe((e: MouseEvent) => {
          gsap.to(f, {
            yPercent: side(e),
            duration: 0.4,
            ease: "power3.inOut",
            overwrite: true,
          });
        });

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        return () => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: btn },
  );

  const colors =
    tone === "ink"
      ? "border-ink text-ink hover:text-paper"
      : "border-paper text-paper hover:text-ink";
  const fillColor = tone === "ink" ? "bg-ink" : "bg-paper";

  return (
    <button
      ref={btn}
      type={type}
      onClick={onClick}
      data-cursor="hover"
      className={`eyebrow relative inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-full border px-7 py-4 transition-colors duration-300 ${colors} ${className}`}
    >
      <span
        ref={fill}
        aria-hidden="true"
        className={`pointer-events-none invisible absolute inset-0 rounded-full ${fillColor}`}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
