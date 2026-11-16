import type Lenis from "lenis";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

/** Smooth-scroll to a section by id (falls back to a plain jump). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (window.lenis) {
    window.lenis.scrollTo(el, { duration: 1.6, offset: 0 });
  } else {
    el.scrollIntoView();
  }
}

export function scrollToTop() {
  if (window.lenis) window.lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo(0, 0);
}
