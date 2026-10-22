"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

const LIME = "#C6FF3D";

type Project = {
  title: string;
  stack: string;
  href: string;
  image?: string;
};

const PROJECTS: Project[] = [
  { title: "Business Dashbords", stack: "Next.js · Node · MongoDB", href: "#" },
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
      const thumbs = gsap.utils.toArray<HTMLElement>(
        "[data-thumb]",
        root.current,
      );

      // ---- hidden start state ----
      gsap.set("[data-work-fade]", { autoAlpha: 0 });
      gsap.set(rows, { autoAlpha: 0, y: 30 });
      gsap.set("[data-row-line] path", { drawSVG: "0%" });
      gsap.set("[data-row-arrow] path", { drawSVG: "0%" });
      gsap.set(preview.current, {
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 0,
        scale: 0,
      });

      // ---- entrance, once, when this panel becomes active ----
      let played = false;
      const onEnter = contextSafe((e: Event) => {
        if ((e as CustomEvent<string>).detail !== "work" || played) return;
        played = true;

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to("[data-work-fade]", {
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.1,
          })
          .to(rows, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.2)
          .to(
            "[data-row-line] path",
            {
              drawSVG: "100%",
              duration: 1,
              stagger: 0.12,
              ease: "power2.inOut",
            },
            0.3,
          );
      });
      window.addEventListener("panel-enter", onEnter);

      // ---- hover effects (mouse devices only) ----
      const mm = gsap.matchMedia();

      mm.add("(hover: hover) and (pointer: fine)", () => {
        const box = list.current!;
        const pv = preview.current!;

        const qx = gsap.quickTo(pv, "x", { duration: 0.5, ease: "power3" });
        const qy = gsap.quickTo(pv, "y", { duration: 0.5, ease: "power3" });
        const qr = gsap.quickTo(pv, "rotation", {
          duration: 0.4,
          ease: "power3",
        });

        let shown = false;
        let settle: gsap.core.Tween | null = null;

        // one paused timeline per row: title shifts, arrow draws
        const tls = rows.map((row) =>
          gsap
            .timeline({
              paused: true,
              defaults: { duration: 0.35, ease: "power3.out" },
            })
            .to(
              row.querySelector("[data-row-title]"),
              { x: 16, color: LIME },
              0,
            )
            .to(
              row.querySelector("[data-row-arrow] path"),
              { drawSVG: "100%" },
              0,
            ),
        );

        const onMove = (e: MouseEvent) => {
          const r = box.getBoundingClientRect();
          qx(e.clientX - r.left);
          qy(e.clientY - r.top);
          qr(gsap.utils.clamp(-12, 12, e.movementX * 0.5));
          settle?.kill();
          settle = gsap.delayedCall(0.08, () => qr(0));
        };

        const hide = () => {
          shown = false;
          gsap.to(pv, {
            autoAlpha: 0,
            scale: 0,
            duration: 0.25,
            ease: "power2.in",
          });
        };

        const enters = rows.map((row, i) => {
          const fn = (e: MouseEvent) => {
            const r = box.getBoundingClientRect();
            if (!shown) {
              // appear exactly at the cursor, then follow with a slight lag
              gsap.set(pv, { x: e.clientX - r.left, y: e.clientY - r.top });
              gsap.to(pv, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.35,
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
          };
          row.addEventListener("mouseenter", fn);
          return fn;
        });

        const leaves = rows.map((row, i) => {
          const fn = () => tls[i].reverse();
          row.addEventListener("mouseleave", fn);
          return fn;
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

      // touch devices: no hover, so show the arrows from the start
      mm.add("(hover: none)", () => {
        gsap.set("[data-row-arrow] path", { drawSVG: "100%" });
      });

      return () => {
        window.removeEventListener("panel-enter", onEnter);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="relative h-full py-20 md:py-32">
      <div className="container relative mx-auto flex w-full flex-col justify-center px-6 pt-24 pb-6 md:justify-start md:px-0 md:pt-[22vh]">
        <p
          data-work-fade
          className="mb-6 font-mono text-[11px] tracking-[0.25em] text-mute uppercase md:mb-10 md:text-xs"
        >
          03 / Selected Work
        </p>

        <div ref={list} className="relative md:cursor-none">
          {PROJECTS.map(({ title, stack, href }, i) => (
            <a
              key={title}
              data-row
              href={href}
              className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 text-paper no-underline md:grid-cols-[160px_1fr_auto] md:gap-12 md:py-6 md:cursor-none"
            >
              <span
                aria-hidden
                className="font-display text-5xl leading-none font-extrabold text-transparent [-webkit-text-stroke:1.5px_var(--color-lime)] md:text-[72px]"
              >
                0{i + 1}
              </span>

              <span className="flex min-w-0 flex-col gap-2">
                <span
                  data-row-title
                  className="font-display text-xl font-medium tracking-tight uppercase md:text-4xl"
                >
                  {title}
                </span>
                <span className="font-mono text-[11px] tracking-[0.1em] text-mute uppercase md:text-xs">
                  {stack}
                </span>
              </span>

              <svg
                data-row-arrow
                aria-hidden
                width="64"
                height="24"
                viewBox="0 0 64 24"
                className="hidden sm:block"
              >
                <path
                  d="M2 12 H60 M48 2 L60 12 L48 22"
                  fill="none"
                  stroke={LIME}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <svg
                data-row-line
                aria-hidden
                viewBox="0 0 100 2"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-0 h-[2px] w-full"
              >
                <path
                  d="M0 1 H100"
                  fill="none"
                  className="stroke-white/20"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </a>
          ))}

          {/* floating thumbnail that replaces the cursor */}
          <div
            ref={preview}
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-20 hidden h-[200px] w-[320px] overflow-hidden border-[1.5px] border-lime bg-[#14161A] md:block"
          >
            {PROJECTS.map(({ title, image }, i) => (
              <div key={title} data-thumb className="absolute inset-0">
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-[110px] font-extrabold text-transparent [-webkit-text-stroke:2px_var(--color-lime)]">
                    0{i + 1}
                  </div>
                )}
              </div>
            ))}
            <span className="absolute right-2 bottom-2 bg-lime px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-ink uppercase">
              View
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
