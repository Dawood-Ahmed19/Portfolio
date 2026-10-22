"use client";

import { Children, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const HIDDEN = "inset(100% 0% 0% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

const SWAP_HIDDEN = "inset(0% 100% 0% 0%)";
const SWAP_EXIT = "inset(0% 0% 0% 100%)";

const SectionStack = ({ children }: { children: React.ReactNode }) => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>(
        "[data-panel]",
        root.current,
      );
      if (!panels.length) return;

      gsap.set(panels, { zIndex: (i) => i });
      gsap.set(panels.slice(1), { clipPath: HIDDEN });

      const swaps = panels.map((p) =>
        gsap.utils.toArray<HTMLElement>("[data-swap]", p),
      );

      swaps.forEach((s) => {
        if (!s.length) return;
        gsap.set(s, { clipPath: SWAP_HIDDEN });
        gsap.set(s[0], { clipPath: SHOWN });
      });

      const total =
        panels.length -
        1 +
        swaps.reduce((n, s) => n + Math.max(0, s.length - 1), 0);
      if (total === 0) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${total * window.innerHeight * 0.8}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / total,
            directional: true,
            duration: { min: 0.25, max: 0.7 },
            delay: 0,
            ease: "power2.inOut",
          },
        },
      });

      const stops: number[] = [0]; // timeline time where each panel is fully shown
      let t = 0;

      panels.forEach((panel, p) => {
        if (p > 0) {
          tl.to(
            panel,
            { clipPath: SHOWN, duration: 1, ease: "power2.inOut" },
            t,
          );
          tl.to(
            panels[p - 1],
            { yPercent: -12, duration: 1, ease: "power2.inOut" },
            t,
          );
          t += 1;
          stops[p] = t;
        }

        const items = swaps[p];
        for (let k = 1; k < items.length; k++) {
          tl.to(
            items[k - 1],
            { clipPath: SWAP_EXIT, duration: 1, ease: "power2.inOut" },
            t,
          );
          tl.fromTo(
            items[k],
            { clipPath: SWAP_HIDDEN },
            { clipPath: SHOWN, duration: 1, ease: "power2.inOut" },
            t,
          );
          t += 1;
        }
      });

      // nav: scroll to a section by its id
      const st = tl.scrollTrigger!;

      const onGoto = (e: Event) => {
        const id = (e as CustomEvent<string>).detail;
        const index = panels.findIndex((p) => p.firstElementChild?.id === id);
        if (index === -1) return;

        const y = st.start + (stops[index] / total) * (st.end - st.start);

        gsap.to(window, {
          scrollTo: { y, autoKill: false },
          duration: 1.4,
          ease: "power3.inOut",
          overwrite: true,
        });
      };

      window.addEventListener("goto-section", onGoto);
      return () => window.removeEventListener("goto-section", onGoto);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-screen w-full overflow-hidden">
      {Children.map(children, (child) => (
        <div data-panel className="absolute inset-0 h-full w-full bg-[#0a0a0a]">
          {child}
        </div>
      ))}
    </div>
  );
};

export default SectionStack;
