"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import dynamic from "next/dynamic";
const RobotCanvas = dynamic(() => import("./RobotCanvas"), { ssr: false });

gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin, DrawSVGPlugin);

const HEADLINE = [
  { text: "Front end.", active: true },
  { text: "Back end.", active: false },
  { text: "Everything", active: false },
  { text: "Between.", active: false },
];

const AboutSection = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.from("[data-label]", { autoAlpha: 0, x: -12, duration: 0.5 })
        .from(
          "[data-bracket]",
          { autoAlpha: 0, duration: 0.4, stagger: 0.08 },
          0.1,
        )
        .from("[data-card]", { autoAlpha: 0, y: 24, duration: 0.8 }, 0.15)
        .from(
          "[data-fig] > *",
          { drawSVG: 0, duration: 1.1, stagger: 0.05, ease: "power2.inOut" },
          0.5,
        )
        .from(
          "[data-spec]",
          { autoAlpha: 0, x: -8, stagger: 0.08, duration: 0.4 },
          0.9,
        );

      const lines = gsap.utils.toArray<HTMLElement>(
        "[data-type]",
        root.current,
      );
      let at = 0.6;
      lines.forEach((el) => {
        const value = el.dataset.type ?? "";
        const dur = Math.max(0.25, value.length * 0.02);
        tl.to(el, { text: { value }, duration: dur, ease: "none" }, at);
        at += dur + 0.12;
      });

      tl.from(
        "[data-headline-line]",
        { yPercent: 110, duration: 0.9, stagger: 0.1, ease: "power4.out" },
        0.9,
      );

      gsap.to("[data-cursor]", {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
      });

      ScrollTrigger.create({
        start: () => window.innerHeight * 0.45,
        invalidateOnRefresh: true,
        onEnter: () => tl.timeScale(1).play(),
        onLeaveBack: () => tl.timeScale(2.5).reverse(),
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      className="relative flex h-full w-full flex-col justify-center gap-10 overflow-hidden pr-6 pl-16 md:pr-16 md:pl-24"
    >
      <p
        data-label
        className="font-mono text-[11px] tracking-[0.25em] text-mute uppercase"
      >
        01 / About
      </p>

      <div className="grid items-start gap-10 md:grid-cols-[minmax(260px,320px)_1fr] md:gap-16">
        {/* ---------- LEFT: model card ---------- */}
        <div className="relative p-3">
          {/* corner brackets */}
          <span
            data-bracket
            className="absolute top-0 left-0 h-7 w-7 border-t-2 border-l-2 border-[var(--color-lime)]"
          />
          <span
            data-bracket
            className="absolute top-0 right-0 h-7 w-7 border-t-2 border-r-2 border-[var(--color-lime)]"
          />
          <span
            data-bracket
            className="absolute bottom-0 left-0 h-7 w-7 border-b-2 border-l-2 border-[var(--color-lime)]"
          />
          <span
            data-bracket
            className="absolute right-0 bottom-0 h-7 w-7 border-r-2 border-b-2 border-[var(--color-lime)]"
          />

          <div
            data-card
            className="bg-[#121317] p-5 font-mono text-[10px] tracking-[0.2em] uppercase"
          >
            <div className="flex items-center justify-between text-mute">
              <span>Model / Dummy</span>
              <span className="flex items-center gap-2 text-[var(--color-lime)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-lime)]" />
                Online
              </span>
            </div>

            <RobotCanvas />

            <dl className="space-y-2">
              {[
                ["Pose", "Idle"],
                ["Rig", "Placeholder"],
                ["Format", "GLB"],
              ].map(([k, v]) => (
                <div key={k} data-spec className="flex justify-between">
                  <dt className="text-mute">{k}</dt>
                  <dd className="text-paper">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className="flex flex-col gap-8">
          <div className="max-w-xl font-mono text-sm leading-7 md:text-base md:leading-8">
            <p className="text-[var(--color-lime)]">
              <span>&gt; </span>
              <span data-type="whoami" />
            </p>
            <p className="text-paper">
              <span
                className="uppercase"
                data-type="Dawood Ahmed — full stack developer"
              />
            </p>
            <p className="text-[var(--color-lime)]">
              <span>&gt; </span>
              <span data-type="cat bio.txt" />
            </p>
            <p className="text-paper">
              <span data-type="I work front to back, from schema to pixels. PERN and MERN stacks, shipped end to end." />
            </p>
            <p className="text-[var(--color-lime)]">
              <span>&gt; </span>
              <span
                data-cursor
                className="inline-block h-[1em] w-2.5 translate-y-[2px] bg-[var(--color-lime)]"
              />
            </p>
          </div>

          <h2 className="grid font-display text-[clamp(48px,8.5vw,100px)] leading-[0.9] font-black tracking-tight text-[var(--color-lime)] uppercase">
            {HEADLINE.map(({ text }) => (
              <div
                key={text}
                data-swap
                className="col-start-1 row-start-1 overflow-hidden whitespace-nowrap"
              >
                <span
                  data-headline-line
                  className="block will-change-transform"
                >
                  {text}
                </span>
              </div>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
