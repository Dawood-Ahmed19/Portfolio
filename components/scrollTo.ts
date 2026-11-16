import type Lenis from "lenis";

type LenisHolder = { lenis?: Lenis };

/** Read the shared Lenis instance without augmenting the global Window type. */
export const getLenis = (): Lenis | undefined =>
  (window as unknown as LenisHolder).lenis;

export const setLenis = (instance: Lenis | undefined) => {
  (window as unknown as LenisHolder).lenis = instance;
};

/** Smooth-scroll to a section by id, using Lenis when it is active. */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, offset: 0 });
  } else {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }
}
