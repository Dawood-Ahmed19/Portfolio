"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

const EMAIL = "gfxwork66@gmail.com";

const LINKS = [
  { label: "GitHub", href: "https://github.com/Dawood-Ahmed19" },
  { label: "LinkedIn", href: "https://linkedin.com/in/dawood-ahmed-911742275" },
];

const ContactSection = () => {
  const root = useRef<HTMLElement>(null);
  const copyLabel = useRef<HTMLSpanElement>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useGSAP(
    (_ctx, contextSafe) => {
      if (!root.current || !contextSafe) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rootEl = root.current;
        if (!rootEl) return;
        gsap.fromTo(
          rootEl,
          { borderTopLeftRadius: 72, borderTopRightRadius: 72 },
          {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            ease: "none",
            scrollTrigger: {
              trigger: rootEl,
              start: "top bottom",
              end: "top 25%",
              scrub: true,
            },
          },
        );

        const words = gsap.utils.toArray<HTMLElement>("[data-word]", rootEl);
        const circle = rootEl.querySelector<SVGPathElement>("[data-circle] path");
        const fades = gsap.utils.toArray<HTMLElement>("[data-contact-fade]", rootEl);

        gsap.set(words, { yPercent: 115 });
        gsap.set(fades, { autoAlpha: 0, y: 20 });
        if (circle) gsap.set(circle, { drawSVG: "0%" });

        ScrollTrigger.create({
          trigger: rootEl,
          start: "top 55%",
          once: true,
          onEnter: contextSafe(() => {
            const tl = gsap
              .timeline({ defaults: { ease: "power3.out" } })
              .to(words, { yPercent: 0, duration: 1.3, stagger: 0.12, ease: "power4.out" });
            if (circle) {
              tl.to(circle, { drawSVG: "100%", duration: 1.6, ease: "power2.inOut" }, 0.6);
            }
            tl.to(fades, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.8);
          }),
        });
      });

      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const links = gsap.utils.toArray<HTMLElement>("[data-link]", root.current);
          const cleanups = links.map((link) => {
            const bar = link.querySelector("[data-bar]");
            if (!bar) return () => {};
            gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
            const tl = gsap
              .timeline({
                paused: true,
                defaults: { duration: 0.45, ease: "power3.out" },
              })
              .to(bar, { scaleX: 1 }, 0)
              .to(link, { color: "#ff4a1c" }, 0);
            const on = contextSafe(() => tl.play());
            const off = contextSafe(() => tl.reverse());
            link.addEventListener("mouseenter", on);
            link.addEventListener("mouseleave", off);
            link.addEventListener("focus", on);
            link.addEventListener("blur", off);
            return () => {
              link.removeEventListener("mouseenter", on);
              link.removeEventListener("mouseleave", off);
              link.removeEventListener("focus", on);
              link.removeEventListener("blur", off);
            };
          });
          return () => cleanups.forEach((c) => c());
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      const el = copyLabel.current;
      if (!el) return;
      el.textContent = "Copied ✓";
      gsap.delayedCall(1.6, () => {
        el.textContent = "Copy email";
      });
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  };

  return (
    <section
      ref={root}
      id="contact"
      className="bg-ink text-paper relative overflow-hidden pt-28 md:pt-44"
    >
      <div className="wrap">
        <p className="eyebrow mb-10 opacity-60 md:mb-16">04 / Contact</p>

        <div className="relative w-fit px-2 py-6 md:px-16 md:py-12">
          <h2 className="display text-[clamp(52px,12vw,220px)]">
            <span className="mask pr-[0.15em]">
              <span data-word className="inline-block">
                Let’s
              </span>
            </span>
            <span className="mask">
              <span
                data-word
                className="serif-i text-signal inline-block text-[1.1em]"
              >
                build.
              </span>
            </span>
          </h2>

          <svg
            data-circle
            aria-hidden
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <path
              d="M300 10 C 520 10 590 60 580 110 C 570 170 400 195 300 192 C 120 190 15 150 25 95 C 35 40 150 14 330 8"
              fill="none"
              stroke="#ff4a1c"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 md:mt-20">
          <a
            data-contact-fade
            data-link
            data-cursor="hover"
            href={`mailto:${EMAIL}`}
            className="display relative inline-flex min-h-11 items-center text-[clamp(22px,4vw,60px)] normal-case no-underline"
          >
            {EMAIL}
            <Bar />
          </a>

          <button
            data-contact-fade
            data-cursor="hover"
            type="button"
            onClick={copyEmail}
            className="eyebrow border-paper/30 hover:border-signal hover:text-signal inline-flex min-h-11 cursor-pointer items-center rounded-full border px-5 transition-colors"
          >
            <span ref={copyLabel}>Copy email</span>
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              data-contact-fade
              data-link
              data-cursor="hover"
              href={href}
              target="_blank"
              rel="noreferrer"
              className="eyebrow relative inline-flex min-h-11 items-center no-underline"
            >
              {label} ↗<Bar />
            </a>
          ))}
        </div>
      </div>

      <footer data-contact-fade className="mt-28 pb-8 md:mt-44">
        <div className="wrap eyebrow border-paper/15 flex justify-between border-t pt-6 text-[0.65rem] opacity-70">
          <span>© {year ?? ""} Dawood Ahmed</span>
          <span>Rawalpindi / Islamabad</span>
        </div>
      </footer>
    </section>
  );
};

const Bar = () => (
  <span
    data-bar
    aria-hidden
    className="pointer-events-none absolute bottom-1 left-0 block h-px w-full bg-current"
  />
);

export default ContactSection;
