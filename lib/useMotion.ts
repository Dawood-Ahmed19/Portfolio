import type { RefObject } from "react";
import { gsap, useGSAP, MOTION_OK } from "./gsap";

/** `contextSafe` as handed out by useGSAP: wraps handlers so GSAP can clean up after them. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextSafe = <T extends (...args: any[]) => any>(fn: T) => T;

type Options = {
  scope: RefObject<HTMLElement | null>;
  dependencies?: unknown[];
};

/**
 * useGSAP + matchMedia in one place.
 *
 * `setup` only runs when the visitor has NOT requested reduced motion, so
 * every section stays fully visible and static for them without any
 * per-component branching. Everything created inside is reverted on
 * unmount, on dependency change and when the media query flips.
 */
export function useMotion(
  setup: (contextSafe: ContextSafe) => void | (() => void),
  { scope, dependencies = [] }: Options,
) {
  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => setup(contextSafe as ContextSafe));
      return () => mm.revert();
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}
