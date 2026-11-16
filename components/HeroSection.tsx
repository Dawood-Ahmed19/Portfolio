"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "./Button";
import { scrollToId } from "./scrollTo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  start?: boolean;
};

const TICKER = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "GraphQL",
  "GSAP",
  "Docker",
  "AWS",
];

const HeroSection = ({ start = true }: Props) => {
  const root = useRef<HTMLElement>(null);

  // Entrance: runs once the loader has lifted. Hidden state is applied
  // only when motion is allowed, so reduced-motion users see everything.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-line]", root.current);
        const fades = gsap.utils.toArray<HTMLElement>("[data-fade]", root.current);
        const rule = root.current?.querySelector<HTMLElement>("[data-rule]");

        gsap.set(lines, { yPercent: 115 });
        gsap.set(fades, { autoAlpha: 0, y: 16 });
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
        if (!start) return;

        gsap
          .timeline({ delay: 0.1, defaults: { ease: "power4.out" } })
          .to(lines, { yPercent: 0, duration: 1.3, stagger: 0.12 })
          .to(rule, { scaleX: 1, duration: 1.4, ease: "expo.out" }, 0.3)
          .to(fades, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.55);
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [start] },
  );

  // Scroll: headline drifts up slower than the page; ticker slides sideways.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-parallax]", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to("[data-serif]", {
          xPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-28 md:pt-36"
    >
      <div className="wrap flex flex-col gap-10 md:gap-14">
        <div
          data-fade
          className="eyebrow text-mute flex flex-wrap items-center justify-between gap-x-8 gap-y-2"
        >
          <span>// Full stack developer</span>
          <span>Based in Rawalpindi / Islamabad</span>
        </div>

        <h1
          data-parallax
          className="display text-[clamp(52px,13.2vw,260px)] will-change-transform"
        >
          <span className="mask block">
            <span data-line className="block whitespace-nowrap">
              I build
            </span>
          </span>
          <span className="mask block">
            <span data-line className="block whitespace-nowrap">
              <span
                data-serif
                className="serif-i text-signal inline-block pr-[0.12em] text-[1.12em] leading-[0.8]"
              >
                the web
              </span>
            </span>
          </span>
          <span className="mask block">
            <span data-line className="block whitespace-nowrap">
              end to end.
            </span>
          </span>
        </h1>

        <div
          data-rule
          aria-hidden="true"
          className="bg-ink h-px w-full origin-left"
        />

        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <p
            data-fade
            className="max-w-md text-base leading-relaxed md:max-w-lg md:text-xl"
          >
            I build full stack web apps, from database to interface, with the
            PERN and MERN stacks.
          </p>

          <div data-fade>
            <Button onClick={() => scrollToId("work")}>
              View Selected Work →
            </Button>
          </div>
        </div>
      </div>

      {/* Stack ticker */}
      <div
        data-fade
        aria-hidden="true"
        className="border-ink/20 mt-14 overflow-hidden border-y py-4 md:mt-20"
      >
        <div className="marquee-track display flex gap-10 text-[clamp(20px,3vw,40px)] whitespace-nowrap">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={`${t}-${i}`} className="flex items-center gap-10">
              {t}
              <span className="text-signal serif-i text-[1.2em] leading-none">
                ✺
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
