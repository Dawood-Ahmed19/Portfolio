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
};

const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
}: Props) => {
  const btn = useRef<HTMLButtonElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = btn.current;
      if (!el || !fill.current || !label.current || !contextSafe) return;

      const lime = getComputedStyle(label.current).color;

      gsap.set(fill.current, { clipPath: "circle(0% at 0% 100%)" });

      const corner = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        return {
          x: e.clientX < r.left + r.width / 2 ? 0 : 100,
          y: e.clientY < r.top + r.height / 2 ? 0 : 100,
        };
      };

      const onEnter = contextSafe((e: MouseEvent) => {
        const { x, y } = corner(e);
        gsap.set(fill.current, { clipPath: `circle(0% at ${x}% ${y}%)` });
        gsap.to(fill.current, {
          clipPath: `circle(150% at ${x}% ${y}%)`,
          duration: 0.6,
          ease: "power3.out",
          overwrite: true,
        });
        gsap.to(label.current, {
          color: "#333333",
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      });

      const onLeave = contextSafe((e: MouseEvent) => {
        const { x, y } = corner(e);
        gsap.to(fill.current, {
          clipPath: `circle(0% at ${x}% ${y}%)`,
          duration: 0.45,
          ease: "power3.inOut",
          overwrite: true,
        });
        gsap.to(label.current, {
          color: lime,
          duration: 0.3,
          ease: "power2.inOut",
          overwrite: true,
        });
      });

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: btn },
  );

  return (
    <button
      ref={btn}
      type={type}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden border border-[var(--color-lime)] px-8 py-4 font-mono text-sm tracking-widest uppercase ${className}`}
    >
      <span
        ref={fill}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[var(--color-lime)]"
      />

      <span ref={label} className="relative z-10 text-[var(--color-lime)]">
        {children}
      </span>
    </button>
  );
};

export default Button;
