"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Project = {
  title: string;
  stack: string;
  href: string;
  image?: string;
};

// Real projects from the original portfolio, unchanged.
const PROJECTS: Project[] = [
  { title: "Business Dashboard", stack: "Next.js · Node · MongoDB", href: "#" },
  { title: "Streaming App", stack: "React · PostgreSQL · NEONDB", href: "#" },
];

const ProjectsSection = () => {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      if (!root.current || !list.current || !preview.current || !contextSafe)
        return;

      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root.current);
      const thumbs = gsap.utils.toArray<HTMLElement>("[data-thumb]", root.current);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rootEl = root.current;
        if (!rootEl) return;
        const heads = gsap.utils.toArray<HTMLElement>("[data-head-line]", rootEl);
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

        rows.forEach((row) => {
          const line = row.querySelector<HTMLElement>("[data-row-line]");
          gsap.set(row, { autoAlpha: 0, y: 50 });
          gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
          ScrollTrigger.create({
            trigger: row,
            start: "top 88%",
            once: true,
            onEnter: contextSafe(() => {
              gsap
                .timeline({ defaults: { ease: "power3.out" } })
                .to(row, { autoAlpha: 1, y: 0, duration: 1 })
                .to(line, { scaleX: 1, duration: 1.2, ease: "expo.out" }, 0);
            }),
          });
        });
      });

      // hover preview that follows the cursor (mouse devices only)
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const box = list.current!;
        const pv = preview.current!;

        gsap.set(pv, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0 });

        const qx = gsap.quickTo(pv, "x", { duration: 0.5, ease: "power3" });
        const qy = gsap.quickTo(pv, "y", { duration: 0.5, ease: "power3" });
        const qr = gsap.quickTo(pv, "rotation", { duration: 0.4, ease: "power3" });

        let shown = false;
        let settle: gsap.core.Tween | null = null;

        const tls = rows.map((row) =>
          gsap
            .timeline({
              paused: true,
              defaults: { duration: 0.45, ease: "power3.out" },
            })
            .to(row.querySelector("[data-row-title]"), { x: 24 }, 0)
            .to(row.querySelector("[data-row-num]"), { color: "#ff4a1c" }, 0)
            .to(row.querySelector("[data-row-arrow]"), { x: 0, autoAlpha: 1 }, 0),
        );

        const onMove = (e: MouseEvent) => {
          const r = box.getBoundingClientRect();
          qx(e.clientX - r.left);
          qy(e.clientY - r.top);
          qr(gsap.utils.clamp(-10, 10, e.movementX * 0.5));
          settle?.kill();
          settle = gsap.delayedCall(0.08, () => qr(0));
        };

        const hide = () => {
          shown = false;
          gsap.to(pv, { autoAlpha: 0, scale: 0, duration: 0.25, ease: "power2.in" });
        };

        const enters = rows.map((_row, i) => (e: MouseEvent) => {
          const r = box.getBoundingClientRect();
          if (!shown) {
            gsap.set(pv, { x: e.clientX - r.left, y: e.clientY - r.top });
            gsap.to(pv, {
              autoAlpha: 1,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.6)",
            });
            shown = true;
          }
          thumbs.forEach((t, k) =>
            gsap.to(t, {
              autoAlpha: k === i ? 1 : 0,
              scale: k === i ? 1 : 1.15,
              duration: 0.4,
              overwrite: true,
            }),
          );
          tls[i].play();
        });
        const leaves = rows.map((_row, i) => () => tls[i].reverse());

        rows.forEach((row, i) => {
          row.addEventListener("mouseenter", enters[i]);
          row.addEventListener("mouseleave", leaves[i]);
        });
        box.addEventListener("mousemove", onMove);
        box.addEventListener("mouseleave", hide);

        return () => {
          box.removeEventListener("mousemove", onMove);
          box.removeEventListener("mouseleave", hide);
          rows.forEach((row, i) => {
            row.removeEventListener("mouseenter", enters[i]);
            row.removeEventListener("mouseleave", leaves[i]);
          });
          settle?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="relative py-28 md:py-44">
      <div className="wrap">
        <p className="eyebrow text-mute mb-10 md:mb-16">03 / Selected Work</p>

        <h2 className="display mb-14 text-[clamp(44px,10vw,180px)] md:mb-24">
          <span className="mask block">
            <span data-head-line className="block whitespace-nowrap">
              Selected
            </span>
          </span>
          <span className="mask block">
            <span
              data-head-line
              className="serif-i text-signal block whitespace-nowrap text-[1.1em]"
            >
              work.
            </span>
          </span>
        </h2>

        <div ref={list} className="relative">
          {PROJECTS.map(({ title, stack, href }, i) => (
            <a
              key={title}
              data-row
              href={href}
              data-cursor="hover"
              className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 py-7 no-underline md:grid-cols-[180px_1fr_auto] md:gap-12 md:py-10"
            >
              <span
                data-row-num
                aria-hidden
                className="display text-5xl md:text-[88px]"
              >
                0{i + 1}
              </span>

              <span className="flex min-w-0 flex-col gap-2">
                <span
                  data-row-title
                  className="display text-[clamp(26px,5vw,76px)]"
                >
                  {title}
                </span>
                <span className="eyebrow text-mute">{stack}</span>
              </span>

              <span
                data-row-arrow
                aria-hidden
                className="display text-signal hidden translate-x-[-12px] text-5xl opacity-30 sm:block"
              >
                →
              </span>

              <span
                data-row-line
                aria-hidden
                className="bg-ink absolute bottom-0 left-0 block h-px w-full"
              />
            </a>
          ))}

          <div
            ref={preview}
            aria-hidden
            className="bg-ink border-paper pointer-events-none absolute top-0 left-0 z-20 hidden h-[220px] w-[340px] overflow-hidden rounded-2xl border-2 opacity-0 md:block"
          >
            {PROJECTS.map(({ title, image }, i) => (
              <div key={title} data-thumb className="absolute inset-0">
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                ) : (
                  <div className="display text-signal flex h-full w-full items-center justify-center text-[120px]">
                    0{i + 1}
                  </div>
                )}
              </div>
            ))}
            <span className="eyebrow bg-signal text-paper absolute right-3 bottom-3 rounded-full px-3 py-1.5 text-[0.6rem]">
              View
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
