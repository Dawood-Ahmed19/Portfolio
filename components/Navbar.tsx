"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { scrollToId } from "./scrollTo";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Stack", id: "stack" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

const Navbar = () => {
  const container = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const scramble = useRef(new WeakMap<HTMLElement, gsap.core.Tween>());
  const [open, setOpen] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-nav-item]", {
          yPercent: -120,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.06,
          delay: 0.2,
          ease: "power4.out",
        });
      });

      // Mobile menu: curtain wipe + staggered links. Duration shrinks for reduced motion.
      gsap.set("[data-menu]", {
        autoAlpha: 0,
        clipPath: "inset(0% 0% 100% 0%)",
      });
      gsap.set("[data-menu-link]", { yPercent: 110 });

      menuTl.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power3.inOut" },
          onReverseComplete: () => {
            gsap.set("[data-menu]", { autoAlpha: 0 });
          },
        })
        .set("[data-menu]", { autoAlpha: 1 })
        .to("[data-menu]", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7 })
        .to(
          "[data-menu-link]",
          { yPercent: 0, duration: 0.7, stagger: 0.07, ease: "power4.out" },
          0.25,
        )
        .to("[data-bar-top]", { y: 4, rotate: 45, duration: 0.4 }, 0)
        .to("[data-bar-bottom]", { y: -4, rotate: -45, duration: 0.4 }, 0);

      return () => mm.revert();
    },
    { scope: container },
  );

  const setMenu = contextSafe((next: boolean) => {
    setOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
    if (next) window.lenis?.stop();
    else window.lenis?.start();
    if (next) menuTl.current?.timeScale(1).play();
    else menuTl.current?.timeScale(1.4).reverse();
  });

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (open) setMenu(false);
    // let the menu start closing before the scroll begins
    window.setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  const scrambleText = contextSafe(
    (element: HTMLElement, text: string) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      scramble.current.get(element)?.kill();
      const obj = { progress: 0 };
      const tween = gsap.to(obj, {
        progress: 1,
        duration: 0.5,
        ease: "none",
        onUpdate: () => {
          const revealed = Math.floor(obj.progress * text.length);
          element.textContent = text
            .split("")
            .map((char, i) =>
              i < revealed || char === " "
                ? char
                : CHARS[Math.floor(Math.random() * CHARS.length)],
            )
            .join("");
        },
        onComplete: () => {
          element.textContent = text;
        },
      });
      scramble.current.set(element, tween);
    },
  );

  return (
    <div ref={container}>
      <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <nav
        aria-label="Primary"
        className="wrap flex items-center justify-between py-5 md:py-7"
      >
        <a
          href="#top"
          data-cursor="hover"
          onClick={(e) => {
            e.preventDefault();
            if (open) setMenu(false);
            if (window.lenis) window.lenis.scrollTo(0, { duration: 1.4 });
            else window.scrollTo(0, 0);
          }}
          className="overflow-hidden"
        >
          <span data-nav-item className="eyebrow block">
            Dawood Ahmed<span className="opacity-60"> / Dev</span>
          </span>
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map(({ label, id }, i) => (
            <li key={id} className="overflow-hidden">
              <a
                data-nav-item
                data-cursor="hover"
                href={`#${id}`}
                onClick={(e) => handleNav(e, id)}
                onMouseEnter={(e) => scrambleText(e.currentTarget, label)}
                className="eyebrow block no-underline"
              >
                {label}
              </a>
              <span className="sr-only">{i + 1}</span>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-hidden md:block">
          <span data-nav-item className="eyebrow flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Available for work
          </span>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setMenu(!open)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          <span data-bar-top className="block h-[2px] w-6 bg-white" />
          <span data-bar-bottom className="block h-[2px] w-6 bg-white" />
        </button>
      </nav>
      </header>

      {/* Mobile menu sits under the blended header so its text stays legible */}
      <div
        data-menu
        className="bg-ink text-paper fixed inset-0 z-40 flex flex-col justify-center px-6 md:hidden"
      >
        <ul className="flex flex-col gap-3">
          {NAV_LINKS.map(({ label, id }, i) => (
            <li key={id} className="overflow-hidden">
              <a
                data-menu-link
                href={`#${id}`}
                onClick={(e) => handleNav(e, id)}
                className="display block text-[clamp(44px,15vw,84px)] no-underline"
              >
                <span className="mr-3 align-top font-mono text-xs tracking-widest opacity-60">
                  0{i + 1}
                </span>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="eyebrow mt-12 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          Available for work
        </p>
      </div>
    </div>
  );
};

export default Navbar;
