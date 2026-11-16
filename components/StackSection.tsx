"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Skill = { name: string; hot?: boolean };
type Group = { label: string; skills: Skill[] };

// Same nine skills as before, grouped as the original layout labelled them.
const GROUPS: Group[] = [
  {
    label: "Frontend",
    skills: [
      { name: "React", hot: true },
      { name: "GSAP" },
      { name: "Next.js" },
      { name: "TypeScript" },
    ],
  },
  {
    label: "Backend",
    skills: [{ name: "Node.js", hot: true }, { name: "GraphQL" }],
  },
  {
    label: "Data & Infra",
    skills: [
      { name: "PostgreSQL" },
      { name: "Docker", hot: true },
      { name: "AWS" },
    ],
  },
];

const StackSection = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      if (!contextSafe) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rootEl = root.current;
        if (!rootEl) return;
        gsap.fromTo(
          rootEl,
          { borderTopLeftRadius: 72, borderTopRightRadius: 72 },
          {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            ease: "none",
            scrollTrigger: {
              trigger: rootEl,
              start: "top bottom",
              end: "top 25%",
              scrub: true,
            },
          },
        );

        const heads = gsap.utils.toArray<HTMLElement>("[data-stack-head]", rootEl);
        const headTrigger = rootEl.querySelector("h2") ?? rootEl;
        gsap.set(heads, { yPercent: 115 });
        ScrollTrigger.create({
          trigger: headTrigger,
          start: "top 85%",
          once: true,
          onEnter: contextSafe(() => {
            gsap.to(heads, {
              yPercent: 0,
              duration: 1.2,
              stagger: 0.1,
              ease: "power4.out",
            });
          }),
        });

        gsap.utils.toArray<HTMLElement>("[data-group]", rootEl).forEach((group) => {
          const rule = group.querySelector<HTMLElement>("[data-rule]");
          const glabel = group.querySelector<HTMLElement>("[data-glabel]");
          const skills = gsap.utils.toArray<HTMLElement>("[data-skill]", group);
          gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(glabel, { autoAlpha: 0, x: -16 });
          gsap.set(skills, { yPercent: 110 });

          ScrollTrigger.create({
            trigger: group,
            start: "top 82%",
            once: true,
            onEnter: contextSafe(() => {
              gsap
                .timeline({ defaults: { ease: "power4.out" } })
                .to(rule, { scaleX: 1, duration: 1.2, ease: "expo.out" })
                .to(glabel, { autoAlpha: 1, x: 0, duration: 0.7 }, 0.1)
                .to(skills, { yPercent: 0, duration: 1, stagger: 0.09 }, 0.15);
            }),
          });
        });

        const slide = rootEl.querySelector("[data-stack-slide]");
        if (slide) {
          gsap.to(slide, {
            xPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: rootEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

      // hover: skills nudge (mouse only)
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-skill-hit]", root.current);
        const cleanups = items.map((el) => {
          const label = el.querySelector("[data-skill]");
          const dot = el.querySelector("[data-dot]");
          const tl = gsap
            .timeline({
              paused: true,
              defaults: { duration: 0.4, ease: "power3.out" },
            })
            .to(label, { x: 20, color: "#ff4a1c" }, 0)
            .to(dot, { scale: 1.8 }, 0);
          const on = contextSafe(() => tl.play());
          const off = contextSafe(() => tl.reverse());
          el.addEventListener("mouseenter", on);
          el.addEventListener("mouseleave", off);
          return () => {
            el.removeEventListener("mouseenter", on);
            el.removeEventListener("mouseleave", off);
          };
        });
        return () => cleanups.forEach((c) => c());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="stack"
      className="bg-ink text-paper relative overflow-hidden py-28 md:py-44"
    >
      <div className="wrap">
        <p className="eyebrow mb-10 opacity-60 md:mb-16">02 / Stack</p>

        <div className="mb-16 md:mb-28" data-stack-slide>
          <h2 className="display text-[clamp(44px,10vw,180px)]">
            <span className="mask block">
              <span data-stack-head className="block whitespace-nowrap">
                Tools of
              </span>
            </span>
            <span className="mask block">
              <span
                data-stack-head
                className="serif-i text-signal block whitespace-nowrap text-[1.1em]"
              >
                the trade.
              </span>
            </span>
          </h2>
        </div>

        <div className="flex flex-col">
          {GROUPS.map(({ label, skills }) => (
            <div
              key={label}
              data-group
              className="relative grid gap-5 py-8 md:grid-cols-12 md:gap-8 md:py-12"
            >
              <div
                data-rule
                aria-hidden="true"
                className="bg-paper/25 absolute inset-x-0 top-0 h-px"
              />
              <p
                data-glabel
                className="eyebrow opacity-70 md:col-span-3 md:pt-4"
              >
                {label}
              </p>

              <ul className="flex flex-col md:col-span-9">
                {skills.map(({ name, hot }) => (
                  <li
                    key={name}
                    data-skill-hit
                    data-cursor="hover"
                    className="mask w-full py-1 md:py-2"
                  >
                    <span
                      data-skill
                      className="display flex items-center gap-4 text-[clamp(32px,6vw,96px)]"
                    >
                      {name}
                      {hot ? (
                        <span
                          data-dot
                          aria-label="Core tool"
                          className="bg-signal inline-block h-[0.14em] w-[0.14em] rounded-full"
                        />
                      ) : (
                        <span data-dot className="hidden" aria-hidden="true" />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackSection;
