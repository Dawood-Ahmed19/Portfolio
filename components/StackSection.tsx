"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);

const SKILLS = [
  // frontend
  { name: "React", hot: true, left: 6, top: 30, rot: -6 },
  { name: "GSAP", hot: false, left: 24, top: 22, rot: 4 },
  { name: "Next.js", hot: false, left: 20, top: 50, rot: 5 },
  { name: "TypeScript", hot: false, left: 4, top: 66, rot: -3 },
  { name: "Node.js", hot: true, left: 42, top: 34, rot: 4 },
  { name: "GraphQL", hot: false, left: 50, top: 62, rot: -5 },
  { name: "PostgreSQL", hot: false, left: 62, top: 24, rot: -4 },
  { name: "Docker", hot: true, left: 66, top: 50, rot: 6 },
  { name: "AWS", hot: false, left: 58, top: 70, rot: -2 },
];

const GROUPS = [
  { label: "Frontend", left: 5 },
  { label: "Backend", left: 42 },
  { label: "Data & Infra", left: 60 },
];

const StackSection = () => {
  const root = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const pills = gsap.utils.toArray<HTMLElement>(
        "[data-pill]",
        root.current,
      );
      if (!box.current || !contextSafe) return;

      gsap.set(pills, {
        autoAlpha: 0,
        y: -160,
        rotation: (i) => SKILLS[i].rot,
      });
      gsap.set("[data-stack-fade]", { autoAlpha: 0 });
      gsap.set("[data-stack-word]", { autoAlpha: 0, yPercent: 20 });

      const drags = Draggable.create(pills, {
        type: "x,y",
        bounds: box.current,
        inertia: true,
        edgeResistance: 0.85,
        onPress() {
          gsap.to(this.target, {
            scale: 1.08,
            duration: 0.2,
            ease: "power2.out",
          });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.3, ease: "power2.out" });
        },
      });
      drags.forEach((d) => d.disable()); // no dragging until they've landed

      let played = false;
      const onEnter = contextSafe((e: Event) => {
        if ((e as CustomEvent<string>).detail !== "stack" || played) return;
        played = true;

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => drags.forEach((d) => d.enable()),
          })
          .to("[data-stack-fade]", {
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.1,
          })
          .to(
            "[data-stack-word]",
            { autoAlpha: 1, yPercent: 0, duration: 1 },
            0.1,
          )
          .to(
            pills,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: { each: 0.07, from: "random" },
              ease: "bounce.out",
            },
            0.3,
          );
      });

      window.addEventListener("panel-enter", onEnter);
      return () => window.removeEventListener("panel-enter", onEnter);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stack" className="h-full bg-lime">
      <div className="container relative mx-auto flex w-full flex-col justify-center pt-24 pb-6 md:justify-start md:py-0 md:pt-[22vh]">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-16">
          <p
            data-stack-fade
            className="font-mono text-[11px] tracking-[0.25em] whitespace-nowrap text-[#0a0a0a]/70 uppercase md:w-40 md:text-xs"
          >
            02 / Stack
          </p>

          <div className="min-w-0 flex-1">
            <p
              data-stack-fade
              className="mb-4 font-mono text-[11px] tracking-[0.25em] text-[#0a0a0a]/70 uppercase md:text-xs"
            >
              ↳ Drag the tags
            </p>

            <div
              ref={box}
              className="relative h-[min(50vh,420px)] overflow-hidden border border-[#0a0a0a]/15"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(10,10,10,0.18) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {/* corner brackets */}
              <span
                aria-hidden
                className="pointer-events-none absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-[#0a0a0a]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-[#0a0a0a]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-[#0a0a0a]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute right-2 bottom-2 h-4 w-4 border-r-2 border-b-2 border-[#0a0a0a]"
              />

              {/* giant outlined word behind the tags */}
              <span
                data-stack-word
                aria-hidden
                className="pointer-events-none absolute right-4 bottom-[-0.12em] z-0 font-display text-[clamp(88px,17vw,230px)] leading-none font-extrabold tracking-tight text-transparent uppercase select-none [-webkit-text-stroke:2px_rgba(10,10,10,0.2)]"
              >
                Stack
              </span>

              {/* category labels (desktop only) */}
              {GROUPS.map(({ label, left }) => (
                <span
                  key={label}
                  data-stack-fade
                  className="pointer-events-none absolute top-4 z-10 hidden font-mono text-[11px] tracking-[0.2em] text-[#0a0a0a]/70 uppercase md:block"
                  style={{ left: `${left}%` }}
                >
                  {label}
                </span>
              ))}

              {/* tags */}
              {SKILLS.map(({ name, hot, left, top }) => (
                <span
                  key={name}
                  data-pill
                  style={{ left: `${left}%`, top: `${top}%` }}
                  className={`absolute z-10 cursor-grab touch-none rounded-full border border-[#0a0a0a] font-mono font-semibold select-none active:cursor-grabbing ${
                    hot
                      ? "bg-[#0a0a0a] px-5 py-2.5 text-sm text-[var(--color-lime)] md:px-8 md:py-4 md:text-base"
                      : "px-4 py-2 text-xs text-[#0a0a0a] md:px-6 md:py-3 md:text-sm"
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StackSection;
