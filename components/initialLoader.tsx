"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger);
CustomEase.create("curtain", "0.76, 0, 0.24, 1");

const COLUMNS = 5;

type Props = {
  onReveal?: () => void;
  onComplete?: () => void;
};

export default function initialLoader({ onReveal, onComplete }: Props) {
  const [year, setYear] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const digitsRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        onReveal?.();
        onComplete?.();
        setUnmounted(true);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const html = document.documentElement;
        const body = document.body;

        const lock = () => {
          html.style.overflow = "hidden";
          body.style.overflow = "hidden";
        };
        const unlock = () => {
          html.style.overflow = "";
          body.style.overflow = "";
        };
        gsap.set("body", { overflow: "hidden" });
        if ("scrollRestoration" in history)
          history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
        lock();
        const counter = { v: 0 };

        const paint = () => {
          if (digitsRef.current) {
            digitsRef.current.textContent = String(
              Math.round(counter.v),
            ).padStart(3, "0");
          }
          gsap.set(barRef.current, { scaleX: counter.v / 100 });
        };

        paint();

        const tl = gsap.timeline({
          onComplete: () => {
            unlock();
            ScrollTrigger.refresh();
            onComplete?.();
            setUnmounted(true);
          },
        });

        tl.from(".ldr-meta", {
          yPercent: 110,
          duration: 0.85,
          stagger: 0.05,
          ease: "power4.out",
        })
          .from(
            ".ldr-digits",
            { yPercent: 115, duration: 1, ease: "power4.out" },
            0.05,
          )
          .to(
            counter,
            { v: 92, duration: 2.2, ease: "power1.out", onUpdate: paint },
            0.2,
          )
          .addPause("+=0", () => {
            const go = () => gsap.delayedCall(0.12, () => tl.play());
            if (document.readyState === "complete") go();
            else window.addEventListener("load", go, { once: true });
          })
          .to(counter, {
            v: 100,
            duration: 0.55,
            ease: "power2.inOut",
            onUpdate: paint,
          })
          .addLabel("exit", "+=0.2")
          .to(
            ".ldr-content",
            { yPercent: -10, autoAlpha: 0, duration: 0.55, ease: "power2.in" },
            "exit",
          )
          .call(() => onReveal?.(), undefined, "exit+=0.22")
          .to(
            ".ldr-col",
            {
              yPercent: -101,
              duration: 1.2,
              ease: "curtain",
              stagger: { each: 0.07, from: "start" },
            },
            "exit+=0.18",
          );

        return () => {
          gsap.set("body", { overflow: "" });
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  if (unmounted) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] overflow-hidden"
      role="status"
      aria-label="Loading"
    >
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            className="ldr-col h-full flex-1 border-r border-black/15 bg-acid will-change-transform last:border-r-0"
          />
        ))}
      </div>

      <div className="ldr-content absolute inset-0 flex flex-col justify-between p-5 text-ink md:p-8">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] md:text-xs">
          <span className="overflow-hidden">
            <span className="ldr-meta block uppercase">
              [Dawood Ahmed / DEV]
            </span>
          </span>
          <span className="overflow-hidden">
            <span className="ldr-meta block">My Portfolio</span>
          </span>
        </div>

        <div className="overflow-hidden">
          <div className="ldr-digits flex items-end will-change-transform">
            <span
              ref={digitsRef}
              className="font-display text-[23vw] font-black leading-[0.76] tracking-[-0.06em] tabular-nums"
            >
              000
            </span>
            <span className="mb-[2.4vw] ml-[0.8vw] font-display text-[6vw] font-black leading-none">
              %
            </span>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="relative h-px overflow-hidden bg-black/20">
            <div
              ref={barRef}
              className="absolute inset-0 origin-left scale-x-0 bg-ink"
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] md:text-xs">
            <span className="overflow-hidden">
              <span className="ldr-meta block">Full Stack Developer</span>
            </span>
            <span className="overflow-hidden">
              <span className="ldr-meta block">Portfolio {year}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
