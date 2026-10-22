"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useState, useEffect } from "react";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

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
        gsap.set("[data-contact-fade]", { autoAlpha: 0, y: 20 });
        gsap.set("[data-contact-word]", { yPercent: 110 });
        gsap.set("[data-contact-circle] path", { drawSVG: "0%" });
        gsap.set("[data-contact-underline] path", { drawSVG: "0%" });

        let played = false;
        const onEnter = contextSafe!((e: Event) => {
          if ((e as CustomEvent<string>).detail !== "contact" || played) return;
          played = true;

          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .to("[data-contact-label]", { autoAlpha: 1, y: 0, duration: 0.5 })
            .to(
              "[data-contact-word]",
              { yPercent: 0, duration: 1, stagger: 0.12, ease: "power4.out" },
              0.15,
            )
            .to(
              "[data-contact-circle] path",
              { drawSVG: "100%", duration: 1.4, ease: "power2.inOut" },
              0.7,
            )
            .to(
              "[data-contact-item]",
              { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 },
              1.0,
            )
            .to(
              "[data-contact-footer]",
              { autoAlpha: 1, y: 0, duration: 0.6 },
              1.4,
            );
        });

        window.addEventListener("panel-enter", onEnter);
        return () => window.removeEventListener("panel-enter", onEnter);
      });

      mm.add("(hover: hover) and (pointer: fine)", () => {
        const links = gsap.utils.toArray<HTMLElement>(
          "[data-contact-link]",
          root.current,
        );
        const cleanups = links.map((link) => {
          const path = link.querySelector("[data-contact-underline] path");
          if (!path) return () => {};
          const tl = gsap
            .timeline({
              paused: true,
              defaults: { duration: 0.35, ease: "power2.out" },
            })
            .to(path, { drawSVG: "100%" }, 0)
            .to(link, { color: "#C6FF3D" }, 0);
          const on = () => tl.play();
          const off = () => tl.reverse();
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
      });

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
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <section ref={root} id="contact" className="relative h-full">
      <div className="container mx-auto flex w-full flex-col justify-center gap-8 px-6 pt-24 pb-6 md:justify-start md:gap-12 md:px-0 md:pt-[20vh]">
        <p
          data-contact-label
          data-contact-fade
          className="font-mono text-[11px] tracking-[0.25em] text-mute uppercase md:text-xs"
        >
          04 / Contact
        </p>

        {/* headline with the drawn circle */}
        <div className="relative w-fit px-4 py-4 md:px-14 md:py-8">
          <h2 className="font-display text-[clamp(44px,9vw,128px)] leading-none font-extrabold tracking-tight text-paper uppercase">
            <span className="inline-block overflow-hidden pr-[0.15em] align-bottom">
              <span data-contact-word className="inline-block">
                Let’s
              </span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <span data-contact-word className="inline-block">
                build.
              </span>
            </span>
          </h2>

          <svg
            data-contact-circle
            aria-hidden
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <path
              d="M300 10 C 520 10 590 60 580 110 C 570 170 400 195 300 192 C 120 190 15 150 25 95 C 35 40 150 14 330 8"
              fill="none"
              stroke="var(--color-lime)"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* contact links */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 font-mono text-sm tracking-[0.06em] text-paper md:text-base">
          <a
            data-contact-item
            data-contact-fade
            data-contact-link
            href={`mailto:${EMAIL}`}
            className="relative inline-flex min-h-11 items-center no-underline"
          >
            {EMAIL}
            <Underline />
          </a>

          <button
            data-contact-item
            data-contact-fade
            type="button"
            onClick={copyEmail}
            className="inline-flex min-h-11 items-center border border-paper/30 px-4 text-xs tracking-[0.15em] uppercase transition-colors hover:border-lime hover:text-lime"
          >
            <span ref={copyLabel}>Copy email</span>
          </button>

          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              data-contact-item
              data-contact-fade
              data-contact-link
              href={href}
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex min-h-11 items-center no-underline"
            >
              {label} ↗<Underline />
            </a>
          ))}
        </div>
      </div>

      <footer
        data-contact-footer
        data-contact-fade
        className="absolute inset-x-0 bottom-6"
      >
        <div className="container mx-auto flex justify-between border-t border-white/10 px-6 pt-5 font-mono text-[11px] tracking-[0.1em] text-mute uppercase md:px-0 md:text-xs">
          <span>© {year} Dawood Ahmed</span>
          <span className="hidden sm:inline uppercase">Rawalpindi</span>
        </div>
      </footer>
    </section>
  );
};

const Underline = () => (
  <svg
    data-contact-underline
    aria-hidden
    viewBox="0 0 100 4"
    preserveAspectRatio="none"
    className="pointer-events-none absolute bottom-1 left-0 h-1 w-full overflow-visible"
  >
    <path
      d="M0 2 H100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default ContactSection;
