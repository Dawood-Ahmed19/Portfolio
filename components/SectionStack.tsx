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

const ORIGIN_X = 0.25;
const ORIGIN_Y = 0.3;
const GAP_RADIUS = 0.05;

const idOf = (p: HTMLElement) => p.querySelector<HTMLElement>("[id]")?.id;

const SectionStack = ({ children }: { children: React.ReactNode }) => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>(
        "[data-panel]",
        root.current,
      );
      if (!panels.length) return;

      const zooms = panels.map((p) =>
        p.querySelector<HTMLElement>("[data-zoom-target]"),
      );
      // a panel right after a zoom is opened by the zoom, not wiped in
      const afterZoom = panels.map((_, i) => i > 0 && !!zooms[i - 1]);

      panels.forEach((p, i) => {
        if (afterZoom[i]) {
          gsap.set(p, { zIndex: -1, clipPath: "circle(0% at 50% 50%)" });
        } else {
          gsap.set(p, { zIndex: i, clipPath: i === 0 ? SHOWN : HIDDEN });
        }
      });

      const swaps = panels.map((p) =>
        gsap.utils.toArray<HTMLElement>("[data-swap]", p),
      );
      swaps.forEach((s) => {
        if (!s.length) return;
        gsap.set(s, { clipPath: SWAP_HIDDEN });
        gsap.set(s[0], { clipPath: SHOWN });
      });

      const total = panels.reduce(
        (n, _, i) =>
          n +
          (i > 0 && !afterZoom[i] ? 1 : 0) +
          (zooms[i] ? 1 : 0) +
          Math.max(0, swaps[i].length - 1),
        0,
      );
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

      const stops: number[] = [0];
      let t = 0;

      panels.forEach((panel, p) => {
        // ---- wipe this panel in (skipped when a zoom opens it) ----
        if (p > 0 && !afterZoom[p]) {
          const id = idOf(panel);
          tl.call(
            () =>
              window.dispatchEvent(
                new CustomEvent("panel-enter", { detail: id }),
              ),
            undefined,
            t,
          );
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

        // ---- phrase swaps ----
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

        // ---- zoom into the middle of the W ----
        const wEl = zooms[p];
        if (wEl && items.length) {
          const last = items[items.length - 1];
          const text = last.firstElementChild as HTMLElement;
          const next = afterZoom[p + 1] ? panels[p + 1] : null;

          const ox = () => wEl.offsetLeft + wEl.offsetWidth * 0.5;
          const oy = () => wEl.offsetTop + wEl.offsetHeight * 0.55;

          const spot = () => {
            const w = wEl.getBoundingClientRect();
            const r = root.current!.getBoundingClientRect();
            return {
              x: ((w.left + w.width * 0.5 - r.left) / r.width) * 100,
              y: ((w.top + w.height * 0.55 - r.top) / r.height) * 100,
            };
          };

          tl.to(
            panel.querySelectorAll("[data-fade]"),
            { autoAlpha: 0, duration: 0.35 },
            t,
          );
          tl.set(panels.slice(0, p), { autoAlpha: 0 }, t);
          const ancestors: HTMLElement[] = [];
          for (
            let el: HTMLElement | null = last;
            el && el !== panel;
            el = el.parentElement
          ) {
            ancestors.push(el);
          }
          tl.set(ancestors, { overflow: "visible" }, t);
          tl.set(last, { clipPath: "none" }, t);
          tl.to(
            panel,
            { backgroundColor: "rgba(10,10,10,0)", duration: 0.3 },
            t,
          );

          tl.fromTo(
            text,
            { scale: 1 },
            {
              scale: () => {
                const fs = parseFloat(getComputedStyle(text).fontSize);
                return (
                  Math.hypot(window.innerWidth, window.innerHeight) /
                  (fs * 0.15)
                );
              },
              transformOrigin: () => `${ox()}px ${oy()}px`,
              force3D: false,
              duration: 1,
              ease: "power3.in",
            },
            t,
          );

          // the W disappears at the end of the dive
          tl.to(text, { autoAlpha: 0, duration: 0.3, ease: "none" }, t + 0.7);

          // Stack opens from the centre of the W
          if (next) {
            const id = idOf(next);
            tl.fromTo(
              next,
              { clipPath: () => `circle(0% at ${spot().x}% ${spot().y}%)` },
              {
                clipPath: () => `circle(150% at ${spot().x}% ${spot().y}%)`,
                duration: 0.8,
                ease: "power2.in",
              },
              t + 0.2,
            );
            tl.call(
              () =>
                window.dispatchEvent(
                  new CustomEvent("panel-enter", { detail: id }),
                ),
              undefined,
              t + 0.6,
            );
          }

          t += 1;
          if (next) stops[p + 1] = t;
        }
      });

      const st = tl.scrollTrigger!;
      const onGoto = (e: Event) => {
        const id = (e as CustomEvent<string>).detail;
        const index = panels.findIndex((p) => idOf(p) === id);
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
    <div
      ref={root}
      className="relative isolate h-screen w-full overflow-hidden"
    >
      {Children.map(children, (child) => (
        <div data-panel className="absolute inset-0 h-full w-full bg-[#0a0a0a]">
          <div className="h-full">{child}</div>
        </div>
      ))}
    </div>
  );
};

export default SectionStack;
