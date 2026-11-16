/** Smooth-scroll to a section by id, using Lenis when it is active. */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = window.lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, offset: 0 });
  } else {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }
}
