"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);

const SKILLS = [
  { name: "React", hot: true },
  { name: "Next.js", hot: false },
  { name: "Type ipt", hot: false },
  { name: "Node.js", hot: true },
  { name: "PostgreSQL", hot: false },
  { name: "GraphQL", hot: false },
  { name: "Docker", hot: true },
  { name: "AWS", hot: false },
  { name: "GSAP", hot: false },
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

      Draggable.create(pills, {
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

      gsap.set(pills, { autoAlpha: 0, scale: 0.6 });
      gsap.set("[data-stack-fade]", { autoAlpha: 0 });

      let played = false;
      const onEnter = contextSafe((e: Event) => {
        if ((e as CustomEvent<string>).detail !== "stack" || played) return;
        played = true;
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to("[data-stack-fade]", {
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.1,
          })
          .to(
            pills,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.6,
              stagger: { each: 0.06, from: "random" },
              ease: "back.out(1.7)",
            },
            0.2,
          );
      });

      window.addEventListener("panel-enter", onEnter);
      return () => window.removeEventListener("panel-enter", onEnter);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stack" className="bg-lime h-full">
      <div className="container mx-auto relative flex w-full flex-col justify-center pt-24 pb-6 md:justify-start md:py-0 md:pt-[22vh]">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-16">
          <p
            data-stack-fade
            className="font-mono text-[10px] tracking-[0.25em] whitespace-nowrap text-[#0a0a0a]/60 uppercase md:w-40 md:text-[11px]"
          >
            02 / Stack
          </p>

          <div className="min-w-0 flex-1">
            <p
              data-stack-fade
              className="mb-4 font-mono text-[10px] tracking-[0.25em] text-[#0a0a0a]/60 uppercase md:text-[11px]"
            >
              ↳ Drag the tags
            </p>

            <div
              ref={box}
              className="flex h-[min(50vh,420px)] flex-wrap content-start gap-3 border border-dashed border-[#0a0a0a]/30 p-5 md:gap-4 md:p-8"
            >
              {SKILLS.map(({ name, hot }) => (
                <span
                  key={name}
                  data-pill
                  className={`cursor-grab touch-none rounded-full border px-4 py-2 font-mono text-xs font-semibold select-none active:cursor-grabbing md:px-6 md:py-3 md:text-sm ${
                    hot
                      ? "border-[#0a0a0a] bg-[#0a0a0a] text-[var(--color-lime)]"
                      : "border-[#0a0a0a] text-[#0a0a0a]"
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
