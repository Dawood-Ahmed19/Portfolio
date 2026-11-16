"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Small follower dot for mouse devices. It grows over anything marked
 * with `data-cursor="hover"` and shows a label for `data-cursor-label`.
 */
const Cursor = () => {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = dot.current;
          const text = label.current;
          if (!el || !text) return;

          gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
          const qx = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
          const qy = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

          let visible = false;

          const onMove = (e: PointerEvent) => {
            qx(e.clientX);
            qy(e.clientY);
            if (!visible) {
              visible = true;
              gsap.set(el, { x: e.clientX, y: e.clientY });
              gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" });
            }
          };

          const onOver = (e: PointerEvent) => {
            const t = (e.target as HTMLElement | null)?.closest<HTMLElement>(
              "[data-cursor]",
            );
            if (t) {
              const lbl = t.dataset.cursorLabel ?? "";
              text.textContent = lbl;
              gsap.to(el, {
                scale: lbl ? 4.2 : 2.6,
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto",
              });
            } else {
              text.textContent = "";
              gsap.to(el, {
                scale: 1,
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          };

          const onLeaveDoc = () => {
            visible = false;
            gsap.to(el, { autoAlpha: 0, scale: 0, duration: 0.25 });
          };

          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerover", onOver);
          document.documentElement.addEventListener("pointerleave", onLeaveDoc);

          return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerover", onOver);
            document.documentElement.removeEventListener(
              "pointerleave",
              onLeaveDoc,
            );
          };
        },
      );

      return () => mm.revert();
    },
    { scope: dot },
  );

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="cursor-dot bg-signal pointer-events-none fixed top-0 left-0 z-[80] flex h-5 w-5 items-center justify-center rounded-full opacity-0 mix-blend-normal"
    >
      <span
        ref={label}
        className="font-mono text-[3px] font-medium tracking-wider text-paper uppercase"
      />
    </div>
  );
};

export default Cursor;
