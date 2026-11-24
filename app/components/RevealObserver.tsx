"use client";

import { useEffect } from "react";

/**
 * Watches every `[data-reveal]` element and marks it `data-revealed` the first
 * time it scrolls into view; the CSS in globals.css does the animating.
 * `data-reveal="stagger"` animates the element's children one after another.
 * Hiding is gated on `html.reveal-on`, so content stays visible without JS
 * and for people who prefer reduced motion.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el) => {
      if (el.dataset.reveal !== "stagger") return;
      Array.from(el.children).forEach((child, index) => {
        (child as HTMLElement).style.setProperty("--i", String(Math.min(index, 10)));
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.revealed = "";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    document.documentElement.classList.add("reveal-on");
    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-on");
    };
  }, []);

  return null;
}
