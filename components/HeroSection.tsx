"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Button from "./Button";

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
          {
            drawSVG: "100%",
            duration: 1.3,
            ease: "expo.out",
          },
          "-=0.1",
        );
      }
    },

    { scope: container, dependencies: [start] },
  );

  useGSAP(
    (_ctx, contextSafe) => {
      const outline =
        container.current?.querySelector<HTMLElement>("[data-outline]");
      const fill = container.current?.querySelector<HTMLElement>("[data-fill]");
      if (!outline || !fill || !contextSafe) return;

      gsap.set(fill, { clipPath: "circle(0% at 0% 100%)" });

      const corner = (e: MouseEvent) => {
        const r = outline.getBoundingClientRect();
        const x = e.clientX < r.left + r.width / 2 ? 0 : 100;
        const y = e.clientY < r.top + r.height / 2 ? 0 : 100;
        return { x, y };
      };

      const onEnter = contextSafe((e: MouseEvent) => {
        const { x, y } = corner(e);
        gsap.set(fill, { clipPath: `circle(0% at ${x}% ${y}%)` });
        gsap.to(fill, {
          clipPath: `circle(150% at ${x}% ${y}%)`,
          duration: 0.7,
          ease: "power3.out",
          overwrite: true,
        });
      });

      const onLeave = contextSafe((e: MouseEvent) => {
        const { x, y } = corner(e);
        gsap.to(fill, {
          clipPath: `circle(0% at ${x}% ${y}%)`,
          duration: 0.5,
          ease: "power3.inOut",
          overwrite: true,
        });
      });

      outline.addEventListener("mouseenter", onEnter);
      outline.addEventListener("mouseleave", onLeave);

      return () => {
        outline.removeEventListener("mouseenter", onEnter);
        outline.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: container },
  );

  return (
    <section ref={container} className="py-30 md:py-32">
      <div className="container mx-auto flex h-full w-full flex-col justify-center gap-6 px-6 pb-10 md:gap-10 md:px-0">
        <p className="text-mute text-xs leading-relaxed font-normal tracking-wide uppercase md:text-sm">
          // Full stack Developer - Based in rawalpindi / islamabad
        </p>

        <h1 className="font-display text-paper text-[clamp(36px,10.5vw,152px)] leading-[0.92] font-extrabold tracking-tight uppercase">
          <div className="overflow-hidden">
            <span data-reveal-line className="block whitespace-nowrap">
              i build
            </span>
          </div>

          <div className="overflow-hidden">
            <span
              data-reveal-line
              data-outline
              className="relative inline-block cursor-default whitespace-nowrap text-transparent [-webkit-text-stroke:1px_var(--color-lime)] md:[-webkit-text-stroke:2px_var(--color-lime)]"
            >
              The web
              <span
                data-fill
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 whitespace-nowrap text-[var(--color-lime)] [-webkit-text-stroke:1px_var(--color-lime)] md:[-webkit-text-stroke:2px_var(--color-lime)]"
              >
                The web
              </span>
            </span>
          </div>

          <div className="overflow-hidden">
            <span data-reveal-line className="block whitespace-nowrap">
              End to End.
            </span>
          </div>

          <svg
            className="mt-2 w-full md:w-[85%]"
            viewBox="0 0 800 12"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <mask
                id="underline-mask"
                maskUnits="userSpaceOnUse"
                x="0"
                y="-10"
                width="800"
                height="32"
              >
                <path
                  data-underline
                  d="M 2 7 Q 200 3 400 7 T 798 7"
                  stroke="white"
                  strokeWidth="20"
                  strokeLinecap="butt"
                  vectorEffect="non-scaling-stroke"
                />
              </mask>
            </defs>

            <path
              d="M 2 5 Q 200 1 400 5 T 798 6.6 L 798 7.4 Q 600 9 400 8.4 T 2 9.2 Z"
              fill="var(--color-lime)"
              mask="url(#underline-mask)"
            />
          </svg>
        </h1>

        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-mute max-w-md text-sm md:text-base">
            I build full stack web apps, from database to interface, with the
            PERN and MERN stacks.
          </p>

          <Button>View Selected Work →</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
