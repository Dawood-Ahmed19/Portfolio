import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };

/** Media query for visitors who have not asked for reduced motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Media query for devices with a real hover-capable pointer. */
export const HOVER_FINE = "(hover: hover) and (pointer: fine)";

/** Shared easing so every reveal on the site feels related. */
export const EASE = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
} as const;
