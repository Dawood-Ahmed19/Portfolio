"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NavLinks = [
  { label: "About", id: "about" },
  { label: "Stack", id: "stack" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

const Navbar = () => {
  const container = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const tweens = useRef(new WeakMap<HTMLElement, gsap.core.Tween>());
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const onPanel = (e: Event) => {
      const d = (e as CustomEvent).detail;
      const id = typeof d === "string" ? d : d?.id;
      setLight(id === "stack");
    };
    window.addEventListener("panel-enter", onPanel);
    window.addEventListener("goto-section", onPanel);
    return () => {
      window.removeEventListener("panel-enter", onPanel);
      window.removeEventListener("goto-section", onPanel);
    };
  }, []);

  const goTo = (id: string) =>
    window.dispatchEvent(new CustomEvent("goto-section", { detail: id }));

  const { contextSafe } = useGSAP(
    () => {
      // ---- intro ----
      gsap.from(container.current, {
        opacity: 0,
        y: -15,
        duration: 1,
        ease: "power2.out",
      });

      // ---- mobile menu timeline ----
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

      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };

          const compact = gsap
            .timeline({
              paused: true,
              defaults: { duration: 0.35, ease: "power2.out" },
            })
            .to("[data-nav-bg]", { autoAlpha: 1 }, 0)
            .to(
              "[data-nav-inner]",
              {
                paddingTop: desktop ? 20 : 12,
                paddingBottom: desktop ? 20 : 12,
              },
              0,
            );

          ScrollTrigger.create({
            start: 40,
            end: "max",
            onToggle: (self) =>
              self.isActive ? compact.play() : compact.reverse(),
          });
        },
      );

      return () => mm.revert();
    },
    { scope: container },
  );

  const setMenu = contextSafe((next: boolean) => {
    setOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
    if (next) menuTl.current?.timeScale(1).play();
    else menuTl.current?.timeScale(1.4).reverse();
  });

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && open) setMenu(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, setMenu]);

  const scrambleText = contextSafe(
    (element: HTMLAnchorElement, text: string) => {
      tweens.current.get(element)?.kill();
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
      tweens.current.set(element, tween);
    },
  );

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (open) setMenu(false);
    goTo(id);
  };

  return (
    <div
      ref={container}
      data-light={light && !open}
      className="group fixed inset-x-0 top-0 z-40 w-full"
    >
      <div
        data-nav-bg
        aria-hidden="true"
        className="invisible absolute inset-0 -z-20 border-b border-white/10 bg-[#0a0a0a]/80 opacity-0 backdrop-blur-md transition-colors duration-300 group-data-[light=true]:border-ink/10 group-data-[light=true]:bg-lime/80"
      />
      <div
        data-nav-inner
        className="container mx-auto flex items-center justify-between px-6 py-6 md:py-12"
      >
        {/* logo */}
        <h1 className="text-sm font-medium uppercase text-paper transition-colors duration-300 group-data-[light=true]:text-ink">
          Dawood Ahmed / DEV
        </h1>

        {/* desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NavLinks.map(({ label, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="text-sm text-paper no-underline transition-colors duration-300 hover:cursor-pointer hover:text-lime group-data-[light=true]:text-ink group-data-[light=true]:hover:text-ink/60"
                onClick={(e) => handleNav(e, id)}
                onMouseEnter={(e) => scrambleText(e.currentTarget, label)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* desktop status */}
        <div className="hidden items-center gap-2 text-sm text-paper transition-colors duration-300 group-data-[light=true]:text-ink md:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lime group-data-[light=true]:bg-ink" />
          <span className="animate-pulse">Available For Work</span>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setMenu(!open)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          <span
            data-bar-top
            className="block h-[2px] w-6 bg-paper transition-colors duration-300 group-data-[light=true]:bg-ink"
          />
          <span
            data-bar-bottom
            className="block h-[2px] w-6 bg-paper transition-colors duration-300 group-data-[light=true]:bg-ink"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        data-menu
        className="absolute inset-x-0 top-0 -z-10 flex h-screen flex-col justify-center bg-[#0a0a0a] px-6 md:hidden"
      >
        <ul className="flex flex-col gap-4">
          {NavLinks.map(({ label, id }, i) => (
            <li key={id} className="overflow-hidden">
              <a
                data-menu-link
                href={`#${id}`}
                onClick={(e) => handleNav(e, id)}
                className="block font-display text-[clamp(40px,14vw,72px)] font-black uppercase leading-none text-paper no-underline active:text-lime"
              >
                <span className="mr-3 font-mono text-xs text-lime">
                  0{i + 1}
                </span>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex items-center gap-2 text-sm text-paper">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />
          <span>Available For Work</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
