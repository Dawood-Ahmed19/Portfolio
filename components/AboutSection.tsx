"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "./SplitReveal";

const RobotCanvas = dynamic(() => import("./RobotCanvas"), { ssr: false });

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HEADLINE = ["Front end.", "Back end.", "Everything", "Between."];

const SPECS = [
  ["Status", "In development"],
  ["Mode", "Build / Debug / Repeat"],
  ["Format", "Human.exe"],
];

const AboutSection = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<HTMLElement>(
          "[data-headline-line]",
          root.current,
        );
        gsap.set(lines, { yPercent: 115 });
        gsap.set("[data-card]", { autoAlpha: 0, y: 60, rotate: 2 });
        gsap.set("[data-about-fade]", { autoAlpha: 0, y: 16 });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap
              .timeline({ defaults: { ease: "power4.out" } })
              .to("[data-about-fade]", {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.08,
              })
              .to(lines, { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.1)
              .to(
                "[data-card]",
                { autoAlpha: 1, y: 0, rotate: 0, duration: 1.2 },
                0.2,
              );
          },
        });

        // headline lines drift at different speeds for depth
        lines.forEach((line, i) => {
          gsap.to(line, {
            x: (i % 2 === 0 ? -1 : 1) * 40,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        // card tilts gently while it passes through
        gsap.to("[data-card]", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
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
      id="about"
      className="relative py-28 md:py-44"
    >
      <div className="wrap">
        <p data-about-fade className="eyebrow text-mute mb-10 md:mb-16">
          01 / About
        </p>

        <div className="grid items-start gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <h2 className="display text-[clamp(44px,9.5vw,170px)]">
              {HEADLINE.map((text, i) => (
                <span key={text} className="mask block">
                  <span
                    data-headline-line
                    className={`block whitespace-nowrap ${
                      i % 2 === 1 ? "serif-i text-signal text-[1.1em]" : ""
                    }`}
                  >
                    {text}
                  </span>
                </span>
              ))}
            </h2>

            <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-2">
              <SplitReveal
                as="p"
                text="Dawood Ahmed, full stack developer."
                className="eyebrow"
              />
              <SplitReveal
                as="p"
                text="I work front to back, from schema to pixels. PERN and MERN stacks, shipped end to end."
                className="text-xl leading-snug md:text-3xl"
                delay={0.1}
              />
            </div>
          </div>

          <aside data-card className="md:col-span-4 md:mt-24">
            <div className="bg-ink text-paper relative overflow-hidden rounded-[1.75rem] p-5 md:p-6">
              <div className="eyebrow flex items-center justify-between opacity-80">
                <span>Dev / Profile</span>
                <span className="text-signal flex items-center gap-2">
                  <span className="bg-signal h-1.5 w-1.5 animate-pulse rounded-full" />
                  Available
                </span>
              </div>

              <div className="mx-auto w-full max-w-[240px]" data-cursor="hover">
                <RobotCanvas />
              </div>

              <dl className="eyebrow border-paper/15 space-y-3 border-t pt-4 text-[0.62rem]">
                {SPECS.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="opacity-60">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
