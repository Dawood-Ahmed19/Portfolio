"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { SKILL_GROUPS } from "@/lib/content";
import Words from "./ui/Words";

const ALL_SKILLS = SKILL_GROUPS.flatMap((g) => [...g.items]);

const SkillsSection = () => {
  const root = useRef<HTMLElement>(null);

  useMotion(
    () => {
      gsap.from("[data-stack-rule]", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.6,
        ease: EASE.inOut,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });

      gsap.from("[data-stack-title] [data-word]", {
        yPercent: 115,
        duration: 1.4,
        ease: EASE.out,
        scrollTrigger: { trigger: "[data-stack-title]", start: "top 88%" },
      });

      // Each group: rule draws, then its skills slide up in turn.
      gsap.utils.toArray<HTMLElement>("[data-group]").forEach((group) => {
        const st = { trigger: group, start: "top 88%" };
        gsap.from(group.querySelector("[data-group-rule]"), {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.4,
          ease: EASE.inOut,
          scrollTrigger: st,
        });
        gsap.from(group.querySelectorAll("[data-skill]"), {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.08,
          ease: EASE.out,
          scrollTrigger: st,
        });
        gsap.from(group.querySelector("[data-group-label]"), {
          autoAlpha: 0,
          x: -12,
          duration: 0.9,
          ease: EASE.soft,
          scrollTrigger: st,
        });
      });

      // Marquee: loops forever, speeds up with scroll and reverses on scroll-up.
      const track = root.current?.querySelector<HTMLElement>("[data-track]");
      if (track) {
        const loop = gsap.to(track, {
          xPercent: -50,
          duration: 40,
          ease: "none",
          repeat: -1,
        });

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const dir = self.direction;
            const boost = Math.min(5, Math.abs(self.getVelocity()) / 300);
            gsap.killTweensOf(loop);
            gsap
              .timeline()
              .to(loop, {
                timeScale: dir * (1 + boost),
                duration: 0.25,
                ease: "power2.out",
              })
              .to(loop, { timeScale: dir, duration: 1.4, ease: "power2.out" });
          },
        });
        return () => st.kill();
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stack" className="relative py-28 md:py-44">
      <div className="wrap">
        <div className="mb-10 md:mb-16">
          <p className="label mb-4">02 / Stack</p>
          <div data-stack-rule className="h-px w-full bg-line" />
        </div>

        <h2
          data-stack-title
          className="text-title mb-16 font-medium md:mb-28"
        >
          <Words text={"Tools I\nreach for."} />
        </h2>

        <div>
          {SKILL_GROUPS.map(({ label, items }) => (
            <div
              key={label}
              data-group
              className="relative grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-12"
            >
              <div
                data-group-rule
                className="absolute inset-x-0 top-0 h-px bg-line"
              />
              <p data-group-label className="label md:col-span-3 md:pt-3">
                {label}
              </p>
              <ul className="flex flex-wrap gap-x-8 gap-y-1 md:col-span-9 md:gap-x-12">
                {items.map((skill) => (
                  <li key={skill} className="overflow-hidden pb-[0.1em]">
                    <span
                      data-skill
                      className="block cursor-default text-[clamp(2rem,6vw,5.5rem)] leading-[1.05] font-medium tracking-[-0.04em] text-fg transition-colors duration-300 hover:text-accent"
                    >
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="h-px w-full bg-line" />
        </div>
      </div>

      {/* Marquee */}
      <div
        aria-hidden="true"
        className="mt-20 overflow-hidden border-y border-line py-6 md:mt-32 md:py-10"
      >
        <div data-track className="flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {ALL_SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center text-[clamp(3rem,9vw,9rem)] leading-none font-medium tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_var(--color-fg)]"
                >
                  {skill}
                  <span className="mx-[0.4em] inline-block h-[0.12em] w-[0.12em] rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
