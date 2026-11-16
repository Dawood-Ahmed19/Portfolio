import type { ElementType } from "react";

type Props = {
  /** Text to split. Use "\n" to force a line break. */
  text: string;
  as?: ElementType;
  className?: string;
  /** Extra classes for each masked word wrapper. */
  wordClassName?: string;
};

/**
 * Renders text as masked words so GSAP can slide each `[data-word]` up
 * from below its mask. Pure markup, so it is identical on server and
 * client (no hydration mismatch) and reads normally to assistive tech.
 */
const Words = ({
  text,
  as: Tag = "span",
  className = "",
  wordClassName = "",
}: Props) => {
  const lines = text.split("\n");

  return (
    <Tag className={className} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className="block">
          {line.split(" ").map((word, wi, arr) => (
            <span key={wi}>
              <span className={`mask ${wordClassName}`}>
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
              {wi < arr.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
};

export default Words;
