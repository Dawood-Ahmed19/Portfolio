"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ScrollProgress = () => {
  const wrapLime = useRef<HTMLDivElement>(null);
  const wrapInk = useRef<HTMLDivElement>(null);
  const fillLime = useRef<HTMLDivElement>(null);
  const fillInk = useRef<HTMLDivElement>(null);
  const active = useRef("hero");

  useEffect(() => {
    const onPanel = (e: Event) => {
      const d = (e as CustomEvent).detail;
      active.current = typeof d === "string" ? d : (d?.id ?? "");
    };
    window.addEventListener("panel-enter", onPanel);
    return () => window.removeEventListener("panel-enter", onPanel);
  }, []);

  useGSAP(() => {
    const fills = [fillLime.current, fillInk.current];
    gsap.set(fills, { scaleY: 0, transformOrigin: "top center" });

    const setLime = gsap.quickTo(fillLime.current, "scaleY", {
      duration: 0.3,
      ease: "power2.out",
    });
    const setInk = gsap.quickTo(fillInk.current, "scaleY", {
      duration: 0.3,
      ease: "power2.out",
    });

    ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      invalidateOnRefresh: true,
      refreshPriority: -1,
      onUpdate: (self) => {
        setLime(self.progress);
        setInk(self.progress);
      },
    });

    let work: HTMLElement | null = null;
    let last = -1;

    const tick = () => {
      if (!work) {
        work =
          document
            .querySelector<HTMLElement>("#work")
            ?.closest<HTMLElement>("[data-panel]") ?? null;
      }

      let y = 0;
      const id = active.current;

      if (work && (id === "stack" || id === "work")) {
        const height = work.getBoundingClientRect().height;
        const m = /inset\(\s*([\d.]+)(%|px)/.exec(
          getComputedStyle(work).clipPath,
        );
        if (m)
          y =
            m[2] === "%" ? (parseFloat(m[1]) / 100) * height : parseFloat(m[1]);
      }

      if (Math.abs(y - last) < 0.5) return;
      last = y;

      if (wrapInk.current)
        wrapInk.current.style.clipPath = `inset(0px 0px calc(100% - ${y}px) 0px)`;
      if (wrapLime.current)
        wrapLime.current.style.clipPath = `inset(${y}px 0px 0px 0px)`;
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-6 z-50 hidden h-screen w-[1px] md:left-10 md:block"
    >
      <div ref={wrapLime} className="absolute inset-0 bg-white/10">
        <div ref={fillLime} className="h-full w-full bg-[var(--color-lime)]" />
      </div>

      <div
        ref={wrapInk}
        className="absolute inset-0 bg-ink/20"
        style={{ clipPath: "inset(0px 0px 100% 0px)" }}
      >
        <div ref={fillInk} className="h-full w-full bg-ink" />
      </div>
    </div>
  );
};

export default ScrollProgress;
