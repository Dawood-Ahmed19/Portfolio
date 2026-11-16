"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { PROFILE } from "@/lib/content";

const COLUMNS = 4;

type Props = {
  /** Fires while the curtain is opening, so the hero can start underneath it. */
  onReveal?: () => void;
};

export default function Preloader({ onReveal }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion: skip the whole sequence.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        onReveal?.();
        setDone(true);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const html = document.documentElement;
        let dead = false;

        html.style.overflow = "hidden";
        if ("scrollRestoration" in history) history.scrollRestoration = "manual";
        window.scrollTo(0, 0);

        const counter = { v: 0 };
        const paint = () => {
          if (digits.current) {
            digits.current.textContent = String(Math.round(counter.v)).padStart(
              3,
              "0",
            );
          }
          if (bar.current) gsap.set(bar.current, { scaleX: counter.v / 100 });
        };
        paint();

        const loaded = new Promise<void>((resolve) => {
          if (document.readyState === "complete") resolve();
          else window.addEventListener("load", () => resolve(), { once: true });
        });

        const finish = () => {
          html.style.overflow = "";
          ScrollTrigger.refresh();
          setDone(true);
        };

        const outro = () => {
          if (dead) return;
          gsap
            .timeline({ onComplete: finish })
            .to(counter, {
              v: 100,
              duration: 0.5,
              ease: "power2.inOut",
              onUpdate: paint,
            })
            .to(
              ".ldr-content",
              { yPercent: -8, autoAlpha: 0, duration: 0.6, ease: "power2.in" },
              "+=0.15",
            )
            .call(() => onReveal?.(), undefined, "<0.25")
            .to(
              ".ldr-col",
              {
                yPercent: -101,
                duration: 1.3,
                ease: "expo.inOut",
                stagger: { each: 0.08, from: "start" },
              },
              "<0.05",
            );
        };

        gsap
          .timeline({
            onComplete: () => {
              loaded.then(() => {
                if (!dead) gsap.delayedCall(0.1, outro);
              });
            },
          })
          .from(".ldr-meta", {
            yPercent: 110,
            duration: 0.9,
            stagger: 0.06,
            ease: "expo.out",
          })
          .from(".ldr-digits", { yPercent: 115, duration: 1.1, ease: "expo.out" }, 0.05)
          .to(
            counter,
            { v: 92, duration: 2, ease: "power1.out", onUpdate: paint },
            0.2,
          );

        return () => {
          dead = true;
          html.style.overflow = "";
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="ldr fixed inset-0 z-[100] overflow-hidden"
      role="status"
      aria-label="Loading"
    >
      {/* Without JS the loader would never leave. */}
      <noscript>
        <style>{`.ldr{display:none}`}</style>
      </noscript>

      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            className="ldr-col h-full flex-1 border-r border-line bg-surface will-change-transform last:border-r-0"
          />
        ))}
      </div>

      <div className="ldr-content absolute inset-0 flex flex-col justify-between p-5 md:p-8">
        <div className="label flex justify-between">
          <span className="overflow-hidden">
            <span className="ldr-meta block">{PROFILE.name}</span>
          </span>
          <span className="overflow-hidden">
            <span className="ldr-meta block">Portfolio {year}</span>
          </span>
        </div>

        <div className="overflow-hidden">
          <div className="ldr-digits flex items-end will-change-transform">
            <span
              ref={digits}
              className="text-[26vw] leading-[0.78] font-medium tracking-[-0.06em] tabular-nums"
            >
              000
            </span>
            <span className="mb-[2.2vw] ml-[1vw] text-[5vw] leading-none font-medium text-accent">
              %
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative h-px overflow-hidden bg-line">
            <div
              ref={bar}
              className="absolute inset-0 bg-fg"
              style={{ transform: "scaleX(0)", transformOrigin: "left" }}
            />
          </div>
          <div className="label flex justify-between">
            <span className="overflow-hidden">
              <span className="ldr-meta block">{PROFILE.role}</span>
            </span>
            <span className="overflow-hidden">
              <span className="ldr-meta block">{PROFILE.location}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
