"use client";

import { Fragment, useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>";
const SETTLE_MS = 420;
const STAGGER_MS = 30;
const MAX_SWEEP_MS = 620;
const SWAP_MS = 50;

/**
 * Section heading whose letters cycle through random glyphs and resolve from
 * left to right the first time it scrolls into view. Glyphs are painted over
 * each letter's own box, so the line breaks never shift while it runs.
 */
export function ScrambleTitle({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const words = children.split(" ");

  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(title.querySelectorAll<HTMLElement>("[data-char]"));
    const stagger = Math.min(STAGGER_MS, MAX_SWEEP_MS / chars.length);
    let frame = 0;

    chars.forEach((char) => {
      char.dataset.glyph = " ";
    });

    const reveal = () => {
      const start = performance.now();
      let lastSwap = 0;

      const tick = (now: number) => {
        const swap = now - lastSwap >= SWAP_MS;
        if (swap) lastSwap = now;
        let running = false;

        chars.forEach((char, index) => {
          if (char.dataset.glyph === undefined) return;
          const elapsed = now - start - index * stagger;
          if (elapsed >= SETTLE_MS) {
            delete char.dataset.glyph;
            return;
          }
          running = true;
          if (elapsed >= 0 && swap) {
            char.dataset.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        });

        if (running) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        reveal();
      },
      { threshold: 0.35 },
    );
    observer.observe(title);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      chars.forEach((char) => {
        delete char.dataset.glyph;
      });
    };
  }, [children]);

  return (
    <h2 ref={titleRef} className={className} aria-label={children}>
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span aria-hidden="true" className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => (
              <span key={charIndex} data-char className="scramble-char">
                {char}
              </span>
            ))}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h2>
  );
}
