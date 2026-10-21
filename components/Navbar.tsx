"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const NavLinks = [
  { label: "About", id: "about" },
  { label: "Stack", id: "stack" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

const Navbar = () => {
  const container = useRef(null);

  const { contextSafe } = useGSAP({ scope: container });
  useGSAP(
    () => {
      gsap.from(container.current, {
        opacity: 0,
        y: -15,
        duration: 1,
        ease: "power2.out",
      });
    },
    { scope: container },
  );

  const scrambleText = contextSafe(
    (element: HTMLAnchorElement, text: string) => {
      const obj = { progress: 0 };

      gsap.killTweensOf(obj);

      gsap.to(obj, {
        progress: 1,
        duration: 0.5,
        ease: "none",

        onUpdate: () => {
          const revealed = Math.floor(obj.progress * text.length);

          element.textContent = text
            .split("")
            .map((char, index) => {
              if (index < revealed || char === " ") return char;

              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("");
        },

        onComplete: () => {
          element.textContent = text;
        },
      });
    },
  );

  return (
    <div
      ref={container}
      className="flex items-center justify-between h-[20px] py-12"
    >
      <div>
        <h1 className="uppercase text-paper font-medium text-sm">
          Dawood Ahmed / DEV
        </h1>
      </div>
      <div>
        <ul className="flex items-center gap-8">
          {NavLinks.map(({ label, id }) => {
            return (
              <li key={id}>
                <a
                  className="decoration-none text-paper text-sm hover:text-lime"
                  href={`#${id}`}
                  onMouseEnter={(e) => scrambleText(e.currentTarget, label)}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center gap-2 text-sm text-paper">
        <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />
        <span className="animate-pulse">Available For Work</span>
      </div>
    </div>
  );
};

export default Navbar;
